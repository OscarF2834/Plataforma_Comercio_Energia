<?php

namespace App\Patterns\Mediators;

use App\Models\EnergyOffer;
use App\Patterns\Mementos\MarketMemento;
use App\Patterns\MarketService;
use App\Patterns\Proxies\MarketProxy;

/**
 * Patron Mediator — Colega concreto «Mercado».
 *
 * Encapsula al mercado real (MarketProxy sobre el Singleton
 * MarketService). Atiende las peticiones del mediador (registrar oferta,
 * comprar energía, instantánea) y le notifica el resultado, sin conocer
 * al Logger ni al Historial.
 */
class MarketServiceColleague implements Colleague
{
    private ?TransactionMediator $mediator = null;

    public function __construct(private MarketProxy $market) {}

    public function setMediator(TransactionMediator $mediator): void
    {
        $this->mediator = $mediator;
    }

    public function getName(): string
    {
        return 'Mercado (MarketService)';
    }

    /** Petición del mediador: registrar una oferta en el mercado. */
    public function registerOffer(array $data): EnergyOffer
    {
        return $this->market->registerOffer($data);
    }

    /** Petición del mediador: comprar energía de una oferta. */
    public function purchaseOffer(int $id, int $kwh): array
    {
        return $this->market->purchaseOffer($id, $kwh);
    }

    /** Petición del mediador: crear una instantánea del estado del mercado. */
    public function createMemento(string $reason): MarketMemento
    {
        return $this->market->createMemento($reason);
    }

    /** Petición del mediador: restaurar el mercado a una instantánea. */
    public function restoreFromMemento(MarketMemento $memento): void
    {
        $this->market->restoreFromMemento($memento);
    }

    /** Notifica al mediador el contexto actual del mercado. */
    public function notifyMarketContext(): void
    {
        $this->mediator?->notify($this, 'market.context', $this->market->getMarketContext());
    }

    public function getMarketContext(): array
    {
        return $this->market->getMarketContext();
    }
}
