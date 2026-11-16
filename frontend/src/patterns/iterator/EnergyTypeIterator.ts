import type { EnergyOffer } from '../singleton/energy-api.service';
import type { OfferIterator } from './OfferIterator';

/**
 * Patron Iterator — Iterador concreto por tipo de energía.
 *
 * Recorre SOLO las ofertas del tipo solicitado (solar, wind, hydro),
 * en el orden original de registro. Cumple el objetivo de clasificar
 * y administrar los tipos de energía del catálogo.
 */
export class EnergyTypeIterator implements OfferIterator {
  private filtered: EnergyOffer[];
  private position = 0;

  constructor(offers: EnergyOffer[], energyType: string) {
    const type = energyType.toLowerCase();
    this.filtered = offers.filter((o) => (o.energyType ?? '').toLowerCase() === type);
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
