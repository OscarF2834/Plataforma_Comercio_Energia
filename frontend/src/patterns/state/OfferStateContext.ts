import type { EnergyOffer } from '../singleton/energy-api.service';
import type { OfferState } from './OfferState';
import { availableState } from './AvailableState';
import { partiallySoldState } from './PartiallySoldState';
import { soldOutState } from './SoldOutState';

/**
 * Patron State (frontend) — Contexto (rol «Context»).
 *
 * Resuelve el estado actual de una oferta y delega en él el
 * comportamiento de la compra. Las transiciones son automáticas
 * según la energía disponible que quede tras cada compra:
 *
 *   Disponible ──compra parcial──► Parcialmente vendida ──llega a 0──► Agotada
 */
export class OfferStateContext {
  /** Resuelve el estado a partir de la energía disponible (dato fuente). */
  static resolve(offer: Pick<EnergyOffer, 'totalKwh' | 'availableKwh'>): OfferState {
    if (offer.availableKwh <= 0) {
      return soldOutState;
    }
    if (offer.availableKwh < offer.totalKwh) {
      return partiallySoldState;
    }
    return availableState;
  }

  /**
   * Ejecuta una compra delegando en el estado actual y devuelve el
   * resultado junto con la transición de estado ocurrida.
   */
  static handlePurchase(offer: EnergyOffer, kwh: number) {
    const state = OfferStateContext.resolve(offer);
    const previous = state.name;

    // El comportamiento depende del ESTADO (compra polimórfica).
    const result = state.purchase(offer, kwh);

    const newState = OfferStateContext.resolve({
      ...offer,
      availableKwh: result.availableKwh,
    });

    return {
      ...result,
      state: {
        previous,
        current: newState.name,
        label: newState.label,
        color: newState.color,
        changed: previous !== newState.name,
      },
    };
  }
}

export default OfferStateContext;
