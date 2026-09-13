import type { EnergyOffer } from '../singleton/energy-api.service';
import type { Prototype } from './Prototype';

export class OfferPrototype implements Prototype<OfferPrototype> {
  constructor(private offer: EnergyOffer) {}

  static from(offer: EnergyOffer): OfferPrototype {
    return new OfferPrototype({ ...offer });
  }

  getOffer(): EnergyOffer {
    return this.offer;
  }

  copy(): OfferPrototype {
    // Clonacion: se crea una copia independiente del prototipo. El clon no
    // comparte la referencia del original, por lo que modificarlo no afecta
    // a la oferta origen.
    const copy: EnergyOffer = {
      ...this.offer,
      id: undefined,
      availableKwh: this.offer.totalKwh,
      createdAt: undefined,
    };
    return new OfferPrototype(copy);
  }

  setProducer(producerName: string): this {
    this.offer.producerName = producerName.trim();
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

  toOffer(): EnergyOffer {
    return { ...this.offer };
  }
}