import { OfferDecorator } from './OfferDecorator';

/** Recargo del 3% por seguro contra perdidas de suministro. */
export class InsuranceDecorator extends OfferDecorator {
  static RATE = 0.03;

  getDescription(): string {
    return `${this.wrapped.getDescription()} + Seguro de suministro`;
  }

  getExtrasTotal(): number {
    return this.wrapped.getExtrasTotal() + this.wrapped.getBasePrice() * InsuranceDecorator.RATE;
  }

  getTotal(): number {
    return this.wrapped.getTotal() + this.wrapped.getBasePrice() * InsuranceDecorator.RATE;
  }

  getAdjustments() {
    return [
      ...this.wrapped.getAdjustments(),
      { label: 'Seguro de suministro (+3%)', amount: Math.round(this.wrapped.getBasePrice() * InsuranceDecorator.RATE * 100) / 100 },
    ];
  }
}
