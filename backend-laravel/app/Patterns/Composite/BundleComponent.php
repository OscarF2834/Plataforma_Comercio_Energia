<?php

namespace App\Patterns\Composite;

/**
 * Patron Composite - COMPONENTE.
 *
 * Interfaz comun entre las hojas (OfferLeaf) y los compuestos
 * (EnergyBundle). El cliente recorre un paquete completo o una oferta
 * suelta de la misma forma.
 */
interface BundleComponent
{
    public function getName(): string;

    /** Suma recursiva de kWh de todo el subarbol. */
    public function getTotalKwh(): float;

    /** Suma recursiva del costo de todo el subarbol. */
    public function getTotalPrice(): float;

    /** Numero de ofertas hoja dentro del subarbol. */
    public function countLeaves(): int;

    /** @return array<int, BundleComponent> */
    public function getChildren(): array;

    public function toArray(): array;
}
