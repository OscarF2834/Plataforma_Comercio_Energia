import type { EnergyOffer } from '../singleton/energy-api.service';
import type { OfferIterator } from './OfferIterator';

/**
 * Patron Iterator — Iterador concreto por precio ascendente.
 *
 * Recorre las ofertas de la más barata a la más cara: el recorrido
 * óptimo para buscar el mejor precio de compra sin ordenar la
 * colección original del mercado.
 */
export class CheapestOfferIterator implements OfferIterator {
  private sorted: EnergyOffer[];
  private position = 0;

  constructor(offers: EnergyOffer[]) {
    this.sorted = [...offers].sort((a, b) => a.pricePerKwh - b.pricePerKwh);
  }

  hasNext(): boolean {
    return this.position < this.sorted.length;
  }

  next(): EnergyOffer | null {
    if (!this.hasNext()) return null;
    return this.sorted[this.position++];
  }

  rewind(): void {
    this.position = 0;
  }
}
