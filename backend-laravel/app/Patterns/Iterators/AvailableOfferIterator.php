<?php

namespace App\Patterns\Iterators;

use App\Models\EnergyOffer;

/**
 * Patron Iterator — Iterador concreto de ofertas disponibles.
 *
 * Recorre únicamente las ofertas con energía disponible (availableKwh
 * > 0), filtrando las ya agotadas. Apoya el objetivo de «consultar los
 * excedentes disponibles».
 */
class AvailableOfferIterator implements OfferIterator
{
    /** @var EnergyOffer[] */
    private array $filtered;
    private int $position = 0;

    public function __construct(array $offers)
    {
        $this->filtered = array_values(array_filter(
            $offers,
            fn (EnergyOffer $o) => $o->availableKwh > 0
        ));
    }

    public function hasNext(): bool
    {
        return $this->position < count($this->filtered);
    }

    public function next(): ?EnergyOffer
    {
        if (!$this->hasNext()) {
            return null;
        }
        return $this->filtered[$this->position++];
    }

    public function rewind(): void
    {
        $this->position = 0;
    }
}
