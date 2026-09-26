import { EnergyBill } from './EnergyBill';
import type { BillAdjustment } from './EnergyBill';

// Patron Bridge - ABSTRACCION REFINADA: tarifa residencial.
// Aplica el subsidio del 5%. El porcentaje es independiente de la unidad
// monetaria, por eso el mismo perfil funciona en COP, USD o EUR sin cambios.
const SUBSIDY_RATE = 0.05;

export class ResidentialBill extends EnergyBill {
  getProfileKey(): string {
    return 'residential';
  }

  getProfileName(): string {
    return 'Tarifa residencial';
  }

  getProfileDescription(): string {
    return 'Vivienda unifamiliar con subsidio del 5% sobre el valor de la energia.';
  }

  applyProfileRules(subtotal: number): BillAdjustment[] {
    const amount = -round(subtotal * SUBSIDY_RATE, 2);
    return [
      {
        label: `Subsidio residencial (${SUBSIDY_RATE * 100}%)`,
        amount,
        amountFormatted: this.currency.format(amount),
      },
    ];
  }
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
