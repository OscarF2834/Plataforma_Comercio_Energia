<?php

namespace App\Patterns\Observers;

use App\Models\EnergyOffer;

/**
 * Patron Observer — Sujeto concreto (rol «Subject»).
 *
 * MarketService delega en este sujeto la lista de observadores y la
 * notificación de los eventos del mercado. Cada observador reacciona
 * a su manera (métricas, alertas, vigilancia de precios) sin que el
 * mercado conozca sus clases concretas.
 *
 * El registro de eventos se persiste en JSON para alimentar el panel
 * de la interfaz, igual que el resto del estado del prototipo.
 */
class MarketSubject
{
    private string $dataFile;

    /** @var MarketObserver[] */
    private array $observers = [];

    /** @var array Registro de eventos notificados (persistido). */
    private array $events = [];

    public function __construct()
    {
        $this->dataFile = storage_path('app/observer_events.json');
        $this->loadEvents();
    }

    private function loadEvents(): void
    {
        if (file_exists($this->dataFile)) {
            $this->events = json_decode(file_get_contents($this->dataFile), true) ?? [];
        }
    }

    private function persistEvents(): void
    {
        file_put_contents($this->dataFile, json_encode($this->events, JSON_PRETTY_PRINT));
    }

    // ------------------------------------------------------------------
    // Gestión de observadores (rol Subject: attach/detach/notify).
    // ------------------------------------------------------------------

    public function attach(MarketObserver $observer): void
    {
        if (!in_array($observer, $this->observers, true)) {
            $this->observers[] = $observer;
        }
    }

    public function detach(MarketObserver $observer): void
    {
        $this->observers = array_values(array_filter(
            $this->observers,
            fn (MarketObserver $o) => $o !== $observer
        ));
    }

    /** @return string[] Nombres de los observadores suscritos. */
    public function observerNames(): array
    {
        return array_map(fn (MarketObserver $o) => $o->getName(), $this->observers);
    }

    // ------------------------------------------------------------------
    // Notificación de eventos del mercado.
    // ------------------------------------------------------------------

    public function notifyOfferRegistered(EnergyOffer $offer): void
    {
        $this->record('offer.registered', "Oferta #{$offer->id} de {$offer->producerName} ({$offer->energyType})");
        foreach ($this->observers as $observer) {
            $observer->onOfferRegistered($offer);
        }
    }

    public function notifyOfferPurchased(EnergyOffer $offer, int $kwh, array $result = []): void
    {
        $this->record('offer.purchased', "Compra de {$kwh} kWh en oferta #{$offer->id}");
        foreach ($this->observers as $observer) {
            $observer->onOfferPurchased($offer, $kwh, $result);
        }
    }

    /** Registro de eventos para el panel (máx. 50). */
    public function getEventLog(): array
    {
        return array_slice($this->events, -50);
    }

    public function countEvents(): int
    {
        return count($this->events);
    }

    private function record(string $event, string $detail): void
    {
        $this->events[] = [
            'event' => $event,
            'detail' => $detail,
            'at' => now()->toIso8601String(),
        ];
        if (count($this->events) > 50) {
            $this->events = array_slice($this->events, -50);
        }
        $this->persistEvents();
    }
}
