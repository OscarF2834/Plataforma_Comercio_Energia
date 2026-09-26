import { EnergyBill } from './EnergyBill';
import type { BillAdjustment } from './EnergyBill';

// Patron Bridge - ABSTRACCION REFINADA: tarifa comercial.
// Recargo del 2% mas una tarifa fija definida en USD y convertida con el
// implementor: el mismo perfil produce $97.500 COP, US$ 25 o 23 EUR segun
// la moneda. Esa es la separacion del Bridge en accion.
const SURCHARGE_RATE = 0.02;
const FLAT_FEE_USD = 25.0;

export class CommercialBill extends EnergyBill {
  getProfileKey(): string {
    return 'commercial';
  }

  getProfileName(): string {
    return 'Tarifa comercial';
  }

  getProfileDescription(): string {
    return 'Local o negocio con recargo comercial del 2% y tarifa de servicio de US$ 25 convertida a la moneda de liquidacion.';
  }

  applyProfileRules(subtotal: number): BillAdjustment[] {
    const surcharge = round(subtotal * SURCHARGE_RATE, 2);
    const flatFee = round(this.currency.convertFromUsd(FLAT_FEE_USD), 2);

    return [
      {
        label: `Recargo comercial (${SURCHARGE_RATE * 100}%)`,
        amount: surcharge,
        amountFormatted: this.currency.format(surcharge),
      },
      {
        label: `Tarifa de servicio comercial (US$ ${FLAT_FEE_USD})`,
        amount: flatFee,
        amountFormatted: this.currency.format(flatFee),
      },
    ];
  }
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
