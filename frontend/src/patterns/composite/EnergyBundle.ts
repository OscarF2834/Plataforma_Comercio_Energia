import type { BundleComponent, BundleNode } from './BundleComponent';

// Patron Composite - COMPUESTO.
// Un bundle agrupa ofertas u otros bundles; sus totales se calculan
// recursivamente recorriendo los hijos.
export class EnergyBundle implements BundleComponent {
  private children: BundleComponent[] = [];

  constructor(private name: string) {}

  add(child: BundleComponent): this {
    this.children.push(child);
    return this;
  }

  getName(): string {
    return this.name;
  }

  getTotalKwh(): number {
    return this.children.reduce((sum, c) => sum + c.getTotalKwh(), 0);
  }

  getTotalPrice(): number {
    return this.children.reduce((sum, c) => sum + c.getTotalPrice(), 0);
  }

  countLeaves(): number {
    return this.children.reduce((sum, c) => sum + c.countLeaves(), 0);
  }

  getChildren(): BundleComponent[] {
    return this.children;
  }

  toArray(): BundleNode {
    return {
      type: 'bundle',
      name: this.name,
      totalKwh: this.getTotalKwh(),
      totalPrice: this.getTotalPrice(),
      offerCount: this.countLeaves(),
      children: this.children.map((c) => c.toArray()),
    };
  }
}
