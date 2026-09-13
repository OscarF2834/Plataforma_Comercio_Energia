import type { EnergyOffer } from '../singleton/energy-api.service';

export const SUPPORTED_ENERGY_TYPES = ['solar', 'wind', 'hydro'] as const;

export class EnergyOfferBuilder {
  private offer!: EnergyOffer;

  constructor() {
    this.reset();
  }

  reset(): this {
    this.offer = {
      producerName: '',
      totalKwh: 0,
      availableKwh: 0,
      pricePerKwh: 0,
      description: '',
      energyType: '',
    };
    return this;
  }

  setProducer(producerName: string): this {
    this.offer.producerName = producerName.trim();
    return this;
  }

  setEnergyType(type: string): this {
    const normalized = type.toLowerCase();
    if (!(SUPPORTED_ENERGY_TYPES as readonly string[]).includes(normalized)) {
      throw new Error(`Tipo de energia no soportado: ${type}`);
    }
    this.offer.energyType = normalized;
    return this;
  }

  setQuantity(totalKwh: number): this {
    if (!Number.isFinite(totalKwh) || totalKwh <= 0) {
      throw new Error('La cantidad de energia debe ser mayor a cero');
    }
    this.offer.totalKwh = totalKwh;
    this.offer.availableKwh = totalKwh;
    return this;
  }

  setPricePerKwh(price: number): this {
    if (!Number.isFinite(price) || price < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    this.offer.pricePerKwh = price;
    return this;
  }

  setDescription(description: string): this {
    this.offer.description = description;
    return this;
  }

  snapshot(): EnergyOffer {
    return { ...this.offer };
  }

  build(): EnergyOffer {
    const built = this.snapshot();
    this.reset();
    return built;
  }
}