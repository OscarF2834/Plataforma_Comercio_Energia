/**
 * Patron Mediator (frontend) — Mediador de la plataforma (rol «Mediator»).
 *
 * Centraliza la comunicación entre los componentes de la interfaz
 * (Publicar oferta, Dashboard, Panel de patrones, ...): antes cada
 * componente avisaba a otro directamente con props encadenadas; ahora
 * todos publican/suscriben eventos a través de este mediador.
 *
 * Eventos coordinados:
 *  - "offer:created"    → un colega publicó un excedente (el dashboard se refresca).
 *  - "offer:purchased"  → un colega compró energía.
 *  - "system:refresh"   → petición genérica de refresco del sistema.
 */

export type PlatformEvent = 'offer:created' | 'offer:purchased' | 'system:refresh';

export interface MediatorEvent {
  event: PlatformEvent | string;
  detail: string;
  at: string;
}

/** Rol «Colleague»: los componentes se registran con esta interfaz. */
export interface PlatformColleague {
  name: string;
}

class PlatformMediator {
  private static instance: PlatformMediator;

  /** @var Record<string, Array<(payload: Record<string, unknown>) => void>> */
  private listeners: Record<string, Array<(payload: Record<string, unknown>) => void>> = {};

  private colleagues: PlatformColleague[] = [];
  private eventLog: MediatorEvent[] = [];

  private constructor() {}

  static getInstance(): PlatformMediator {
    if (!PlatformMediator.instance) {
      PlatformMediator.instance = new PlatformMediator();
    }
    return PlatformMediator.instance;
  }

  // ------------------------------------------------------------------
  // Rol «Colleague»: registro de componentes coordinados.
  // ------------------------------------------------------------------

  registerColleague(colleague: PlatformColleague): void {
    if (!this.colleagues.some((c) => c.name === colleague.name)) {
      this.colleagues.push(colleague);
    }
  }

  getColleagues(): PlatformColleague[] {
    return [...this.colleagues];
  }

  // ------------------------------------------------------------------
  // Comunicación: todo pasa por el mediador.
  // ------------------------------------------------------------------

  /** Devuelve la función para desuscribirse. */
  subscribe(event: PlatformEvent | string, handler: (payload: Record<string, unknown>) => void): () => void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
    return () => {
      this.listeners[event] = this.listeners[event].filter((h) => h !== handler);
    };
  }

  /** Un colega notifica un evento; el mediador lo reparte y lo registra. */
  publish(event: PlatformEvent | string, detail = '', payload: Record<string, unknown> = {}): void {
    this.eventLog.push({
      event,
      detail,
      at: new Date().toLocaleTimeString(),
    });
    if (this.eventLog.length > 30) {
      this.eventLog = this.eventLog.slice(-30);
    }
    for (const handler of this.listeners[event] ?? []) {
      handler(payload);
    }
  }

  getEventLog(): MediatorEvent[] {
    return [...this.eventLog].reverse();
  }

  getStats() {
    return {
      colleagues: this.colleagues.map((c) => c.name),
      eventsHandled: this.eventLog.length,
      subscribedEvents: Object.keys(this.listeners).filter((k) => this.listeners[k].length > 0),
    };
  }
}

export default PlatformMediator;
