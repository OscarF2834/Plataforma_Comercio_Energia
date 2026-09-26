<?php

namespace App\Patterns\Adapters;

use App\Models\DeviceTelemetry;

/**
 * Patron Adapter - TARGET (interfaz que el dominio espera).
 *
 * Es la unica interfaz que conoce el cliente (DeviceMonitorService).
 * Cada fabricante talka un idioma distinto; los Adapter traducen ese
 * idioma a esta interfaz comun.
 */
interface DeviceGateway
{
    /** Clave del fabricante: 'legacy-scada' o 'pv-inverter'. */
    public function getProviderKey(): string;

    /** Identificador unico y estable del dispositivo dentro de la plataforma. */
    public function getDeviceId(): string;

    /** Nombre legible para la interfaz de usuario. */
    public function getDisplayName(): string;

    public function isOnline(): bool;

    /**
     * Metricas soportadas por el dispositivo, ya normalizadas.
     *
     * @return array<string, string> clave => etiqueta
     */
    public function getSupportedMetrics(): array;

    /** Lectura normalizada del dispositivo. */
    public function readTelemetry(): DeviceTelemetry;
}
