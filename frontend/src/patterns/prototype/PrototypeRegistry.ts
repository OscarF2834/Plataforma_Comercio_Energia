import type { EnergyOffer } from '../singleton/energy-api.service';
import EnergyApiService from '../singleton/energy-api.service';
import { OfferPrototype } from './OfferPrototype';

export interface PrototypeTemplate {
  templateId: string;
  energyType: string;
}

export class PrototypeRegistry {
  private templates: EnergyOffer[] = [];

  // El registro usa el cliente HTTP (Singleton) para obtener las plantillas
  // que el backend mantiene en su PrototypeRegistry (PHP).
  async loadTemplates(): Promise<PrototypeTemplate[]> {
    const api = EnergyApiService.getInstance();
    const data = await api.getPrototypeTemplates();
    this.templates = data;
    return data.map((t) => ({
      templateId: `${t.energyType}-template`,
      energyType: t.energyType ?? '',
    }));
  }

  // Devuelve un CLON del prototipo de la plantilla seleccionada.
  async cloneTemplate(type: string): Promise<OfferPrototype> {
    if (this.templates.length === 0) {
      await this.loadTemplates();
    }
    const source = this.templates.find((t) => t.energyType === type);
    if (!source) throw new Error(`No existe plantilla para el tipo: ${type}`);
    return OfferPrototype.from(source).copy();
  }
}

// Se exporta una única instancia compartida del registro de prototipos.
const prototypeRegistry = new PrototypeRegistry();
export default prototypeRegistry;