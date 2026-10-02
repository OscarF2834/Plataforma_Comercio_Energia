<?php

namespace App\Patterns\Decorators;

/** Recargo del 5% por certificacion de energia 100% renovable. */
class GreenCertificationDecorator extends OfferDecorator
{
    public const RATE = 0.05;

    public function getDescription(): string
    {
        return $this->wrapped->getDescription() . ' + Certificacion Verde';
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
            'label' => 'Certificacion Verde (+5%)',
            'amount' => round($this->wrapped->getBasePrice() * self::RATE, 2),
        ]]);
    }
}
