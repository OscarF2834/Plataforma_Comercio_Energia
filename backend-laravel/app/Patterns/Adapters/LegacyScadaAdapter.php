<?php

namespace App\Patterns\Adapters;

use App\Models\DeviceTelemetry;

/**
 * Patron Adapter - ADAPTER del medidor SCADA legado.
 *
 * Envuelve un Adaptee (LegacyScadaMeter) y cumple el contrato DeviceGateway:
 *   - traduce el estado textual 'UP'/'DOWN' a un booleano `online`;
 *   - convierte las unidades heredadas a las unidades del dominio
 *     (centiamperios -> A, decivatios -> kW, hectovatios-hora -> kWh,
 *     decigrados -> C);
 *   - construye un DeviceId estable para la plataforma.
 */
class LegacyScadaAdapter implements DeviceGateway
{
    public function __construct(private LegacyScadaMeter $meter) {}

    public function getProviderKey(): string
    {
        return 'legacy-scada';
    }

    public function getDeviceId(): string
    {
        return 'scada-' . strtolower($this->meter->getSerialNumber());
    }

    public function getDisplayName(): string
    {
        return 'Medidor ' . $this->meter->getModel();
    }

    public function isOnline(): bool
    {
        return $this->meter->getLinkState() === 'UP';
    }

    public function getSupportedMetrics(): array
    {
        return [
            'voltage' => 'Voltaje',
            'current' => 'Corriente',
            'powerKw' => 'Potencia',
            'energyKwh' => 'Energia acumulada',
            'temperatureC' => 'Temperatura',
        ];
    }

    public function readTelemetry(): DeviceTelemetry
    {
        $telemetry = new DeviceTelemetry();
        $telemetry->deviceId = $this->getDeviceId();
        $telemetry->provider = $this->getProviderKey();
        $telemetry->deviceType = 'smart-meter';
        $telemetry->displayName = $this->getDisplayName();
        $telemetry->online = $this->isOnline();
        $telemetry->measuredAt = now()->toIso8601String();

        // Traduccion de unidades heredadas a unidades del dominio.
        $telemetry->voltage = (float) $this->meter->readRegister(LegacyScadaMeter::REG_VOLTAGE);
        $telemetry->current = $this->meter->readRegister(LegacyScadaMeter::REG_CURRENT) / 100;
        $telemetry->powerKw = ($this->meter->readRegister(LegacyScadaMeter::REG_POWER) / 10) / 1000;
        $telemetry->energyKwh = $this->meter->readRegister(LegacyScadaMeter::REG_ENERGY) / 100;
        $telemetry->temperatureC = $this->meter->readRegister(LegacyScadaMeter::REG_TEMPERATURE) / 10;

        $telemetry->rawReading = sprintf(
            'registros SCADA %d-%d (decivatios, centiamperios, hectovatios-hora, decigrados) - enlace %s',
            LegacyScadaMeter::REG_VOLTAGE,
            LegacyScadaMeter::REG_TEMPERATURE,
            $this->meter->getLinkState()
        );

        $telemetry->metrics = [
            'voltage' => ['label' => 'Voltaje', 'value' => round($telemetry->voltage, 2), 'unit' => 'V'],
            'current' => ['label' => 'Corriente', 'value' => round($telemetry->current, 2), 'unit' => 'A'],
            'powerKw' => ['label' => 'Potencia', 'value' => round($telemetry->powerKw, 3), 'unit' => 'kW'],
            'energyKwh' => ['label' => 'Energia acumulada', 'value' => round($telemetry->energyKwh, 2), 'unit' => 'kWh'],
            'temperatureC' => ['label' => 'Temperatura', 'value' => round($telemetry->temperatureC, 1), 'unit' => 'C'],
        ];

        return $telemetry;
    }
}
