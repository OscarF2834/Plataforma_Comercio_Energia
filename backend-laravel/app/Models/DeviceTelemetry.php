<?php

namespace App\Models;

/**
 * Patron Adapter - modelo de dominio normalizado.
 * Todos los Adapter (SCADA legado, inversor PV) entregan la telemetria en este
 * formato comun, de modo que el cliente nunca ve las unidades del fabricante.
 */
class DeviceTelemetry
{
    public string $deviceId = '';
    public string $provider = '';
    public string $deviceType = '';
    public string $displayName = '';
    public bool $online = false;
    public string $measuredAt = '';

    public float $voltage = 0.0;
    public float $current = 0.0;
    public float $powerKw = 0.0;
    public float $energyKwh = 0.0;
    public float $temperatureC = 0.0;

    // Descripcion de como el dispositivo entrego originalmente el dato
    // (registros, payload JSON, unidades heredadas). Sirve para evidenciar
    // la traduccion hecha por el Adapter.
    public string $rawReading = '';

    /** @var array<string, array{label: string, value: float, unit: string}> */
    public array $metrics = [];

    public function toArray(): array
    {
        return [
            'deviceId' => $this->deviceId,
            'provider' => $this->provider,
            'deviceType' => $this->deviceType,
            'displayName' => $this->displayName,
            'online' => $this->online,
            'measuredAt' => $this->measuredAt,
            'voltage' => round($this->voltage, 2),
            'current' => round($this->current, 2),
            'powerKw' => round($this->powerKw, 3),
            'energyKwh' => round($this->energyKwh, 2),
            'temperatureC' => round($this->temperatureC, 1),
            'rawReading' => $this->rawReading,
            'metrics' => $this->metrics,
        ];
    }
}
