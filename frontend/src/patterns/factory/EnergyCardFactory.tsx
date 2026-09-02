import SolarCard from './cards/SolarCard';
import WindCard from './cards/WindCard';
import HydroCard from './cards/HydroCard';
import type { EnergySource } from './types';

type CardComponent = (props: { source: EnergySource }) => JSX.Element;

class EnergyCardFactory {
  create(type: string): (props: { source: EnergySource }) => JSX.Element {
    switch (type) {
      case 'solar':
        return SolarCard;
      case 'wind':
        return WindCard;
      case 'hydro':
        return HydroCard;
      default:
        throw new Error(`Tipo de energia no soportado: ${type}`);
    }
  }
}

const instance = new EnergyCardFactory();
export default instance;
export type { CardComponent };
