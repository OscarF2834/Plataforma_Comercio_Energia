<?php

namespace App\Patterns\Decorators;

/** Recargo del 3% por seguro contra perdidas de suministro. */
class InsuranceDecorator extends OfferDecorator
{
    public const RATE = 0.03;

    public function getDescription(): string
    {
        return $this->wrapped->getDescription() . ' + Seguro de suministro';
    }

    public function getExtrasTotal(): float
    {
        return $this->wrapped->getExtrasTotal() + $this->wrapped->getBasePrice() * self::RATE;
    }

    public function getTotal(): float
    {
        return $this->wrapped->getTotal() + $this->wrapped->getBasePrice() * self::RATE;
    }

    public function getAdjustments(): array
    {
        return array_merge($this->wrapped->getAdjustments(), [[
            'label' => 'Seguro de suministro (+3%)',
            'amount' => round($this->wrapped->getBasePrice() * self::RATE, 2),
        ]]);
    }
}
