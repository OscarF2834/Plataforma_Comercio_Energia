import { CopCurrency } from './CopCurrency';
import { UsdCurrency } from './UsdCurrency';
import { EurCurrency } from './EurCurrency';
import { ResidentialBill } from './ResidentialBill';
import { CommercialBill } from './CommercialBill';
import { EnergyBill } from './EnergyBill';
import type { CurrencyBridge, CurrencyInfo } from './CurrencyBridge';
import type { BillInput, EnergyBillResult } from './EnergyBill';

type BillConstructor = new (currency: CurrencyBridge) => EnergyBill;

export interface ProfileInfo {
  key: string;
  name: string;
  description: string;
}

// Patron Bridge - CLIENTE.
// Compone las dos jerarquias: una abstraccion refinada (EnergyBill) mas un
// implementor concreto (CurrencyBridge). Es el unico punto que conoce ambas
// clases concretas; ni EnergyBill ni CurrencyBridge se conocen entre si.
class SettlementService {
  private currencies: Record<string, CurrencyBridge>;
  private profiles: Record<string, BillConstructor>;

  constructor() {
    const currencies = [new CopCurrency(), new UsdCurrency(), new EurCurrency()];
    this.currencies = {};
    currencies.forEach((currency) => {
      this.currencies[currency.code] = currency;
    });

    this.profiles = {
      residential: ResidentialBill,
      commercial: CommercialBill,
    };
  }

  getCurrencies(): CurrencyInfo[] {
    return Object.values(this.currencies).map((currency) => ({
      code: currency.code,
      symbol: currency.symbol,
      label: currency.label,
      decimals: currency.decimals,
      taxRate: currency.taxRate,
      usdRate: currency.usdRate,
    }));
  }

  getProfiles(): ProfileInfo[] {
    // Se instancia cada perfil con cualquier implementor solo para leer su
    // descripcion: la moneda no altera las reglas del perfil.
    return Object.entries(this.profiles).map(([key, Bill]) => {
      const profile = new Bill(this.currencies.COP);
      return {
        key: profile.getProfileKey() || key,
        name: profile.getProfileName(),
        description: profile.getProfileDescription(),
      };
    });
  }

  quote(profile: string, currencyCode: string, input: BillInput): EnergyBillResult {
    const bill = this.createBill(profile, this.resolveCurrency(currencyCode));
    return bill.build(input);
  }

  private createBill(profile: string, currency: CurrencyBridge): EnergyBill {
    const Bill = this.profiles[profile];
    if (!Bill) throw new Error(`Perfil de liquidacion desconocido: ${profile}`);
    return new Bill(currency);
  }

  private resolveCurrency(code: string): CurrencyBridge {
    const currency = this.currencies[code];
    if (!currency) throw new Error(`Moneda no soportada: ${code}`);
    return currency;
  }
}

const settlementService = new SettlementService();
export default settlementService;
