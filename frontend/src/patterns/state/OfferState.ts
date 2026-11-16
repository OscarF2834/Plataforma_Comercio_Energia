import type { EnergyOffer } from '../singleton/energy-api.service';

/**
 * Patron State (frontend) — Interfaz del estado (rol «State»).
 *
 * Cada estado del ciclo de vida de una oferta de excedente implementa
 * este contrato: la compra se comporta distinto según el estado en el
 * que esté la oferta (disponible, parcialmente vendida o agotada).
 */
export interface OfferState {
  /** Nombre técnico del estado (coincide con el backend). */
  name: string;

  /** Etiqueta visible en la insignia del panel. */
  label: string;

  /** Color de la insignia. */
  color: string;

  /** ¿Se puede comprar energía en este estado? */
  canPurchase(): boolean;

  /**
   * Ejecuta la compra en este estado. Cada estado concreto decide si
   * la permite o la rechaza, y devuelve el nuevo stock disponible.
   */
  purchase(offer: EnergyOffer, kwh: number): { success: boolean; message: string; availableKwh: number };
}
