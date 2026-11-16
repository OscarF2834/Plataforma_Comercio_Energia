<?php

namespace App\Patterns\Iterators;

use App\Models\EnergyOffer;

/**
 * Patron Iterator — Iterador concreto por precio ascendente.
 *
 * Recorre las ofertas de la más barata a la más cara. Apoya el objetivo
 * de «comprar excedentes» dando el recorrido óptimo para hallar el mejor
 * precio sin que el cliente ordene ni toque la colección original.
 */
class CheapestOfferIterator implements OfferIterator
{
    /** @var EnergyOffer[] */
    private array $sorted;
    private int $position = 0;

    public function __construct(array $offers)
    {
        $sorted = $offers;
        usort($sorted, fn (EnergyOffer $a, EnergyOffer $b) => $a->pricePerKwh <=> $b->pricePerKwh);
        $this->sorted = array_values($sorted);
    }

    public function hasNext(): bool
    {
        return $this->position < count($this->sorted);
    }

    public function next(): ?EnergyOffer
    {
        if (!$this->hasNext()) {
            return null;
        }
        return $this->sorted[$this->position++];
    }

    public function rewind(): void
    {
        $this->position = 0;
    }
}
