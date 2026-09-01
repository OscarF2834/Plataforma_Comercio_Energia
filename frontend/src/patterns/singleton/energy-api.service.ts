export interface EnergyOffer {
  id?: number;
  producerName: string;
  totalKwh: number;
  availableKwh: number;
  pricePerKwh: number;
  description?: string;
  type: 'solar' | 'wind';
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
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(offer),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Respuesta del servidor:', data);
      throw new Error(
        data.message || data.error || 'Error al crear oferta'
      );
    }

    return data;
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
    if (!response.ok) throw new Error('Error al obtener métricas');
    return response.json();
  }
}

export default EnergyApiService;
