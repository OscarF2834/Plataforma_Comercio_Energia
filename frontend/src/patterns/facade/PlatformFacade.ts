import EnergyApiService from '../singleton/energy-api.service';
import type {
  BuyResult,
  DeviceInfo,
  EnergyOffer,
  PlatformDashboard,
  SettlementBill,
  SurplusAdvice,
  TelemetrySummary,
} from '../singleton/energy-api.service';
import type { MarketContext } from '../template/Predictor';

// Re-exporta los tipos de respuesta para los componentes.
export type {
  BuyResult,
  PlatformDashboard,
  SettlementBill,
  SurplusAdvice,
};

/**
 * Patron Facade (frontend).
 *
 * Proporciona una interfaz simplificada a los subsistemas del
 * backend (mercado de excedentes, prediccion, red IoT y
 * liquidaciones). Los componentes de React ya NO conocen los
 * endpoints ni los servicios internos: solo piden operaciones
 * de negocio de alto nivel a esta clase.
 *
 * Internamente delega la comunicacion HTTP en EnergyApiService
 * (cliente Singleton), por lo que se reutiliza el mismo cliente
 * y la misma URL base de toda la aplicacion.
 */
class PlatformFacade {
  private api = EnergyApiService.getInstance();

  /**
   * Panel unificado de la plataforma: mercado, ofertas
   * disponibles, red IoT, configuracion y actividad en
   * UNA sola peticion.
   */
  loadDashboard(): Promise<PlatformDashboard> {
    return this.api.getPlatformDashboard();
  }

  /** Publica un excedente: lo construye, registra y contabiliza. */
  publishSurplus(data: {
    producerName: string;
    totalKwh: number;
    pricePerKwh: number;
    energyType?: string;
    description?: string;
  }): Promise<{ offer: EnergyOffer; market: MarketContext }> {
    return this.api.publishSurplus(data);
  }

  /**
   * Compra energia: ejecuta la compra en el mercado y, en la
   * misma operacion, emite la liquidacion (Bridge) de la
   * energia adquirida segun perfil y moneda.
   */
  buyEnergy(
    offerId: number,
    kwh: number,
    profile = 'residential',
    currency = 'COP'
  ): Promise<BuyResult> {
    return this.api.buyEnergy(offerId, kwh, profile, currency);
  }

  /** Asesoria de excedente: predicciones + mercado + recomendacion. */
  getSurplusAdvice(production = 0, consumption = 0): Promise<SurplusAdvice> {
    return this.api.getSurplusAdvice(production, consumption);
  }

  /** Estado de la red IoT: resumen + inventario normalizado (Adapter). */
  getIoTNetworkStatus(): Promise<{ summary: TelemetrySummary; devices: DeviceInfo[] }> {
    return this.api.getIoTNetworkStatus();
  }
}

// Se exporta una unica instancia compartida por los componentes.
const platformFacade = new PlatformFacade();
export default platformFacade;
