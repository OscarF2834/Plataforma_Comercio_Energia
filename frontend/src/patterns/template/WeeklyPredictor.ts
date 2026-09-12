import { Predictor } from './Predictor';
import type { MarketContext } from './Predictor';

export class WeeklyPredictor extends Predictor {
  constructor(production = 0, consumption = 0, marketContext?: MarketContext) {
    super(production, consumption, marketContext);
  }

  getPeriod(): string {
    return 'weekly';
  }

  getProductionEstimate(): number {
    return this.production > 0 ? this.production * 6 : 21.5;
  }

  getConsumptionEstimate(): number {
    return this.consumption > 0 ? this.consumption * 6 : 13;
  }

  getDescription(): string {
    return 'Prediccion semanal basada en el promedio ponderado de produccion y consumo de la ultima semana.';
  }

  getColor(): string {
    return '#3498db';
  }
}