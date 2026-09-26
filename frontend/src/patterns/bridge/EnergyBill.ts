import type { CurrencyBridge } from './CurrencyBridge';

// Patron Bridge - ABSTRACCION.
// Define la dimension "que reglas de liquidacion aplican" (perfil del
// cliente), independiente de la dimension "en que moneda se cobra"
// (CurrencyBridge). El flujo de calculo es el mismo para cualquier moneda:
// solo cambia el implementor inyectado en el constructor.
export interface BillInput {
  kwh: number;
  pricePerKwh: number;
}

export interface BillAdjustment {
  label: string;
  amount: number;
  amountFormatted: string;
}

export interface EnergyBillResult {
  profile: string;
  profileName: string;
  profileDescription: string;
  currency: string;
  currencySymbol: string;
  currencyLabel: string;
  kwh: number;
  pricePerKwh: number;
  pricePerKwhFormatted: string;
  subtotal: number;
  subtotalFormatted: string;
  adjustments: BillAdjustment[];
  adjustmentTotal: number;
  adjustmentTotalFormatted: string;
  base: number;
  baseFormatted: string;
  taxRate: number;
  tax: number;
  taxFormatted: string;
  total: number;
  totalFormatted: string;
  totalMinorUnits: number;
  issuedAt: string;
}

export abstract class EnergyBill {
  constructor(protected currency: CurrencyBridge) {}

  abstract getProfileKey(): string;
  abstract getProfileName(): string;
  abstract getProfileDescription(): string;
  abstract applyProfileRules(subtotal: number): BillAdjustment[];

  build(input: BillInput): EnergyBillResult {
    const subtotal = input.kwh * input.pricePerKwh;
    const adjustments = this.applyProfileRules(subtotal);

    const adjustmentTotal = adjustments.reduce((acc, item) => acc + item.amount, 0);
    const base = subtotal + adjustmentTotal;
    const taxRate = this.currency.taxRate;
    const tax = base * taxRate;
    const total = base + tax;

    return {
      profile: this.getProfileKey(),
      profileName: this.getProfileName(),
      profileDescription: this.getProfileDescription(),
      currency: this.currency.code,
      currencySymbol: this.currency.symbol,
      currencyLabel: this.currency.label,
      kwh: round(input.kwh, 2),
      pricePerKwh: round(input.pricePerKwh, 2),
      pricePerKwhFormatted: this.currency.format(input.pricePerKwh),
      subtotal: round(subtotal, 2),
      subtotalFormatted: this.currency.format(subtotal),
      adjustments,
      adjustmentTotal: round(adjustmentTotal, 2),
      adjustmentTotalFormatted: this.currency.format(adjustmentTotal),
      base: round(base, 2),
      baseFormatted: this.currency.format(base),
      taxRate,
      tax: round(tax, 2),
      taxFormatted: this.currency.format(tax),
      total: round(total, 2),
      totalFormatted: this.currency.format(total),
      totalMinorUnits: this.currency.convertToMinorUnits(total),
      issuedAt: new Date().toISOString(),
    };
  }
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
