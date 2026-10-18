<?php

namespace App\Patterns\Proxies;

use App\Models\EnergyOffer;
use App\Patterns\ConfigService;
use App\Patterns\LoggerService;
use App\Patterns\MarketService;

/**
 * Patron Proxy.
 *
 * Sustituto transparente de MarketService que controla el acceso al
 * mercado. Combina tres facetas del Proxy sobre la MISMA interfaz:
 *
 *  - Proxy virtual: solo instancia MarketService cuando hace falta.
 *  - Proxy de caché: cachea las ofertas disponibles durante unos
 *    segundos (TTL) para no recorrer el mercado en cada petición y
 *    invalida la caché cuando el mercado cambia.
 *  - Proxy de protección: valida cada compra contra ConfigService
 *    (cantidad mínima y máximo por operación) y bloquea las compras
 *    fuera de política antes de llegar al sujeto real.
 *
 * El cliente (EnergyController) sigue llamando a los mismos métodos que
 * expondría MarketService: el Proxy no cambia el contrato.
 */
class MarketProxy
{
    private static ?MarketProxy $instance = null;

    private ?MarketService $real = null;

    /** @var array{offers:array,expiresAt:int}|null Caché de ofertas en disco. */
    private ?array $cache = null;

    private string $cacheFile;

    private function __construct()
    {
        $this->cacheFile = storage_path('app/market_proxy_cache.json');
        $this->loadCache();
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    // ------------------------------------------------------------------
    // Proxy virtual: el sujeto real se crea solo al primer acceso.
    // ------------------------------------------------------------------

    private function real(): MarketService
    {
        if ($this->real === null) {
            $this->real = MarketService::getInstance();
        }
        return $this->real;
    }

    // ------------------------------------------------------------------
    // Proxy de caché: ofertas disponibles con TTL.
    // ------------------------------------------------------------------

    private function loadCache(): void
    {
        if (file_exists($this->cacheFile)) {
            $this->cache = json_decode(file_get_contents($this->cacheFile), true);
        }
    }

    private function ttl(): int
    {
        return (int) ConfigService::getInstance()->get('offersCacheTtl');
    }

    private function isCacheValid(): bool
    {
        return $this->cache !== null
            && isset($this->cache['expiresAt'])
            && time() < (int) $this->cache['expiresAt'];
    }

    private function writeCache(array $offers): void
    {
        $this->cache = [
            'offers' => $offers,
            'expiresAt' => time() + $this->ttl(),
        ];
        file_put_contents($this->cacheFile, json_encode($this->cache, JSON_PRETTY_PRINT));
    }

    /** Invalida la caché (llamado tras cualquier mutación del mercado). */
    public function invalidateCache(): void
    {
        $this->cache = null;
        if (file_exists($this->cacheFile)) {
            unlink($this->cacheFile);
        }
    }

    public function getAvailableOffers(): array
    {
        if ($this->isCacheValid()) {
            // Cache hit: no se toca el mercado real.
            LoggerService::getInstance()->log('Proxy: ofertas servidas desde la caché (cache hit)');
            return array_map(function (array $offer) {
                $e = new EnergyOffer();
                $e->id = $offer['id'];
                $e->producerName = $offer['producerName'];
                $e->totalKwh = $offer['totalKwh'];
                $e->availableKwh = $offer['availableKwh'];
                $e->pricePerKwh = $offer['pricePerKwh'];
                $e->description = $offer['description'];
                $e->energyType = $offer['energyType'];
                $e->createdAt = $offer['createdAt'];
                return $e;
            }, $this->cache['offers']);
        }

        // Cache miss: se consulta el sujeto real y se cachea el resultado.
        $offers = array_values($this->real()->getAvailableOffers());
        $this->writeCache(array_map(fn (EnergyOffer $o) => $o->toArray(), $offers));

        return $offers;
    }

    // ------------------------------------------------------------------
    // Proxy de protección: toda compra pasa primero por la política.
    // ------------------------------------------------------------------

    public function purchaseOffer(int $id, int $kwh): array
    {
        $config = ConfigService::getInstance();
        $minKwh = (float) $config->get('minPurchaseKwh');
        $maxKwh = (float) $config->get('maxPurchaseKwh');

        if ($kwh < $minKwh) {
            LoggerService::getInstance()->log("Proxy: compra bloqueada ({$kwh} kWh < mínimo {$minKwh})");
            return [
                'success' => false,
                'message' => "Proxy de seguridad: la compra mínima es {$minKwh} kWh",
            ];
        }

        if ($kwh > $maxKwh) {
            LoggerService::getInstance()->log("Proxy: compra bloqueada ({$kwh} kWh > máximo {$maxKwh})");
            return [
                'success' => false,
                'message' => "Proxy de seguridad: no se pueden comprar más de {$maxKwh} kWh por operación",
            ];
        }

        // Política cumplida: se delega en el sujeto real y se invalida la caché.
        $result = $this->real()->purchaseOffer($id, $kwh);

        if ($result['success']) {
            $this->invalidateCache();
        }

        return $result;
    }

    // ------------------------------------------------------------------
    // Resto de la interfaz: delegación transparente en el sujeto real.
    // ------------------------------------------------------------------

    public function registerOffer(array $data): EnergyOffer
    {
        $offer = $this->real()->registerOffer($data);
        $this->invalidateCache();
        return $offer;
    }

    public function registerExpressOffer(array $data): EnergyOffer
    {
        $offer = $this->real()->registerExpressOffer($data);
        $this->invalidateCache();
        return $offer;
    }

    public function cloneOffer(int $sourceId, array $adjustments = []): EnergyOffer
    {
        $offer = $this->real()->cloneOffer($sourceId, $adjustments);
        $this->invalidateCache();
        return $offer;
    }

    public function createOfferFromTemplate(string $type, array $data): EnergyOffer
    {
        $offer = $this->real()->createOfferFromTemplate($type, $data);
        $this->invalidateCache();
        return $offer;
    }

    public function getOfferById(int $id): ?EnergyOffer
    {
        return $this->real()->getOfferById($id);
    }

    public function getMetrics(): array
    {
        return $this->real()->getMetrics();
    }

    public function getMarketContext(): array
    {
        return $this->real()->getMarketContext();
    }

    /** Estado de la caché del Proxy, para el panel de patrones. */
    public function getCacheStatus(): array
    {
        return [
            'ttlSeconds' => $this->ttl(),
            'valid' => $this->isCacheValid(),
            'entries' => $this->isCacheValid() ? count($this->cache['offers']) : 0,
            'expiresIn' => $this->isCacheValid() ? max(0, (int) $this->cache['expiresAt'] - time()) : 0,
        ];
    }
}
