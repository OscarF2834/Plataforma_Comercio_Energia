<?php

namespace App\Patterns\Decorators;

/**
 * Patron Decorator - COMPONENTE.
 *
 * Interfaz comun entre el componente concreto (BasicOffer) y los
 * decoradores. El cliente trata una oferta base y una oferta "decorada"
 * (con certificacion, seguro, entrega prioritaria...) de la misma forma.
 */
interface OfferComponent
{
    /** Descripcion legible: se va ampliando con cada decorador. */
    public function getDescription(): string;

    /** Subtotal base de la oferta (sin extras). */
    public function getBasePrice(): float;

    /** Suma de los ajustes aportados por los decoradores. */
    public function getExtrasTotal(): float;

    /** Total final = base + extras. */
    public function getTotal(): float;

    /**
     * Desglose de ajustes: lineas {label, amount}.
     *
     * @return array<int, array{label: string, amount: float}>
     */
    public function getAdjustments(): array;
}
