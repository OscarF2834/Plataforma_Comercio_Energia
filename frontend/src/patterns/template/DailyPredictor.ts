import { Predictor } from './Predictor';
import type { MarketContext } from './Predictor';

export class DailyPredictor extends Predictor {
  constructor(production = 0, consumption = 0, marketContext?: MarketContext) {
    super(production, consumption, marketContext);
  }

  getPeriod(): string {
    return 'daily';
  }

  getProductionEstimate(): number {
    return this.production > 0 ? this.production : 18;
  }

  getConsumptionEstimate(): number {
    return this.consumption > 0 ? this.consumption : 10;
  }

  getDescription(): string {
    return 'Prediccion diaria basada en la produccion y consumo registrados en el ultimo periodo.';
  }

  getColor(): string {
    return '#f39c12';
  }
}