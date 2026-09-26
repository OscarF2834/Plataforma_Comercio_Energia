import { LegacyScadaClient } from './LegacyScadaClient';
import { PvInverterClient } from './PvInverterClient';
import { ScadaGatewayAdapter } from './ScadaGatewayAdapter';
import { InverterGatewayAdapter } from './InverterGatewayAdapter';
import type { DeviceGateway } from './DeviceGateway';

// REGISTRO de gateways: el unico punto que sabe que Adapter corresponde a
// cada sistema legado. El componente React solo recibe DeviceGateway, por
// lo que agregar un fabricante nuevo no obliga a tocarlo.
class DeviceGatewayRegistry {
  private cache: DeviceGateway[] | null = null;
  private pending: Promise<DeviceGateway[]> | null = null;

  async gateways(): Promise<DeviceGateway[]> {
    if (this.cache) return this.cache;
    if (!this.pending) {
      this.pending = this.build().then((gateways) => {
        this.cache = gateways;
        return gateways;
      });
    }
    return this.pending;
  }

  private async build(): Promise<DeviceGateway[]> {
    const scada = new LegacyScadaClient();
    const inverter = new PvInverterClient();

    const [meters, inverters] = await Promise.all([
      scada.fetchRegisterDumps(),
      inverter.fetchPollPayloads(),
    ]);

    return [
      ...meters.map((m) => new ScadaGatewayAdapter(scada, m.serial)),
      ...inverters.map((d) => new InverterGatewayAdapter(inverter, d.serial)),
    ];
  }
}

const registry = new DeviceGatewayRegistry();
export default registry;
