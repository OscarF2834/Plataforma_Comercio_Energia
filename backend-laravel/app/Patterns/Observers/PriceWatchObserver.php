<?php

namespace App\Patterns\Observers;

use App\Models\EnergyOffer;
use App\Patterns\LoggerService;
use App\Patterns\MarketService;

/**
 * Patron Observer — Observador concreto «Vigilancia de precios».
 *
 * Reacciona a las COMPRAS comparando el precio pagado con el precio
 * promedio del mercado en ese instante. Apoya el objetivo de apoyar
 * la toma de decisiones: registra si la compra fue favorable o cara.
 */
class PriceWatchObserver implements MarketObserver
{
    public function __construct(private LoggerService $logger) {}

    public function getName(): string
    {
        return 'Vigilancia de precios (PriceWatchObserver)';
    }

    public function onOfferRegistered(EnergyOffer $offer): void
    {
        // Sin reacción: este observador solo vigila las compras.
    }

    public function onOfferPurchased(EnergyOffer $offer, int $kwh, array $result = []): void
    {
        $avg = (float) (MarketService::getInstance()->getMarketContext()['avgPricePerKwh'] ?? 0);
        $price = (float) $offer->pricePerKwh;

        if ($avg <= 0) {
            return;
        }

        if ($price < $avg * 0.9) {
            $this->logger->log("Observer PRECIO: la compra en la oferta #{$offer->id} fue FAVORABLE ({$price} COP/kWh vs promedio {$avg})");
        } elseif ($price > $avg * 1.1) {
            $this->logger->log("Observer PRECIO: la compra en la oferta #{$offer->id} fue CARA ({$price} COP/kWh vs promedio {$avg})");
        } else {
            $this->logger->log("Observer PRECIO: la compra en la oferta #{$offer->id} estuvo cerca del promedio del mercado ({$price} COP/kWh)");
        }
    }
}
