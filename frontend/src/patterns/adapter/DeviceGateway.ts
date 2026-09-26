// Patron Adapter - TARGET: la unica interfaz que conoce el cliente React.
// Cada fabricante de dispositivos habla un idioma distinto; los Adapter
// traducen ese idioma a esta interfaz comun.
export interface DeviceMetric {
  key: string;
  label: string;
  value: number;
  unit: string;
}

export interface DeviceTelemetry {
  deviceId: string;
  provider: string;
  deviceType: string;
  displayName: string;
  online: boolean;
  measuredAt: string;
  voltage: number;
  current: number;
  powerKw: number;
  energyKwh: number;
  temperatureC: number;
  rawReading: string;
  metrics: Record<string, { label: string; value: number; unit: string }>;
}

export interface DeviceInfo {
  deviceId: string;
  provider: string;
  deviceType: string;
  displayName: string;
  online: boolean;
  metricLabels: Record<string, string>;
}

export interface DeviceGateway {
  getProviderKey(): string;
  getDeviceId(): string;
  getDisplayName(): string;
  isOnline(): Promise<boolean>;
  getSupportedMetrics(): Record<string, string>;
  readTelemetry(): Promise<DeviceTelemetry>;
}

export function toMetricList(telemetry: DeviceTelemetry): DeviceMetric[] {
  return Object.entries(telemetry.metrics).map(([key, metric]) => ({
    key,
    label: metric.label,
    value: metric.value,
    unit: metric.unit,
  }));
}
