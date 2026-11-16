<?php

namespace App\Patterns\Iterators;

use App\Models\EnergyOffer;

/**
 * Patron Iterator — Colección agregada (rol «Aggregate»).
 *
 * Envuelve el arreglo de ofertas del mercado y expone la creación de
 * iteradores concretos según la estrategia pedida. El cliente (por
 * ejemplo EnergyController) nunca accede al arreglo directamente:
 * siempre recorre mediante un OfferIterator.
 */
class OfferCollection
{
    /**
     * @param EnergyOffer[] $offers Todas las ofertas del mercado.
     */
    public function __construct(private array $offers) {}

    public const STRATEGIES = ['type', 'cheapest', 'available'];

    /**
     * Factory Method del Iterator: crea el iterador concreto según la
     * estrategia. "type" exige el parámetro energyType.
     */
    public function createIterator(string $strategy, array $params = []): OfferIterator
    {
        return match (strtolower($strategy)) {
            'type' => new EnergyTypeOfferIterator($this->offers, strtolower($params['energyType'] ?? '')),
            'cheapest' => new CheapestOfferIterator($this->offers),
            'available' => new AvailableOfferIterator($this->offers),
            default => throw new \InvalidArgumentException("Estrategia de iteracion no soportada: {$strategy}"),
        };
    }

    public function count(): int
    {
        return count($this->offers);
    }
}
