import type { EnergyOffer } from '../singleton/energy-api.service';
import type { MarketEvent, MarketEventPayload, MarketObserver } from './MarketObserver';

/**
 * Patron Observer (frontend) — Sujeto concreto (rol «Subject»).
 *
 * Los cambios de estado del mercado (publicar/comprar energía) se
 * notifican por aquí: el sujeto guarda la lista de observadores y los
 * avisa a todos, sin conocer sus clases concretas. Cada observador
 * reacciona a su manera (refresco del dashboard, feed de actividad).
 */
class MarketEventsSubject {
  private static instance: MarketEventsSubject;

  /** @var MarketObserver[] */
  private observers: MarketObserver[] = [];

  private constructor() {}

  static getInstance(): MarketEventsSubject {
    if (!MarketEventsSubject.instance) {
      MarketEventsSubject.instance = new MarketEventsSubject();
    }
    return MarketEventsSubject.instance;
  }

  // ------------------------------------------------------------------
  // Gestión de observadores (rol Subject: attach/detach/notify).
  // ------------------------------------------------------------------

  attach(observer: MarketObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer: MarketObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  getObservers(): string[] {
    return this.observers.map((o) => o.name);
  }

  // ------------------------------------------------------------------
  // Notificación de cambios del mercado.
  // ------------------------------------------------------------------

  notifyOfferPublished(offer: EnergyOffer, detail = ''): void {
    this.notify('offer:published', { offer, detail });
  }

  notifyOfferPurchased(offer: EnergyOffer, detail = ''): void {
    this.notify('offer:purchased', { offer, detail });
  }

  private notify(event: MarketEvent, payload: MarketEventPayload): void {
    for (const observer of [...this.observers]) {
      observer.update(event, payload);
    }
  }
}

/** Sujeto único del mercado (singleton). */
const marketEventsSubject = MarketEventsSubject.getInstance();
export default marketEventsSubject;
