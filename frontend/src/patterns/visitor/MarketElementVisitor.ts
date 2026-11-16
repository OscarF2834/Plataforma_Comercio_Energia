import type { EnergyOffer } from '../singleton/energy-api.service';

/** Fuente de energía del catálogo (datos del elemento). */
export interface SourceElement {
  type: string;
  name: string;
  efficiency: number;
}

/** Dispositivo IoT de la red (datos del elemento). */
export interface DeviceElement {
  deviceId: string;
  displayName: string;
  online: boolean;
}

/**
 * Patron Visitor (frontend) — Interfaz del visitante (rol «Visitor»).
 *
 * Un visit por cada tipo de elemento del inventario del mercado
 * (ofertas de excedente, fuentes de energía y dispositivos IoT).
 * Así se pueden ejecutar operaciones distintas —reporte, auditoría—
 * sobre los mismos elementos sin modificarlos.
 */
export interface MarketElementVisitor {
  visitOffer(offer: EnergyOffer): void;

  visitSource(source: SourceElement): void;

  visitDevice(device: DeviceElement): void;

  /** Resultado acumulado tras recorrer todos los elementos. */
  result(): Record<string, unknown>;
}
