import type { EnergyOffer } from '../singleton/energy-api.service';

/**
 * Patron Observer (frontend) — Interfaz del observador (rol «Observer»).
 *
 * Los observadores implementan update() y reaccionan de forma distinta
 * a los MISMOS eventos del mercado: uno refresca el dashboard, otro
 * alimenta el registro de actividad en vivo. El sujeto no conoce sus
 * clases concretas, solo esta interfaz.
 */
export type MarketEvent = 'offer:published' | 'offer:purchased';

export interface MarketEventPayload {
  offer: EnergyOffer;
  detail: string;
}

export interface MarketObserver {
  /** Nombre visible del observador (para el panel de estadísticas). */
  name: string;

  /** Reacción al evento notificado por el sujeto. */
  update(event: MarketEvent, payload: MarketEventPayload): void;
}
