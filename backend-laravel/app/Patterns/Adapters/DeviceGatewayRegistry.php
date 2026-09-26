<?php

namespace App\Patterns\Adapters;

/**
 * Patron Adapter - REGISTRO de gateways.
 *
 * Es el unico punto que conoce a la vez los Adaptee y los Adapter: decide
 * que Adapter corresponde a cada dispositivo. El cliente
 * (DeviceMonitorService) recibe gateways ya armados y jamas ve a los
 * dispositivos heredados, por lo que agregar un fabricante nuevo no lo
 * obliga a modificar una sola linea.
 */
class DeviceGatewayRegistry
{
    /** @var array<string, DeviceGateway> */
    private array $gateways = [];

    public function __construct()
    {
        foreach (LegacyScadaMeter::createSampleFleet() as $meter) {
            $this->register(new LegacyScadaAdapter($meter));
        }

        foreach (PvInverterDevice::createSampleFleet() as $device) {
            $this->register(new PvInverterAdapter($device));
        }
    }

    public function register(DeviceGateway $gateway): void
    {
        $this->gateways[$gateway->getDeviceId()] = $gateway;
    }

    /** @return DeviceGateway[] */
    public function all(): array
    {
        return array_values($this->gateways);
    }

    public function get(string $deviceId): DeviceGateway
    {
        if (!isset($this->gateways[$deviceId])) {
            throw new \RuntimeException('Dispositivo no registrado en la plataforma: ' . $deviceId);
        }

        return $this->gateways[$deviceId];
    }

    /**
     * Payload crudo de los Adaptee, tal como lo entrega cada fabricante.
     * Se expone para evidenciar el "antes" de la adaptacion (y lo consume
     * el Adapter equivalente del frontend).
     *
     * @return array<int, array{serial: string, model: string, firmware: string, linkState: string, registers: array<int, int>}>
     */
    public function rawMeterDumps(): array
    {
        $dumps = [];
        foreach (LegacyScadaMeter::createSampleFleet() as $meter) {
            $dumps[] = [
                'serial' => $meter->getSerialNumber(),
                'model' => $meter->getModel(),
                'firmware' => $meter->getFirmware(),
                'linkState' => $meter->getLinkState(),
                'registers' => $meter->dumpRegisters(),
            ];
        }

        return $dumps;
    }

    /** @return array<int, array{serial: string, model: string, payload: string}> */
    public function rawInverterPolls(): array
    {
        $polls = [];
        foreach (PvInverterDevice::createSampleFleet() as $device) {
            $polls[] = [
                'serial' => $device->getSerial(),
                'model' => $device->getModel(),
                'payload' => $device->poll(),
            ];
        }

        return $polls;
    }
}
