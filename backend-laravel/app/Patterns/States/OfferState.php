<?php

namespace App\Patterns\States;

use App\Models\EnergyOffer;

/**
 * Patron State — Interfaz del estado (rol «State»).
 *
 * Cada estado del ciclo de vida de una oferta de excedente implementa
 * este contrato: la COMPRA se comporta distinto según el estado en el
 * que esté la oferta (disponible, parcialmente vendida o agotada).
 */
interface OfferState
{
    /** Nombre técnico del estado (persistido en el JSON del mercado). */
    public function name(): string;

    /** Etiqueta visible en la interfaz. */
    public function label(): string;

    /** Color de la insignia en el panel. */
    public function color(): string;

    /** ¿Se puede comprar energía en este estado? */
    public function canPurchase(): bool;

    /**
     * Ejecuta la compra en este estado. Cada estado concreto decide si
     * la permite o la rechaza, y muta la energía disponible de la oferta.
     */
    public function purchase(EnergyOffer $offer, int $kwh): array;
}
