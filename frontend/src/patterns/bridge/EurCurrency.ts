import type { CurrencyBridge } from './CurrencyBridge';

// Patron Bridge - IMPLEMENTOR CONCRETO: euro.
// Formato local: dos decimales, punto de miles y simbolo al final.
const USD_RATE = 0.92;
const TAX_RATE = 0.21;

export class EurCurrency implements CurrencyBridge {
  get code(): string {
    return 'EUR';
  }

  get symbol(): string {
    return '\u20AC';
  }

  get label(): string {
    return 'Euros';
  }

  get decimals(): number {
    return 2;
  }

  get taxRate(): number {
    return TAX_RATE;
  }

  get usdRate(): number {
    return USD_RATE;
  }

  convertFromUsd(usdAmount: number): number {
    return usdAmount * USD_RATE;
  }

  convertToMinorUnits(amount: number): number {
    return Math.round(amount * 100);
  }

  format(amount: number): string {
    return `${new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)} \u20AC`;
  }
}
