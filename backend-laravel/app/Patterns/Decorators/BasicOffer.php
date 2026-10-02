<?php

namespace App\Patterns\Decorators;

/**
 * Patron Decorator - COMPONENTE CONCRETO.
 *
 * Oferta de energia "pura": solo energia x precio. Todos los extras se
 * agregan despues envolviendola con decoradores, sin modificarla.
 */
class BasicOffer implements OfferComponent
{
    public function __construct(
        private float $kwh,
        private float $pricePerKwh,
    ) {}

    public function getDescription(): string
    {
        return "Oferta base de {$this->kwh} kWh a {$this->pricePerKwh} COP/kWh";
    }

    public function getBasePrice(): float
    {
        return $this->kwh * $this->pricePerKwh;
    }

    public function getExtrasTotal(): float
    {
        return 0.0;
    }

    public function getTotal(): float
    {
        return $this->getBasePrice();
    }

    public function getAdjustments(): array
    {
        return [];
    }
}
