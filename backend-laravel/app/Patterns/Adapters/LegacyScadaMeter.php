<?php

namespace App\Patterns\Adapters;

/**
 * Patron Adapter - ADAPTEE #1: medidor SCADA legado.
 *
 * Simula un medidor industrial de 1998. NO implementa DeviceGateway:
 * expone registros Modbus crudos con unidades heredadas y un estado de
 * enlace en texto ('UP' / 'DOWN'). Es exactamente el problema que
 * resuelve el patron Adapter: su interfaz no encaja con la del dominio.
 */
class LegacyScadaMeter
{
    public const REG_VOLTAGE = 30001;    // voltios
    public const REG_CURRENT = 30002;    // centiamperios
    public const REG_POWER = 30003;     // decivatios (0.1 W)
    public const REG_ENERGY = 30004;     // hectovatios-hora (0.01 kWh)
    public const REG_TEMPERATURE = 30005; // decigrados Celsius

    /** @param array<int, int> $registers */
    public function __construct(
        private string $serialNumber,
        private string $model,
        private array $registers,
        private string $linkState,
        private string $firmware
    ) {}

    /** Flota de medidores legados que representa el parque IoT del proyecto. */
    public static function createSampleFleet(): array
    {
        return [
            new self(
                'ITM-4417',
                'Itron OpenWay M40',
                [
                    self::REG_VOLTAGE => 231,
                    self::REG_CURRENT => 742,   // 7.42 A
                    self::REG_POWER => 1713,    // 171.3 W
                    self::REG_ENERGY => 128450, // 1284.50 kWh
                    self::REG_TEMPERATURE => 386, // 38.6 C
                ],
                'UP',
                'v2.1.4-legacy'
            ),
            new self(
                'ITM-4418',
                'Itron OpenWay M40',
                [
                    self::REG_VOLTAGE => 228,
                    self::REG_CURRENT => 315,   // 3.15 A
                    self::REG_POWER => 719,     // 71.9 W
                    self::REG_ENERGY => 64200,  // 642.00 kWh
                    self::REG_TEMPERATURE => 352, // 35.2 C
                ],
                'DOWN',                        // enlace caido: el Adapter lo expone como offline
                'v2.1.4-legacy'
            ),
        ];
    }

    public function getSerialNumber(): string
    {
        return $this->serialNumber;
    }

    public function getModel(): string
    {
        return $this->model;
    }

    public function getFirmware(): string
    {
        return $this->firmware;
    }

    /** Estado del enlace en el idioma del fabricante: 'UP' o 'DOWN'. */
    public function getLinkState(): string
    {
        return $this->linkState;
    }

    public function readRegister(int $address): int
    {
        return $this->registers[$address] ?? 0;
    }

    /** @return array<int, int> mapa direccion => valor crudo */
    public function dumpRegisters(): array
    {
        return $this->registers;
    }
}
