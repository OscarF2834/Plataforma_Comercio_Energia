import type { MarketContext, Prediction } from '../template/Predictor';

export interface EnergyOffer {
  id?: number;
  producerName: string;
  totalKwh: number;
  availableKwh: number;
  pricePerKwh: number;
  description?: string;
  energyType?: string;
  createdAt?: string;
}

export interface DeviceInfo {
  deviceId: string;
  provider: string;
  deviceType: string;
  displayName: string;
  online: boolean;
  metricLabels: Record<string, string>;
}

export interface TelemetrySummary {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  totalPowerKw: number;
  totalEnergyKwh: number;
  devicesByProvider: Record<string, number>;
}

export interface SettlementMatrix {
  profiles: { key: string; name: string; description: string }[];
  currencies: {
    code: string;
    symbol: string;
    label: string;
    decimals: number;
    taxRate: number;
    usdRate: number;
  }[];
  combinations: string[];
  totalCombinations: number;
}

// ------------------------------------------------------------------
// Patron Facade: respuestas de las operaciones unificadas.
// ------------------------------------------------------------------

export interface ActivityMetrics {
  totalLogs: number;
  transactionCount: number;
  offerCount: number;
  recentLogs: string[];
}

export interface PlatformConfig {
  marketName: string;
  defaultPricePerKwh: number;
  currency: string;
  maxOfferKwh: number;
}

/** Panel unificado: UNA sola llamada agrega todo el subsistema. */
export interface PlatformDashboard {
  market: MarketContext;
  offers: EnergyOffer[];
  iot: TelemetrySummary;
  config: PlatformConfig;
  activity: ActivityMetrics;
}

/** Liquidacion emitida por el patron Bridge. */
export interface SettlementBill {
  profile: string;
  currency: string;
  adjustments: { label: string; amount: number }[];
  total: number;
  totalFormatted: string;
  totalMinorUnits: number;
}

export interface SurplusAdvice {
  predictions: Prediction[];
  market: MarketContext;
  advice: string;
}

export interface BuyResult {
  success: boolean;
  message: string;
  purchase?: { offerId: number; kwh: number; pricePerKwh: number };
  bill?: SettlementBill;
  market: MarketContext;
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

  async createExpressOffer(data: {
    producerName: string;
    totalKwh: number;
    energyType: string;
  }): Promise<EnergyOffer> {
    const response = await fetch(`${this.baseUrl}/energy/offers/express`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al crear oferta expres');
    return response.json();
  }

  async cloneOffer(id: number, adjustments?: Partial<EnergyOffer>): Promise<EnergyOffer> {
    const response = await fetch(`${this.baseUrl}/energy/offers/${id}/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adjustments ?? {}),
    });
    if (!response.ok) throw new Error('Error al clonar oferta');
    return response.json();
  }

  async getPrototypeTemplates(): Promise<EnergyOffer[]> {
    const response = await fetch(`${this.baseUrl}/energy/prototype-templates`);
    if (!response.ok) throw new Error('Error al obtener plantillas Prototype');
    return response.json();
  }

  async createOfferFromTemplate(data: {
    energyType: string;
    producerName: string;
    totalKwh: number;
    pricePerKwh?: number;
  }): Promise<EnergyOffer> {
    const response = await fetch(`${this.baseUrl}/energy/offers/clone-template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al crear oferta desde plantilla');
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

  async getPredictions(production = 0, consumption = 0) {
    const params = new URLSearchParams();
    if (production > 0) params.set('production', String(production));
    if (consumption > 0) params.set('consumption', String(consumption));
    const response = await fetch(
      `${this.baseUrl}/energy/predictions${params.toString() ? `?${params.toString()}` : ''}`
    );
    if (!response.ok) throw new Error('Error al obtener predicciones');
    return response.json();
  }

  // Patron Adapter: inventario y telemetria YA normalizados por los Adapter
  // del backend. El frontend tiene sus propios Adapter (src/patterns/adapter)
  // que consultan los endpoints /legacy/* sin pasar por este servicio.
  async getDevices(): Promise<DeviceInfo[]> {
    const response = await fetch(`${this.baseUrl}/energy/devices`);
    if (!response.ok) throw new Error('Error al obtener dispositivos IoT');
    return response.json();
  }

  async getDeviceTelemetry<T = unknown>(deviceId: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/energy/devices/${deviceId}/telemetry`);
    if (!response.ok) throw new Error('Error al obtener telemetria del dispositivo');
    return response.json();
  }

  async getTelemetrySummary(): Promise<TelemetrySummary> {
    const response = await fetch(`${this.baseUrl}/energy/devices/telemetry/summary`);
    if (!response.ok) throw new Error('Error al obtener resumen de telemetria');
    return response.json();
  }

  // Patron Bridge: matriz de combinaciones perfil x moneda y emision de la
  // liquidacion (las mismas clases existen tambien en el frontend).
  async getSettlementMatrix(): Promise<SettlementMatrix> {
    const response = await fetch(`${this.baseUrl}/energy/settlements/matrix`);
    if (!response.ok) throw new Error('Error al obtener la matriz de liquidaciones');
    return response.json();
  }

  async quoteSettlement(data: {
    profile: string;
    currency: string;
    kwh: number;
    pricePerKwh: number;
  }) {
    const response = await fetch(`${this.baseUrl}/energy/settlements/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al emitir la liquidacion');
    return response.json();
  }

  // Patron Decorator: catalogo de extras y cotizacion con decoradores.
  async getExtrasCatalog() {
    const response = await fetch(`${this.baseUrl}/energy/extras`);
    if (!response.ok) throw new Error('Error al obtener los extras');
    return response.json();
  }

  async quoteWithExtras(data: { kwh: number; pricePerKwh: number; extras: string[] }) {
    const response = await fetch(`${this.baseUrl}/energy/offers/quote-extras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al cotizar con extras');
    return response.json();
  }

  // Patron Composite: arbol de ejemplo y evaluacion de paquetes.
  async getSampleBundle() {
    const response = await fetch(`${this.baseUrl}/energy/bundles/sample`);
    if (!response.ok) throw new Error('Error al obtener el paquete de ejemplo');
    return response.json();
  }

  async evaluateBundle(tree: unknown) {
    const response = await fetch(`${this.baseUrl}/energy/bundles/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tree),
    });
    if (!response.ok) throw new Error('Error al evaluar el paquete');
    return response.json();
  }

  // ----------------------------------------------------------------
  // Patron Facade: operaciones unificadas de la plataforma.
  // El Facade (patterns/facade/PlatformFacade) delega aqui.
  // ----------------------------------------------------------------

  /** Panel unificado: mercado + ofertas + red IoT + configuracion + actividad. */
  async getPlatformDashboard(): Promise<PlatformDashboard> {
    const response = await fetch(`${this.baseUrl}/energy/platform/dashboard`);
    if (!response.ok) throw new Error('Error al cargar el panel unificado');
    return response.json();
  }

  /** Publica un excedente: lo construye, registra y contabiliza. */
  async publishSurplus(data: {
    producerName: string;
    totalKwh: number;
    pricePerKwh: number;
    energyType?: string;
    description?: string;
  }): Promise<{ offer: EnergyOffer; market: MarketContext }> {
    const response = await fetch(`${this.baseUrl}/energy/platform/publish-surplus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al publicar el excedente');
    return response.json();
  }

  /** Compra energia: compra en el mercado + liquidacion (Bridge). */
  async buyEnergy(
    offerId: number,
    kwh: number,
    profile = 'residential',
    currency = 'COP'
  ): Promise<BuyResult> {
    const response = await fetch(`${this.baseUrl}/energy/platform/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId, kwh, profile, currency }),
    });
    if (!response.ok) throw new Error('Error al comprar energia');
    return response.json();
  }

  /** Asesoria de excedente: predicciones + mercado + recomendacion. */
  async getSurplusAdvice(production = 0, consumption = 0): Promise<SurplusAdvice> {
    const params = new URLSearchParams();
    if (production > 0) params.set('production', String(production));
    if (consumption > 0) params.set('consumption', String(consumption));
    const query = params.toString();
    const response = await fetch(
      `${this.baseUrl}/energy/platform/advice${query ? `?${query}` : ''}`
    );
    if (!response.ok) throw new Error('Error al obtener la asesoria de excedente');
    return response.json();
  }

  /** Estado de la red IoT: resumen + inventario normalizado. */
  async getIoTNetworkStatus(): Promise<{ summary: TelemetrySummary; devices: DeviceInfo[] }> {
    const response = await fetch(`${this.baseUrl}/energy/platform/iot-status`);
    if (!response.ok) throw new Error('Error al obtener el estado de la red IoT');
    return response.json();
  }

  /** Estadísticas de Flyweight (pool compartido). */
  async getFlyweightStats() {
    const response = await fetch(`${this.baseUrl}/energy/flyweight-stats`);
    if (!response.ok) throw new Error('Error al obtener estadísticas Flyweight');
    return response.json();
  }

  /** Estadísticas de Proxy (caché + protección). */
  async getProxyStats() {
    const response = await fetch(`${this.baseUrl}/energy/proxy-stats`);
    if (!response.ok) throw new Error('Error al obtener estadísticas Proxy');
    return response.json();
  }
}

export default EnergyApiService;
