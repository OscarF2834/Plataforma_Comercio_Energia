import { useEffect, useState } from 'react';
import EnergyApiService from '../patterns/singleton/energy-api.service';
import type { DeviceInfo } from '../patterns/singleton/energy-api.service';
import deviceGatewayRegistry from '../patterns/adapter/deviceGatewayRegistry';
import { toMetricList } from '../patterns/adapter/DeviceGateway';
import type { DeviceGateway, DeviceTelemetry } from '../patterns/adapter/DeviceGateway';

type Source = 'frontend' | 'backend';

interface TelemetryRow {
  deviceId: string;
  provider: string;
  displayName: string;
  deviceType: string;
  online: boolean;
  measuredAt: string;
  rawReading: string;
  metrics: { key: string; label: string; value: number; unit: string }[];
}

// El componente es el CLIENTE del patron Adapter: solo conoce la interfaz
// DeviceGateway. No sabe si el dato vino de registros SCADA o de un payload
// JSON de inversor, porque el Adapter ya lo normalizo.
export default function DevicePanel() {
  const [source, setSource] = useState<Source>('frontend');
  const [rows, setRows] = useState<TelemetryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const api = EnergyApiService.getInstance();

  const loadFromAdapters = async () => {
    const gateways: DeviceGateway[] = await deviceGatewayRegistry.gateways();
    const telemetry = await Promise.all(gateways.map((gateway) => gateway.readTelemetry()));
    return telemetry.map((t: DeviceTelemetry) => ({
      deviceId: t.deviceId,
      provider: t.provider,
      displayName: t.displayName,
      deviceType: t.deviceType,
      online: t.online,
      measuredAt: t.measuredAt,
      rawReading: t.rawReading,
      metrics: toMetricList(t),
    }));
  };

  const loadFromBackend = async () => {
    const devices: DeviceInfo[] = await api.getDevices();
    const telemetry = await Promise.all(
      devices.map((device) => api.getDeviceTelemetry<DeviceTelemetry>(device.deviceId))
    );
    return telemetry.map((t) => ({
      deviceId: t.deviceId,
      provider: t.provider,
      displayName: t.displayName,
      deviceType: t.deviceType,
      online: t.online,
      measuredAt: t.measuredAt,
      rawReading: t.rawReading,
      metrics: toMetricList(t),
    }));
  };

  const fetchTelemetry = async (current: Source) => {
    setLoading(true);
    setError('');
    try {
      const data = current === 'frontend' ? await loadFromAdapters() : await loadFromBackend();
      setRows(data);
    } catch {
      setError('No se pudo leer la telemetria de los dispositivos.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry(source);
  }, [source]);

  const online = rows.filter((r) => r.online);
  const totalPowerKw = online.reduce((acc, r) => {
    const power = r.metrics.find((m) => m.key === 'powerKw');
    return acc + (power ? power.value : 0);
  }, 0);

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Dispositivos IoT del hogar (Adapter)</h2>
      <p style={styles.subtitle}>
        Cada fabricante habla un idioma distinto. Los <strong>Adapter</strong> traducen registros SCADA
        y payloads de inversor a una interfaz comun (<code>DeviceGateway</code>) que este panel consume
        sin saber quien fabrico el dato.
      </p>

      <div style={styles.toolbar}>
        <span style={styles.toolbarLabel}>Origen de la telemetria:</span>
        <button
          onClick={() => setSource('frontend')}
          style={styles.sourceButton(source === 'frontend')}
        >
          Adapter del navegador
        </button>
        <button
          onClick={() => setSource('backend')}
          style={styles.sourceButton(source === 'backend')}
        >
          Adapter del backend
        </button>
      </div>

      {loading && <p style={styles.muted}>Leyendo dispositivos...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={styles.summary}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>En linea</span>
              <span style={styles.summaryValue}>
                {online.length}/{rows.length}
              </span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Potencia total</span>
              <span style={styles.summaryValue}>{totalPowerKw.toFixed(3)} kW</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Adaptadores activos</span>
              <span style={styles.summaryValue}>
                {new Set(rows.map((r) => r.provider)).size}
              </span>
            </div>
          </div>

          <div style={styles.grid}>
            {rows.map((row) => (
              <div key={row.deviceId} style={styles.deviceCard}>
                <div style={styles.deviceHeader}>
                  <h3 style={styles.deviceTitle}>{row.displayName}</h3>
                  <span style={row.online ? styles.badgeOnline : styles.badgeOffline}>
                    {row.online ? 'En linea' : 'Sin conexion'}
                  </span>
                </div>
                <p style={styles.deviceMeta}>
                  <code>{row.deviceId}</code> · {row.provider} · {row.deviceType}
                </p>

                <div style={styles.metrics}>
                  {row.metrics.map((metric) => (
                    <div key={metric.key} style={styles.metric}>
                      <span style={styles.metricLabel}>{metric.label}</span>
                      <span style={styles.metricValue}>
                        {metric.value} {metric.unit}
                      </span>
                    </div>
                  ))}
                </div>

                <p style={styles.rawReading}>
                  <strong>Origen crudo:</strong> {row.rawReading}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles: Record<string, any> = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#1a1a2e',
    fontSize: '1.3rem',
  },
  subtitle: {
    margin: '0 0 16px 0',
    color: '#666',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  toolbarLabel: {
    color: '#666',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  sourceButton: (active: boolean): React.CSSProperties => ({
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #0f3460',
    backgroundColor: active ? '#0f3460' : '#fff',
    color: active ? '#fff' : '#0f3460',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  }),
  muted: {
    color: '#888',
    fontStyle: 'italic',
  },
  error: {
    color: '#c0392b',
    margin: 0,
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  },
  summaryItem: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '12px',
    backgroundColor: '#f7f9fc',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryLabel: {
    fontSize: '0.75rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  summaryValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#0f3460',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  deviceCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
  },
  deviceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
  },
  deviceTitle: {
    margin: '0 0 4px 0',
    fontSize: '1rem',
    color: '#0f3460',
  },
  badgeOnline: {
    padding: '4px 8px',
    borderRadius: '999px',
    backgroundColor: '#e4f8ef',
    color: '#16c784',
    border: '1px solid #b7ecd5',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  badgeOffline: {
    padding: '4px 8px',
    borderRadius: '999px',
    backgroundColor: '#fdecea',
    color: '#c0392b',
    border: '1px solid #f5c6c2',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  deviceMeta: {
    margin: '0 0 12px 0',
    fontSize: '0.75rem',
    color: '#888',
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
  },
  metricLabel: {
    fontSize: '0.7rem',
    color: '#666',
  },
  metricValue: {
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  rawReading: {
    margin: '12px 0 0 0',
    paddingTop: '8px',
    borderTop: '1px dashed #ddd',
    fontSize: '0.72rem',
    color: '#888',
    lineHeight: 1.4,
  },
};
