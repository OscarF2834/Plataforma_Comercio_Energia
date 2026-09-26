// Patron Adapter - ADAPTEE #1: cliente del medidor SCADA legado.
//
// No cumple el contrato DeviceGateway: habla el idioma del fabricante
// (volcado de registros Modbus con unidades heredadas). El Adapter
// ScadaGatewayAdapter es quien traduce esta respuesta al dominio.
const LEGACY_BASE_URL = 'http://localhost:8000/api';

export interface LegacyRegisterDump {
  serial: string;
  model: string;
  firmware: string;
  linkState: string;
  registers: Record<string, number>;
}

export class LegacyScadaClient {
  private cache: Promise<LegacyRegisterDump[]> | null = null;

  // El sistema legado se consulta directo (no pasa por EnergyApiService):
  // precisamente por eso hace falta un Adapter, su respuesta no tiene el
  // formato que espera la aplicacion.
  fetchRegisterDumps(): Promise<LegacyRegisterDump[]> {
    if (!this.cache) {
      this.cache = fetch(`${LEGACY_BASE_URL}/energy/legacy/meters`)
        .then((response) => {
          if (!response.ok) throw new Error('El medidor SCADA no responde');
          return response.json() as Promise<LegacyRegisterDump[]>;
        })
        .catch((error) => {
          this.cache = null;
          throw error;
        });
    }
    return this.cache;
  }
}
