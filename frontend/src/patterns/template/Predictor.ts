export interface MarketContext {
  totalOffers: number;
  activeOffers: number;
  totalAvailableKwh: number;
  avgPricePerKwh: number;
  transactionCount: number;
}

export interface Prediction {
  period: string;
  description: string;
  color: string;
  productionEstimate: number;
  consumptionEstimate: number;
  surplusEstimate: number;
  deficitEstimate: number;
  action: 'publish' | 'buy' | 'none';
  recommendation: string;
  market: MarketContext;
}

export abstract class Predictor {
  protected production: number;
  protected consumption: number;
  protected marketContext: MarketContext;

  constructor(production = 0, consumption = 0, marketContext: MarketContext = emptyMarket()) {
    this.production = production;
    this.consumption = consumption;
    this.marketContext = marketContext;
  }

  abstract getPeriod(): string;
  abstract getProductionEstimate(): number;
  abstract getConsumptionEstimate(): number;
  abstract getDescription(): string;
  abstract getColor(): string;

  predict(): Prediction {
    const production = this.getProductionEstimate();
    const consumption = this.getConsumptionEstimate();
    const surplus = production - consumption;

    return {
      period: this.getPeriod(),
      description: this.getDescription(),
      color: this.getColor(),
      productionEstimate: round(production),
      consumptionEstimate: round(consumption),
      surplusEstimate: round(Math.max(0, surplus)),
      deficitEstimate: round(Math.max(0, -surplus)),
      action: this.getAction(surplus),
      recommendation: this.buildRecommendation(surplus),
      market: this.marketContext,
    };
  }

  protected getAction(surplus: number): 'publish' | 'buy' | 'none' {
    if (surplus > 0) return 'publish';
    if (surplus < 0) return 'buy';
    return 'none';
  }

  protected buildRecommendation(surplus: number): string {
    const avgPrice = round(this.marketContext.avgPricePerKwh);
    const available = this.marketContext.totalAvailableKwh;
    const activeOffers = this.marketContext.activeOffers;

    if (surplus > 0) {
      return `Se estima un excedente de ${surplus} kWh. Puedes venderlo: el mercado promedia ${avgPrice} COP/kWh.`;
    }
    if (surplus < 0) {
      return `Se estima un deficit de ${Math.abs(surplus)} kWh. El mercado dispone de ${available} kWh en ${activeOffers} ofertas activas; compra para cubrir tu consumo.`;
    }
    return 'Tu produccion estimada cubre tu consumo; no necesitas comprar ni vender.';
  }
}

function emptyMarket(): MarketContext {
  return {
    totalOffers: 0,
    activeOffers: 0,
    totalAvailableKwh: 0,
    avgPricePerKwh: 0,
    transactionCount: 0,
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}