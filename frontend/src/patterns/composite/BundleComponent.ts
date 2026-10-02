// Patron Composite - COMPONENTE.
// Hojas y compuestos comparten esta interfaz.
export interface BundleComponent {
  getName(): string;
  getTotalKwh(): number;
  getTotalPrice(): number;
  countLeaves(): number;
  getChildren(): BundleComponent[];
  toArray(): BundleNode;
}

export interface BundleNode {
  type: 'offer' | 'bundle';
  name: string;
  energyType?: string;
  kwh?: number;
  pricePerKwh?: number;
  totalKwh: number;
  totalPrice: number;
  offerCount?: number;
  children: BundleNode[];
}
