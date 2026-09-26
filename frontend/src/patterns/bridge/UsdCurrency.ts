import type { CurrencyBridge } from './CurrencyBridge';

// Patron Bridge - IMPLEMENTOR CONCRETO: dolar estadounidense.
// Formato local: dos decimales, coma de miles y sufijo USD.
const USD_RATE = 1.0;
const TAX_RATE = 0.1;

export class UsdCurrency implements CurrencyBridge {
  get code(): string {
    return 'USD';
  }

  get symbol(): string {
    return 'US$';
  }

  get label(): string {
    return 'Dolares estadounidenses';
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
    return `US$ ${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)} USD`;
  }
}
