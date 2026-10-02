import type { BundleComponent, BundleNode } from './BundleComponent';
import { EnergyBundle } from './EnergyBundle';
import { OfferLeaf } from './OfferLeaf';

// Patron Composite - CLIENTE.
// Construye el arbol con el mismo formato JSON del backend.
class BundleService {
  getSampleTree(): BundleNode {
    const solar = new EnergyBundle('Paquete Solar Residencial');
    solar
      .add(new OfferLeaf('Paneles techo casa', 15, 480, 'solar'))
      .add(new OfferLeaf('Excedente patio', 5, 500, 'solar'));

    const renewable = new EnergyBundle('Paquete Renovable Mixto');
    renewable
      .add(new OfferLeaf('Aerogenerador finca', 20, 450, 'wind'))
      .add(new OfferLeaf('Microhidro local', 8, 520, 'hydro'));

    const market = new EnergyBundle('Paquete del Mercado');
    market.add(solar).add(renewable);

    return market.toArray();
  }

  // Evalua un arbol JSON con totales recursivos usando los mismos compuestos.
  evaluate(node: BundleNode): BundleNode {
    return this.build(node).toArray();
  }

  private build(node: BundleNode): BundleComponent {
    if (node.type === 'offer') {
      return new OfferLeaf(node.name, Number(node.kwh ?? 0), Number(node.pricePerKwh ?? 0), node.energyType ?? 'solar');
    }
    const bundle = new EnergyBundle(node.name);
    for (const child of node.children ?? []) {
      bundle.add(this.build(child));
    }
    return bundle;
  }
}

const bundleService = new BundleService();
export default bundleService;
