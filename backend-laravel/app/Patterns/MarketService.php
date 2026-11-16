<?php

namespace App\Patterns;

use App\Models\EnergyOffer;
use App\Patterns\Builders\EnergyOfferBuilder;
use App\Patterns\Builders\OfferDirector;
use App\Patterns\Iterators\OfferCollection;
use App\Patterns\Mementos\MarketMemento;
use App\Patterns\Prototypes\OfferPrototype;
use App\Patterns\Prototypes\PrototypeRegistry;
use App\Patterns\Observers\LowStockAlertObserver;
use App\Patterns\Observers\MarketSubject;
use App\Patterns\Observers\MetricsSnapshotObserver;
use App\Patterns\Observers\PriceWatchObserver;
use App\Patterns\States\OfferStateContext;
use App\Patterns\LoggerService;

class MarketService
{
    private static ?MarketService $instance = null;

    private array $offers = [];
    private int $nextId = 1;
    private int $transactionCount = 0;

    private string $dataFile;

    /** Patron Observer: sujeto que notifica los cambios del mercado. */
    private MarketSubject $subject;

    private function __construct()
    {
        $this->dataFile = storage_path('app/market_data.json');
        $this->load();

        // Patron Observer: el mercado adjunta sus observadores. Cada uno
        // reacciona distinto a los mismos eventos (métricas, alertas, precios).
        $this->subject = new MarketSubject();
        $this->subject->attach(new MetricsSnapshotObserver());
        $this->subject->attach(new LowStockAlertObserver(LoggerService::getInstance()));
        $this->subject->attach(new PriceWatchObserver(LoggerService::getInstance()));
    }

    public function getMarketSubject(): MarketSubject
    {
        return $this->subject;
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function load(): void
    {
        if (file_exists($this->dataFile)) {
            $data = json_decode(file_get_contents($this->dataFile), true);
            $this->nextId = $data['nextId'] ?? 1;
            $this->transactionCount = $data['transactionCount'] ?? 0;

            foreach ($data['offers'] ?? [] as $o) {
                $offer = new EnergyOffer();
                $offer->id = $o['id'];
                $offer->producerName = $o['producerName'];
                $offer->totalKwh = $o['totalKwh'];
                $offer->availableKwh = $o['availableKwh'];
                $offer->pricePerKwh = $o['pricePerKwh'];
                $offer->description = $o['description'] ?? '';
                $offer->energyType = $o['energyType'] ?? '';
                $offer->createdAt = $o['createdAt'] ?? '';
                // Patron State: estado persistido, o derivado del stock si
                // el JSON es anterior a la incorporación del patrón.
                $offer->state = $o['state'] ?? OfferStateContext::deriveName($o['availableKwh'], $o['totalKwh']);
                $this->offers[] = $offer;
            }
        }
    }

    private function save(): void
    {
        $data = [
            'nextId' => $this->nextId,
            'transactionCount' => $this->transactionCount,
            'offers' => array_map(fn($o) => $o->toArray(), $this->offers),
        ];
        file_put_contents($this->dataFile, json_encode($data, JSON_PRETTY_PRINT));
    }

    public function registerOffer(array $data): EnergyOffer
    {
        // Patron Builder: el Director orquesta a EnergyOfferBuilder para
        // construir la oferta paso a paso (productor, tipo validado con
        // EnergySourceFactory, cantidad, precio, descripcion).
        $offer = (new OfferDirector(new EnergyOfferBuilder()))
            ->buildFromRequest($data);

        $offer->id = $this->nextId++;
        $offer->createdAt = now()->toIso8601String();

        $this->offers[] = $offer;
        $this->save();

        // Patron Observer: notifica a los observadores del mercado.
        $this->subject->notifyOfferRegistered($offer);

        return $offer;
    }

    public function registerExpressOffer(array $data): EnergyOffer
    {
        // Variante del Builder: el Director completa los pasos con valores por
        // defecto (precio tomado de ConfigService) para construir una oferta
        // rapida a partir de solo 3 datos: productor, kWh y tipo de energia.
        $offer = (new OfferDirector(new EnergyOfferBuilder()))
            ->buildExpressOffer($data['producerName'], (float) $data['totalKwh'], $data['energyType']);

        $offer->id = $this->nextId++;
        $offer->createdAt = now()->toIso8601String();

        $this->offers[] = $offer;
        $this->save();

        // Patron Observer: notifica a los observadores del mercado.
        $this->subject->notifyOfferRegistered($offer);

        return $offer;
    }

    public function cloneOffer(int $sourceId, array $adjustments = []): EnergyOffer
    {
        $source = null;
        foreach ($this->offers as $offer) {
            if ($offer->id === $sourceId) {
                $source = $offer;
                break;
            }
        }
        if ($source === null) {
            throw new \RuntimeException('Oferta origen no encontrada');
        }

        // Patron Prototype: se clona la oferta origen en lugar de construirla
        // desde cero. Cada clon recibe su propia copia (id y fecha nuevos).
        $clonedPrototype = OfferPrototype::from($source)->copy();

        if (!empty($adjustments['producerName'])) {
            $clonedPrototype->setProducer($adjustments['producerName']);
        }
        if (!empty($adjustments['totalKwh'])) {
            $clonedPrototype->setQuantity((float) $adjustments['totalKwh']);
        }
        if (array_key_exists('pricePerKwh', $adjustments) && $adjustments['pricePerKwh'] !== '' && $adjustments['pricePerKwh'] !== null) {
            $clonedPrototype->setPricePerKwh((float) $adjustments['pricePerKwh']);
        }
        if (!empty($adjustments['description'])) {
            $clonedPrototype->setDescription($adjustments['description']);
        }

        $offer = $clonedPrototype->getOffer();
        $offer->id = $this->nextId++;
        $offer->createdAt = now()->toIso8601String();

        $this->offers[] = $offer;
        $this->save();

        // Patron Observer: notifica a los observadores del mercado.
        $this->subject->notifyOfferRegistered($offer);

        return $offer;
    }

    public function createOfferFromTemplate(string $type, array $data): EnergyOffer
    {
        // Patron Prototype: se clona una plantilla registrada en el
        // PrototypeRegistry (creada con el Factory Method) y se personaliza.
        $prototype = PrototypeRegistry::getInstance()->getTemplate($type);

        $prototype
            ->setProducer($data['producerName'])
            ->setQuantity((float) $data['totalKwh']);

        if (!empty($data['pricePerKwh'])) {
            $prototype->setPricePerKwh((float) $data['pricePerKwh']);
        }
        if (!empty($data['description'])) {
            $prototype->setDescription($data['description']);
        }

        $offer = $prototype->getOffer();
        $offer->id = $this->nextId++;
        $offer->createdAt = now()->toIso8601String();

        $this->offers[] = $offer;
        $this->save();

        // Patron Observer: notifica a los observadores del mercado.
        $this->subject->notifyOfferRegistered($offer);

        return $offer;
    }

    // ------------------------------------------------------------------
    // Patron Iterator: la coleccion agregada envuelve TODAS las ofertas
    // (incluidas las agotadas) y crea iteradores por estrategia. El
    // cliente nunca accede al arreglo interno.
    // ------------------------------------------------------------------

    public function getOfferCollection(): OfferCollection
    {
        return new OfferCollection($this->offers);
    }

    // ------------------------------------------------------------------
    // Patron Memento: el MarketService es el ORIGINATOR. Solo el mercado
    // sabe capturar y restaurar su estado completo (ofertas + contadores).
    // ------------------------------------------------------------------

    /** Captura una instantánea completa del mercado. */
    public function createMemento(string $reason): MarketMemento
    {
        return MarketMemento::capture(
            array_map(fn (EnergyOffer $o) => $o->toArray(), $this->offers),
            $this->nextId,
            $this->transactionCount,
            $reason
        );
    }

    /** Restaura el mercado a una instantánea anterior y persiste el cambio. */
    public function restoreFromMemento(MarketMemento $memento): void
    {
        $this->offers = $memento->offers();
        $this->nextId = $memento->nextId;
        $this->transactionCount = $memento->transactionCount;
        $this->save();
    }

    public function getOfferById(int $id): ?EnergyOffer
    {
        foreach ($this->offers as $offer) {
            if ($offer->id === $id) {
                return $offer;
            }
        }
        return null;
    }

    public function getAvailableOffers(): array
    {
        return array_filter($this->offers, fn($o) => $o->availableKwh > 0);
    }

    public function purchaseOffer(int $id, int $kwh): array
    {
        foreach ($this->offers as $offer) {
            if ($offer->id === $id) {
                // Patron State: el comportamiento de la compra depende del
                // estado de la oferta (disponible / parcialmente vendida /
                // agotada) y el estado transiciona automáticamente.
                $result = OfferStateContext::handlePurchase($offer, $kwh);

                if ($result['success']) {
                    $this->transactionCount++;
                    $this->save();

                    // Patron Observer: notifica la compra a los observadores
                    // (estado actual incluido, para alertas y precios).
                    $this->subject->notifyOfferPurchased($offer, $kwh, $result);
                }
                return $result;
            }
        }
        return ['success' => false, 'message' => 'Oferta no encontrada'];
    }

    public function getMetrics(): array
    {
        return [
            'totalOffers' => count($this->offers),
            'transactionCount' => $this->transactionCount,
        ];
    }

    public function getMarketContext(): array
    {
        $active = array_filter($this->offers, fn($o) => $o->availableKwh > 0);
        $activeCount = count($active);
        $totalAvailable = array_sum(array_map(fn($o) => $o->availableKwh, $active));
        $avgPrice = $activeCount > 0
            ? round(array_sum(array_map(fn($o) => $o->pricePerKwh, $active)) / $activeCount, 2)
            : 0.0;

        return [
            'totalOffers' => count($this->offers),
            'activeOffers' => $activeCount,
            'totalAvailableKwh' => round($totalAvailable, 2),
            'avgPricePerKwh' => $avgPrice,
            'transactionCount' => $this->transactionCount,
        ];
    }
}
