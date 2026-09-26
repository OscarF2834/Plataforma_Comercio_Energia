// Patron Bridge - IMPLEMENTOR.
// Define la dimension "como se expresa y convierte el dinero" sin saber
// nada de facturas ni de la plataforma. Gracias a esta separacion, agregar
// una moneda no obliga a tocar la jerarquia de facturas, y viceversa.
export interface CurrencyInfo {
  code: string;
  symbol: string;
  label: string;
  decimals: number;
  taxRate: number;
  usdRate: number;
}

export interface CurrencyBridge extends CurrencyInfo {
  convertFromUsd(usdAmount: number): number;
  convertToMinorUnits(amount: number): number;
  format(amount: number): string;
}
