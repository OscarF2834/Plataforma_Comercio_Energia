import type { EnergyOffer } from '../singleton/energy-api.service';
import type { MarketEvent, MarketEventPayload, MarketObserver } from './MarketObserver';

export interface MarketFeedEntry {
  event: MarketEvent;
  detail: string;
  at: string;
}

/**
 * Patron Observer (frontend) — Observador concreto «Feed de actividad».
 *
 * Reacciona a los cambios del mercado manteniendo un registro en vivo
 * de las últimas novedades (publicaciones y compras). Es el observador
 * que alimenta el panel de patrones de comportamiento.
 */
export class ActivityFeedObserver implements MarketObserver {
  readonly name = 'Feed de actividad (ActivityFeedObserver)';

  private feed: MarketFeedEntry[] = [];

  update(event: MarketEvent, payload: MarketEventPayload): void {
    this.feed.push({
      event,
      detail: payload.detail || this.describe(payload.offer),
      at: new Date().toLocaleTimeString(),
    });
    if (this.feed.length > 20) {
      this.feed = this.feed.slice(-20);
    }
  }

  private describe(offer: EnergyOffer): string {
    const label = offer.producerName ? `de ${offer.producerName}` : '';
    return `Oferta #${offer.id ?? '?'} ${label} (${offer.energyType ?? 'sin tipo'})`;
  }

  /** Últimas novedades, la más reciente primero. */
  getFeed(): MarketFeedEntry[] {
    return [...this.feed].reverse();
  }

  countEvents(): number {
    return this.feed.length;
  }
}

/** Observador único del feed (singleton: el panel lo lee en vivo). */
const activityFeedObserver = new ActivityFeedObserver();
export default activityFeedObserver;
