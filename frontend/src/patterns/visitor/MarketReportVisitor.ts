import type { EnergyOffer } from '../singleton/energy-api.service';
import type { DeviceElement, MarketElementVisitor, SourceElement } from './MarketElementVisitor';

/**
 * Patron Visitor (frontend) — Visitante concreto «Reporte del mercado».
 *
 * Recorre ofertas, fuentes de energía y dispositivos IoT acumulando
 * un reporte consolidado: energía disponible por tipo de energía,
 * estadísticas de precio y estado de la red IoT.
 */
export class MarketReportVisitor implements MarketElementVisitor {
  private offers: { id?: number; producerName: string; energyType: string; availableKwh: number; pricePerKwh: number }[] = [];
  private kwhByType: Record<string, number> = {};
  private offersByType: Record<string, number> = {};
  private prices: number[] = [];

  private sources: { type: string; name: string; efficiency: number }[] = [];

  private totalDevices = 0;
  private onlineDevices = 0;

  visitOffer(offer: EnergyOffer): void {
    const type = offer.energyType || 'sin_tipo';
    this.offers.push({
      id: offer.id,
      producerName: offer.producerName,
      energyType: offer.energyType ?? '',
      availableKwh: offer.availableKwh,
      pricePerKwh: offer.pricePerKwh,
    });
    this.kwhByType[type] = Math.round(((this.kwhByType[type] ?? 0) + offer.availableKwh) * 100) / 100;
    this.offersByType[type] = (this.offersByType[type] ?? 0) + 1;
    this.prices.push(offer.pricePerKwh);
  }

  visitSource(source: SourceElement): void {
    this.sources.push({ type: source.type, name: source.name, efficiency: source.efficiency });
  }

  visitDevice(device: DeviceElement): void {
    this.totalDevices++;
    if (device.online) {
      this.onlineDevices++;
    }
  }

  result(): Record<string, unknown> {
    const avgPrice =
      this.prices.length > 0
        ? Math.round((this.prices.reduce((a, b) => a + b, 0) / this.prices.length) * 100) / 100
        : 0;

    return {
      visitor: 'Reporte del mercado (MarketReportVisitor)',
      market: {
        totalOffers: this.offers.length,
        kwhAvailableByType: this.kwhByType,
        offersByType: this.offersByType,
        minPricePerKwh: this.prices.length > 0 ? Math.min(...this.prices) : 0,
        maxPricePerKwh: this.prices.length > 0 ? Math.max(...this.prices) : 0,
        avgPricePerKwh: avgPrice,
      },
      sources: this.sources,
      iot: {
        totalDevices: this.totalDevices,
        onlineDevices: this.onlineDevices,
        offlineDevices: this.totalDevices - this.onlineDevices,
      },
    };
  }
}
