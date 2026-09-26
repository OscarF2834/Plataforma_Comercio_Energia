<?php

namespace App\Patterns\Adapters;

use App\Models\DeviceTelemetry;

/**
 * Patron Adapter - CLIENTE.
 *
 * Es la pieza que da sentido al patron: este servicio trabaja EXCLUSIVAMENTE
 * contra la interfaz DeviceGateway. No importa si el dato vino de un medidor
 * SCADA de 1998 o de un inversor moderno, ni en que unidades llegue.
 *
 * Si manana se integra un nuevo fabricante, solo se agrega su Adapter al
 * DeviceGatewayRegistry: este cliente no cambia.
 */
class DeviceMonitorService
{
    /** @param DeviceGateway[] $gateways */
    public function __construct(private array $gateways) {}

    /**
     * Inventario de dispositivos ya normalizado: el cliente solo pide
     * informacion a la interfaz comun.
     */
    public function listDevices(): array
    {
        return array_map(fn(DeviceGateway $gateway) => [
            'deviceId' => $gateway->getDeviceId(),
            'provider' => $gateway->getProviderKey(),
            'deviceType' => $gateway->readTelemetry()->deviceType,
            'displayName' => $gateway->getDisplayName(),
            'online' => $gateway->isOnline(),
            'metricLabels' => $gateway->getSupportedMetrics(),
        ], $this->gateways);
    }

    public function readTelemetry(string $deviceId): DeviceTelemetry
    {
        return $this->gateway($deviceId)->readTelemetry();
    }

    /** Resumen consolidado de la red domestica (el cliente no sabe de marcas). */
    public function getSummary(): array
    {
        $online = 0;
        $totalPowerKw = 0.0;
        $totalEnergyKwh = 0.0;
        $byProvider = [];

        foreach ($this->gateways as $gateway) {
            $telemetry = $gateway->readTelemetry();

            if ($telemetry->online) {
                $online++;
                $totalPowerKw += $telemetry->powerKw;
                $totalEnergyKwh += $telemetry->energyKwh;
            }

            $provider = $gateway->getProviderKey();
            $byProvider[$provider] = ($byProvider[$provider] ?? 0) + 1;
        }

        return [
            'totalDevices' => count($this->gateways),
            'onlineDevices' => $online,
            'offlineDevices' => count($this->gateways) - $online,
            'totalPowerKw' => round($totalPowerKw, 3),
            'totalEnergyKwh' => round($totalEnergyKwh, 2),
            'devicesByProvider' => $byProvider,
        ];
    }

    private function gateway(string $deviceId): DeviceGateway
    {
        foreach ($this->gateways as $gateway) {
            if ($gateway->getDeviceId() === $deviceId) {
                return $gateway;
            }
        }

        throw new \RuntimeException('Dispositivo no registrado en la plataforma: ' . $deviceId);
    }
}
