<?php

namespace App\Patterns\Iterators;

use App\Models\EnergyOffer;

/**
 * Patron Iterator — Iterador concreto por tipo de energía.
 *
 * Recorre SOLO las ofertas del tipo solicitado (solar, wind, hydro),
 * en el orden original de registro. Da cumplimiento al objetivo de
 * «clasificar y administrar los diferentes tipos de energía».
 */
class EnergyTypeOfferIterator implements OfferIterator
{
    /** @var EnergyOffer[] */
    private array $filtered;
    private int $position = 0;

    /**
     * @param EnergyOffer[] $offers Ofertas de todo el mercado (el iterador filtra).
     */
    public function __construct(array $offers, private string $energyType)
    {
        $this->filtered = array_values(array_filter(
            $offers,
            fn (EnergyOffer $o) => $o->energyType === $this->energyType
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
