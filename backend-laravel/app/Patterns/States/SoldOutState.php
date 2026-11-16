<?php

namespace App\Patterns\States;

use App\Models\EnergyOffer;

/**
 * Patron State — Estado concreto «Agotada».
 *
 * No queda energía disponible: el estado RECHAZA la compra sin tocar
 * el stock. Este es el comportamiento polimórfico clave del patrón:
 * el mismo método purchase() produce resultados distintos según el
 * estado de la oferta.
 */
class SoldOutState implements OfferState
{
    private static ?SoldOutState $instance = null;

    private function __construct() {}

    public static function instance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function name(): string
    {
        return 'sold_out';
    }

    public function label(): string
    {
        return 'Agotada';
    }

    public function color(): string
    {
        return '#e74c3c';
    }

    public function canPurchase(): bool
    {
        return false;
    }

    public function purchase(EnergyOffer $offer, int $kwh): array
    {
        return [
            'success' => false,
            'message' => 'Esta oferta está agotada: no queda energía disponible para comprar',
        ];
    }
}
