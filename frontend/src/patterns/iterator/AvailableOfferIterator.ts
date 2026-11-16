import type { EnergyOffer } from '../singleton/energy-api.service';
import type { OfferIterator } from './OfferIterator';

/**
 * Patron Iterator — Iterador concreto de ofertas disponibles.
 *
 * Recorre únicamente las ofertas con energía disponible
 * (availableKwh > 0), filtrando las agotadas. Apoya el objetivo de
 * «consultar los excedentes disponibles».
 */
export class AvailableOfferIterator implements OfferIterator {
  private filtered: EnergyOffer[];
  private position = 0;

  constructor(offers: EnergyOffer[]) {
    this.filtered = offers.filter((o) => o.availableKwh > 0);
  }

  hasNext(): boolean {
    return this.position < this.filtered.length;
  }

  next(): EnergyOffer | null {
    if (!this.hasNext()) return null;
    return this.filtered[this.position++];
  }

  rewind(): void {
    this.position = 0;
  }
}
