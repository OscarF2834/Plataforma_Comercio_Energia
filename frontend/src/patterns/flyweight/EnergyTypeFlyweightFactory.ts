import type { EnergySource as _EnergySource } from '../factory/types';

export interface EnergyTypeDescriptor {
  type: string;
  name: string;
  description: string;
  efficiency: number;
  color: string;
  emoji: string;
  image: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}

/**
 * Patron Flyweight (frontend).
 *
 * Reutiliza descriptores compartidos por tipo de energia (solar, wind, hydro).
 * Cada componente que muestre el mismo tipo accede a la MISMA instancia.
 */
class EnergyTypeFlyweightFactory {
  private static instance: EnergyTypeFlyweightFactory;
  private readonly pool = new Map<string, EnergyTypeDescriptor>();

  private constructor() {
    this.seed();
  }

  static getInstance(): EnergyTypeFlyweightFactory {
    if (!EnergyTypeFlyweightFactory.instance) {
      EnergyTypeFlyweightFactory.instance = new EnergyTypeFlyweightFactory();
    }
    return EnergyTypeFlyweightFactory.instance;
  }

  private seed() {
    this.pool.set('solar', {
      type: 'solar',
      name: 'Energia Solar',
      description: 'Captura la luz del sol mediante paneles fotovoltaicos para generar electricidad de forma limpia.',
      efficiency: 85,
      color: '#f39c12',
      emoji: '☀️',
      image: '/images/solar-energy.svg',
      accentBg: '#fdf3e3',
      accentBorder: '#f39c12',
      accentText: '#7a5200',
    });
    this.pool.set('wind', {
      type: 'wind',
      name: 'Energia Eolica',
      description: 'Aprovecha el viento mediante aerogeneradores para producir electricidad renovable.',
      efficiency: 70,
      color: '#3498db',
      emoji: '🌬️',
      image: '/images/wind-energy.svg',
      accentBg: '#eaf4fb',
      accentBorder: '#3498db',
      accentText: '#1f5a85',
    });
    this.pool.set('hydro', {
      type: 'hydro',
      name: 'Energia Hidraulica',
      description: 'Convierte la energia del agua en movimiento en electricidad aprovechando embalses y corrientes.',
      efficiency: 92,
      color: '#2ecc71',
      emoji: '💧',
      image: '/images/hydro-energy.svg',
      accentBg: '#e9f9f0',
      accentBorder: '#2ecc71',
      accentText: '#1c6b3f',
    });
  }

  get(type?: string | null): EnergyTypeDescriptor | null {
    if (!type) return null;
    const key = type.toLowerCase();
    return this.pool.get(key) ?? null;
  }

  ensure(type?: string | null): EnergyTypeDescriptor {
    const found = this.get(type);
    if (found) return found;
    return this.get('solar')!;
  }

  getName(type?: string | null): string {
    return this.get(type)?.name ?? (type ?? '').toString();
  }

  getImage(type?: string | null): string {
    return this.get(type)?.image ?? '/images/renewable-landscape.svg';
  }

  getColor(type?: string | null): string {
    return this.get(type)?.color ?? '#888';
  }

  describe(type?: string | null): EnergyTypeDescriptor | null {
    return this.get(type);
  }

  list(): EnergyTypeDescriptor[] {
    return Array.from(this.pool.values());
  }
}

const energyTypeFlyweightFactory = EnergyTypeFlyweightFactory.getInstance();
export default energyTypeFlyweightFactory;
export { EnergyTypeFlyweightFactory };
