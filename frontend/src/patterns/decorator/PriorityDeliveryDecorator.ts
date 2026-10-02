import { OfferDecorator } from './OfferDecorator';

/** Costo fijo por entregar la energia con prioridad en la red virtual. */
export class PriorityDeliveryDecorator extends OfferDecorator {
  static FLAT_FEE = 8000;

  getDescription(): string {
    return `${this.wrapped.getDescription()} + Entrega prioritaria`;
  }

  getExtrasTotal(): number {
    return this.wrapped.getExtrasTotal() + PriorityDeliveryDecorator.FLAT_FEE;
  }

  getTotal(): number {
    return this.wrapped.getTotal() + PriorityDeliveryDecorator.FLAT_FEE;
  }

  getAdjustments() {
    return [
      ...this.wrapped.getAdjustments(),
      { label: 'Entrega prioritaria (tarifa fija)', amount: PriorityDeliveryDecorator.FLAT_FEE },
    ];
  }
}
