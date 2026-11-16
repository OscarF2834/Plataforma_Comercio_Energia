<?php

namespace App\Patterns\Iterators;

use App\Models\EnergyOffer;

/**
 * Patron Iterator — Interfaz del iterador (rol «Iterator»).
 *
 * Define el contrato para recorrer el mercado de excedentes energéticos
 * elemento a elemento SIN exponer la estructura interna (el arreglo de
 * ofertas de MarketService). Cada estrategia concreta implementa su
 * propio orden y filtrado.
 */
interface OfferIterator
{
    /** ¿Hay más ofertas por recorrer? */
    public function hasNext(): bool;

    /** Devuelve la siguiente oferta del recorrido, o null al terminar. */
    public function next(): ?EnergyOffer;

    /** Reinicia el recorrido desde el principio. */
    public function rewind(): void;
}
