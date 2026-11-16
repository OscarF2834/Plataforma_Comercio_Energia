import EnergyApiService from '../singleton/energy-api.service';
import type { EnergyOffer } from '../singleton/energy-api.service';
import type { DeviceElement, MarketElementVisitor, SourceElement } from './MarketElementVisitor';

/**
 * Patron Visitor (frontend) — Elementos concretos (rol «Element»).
 *
 * Cada elemento implementa accept(visitor) con el DOBLE DESPACHO: el
 * elemento decide qué método visit corresponde a su clase, así el
 * visitante nunca necesita hacer comprobaciones de tipo.
 */

export interface OfferElement {
  accept(visitor: MarketElementVisitor): void;
}

export function offerElement(offer: EnergyOffer): OfferElement {
  return {
    accept(visitor: MarketElementVisitor) {
      visitor.visitOffer(offer);
    },
  };
}

export function sourceElement(source: SourceElement): SourceElement & { accept(visitor: MarketElementVisitor): void } {
  return {
    ...source,
    accept(visitor: MarketElementVisitor) {
      visitor.visitSource(source);
    },
  };
}

export function deviceElement(device: DeviceElement): DeviceElement & { accept(visitor: MarketElementVisitor): void } {
  return {
    ...device,
    accept(visitor: MarketElementVisitor) {
      visitor.visitDevice(device);
    },
  };
}

/**
 * Inventario completo del mercado: ofertas + fuentes de energía +
 * red IoT. Cada uno se convierte en elemento visitable con accept().
 */
export async function buildMarketInventory() {
  const api = EnergyApiService.getInstance();
  const [offers, sources, devices] = await Promise.all([
    api.getAvailableOffers(),
    api.getSourceCatalog() as Promise<SourceElement[]>,
    api.getDevices(),
  ]);

  return {
    offers: offers.map(offerElement),
    sources: sources.map(sourceElement),
    devices: devices.map(deviceElement),
  };
}

/** Ejecuta un visitante sobre todos los elementos del inventario. */
export async function visitMarketInventory(visitor: MarketElementVisitor) {
  const inventory = await buildMarketInventory();
  for (const element of [...inventory.offers, ...inventory.sources, ...inventory.devices]) {
    element.accept(visitor);
  }
  return visitor.result();
}
