<?php

namespace App\Patterns\Adapters;

/**
 * Patron Adapter - ADAPTEE #2: inversor fotovoltaico.
 *
 * A diferencia del medidor SCADA, este dispositivo no entrega registros
 * sino un payload JSON serializado (metodo poll()) con claves en MAYUSCULAS,
 * unidades del fabricante (W, Wh, decigrados) y un codigo de estado numerico.
 * Segunda prueba de que "una interfaz por dispositivo" no escala.
 */
class PvInverterDevice
{
    public function __construct(
        private string $serial,
        private string $model,
        private string $pollPayload
    ) {}

    /** Flota de inversores connected a la red domestica. */
    public static function createSampleFleet(): array
    {
        return [
            new self(
                'INV-77021',
                'SunPower SPR-5000',
                json_encode([
                    'SERIAL' => 'INV-77021',
                    'TS' => '2026-09-26T10:15:00Z',
                    'MODE' => 'GRID_CONNECTED',
                    'STATUS' => 0,       // 0 = healthy, 3 = fault
                    'P' => 1850,         // W
                    'E_TODAY' => 4210,   // Wh
                    'V' => 231,
                    'I' => 8,
                    'TEMP' => 415,       // decigrados C
                ])
            ),
            new self(
                'INV-77022',
                'SunPower SPR-3000',
                json_encode([
                    'SERIAL' => 'INV-77022',
                    'TS' => '2026-09-26T10:15:00Z',
                    'MODE' => 'ISLANDING',
                    'STATUS' => 3,       // falla: el Adapter lo expone como offline
                    'P' => 0,
                    'E_TODAY' => 1180,
                    'V' => 0,
                    'I' => 0,
                    'TEMP' => 512,
                ])
            ),
        ];
    }

    public function getSerial(): string
    {
        return $this->serial;
    }

    public function getModel(): string
    {
        return $this->model;
    }

    /** El fabricante devuelve el payload como TEXTO, no como objeto. */
    public function poll(): string
    {
        return $this->pollPayload;
    }
}
