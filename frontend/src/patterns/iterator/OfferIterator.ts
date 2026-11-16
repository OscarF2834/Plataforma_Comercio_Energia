import type { EnergyOffer } from '../singleton/energy-api.service';

/**
 * Patron Iterator (frontend) — Interfaz del iterador (rol «Iterator»).
 *
 * Contrato para recorrer el mercado de excedentes elemento a elemento
 * sin exponer la estructura interna (el arreglo de ofertas). Cada
 * estrategia concreta define su propio orden y filtrado.
 */
export interface OfferIterator {
  /** ¿Hay más ofertas por recorrer? */
  hasNext(): boolean;

  /** Devuelve la siguiente oferta del recorrido, o null al terminar. */
  next(): EnergyOffer | null;

  /** Reinicia el recorrido desde el principio. */
  rewind(): void;
}
