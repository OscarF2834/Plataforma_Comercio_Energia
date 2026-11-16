import type { MarketEvent, MarketEventPayload, MarketObserver } from './MarketObserver';

/**
 * Patron Observer (frontend) — Observador concreto «Refresco del dashboard».
 *
 * Reacciona a los cambios del mercado refrescando la lista de ofertas
 * del dashboard: cuando alguien publica o compra energía, el sujeto lo
 * notifica y este observador vuelve a consultar los datos sin que el
 * usuario tenga que recargar nada.
 */
export class DashboardRefreshObserver implements MarketObserver {
  readonly name = 'Refresco del dashboard (DashboardRefreshObserver)';

  private refreshCount = 0;

  constructor(private refresh: () => void) {}

  update(_event: MarketEvent, _payload: MarketEventPayload): void {
    this.refreshCount++;
    this.refresh();
  }

  getRefreshCount(): number {
    return this.refreshCount;
  }
}

export default DashboardRefreshObserver;
