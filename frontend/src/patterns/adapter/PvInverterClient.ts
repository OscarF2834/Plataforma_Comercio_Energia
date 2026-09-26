// Patron Adapter - ADAPTEE #2: cliente del inversor fotovoltaico.
//
// Habla un idioma distinto al del SCADA: devuelve un payload JSON como
// texto con claves en MAYUSCULAS, P en W, E_TODAY en Wh y TEMP en
// decigrados. Segundo Adaptee, segunda interfaz incompatible.
const LEGACY_BASE_URL = 'http://localhost:8000/api';

export interface LegacyInverterPoll {
  serial: string;
  model: string;
  payload: string;
}

export class PvInverterClient {
  private cache: Promise<LegacyInverterPoll[]> | null = null;

  fetchPollPayloads(): Promise<LegacyInverterPoll[]> {
    if (!this.cache) {
      this.cache = fetch(`${LEGACY_BASE_URL}/energy/legacy/inverters`)
        .then((response) => {
          if (!response.ok) throw new Error('El inversor no responde');
          return response.json() as Promise<LegacyInverterPoll[]>;
        })
        .catch((error) => {
          this.cache = null;
          throw error;
        });
    }
    return this.cache;
  }
}
