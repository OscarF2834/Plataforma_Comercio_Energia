import { BasicOffer } from './BasicOffer';
import { OfferComponent } from './OfferComponent';
import { GreenCertificationDecorator } from './GreenCertificationDecorator';
import { InsuranceDecorator } from './InsuranceDecorator';
import { PriorityDeliveryDecorator } from './PriorityDeliveryDecorator';

export interface ExtraInfo {
  key: string;
  name: string;
  description: string;
  rule: string;
}

export interface ExtrasQuote {
  kwh: number;
  pricePerKwh: number;
  description: string;
  basePrice: number;
  extrasTotal: number;
  total: number;
  adjustments: { label: string; amount: number }[];
  extrasApplied: string[];
}

// Patron Decorator - CLIENTE.
// Envuelve un BasicOffer con los decoradores elegidos, en orden.
export class OfferPricingService {
  private extras: Record<string, { info: ExtraInfo; wrap: (c: OfferComponent) => OfferComponent }> = {
    green: {
      info: {
        key: 'green',
        name: 'Certificacion Verde',
        description: 'Garantiza que la energia proviene de fuentes 100% renovables.',
        rule: '+5% sobre el subtotal base',
      },
      wrap: (c) => new GreenCertificationDecorator(c),
    },
    insurance: {
      info: {
        key: 'insurance',
        name: 'Seguro de suministro',
        description: 'Cubre perdidas de suministro durante el periodo contratado.',
        rule: '+3% sobre el subtotal base',
      },
      wrap: (c) => new InsuranceDecorator(c),
    },
    priority: {
      info: {
        key: 'priority',
        name: 'Entrega prioritaria',
        description: 'Prioriza la entrega de la energia en la red virtual.',
        rule: '+$8.000 COP tarifa fija',
      },
      wrap: (c) => new PriorityDeliveryDecorator(c),
    },
  };

  getExtrasCatalog(): ExtraInfo[] {
    return Object.values(this.extras).map((e) => e.info);
  }

  quote(kwh: number, pricePerKwh: number, extras: string[]): ExtrasQuote {
    let offer: OfferComponent = new BasicOffer(kwh, pricePerKwh);

    for (const extra of extras) {
      const entry = this.extras[extra.toLowerCase()];
      if (!entry) throw new Error(`Extra desconocido: ${extra}`);
      offer = entry.wrap(offer);
    }

    const round = (n: number) => Math.round(n * 100) / 100;

    return {
      kwh,
      pricePerKwh,
      description: offer.getDescription(),
      basePrice: round(offer.getBasePrice()),
      extrasTotal: round(offer.getExtrasTotal()),
      total: round(offer.getTotal()),
      adjustments: offer.getAdjustments(),
      extrasApplied: extras,
    };
  }
}

const offerPricingService = new OfferPricingService();
export default offerPricingService;
