<?php

namespace App\Patterns\Observers;

use App\Models\EnergyOffer;

/**
 * Patron Observer — Interfaz del observador (rol «Observer»).
 *
 * Todos los observadores del mercado implementan este contrato y
 * reaccionan de forma distinta a los MISMOS eventos: registro de una
 * oferta y compra de energía. El sujeto (MarketService) no conoce las
 * clases concretas, solo esta interfaz.
 */
interface MarketObserver
{
    /** Evento: se registró (publicó/clonó) una oferta en el mercado. */
    public function onOfferRegistered(EnergyOffer $offer): void;

    /** Evento: alguien compró energía de una oferta. */
    public function onOfferPurchased(EnergyOffer $offer, int $kwh, array $result): void;

    /** Nombre visible del observador (para el panel de estadísticas). */
    public function getName(): string;
}
