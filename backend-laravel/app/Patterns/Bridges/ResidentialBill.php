<?php

namespace App\Patterns\Bridges;

/**
 * Patron Bridge - ABSTRACCION REFINADA: tarifa residencial.
 *
 * Aplica el subsidio del 5% sobre el subtotal. No conoce la moneda: el
 * porcentaje es independiente de la unidad monetaria, por eso el mismo
 * perfil funciona en COP, USD o EUR sin cambiar una linea.
 */
class ResidentialBill extends EnergyBill
{
    public const PROFILE = 'residential';

    private const SUBSIDY_RATE = 0.05;

    public function getProfileKey(): string
    {
        return self::PROFILE;
    }

    public function getProfileName(): string
    {
        return 'Tarifa residencial';
    }

    public function getProfileDescription(): string
    {
        return 'Vivienda unifamiliar con subsidio del 5% sobre el valor de la energia.';
    }

    protected function applyProfileRules(float $subtotal, array $data): array
    {
        return [
            [
                'label' => 'Subsidio residencial (' . (self::SUBSIDY_RATE * 100) . '%)',
                'amount' => -round($subtotal * self::SUBSIDY_RATE, 2),
            ],
        ];
    }
}
