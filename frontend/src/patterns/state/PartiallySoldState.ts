import type { EnergyOffer } from '../singleton/energy-api.service';
import type { OfferState } from './OfferState';

/**
 * Patron State (frontend) — Estado concreto «Parcialmente vendida».
 *
 * Parte de la energía ya fue comprada pero queda stock disponible.
 * La compra sigue permitiéndose; el contexto decidirá si transiciona
 * a «Agotada» cuando llegue a cero.
 */
class PartiallySoldState implements OfferState {
  readonly name = 'partially_sold';
  readonly label = 'Parcialmente vendida';
  readonly color = '#f39c12';

  canPurchase(): boolean {
    return true;
  }

  purchase(offer: EnergyOffer, kwh: number) {
    if (kwh > offer.availableKwh) {
      return {
        success: false,
        message: `KWh insuficientes: quedan ${offer.availableKwh} kWh en esta oferta`,
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
export const partiallySoldState = new PartiallySoldState();
export default partiallySoldState;
