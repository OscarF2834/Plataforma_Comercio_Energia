import { LegacyScadaClient } from './LegacyScadaClient';
import type { DeviceGateway, DeviceTelemetry } from './DeviceGateway';

// Direcciones del medidor SCADA legado (mismas que usa el Adapter en PHP).
const REG = {
  voltage: 30001,     // voltios
  current: 30002,     // centiamperios
  power: 30003,       // decivatios (0.1 W)
  energy: 30004,      // hectovatios-hora (0.01 kWh)
  temperature: 30005, // decigrados Celsius
} as const;

// Patron Adapter - ADAPTER del medidor SCADA legado.
// Traduce el volcado de registros a la interfaz DeviceGateway:
// estado 'UP'/'DOWN' -> booleano, y unidades heredadas -> unidades del dominio.
export class ScadaGatewayAdapter implements DeviceGateway {
  constructor(
    private client: LegacyScadaClient,
    private serial: string
  ) {}

  getProviderKey(): string {
    return 'legacy-scada';
  }

  getDeviceId(): string {
    return `scada-${this.serial.toLowerCase()}`;
  }

  getDisplayName(): string {
    return 'Medidor SCADA';
  }

  async isOnline(): Promise<boolean> {
    const dump = await this.dump();
    return dump?.linkState === 'UP';
  }

  getSupportedMetrics(): Record<string, string> {
    return {
      voltage: 'Voltaje',
      current: 'Corriente',
      powerKw: 'Potencia',
      energyKwh: 'Energia acumulada',
      temperatureC: 'Temperatura',
    };
  }

  async readTelemetry(): Promise<DeviceTelemetry> {
    const dump = await this.dump();
    if (!dump) throw new Error(`El medidor ${this.serial} no aparece en el volcado SCADA`);

    const read = (address: number): number => Number(dump.registers[String(address)] ?? 0);

    const voltage = round(read(REG.voltage), 2);
    const current = round(read(REG.current) / 100, 2);         // centiamperios -> A
    const powerKw = round(read(REG.power) / 10 / 1000, 3);     // decivatios -> kW
    const energyKwh = round(read(REG.energy) / 100, 2);        // hectovatios-hora -> kWh
    const temperatureC = round(read(REG.temperature) / 10, 1); // decigrados -> C

    return {
      deviceId: this.getDeviceId(),
      provider: this.getProviderKey(),
      deviceType: 'smart-meter',
      displayName: `${this.getDisplayName()} ${dump.model}`,
      online: dump.linkState === 'UP',
      measuredAt: new Date().toISOString(),
      voltage,
      current,
      powerKw,
      energyKwh,
      temperatureC,
      rawReading: `registros SCADA ${REG.voltage}-${REG.temperature} (decivatios, centiamperios, hectovatios-hora, decigrados) - enlace ${dump.linkState}`,
      metrics: {
        voltage: { label: 'Voltaje', value: voltage, unit: 'V' },
        current: { label: 'Corriente', value: current, unit: 'A' },
        powerKw: { label: 'Potencia', value: powerKw, unit: 'kW' },
        energyKwh: { label: 'Energia acumulada', value: energyKwh, unit: 'kWh' },
        temperatureC: { label: 'Temperatura', value: temperatureC, unit: 'C' },
      },
    };
  }

  private async dump() {
    const dumps = await this.client.fetchRegisterDumps();
    return dumps.find((d) => d.serial === this.serial);
  }
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
