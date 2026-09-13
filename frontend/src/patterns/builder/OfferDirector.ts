import { EnergyOfferBuilder } from './EnergyOfferBuilder';
import type { EnergyOffer } from '../singleton/energy-api.service';

const DEFAULT_PRICE_PER_KWH = 500; // espejo de ConfigService (backend)

interface OfferData {
  producerName: string;
  totalKwh: number;
  pricePerKwh: number;
  energyType?: string;
  description?: string;
}

export class OfferDirector {
  constructor(private builder: EnergyOfferBuilder) {}

  buildFromRequest(data: OfferData): EnergyOffer {
    return this.builder
      .reset()
      .setProducer(data.producerName)
      .setEnergyType(data.energyType ?? 'solar')
      .setQuantity(data.totalKwh)
      .setPricePerKwh(data.pricePerKwh)
      .setDescription(data.description ?? '')
      .build();
  }

  buildExpressOffer(
    producerName: string,
    totalKwh: number,
    energyType: string,
    description = ''
  ): EnergyOffer {
    return this.builder
      .reset()
      .setProducer(producerName)
      .setEnergyType(energyType)
      .setQuantity(totalKwh)
      .setPricePerKwh(DEFAULT_PRICE_PER_KWH)
      .setDescription(description || 'Oferta expres construida por el Director con el precio por defecto del mercado')
      .build();
  }
}