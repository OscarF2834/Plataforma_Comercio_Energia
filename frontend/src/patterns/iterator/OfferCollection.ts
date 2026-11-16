import type { EnergyOffer } from '../singleton/energy-api.service';
import type { OfferIterator } from './OfferIterator';
import { EnergyTypeIterator } from './EnergyTypeIterator';
import { CheapestOfferIterator } from './CheapestOfferIterator';
import { AvailableOfferIterator } from './AvailableOfferIterator';

/**
 * Patron Iterator — Colección agregada (rol «Aggregate»).
 *
 * Envuelve el arreglo de ofertas del mercado y expone la creación de
 * iteradores concretos según la estrategia pedida. El cliente (paneles
 * de React) nunca recorre el arreglo directamente: siempre lo hace
 * mediante un OfferIterator con hasNext()/next().
 */
export class OfferCollection {
  public static readonly STRATEGIES = ['type', 'cheapest', 'available'] as const;

  constructor(private offers: EnergyOffer[]) {}

  /** Factory Method del Iterator: crea el iterador concreto por estrategia. */
  createIterator(
    strategy: string,
    params: { energyType?: string } = {},
  ): OfferIterator {
    switch (strategy.toLowerCase()) {
      case 'type':
        return new EnergyTypeIterator(this.offers, params.energyType ?? '');
      case 'cheapest':
        return new CheapestOfferIterator(this.offers);
      case 'available':
        return new AvailableOfferIterator(this.offers);
      default:
        throw new Error(`Estrategia de iteracion no soportada: ${strategy}`);
    }
  }

  /** Recorrido completo en un solo paso (usa el iterador internamente). */
  collect(
    strategy: string,
    params: { energyType?: string } = {},
  ): { offers: EnergyOffer[]; walked: number } {
    const iterator = this.createIterator(strategy, params);
    const collected: EnergyOffer[] = [];
    let walked = 0;
    while (iterator.hasNext()) {
      const offer = iterator.next();
      walked++;
      if (offer !== null) collected.push(offer);
    }
    return { offers: collected, walked };
  }

  count(): number {
    return this.offers.length;
  }
}
