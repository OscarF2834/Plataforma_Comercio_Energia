import { PvInverterClient } from './PvInverterClient';
import type { DeviceGateway, DeviceTelemetry } from './DeviceGateway';

interface InverterPayload {
  SERIAL: string;
  TS: string;
  MODE: string;
  STATUS: number;
  P: number;
  E_TODAY: number;
  V: number;
  I: number;
  TEMP: number;
}

// Patron Adapter - ADAPTER del inversor fotovoltaico.
// Traduce el payload JSON del fabricante a la interfaz DeviceGateway:
// claves en MAYUSCULAS -> campos del dominio, W -> kW, Wh -> kWh,
// decigrados -> C y STATUS 0 (healthy) -> booleano `online`.
export class InverterGatewayAdapter implements DeviceGateway {
  constructor(
    private client: PvInverterClient,
    private serial: string
  ) {}

  getProviderKey(): string {
    return 'pv-inverter';
  }

  getDeviceId(): string {
    return `inverter-${this.serial.toLowerCase()}`;
  }

  getDisplayName(): string {
    return 'Inversor PV';
  }

  async isOnline(): Promise<boolean> {
    const payload = await this.payload();
    return payload?.STATUS === 0;
  }

  getSupportedMetrics(): Record<string, string> {
    return {
      voltage: 'Voltaje',
      current: 'Corriente',
      powerKw: 'Potencia',
      energyKwh: 'Energia del dia',
      temperatureC: 'Temperatura',
    };
  }

  async readTelemetry(): Promise<DeviceTelemetry> {
    const payload = await this.payload();
    if (!payload) throw new Error(`El inversor ${this.serial} no responde el polling`);

    const powerKw = round(payload.P / 1000, 3);         // W -> kW
    const energyKwh = round(payload.E_TODAY / 1000, 2); // Wh -> kWh
    const temperatureC = round(payload.TEMP / 10, 1);    // decigrados -> C

    return {
      deviceId: this.getDeviceId(),
      provider: this.getProviderKey(),
      deviceType: payload.MODE.toLowerCase().replace(/_/g, '-'),
      displayName: `${this.getDisplayName()} ${this.serial}`,
      online: payload.STATUS === 0,
      measuredAt: payload.TS,
      voltage: payload.V,
      current: payload.I,
      powerKw,
      energyKwh,
      temperatureC,
      rawReading: `payload JSON del polling (${payload.MODE}) con P en W, E_TODAY en Wh y TEMP en decigrados - STATUS ${payload.STATUS}`,
      metrics: {
        voltage: { label: 'Voltaje', value: payload.V, unit: 'V' },
        current: { label: 'Corriente', value: payload.I, unit: 'A' },
        powerKw: { label: 'Potencia', value: powerKw, unit: 'kW' },
        energyKwh: { label: 'Energia del dia', value: energyKwh, unit: 'kWh' },
        temperatureC: { label: 'Temperatura', value: temperatureC, unit: 'C' },
      },
    };
  }

  private async payload(): Promise<InverterPayload | undefined> {
    const polls = await this.client.fetchPollPayloads();
    const poll = polls.find((p) => p.serial === this.serial);
    if (!poll) return undefined;
    return JSON.parse(poll.payload) as InverterPayload;
  }
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
