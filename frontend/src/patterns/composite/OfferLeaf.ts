import type { BundleComponent, BundleNode } from './BundleComponent';

// Patron Composite - HOJA. Oferta individual sin hijos.
export class OfferLeaf implements BundleComponent {
  constructor(
    private name: string,
    private kwh: number,
    private pricePerKwh: number,
    private energyType = 'solar',
  ) {}

  getName(): string {
    return this.name;
  }

  getTotalKwh(): number {
    return this.kwh;
  }

  getTotalPrice(): number {
    return this.kwh * this.pricePerKwh;
  }

  countLeaves(): number {
    return 1;
  }

  getChildren(): BundleComponent[] {
    return [];
  }

  toArray(): BundleNode {
    return {
      type: 'offer',
      name: this.name,
      energyType: this.energyType,
      kwh: this.kwh,
      pricePerKwh: this.pricePerKwh,
      totalKwh: this.getTotalKwh(),
      totalPrice: this.getTotalPrice(),
      children: [],
    };
  }
}
