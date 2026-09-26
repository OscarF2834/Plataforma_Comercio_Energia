<?php

namespace App\Patterns\Adapters;

use App\Models\DeviceTelemetry;

/**
 * Patron Adapter - ADAPTER del inversor fotovoltaico.
 *
 * Envuelve un Adaptee (PvInverterDevice) y cumple el contrato DeviceGateway:
 *   - deserializa el payload JSON que el fabricante entrega como texto;
 *   - traduce las claves en MAYUSCULAS a los campos del dominio;
 *   - convierte W -> kW, Wh -> kWh y decigrados -> C;
 *   - interpreta el codigo de estado numerico (0 = healthy) como booleano.
 */
class PvInverterAdapter implements DeviceGateway
{
    public function __construct(private PvInverterDevice $device) {}

    public function getProviderKey(): string
    {
        return 'pv-inverter';
    }

    public function getDeviceId(): string
    {
        return 'inverter-' . strtolower($this->device->getSerial());
    }

    public function getDisplayName(): string
    {
        return 'Inversor ' . $this->device->getModel();
    }

    public function isOnline(): bool
    {
        $payload = $this->readPayload();

        return (int) ($payload['STATUS'] ?? 1) === 0;
    }

    public function getSupportedMetrics(): array
    {
        return [
            'voltage' => 'Voltaje',
            'current' => 'Corriente',
            'powerKw' => 'Potencia',
            'energyKwh' => 'Energia del dia',
            'temperatureC' => 'Temperatura',
        ];
    }

    public function readTelemetry(): DeviceTelemetry
    {
        $payload = $this->readPayload();

        $telemetry = new DeviceTelemetry();
        $telemetry->deviceId = $this->getDeviceId();
        $telemetry->provider = $this->getProviderKey();
        $telemetry->deviceType = strtolower(str_replace('_', '-', (string) ($payload['MODE'] ?? 'unknown')));
        $telemetry->displayName = $this->getDisplayName();
        $telemetry->online = (int) ($payload['STATUS'] ?? 1) === 0;
        $telemetry->measuredAt = (string) ($payload['TS'] ?? now()->toIso8601String());

        // Traduccion de unidades del fabricante a unidades del dominio.
        $telemetry->voltage = (float) ($payload['V'] ?? 0);
        $telemetry->current = (float) ($payload['I'] ?? 0);
        $telemetry->powerKw = (float) ($payload['P'] ?? 0) / 1000;
        $telemetry->energyKwh = (float) ($payload['E_TODAY'] ?? 0) / 1000;
        $telemetry->temperatureC = (float) ($payload['TEMP'] ?? 0) / 10;

        $telemetry->rawReading = sprintf(
            'payload JSON del polling (%s) con P en W, E_TODAY en Wh y TEMP en decigrados - STATUS %d',
            (string) ($payload['MODE'] ?? 'UNKNOWN'),
            (int) ($payload['STATUS'] ?? -1)
        );

        $telemetry->metrics = [
            'voltage' => ['label' => 'Voltaje', 'value' => round($telemetry->voltage, 2), 'unit' => 'V'],
            'current' => ['label' => 'Corriente', 'value' => round($telemetry->current, 2), 'unit' => 'A'],
            'powerKw' => ['label' => 'Potencia', 'value' => round($telemetry->powerKw, 3), 'unit' => 'kW'],
            'energyKwh' => ['label' => 'Energia del dia', 'value' => round($telemetry->energyKwh, 2), 'unit' => 'kWh'],
            'temperatureC' => ['label' => 'Temperatura', 'value' => round($telemetry->temperatureC, 1), 'unit' => 'C'],
        ];

        return $telemetry;
    }

    /** @return array<string, mixed> */
    private function readPayload(): array
    {
        $decoded = json_decode($this->device->poll(), true);

        return is_array($decoded) ? $decoded : [];
    }
}
