import { OfferDecorator } from './OfferDecorator';

/** Recargo del 5% por certificacion de energia 100% renovable. */
export class GreenCertificationDecorator extends OfferDecorator {
  static RATE = 0.05;

  getDescription(): string {
    return `${this.wrapped.getDescription()} + Certificacion Verde`;
  }

  getExtrasTotal(): number {
    return this.wrapped.getExtrasTotal() + this.wrapped.getBasePrice() * GreenCertificationDecorator.RATE;
  }

  getTotal(): number {
    return this.wrapped.getTotal() + this.wrapped.getBasePrice() * GreenCertificationDecorator.RATE;
  }

  getAdjustments() {
    return [
      ...this.wrapped.getAdjustments(),
      { label: 'Certificacion Verde (+5%)', amount: Math.round(this.wrapped.getBasePrice() * GreenCertificationDecorator.RATE * 100) / 100 },
    ];
  }
}
