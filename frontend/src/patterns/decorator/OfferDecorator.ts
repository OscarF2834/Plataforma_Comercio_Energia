import type { OfferComponent } from './OfferComponent';

// Patron Decorator - DECORADOR BASE.
// Envuelve un OfferComponent y delega todo en el componente envuelto.
export abstract class OfferDecorator implements OfferComponent {
  constructor(protected wrapped: OfferComponent) {}

  getDescription(): string {
    return this.wrapped.getDescription();
  }

  getBasePrice(): number {
    return this.wrapped.getBasePrice();
  }

  getExtrasTotal(): number {
    return this.wrapped.getExtrasTotal();
  }

  getTotal(): number {
    return this.wrapped.getTotal();
  }

  getAdjustments(): { label: string; amount: number }[] {
    return this.wrapped.getAdjustments();
  }
}
