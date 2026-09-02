interface EnergyOffer {
  id?: number;
  producerName: string;
  totalKwh: number;
  availableKwh: number;
  pricePerKwh: number;
  description?: string;
  energyType?: string;
  createdAt?: string;
}

class EnergyApiService {
  private static instance: EnergyApiService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = 'http://localhost:8000/api';
  }

  static getInstance(): EnergyApiService {
    if (!EnergyApiService.instance) {
      EnergyApiService.instance = new EnergyApiService();
    }
    return EnergyApiService.instance;
  }

  async getAvailableOffers(): Promise<EnergyOffer[]> {
    const response = await fetch(`${this.baseUrl}/energy/offers`);
    if (!response.ok) throw new Error('Error al obtener ofertas');
    return response.json();
  }

  async createOffer(offer: EnergyOffer): Promise<EnergyOffer> {
    const response = await fetch(`${this.baseUrl}/energy/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer),
    });
    if (!response.ok) throw new Error('Error al crear oferta');
    return response.json();
  }

  async purchaseOffer(id: number, kwh: number) {
    const response = await fetch(`${this.baseUrl}/energy/offers/${id}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kwh }),
    });
    if (!response.ok) throw new Error('Error al realizar compra');
    return response.json();
  }

  async getMetrics() {
    const response = await fetch(`${this.baseUrl}/energy/metrics`);
    if (!response.ok) throw new Error('Error al obtener metricas');
    return response.json();
  }

  async getSourceCatalog() {
    const response = await fetch(`${this.baseUrl}/energy/source-catalog`);
    if (!response.ok) throw new Error('Error al obtener catalogo de fuentes');
    return response.json();
  }
}

export default EnergyApiService;
