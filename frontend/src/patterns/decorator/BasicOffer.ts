import type { OfferComponent } from './OfferComponent';

// Patron Decorator - COMPONENTE CONCRETO.
// Oferta base: energia x precio, sin extras.
export class BasicOffer implements OfferComponent {
  constructor(
    private kwh: number,
    private pricePerKwh: number,
  ) {}

  getDescription(): string {
    return `Oferta base de ${this.kwh} kWh a ${this.pricePerKwh} COP/kWh`;
  }

  getBasePrice(): number {
    return this.kwh * this.pricePerKwh;
  }

  getExtrasTotal(): number {
    return 0;
  }

  getTotal(): number {
    return this.getBasePrice();
  }

  getAdjustments(): { label: string; amount: number }[] {
    return [];
  }
}
