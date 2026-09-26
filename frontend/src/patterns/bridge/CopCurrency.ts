import type { CurrencyBridge } from './CurrencyBridge';

// Patron Bridge - IMPLEMENTOR CONCRETO: peso colombiano.
// Formato local: sin decimales, punto de miles y sufijo COP.
const USD_RATE = 3900.0;
const TAX_RATE = 0.19;

export class CopCurrency implements CurrencyBridge {
  get code(): string {
    return 'COP';
  }

  get symbol(): string {
    return '$';
  }

  get label(): string {
    return 'Pesos colombianos';
  }

  get decimals(): number {
    return 0;
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
    return Math.round(amount);
  }

  format(amount: number): string {
    return `$ ${new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)} COP`;
  }
}
