<?php

namespace App\Patterns\Decorators;

/** Costo fijo por entregar la energia con prioridad en la red virtual. */
class PriorityDeliveryDecorator extends OfferDecorator
{
    public const FLAT_FEE = 8000.0;

    public function getDescription(): string
    {
        return $this->wrapped->getDescription() . ' + Entrega prioritaria';
    }

    public function getExtrasTotal(): float
    {
        return $this->wrapped->getExtrasTotal() + self::FLAT_FEE;
    }

    public function getTotal(): float
    {
        return $this->wrapped->getTotal() + self::FLAT_FEE;
    }

    public function getAdjustments(): array
    {
        return array_merge($this->wrapped->getAdjustments(), [[
            'label' => 'Entrega prioritaria (tarifa fija)',
            'amount' => self::FLAT_FEE,
        ]]);
    }
}
