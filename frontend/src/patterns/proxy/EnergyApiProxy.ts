import EnergyApiService, { type EnergyOffer } from '../singleton/energy-api.service';

/**
 * Patron Proxy (frontend).
 *
 * Envoltorio del cliente HTTP (Singleton) que añade:
 * - Caché de ofertas disponibles con TTL (virtual/proxy de caché).
 * - Validación de compras (proxy de protección).
 */
class EnergyApiProxy {
  private static instance: EnergyApiProxy;
  private api = EnergyApiService.getInstance();

  private offersCache: { data: EnergyOffer[]; expiresAt: number } | null = null;

  private constructor() {}

  static getInstance(): EnergyApiProxy {
    if (!EnergyApiProxy.instance) {
      EnergyApiProxy.instance = new EnergyApiProxy();
    }
    return EnergyApiProxy.instance;
  }

  private ttlMs(): number {
    return 10_000;
  }

  invalidateOffers() {
    this.offersCache = null;
  }

  async getAvailableOffers(): Promise<EnergyOffer[]> {
    const now = Date.now();
    if (this.offersCache && now < this.offersCache.expiresAt) {
      return this.offersCache.data;
    }
    const data = await this.api.getAvailableOffers();
    this.offersCache = { data, expiresAt: now + this.ttlMs() };
    return data;
  }

  async purchaseOffer(id: number, kwh: number) {
    if (kwh < 1) {
      return { success: false, message: 'Proxy: la compra mínima es 1 kWh' };
    }
    if (kwh > 100) {
      return { success: false, message: 'Proxy: no se pueden comprar más de 100 kWh por operación' };
    }
    const result = await this.api.purchaseOffer(id, kwh);
    if (result.success) {
      this.invalidateOffers();
    }
    return result;
  }

  // Delegaciones transparentes (resto de métodos)
  createOffer(offer: EnergyOffer) {
    return this.api.createOffer(offer);
  }

  createExpressOffer(data: { producerName: string; totalKwh: number; energyType: string }) {
    return this.api.createExpressOffer(data);
  }

  cloneOffer(id: number, adjustments?: Partial<EnergyOffer>) {
    return this.api.cloneOffer(id, adjustments);
  }

  getPrototypeTemplates() {
    return this.api.getPrototypeTemplates();
  }

  createOfferFromTemplate(data: { energyType: string; producerName: string; totalKwh: number; pricePerKwh?: number }) {
    return this.api.createOfferFromTemplate(data);
  }

  getMetrics() {
    return this.api.getMetrics();
  }

  getSourceCatalog() {
    return this.api.getSourceCatalog();
  }

  getPredictions(production = 0, consumption = 0) {
    return this.api.getPredictions(production, consumption);
  }

  getDevices() {
    return this.api.getDevices();
  }

  getDeviceTelemetry<T = unknown>(deviceId: string) {
    return this.api.getDeviceTelemetry<T>(deviceId);
  }

  getTelemetrySummary() {
    return this.api.getTelemetrySummary();
  }

  getSettlementMatrix() {
    return this.api.getSettlementMatrix();
  }

  quoteSettlement(data: { profile: string; currency: string; kwh: number; pricePerKwh: number }) {
    return this.api.quoteSettlement(data);
  }

  getExtrasCatalog() {
    return this.api.getExtrasCatalog();
  }

  quoteWithExtras(data: { kwh: number; pricePerKwh: number; extras: string[] }) {
    return this.api.quoteWithExtras(data);
  }

  getSampleBundle() {
    return this.api.getSampleBundle();
  }

  evaluateBundle(tree: unknown) {
    return this.api.evaluateBundle(tree);
  }

  getPlatformDashboard() {
    return this.api.getPlatformDashboard();
  }

  publishSurplus(data: { producerName: string; totalKwh: number; pricePerKwh: number; energyType?: string; description?: string }) {
    return this.api.publishSurplus(data);
  }

  buyEnergy(offerId: number, kwh: number, profile = 'residential', currency = 'COP') {
    return this.api.buyEnergy(offerId, kwh, profile, currency);
  }

  getSurplusAdvice(production = 0, consumption = 0) {
    return this.api.getSurplusAdvice(production, consumption);
  }

  getIoTNetworkStatus() {
    return this.api.getIoTNetworkStatus();
  }

  getFlyweightStats() {
    return this.api.getFlyweightStats();
  }

  getProxyStats() {
    return this.api.getProxyStats();
  }
}

const energyApiProxy = EnergyApiProxy.getInstance();
export default energyApiProxy;
export { EnergyApiProxy };
