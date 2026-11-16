import type { EnergyOffer } from '../singleton/energy-api.service';
import type { OfferState } from './OfferState';

/**
 * Patron State (frontend) — Estado concreto «Agotada».
 *
 * No queda energía disponible: el estado RECHAZA la compra sin tocar
 * el stock. Es el comportamiento polimórfico clave del patrón: el
 * mismo método purchase() produce resultados distintos según el
 * estado de la oferta.
 */
class SoldOutState implements OfferState {
  readonly name = 'sold_out';
  readonly label = 'Agotada';
  readonly color = '#e74c3c';

  canPurchase(): boolean {
    return false;
  }

  purchase(offer: EnergyOffer, _kwh: number) {
    return {
      success: false,
      message: 'Esta oferta está agotada: no queda energía disponible para comprar',
      availableKwh: offer.availableKwh,
    };
  }
}

/** Instancia única del estado (los estados no llevan datos propios). */
export const soldOutState = new SoldOutState();
export default soldOutState;
