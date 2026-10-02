<?php

namespace App\Patterns\Decorators;

/**
 * Patron Decorator - DECORADOR BASE.
 *
 * Envuelve un OfferComponent y delega todo en el componente envuelto.
 * Las subclases solo agregan (o modifican) comportamiento, nunca
 * reemplazan al componente.
 */
abstract class OfferDecorator implements OfferComponent
{
    public function __construct(protected OfferComponent $wrapped) {}

    public function getDescription(): string
    {
        return $this->wrapped->getDescription();
    }

    public function getBasePrice(): float
    {
        return $this->wrapped->getBasePrice();
    }

    public function getExtrasTotal(): float
    {
        return $this->wrapped->getExtrasTotal();
    }

    public function getTotal(): float
    {
        return $this->wrapped->getTotal();
    }

    public function getAdjustments(): array
    {
        return $this->wrapped->getAdjustments();
    }
}
