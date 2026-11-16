import type { EnergyOffer } from '../singleton/energy-api.service';
import type { OfferState } from './OfferState';

/**
 * Patron State (frontend) — Estado concreto «Disponible».
 *
 * La oferta tiene TODA su energía sin vender. La compra se permite
 * mientras alcance la cantidad pedida.
 */
class AvailableState implements OfferState {
  readonly name = 'available';
  readonly label = 'Disponible';
  readonly color = '#16c784';

  canPurchase(): boolean {
    return true;
  }

  purchase(offer: EnergyOffer, kwh: number) {
    if (kwh > offer.availableKwh) {
      return {
        success: false,
        message: 'KWh insuficientes disponibles',
        availableKwh: offer.availableKwh,
      };
    }

    const availableKwh = offer.availableKwh - kwh;
    return {
      success: true,
      message: `Compra exitosa de ${kwh} KWh`,
      availableKwh,
    };
  }
}

/** Instancia única del estado (los estados no llevan datos propios). */
export const availableState = new AvailableState();
export default availableState;
