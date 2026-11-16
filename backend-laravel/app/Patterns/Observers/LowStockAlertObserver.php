<?php

namespace App\Patterns\Observers;

use App\Models\EnergyOffer;
use App\Patterns\LoggerService;
use App\Patterns\States\OfferStateContext;

/**
 * Patron Observer — Observador concreto «Alerta de agotamiento».
 *
 * Reacciona a las COMPRAS: si una oferta llega a cero (estado
 * «Agotada» del patrón State) o queda poca energía, escribe una
 * alerta en el registro de actividad. Así el productor y la
 * plataforma se enteran sin que nadie pregunte.
 */
class LowStockAlertObserver implements MarketObserver
{
    public function __construct(private LoggerService $logger) {}

    public function getName(): string
    {
        return 'Alerta de agotamiento (LowStockAlertObserver)';
    }

    public function onOfferRegistered(EnergyOffer $offer): void
    {
        // Sin reacción: este observador solo vigila las compras.
    }

    public function onOfferPurchased(EnergyOffer $offer, int $kwh, array $result = []): void
    {
        $state = OfferStateContext::resolve($offer);

        if ($offer->availableKwh <= 0) {
            $this->logger->log("Observer ALERTA: la oferta #{$offer->id} de {$offer->producerName} quedó AGOTADA (estado: {$state->label()})");
            return;
        }

        if ($offer->availableKwh <= $offer->totalKwh * 0.25) {
            $this->logger->log("Observer ALERTA: la oferta #{$offer->id} tiene poco stock (quedan {$offer->availableKwh} de {$offer->totalKwh} kWh)");
        }
    }
}
