<?php

namespace App\Patterns\Bridges;

/**
 * Patron Bridge - ABSTRACCION REFINADA: tarifa comercial.
 *
 * Dos reglas que solo el comercio entiende: recargo del 2% y una tarifa de
 * servicio comercial. La tarifa fija esta definida en USD y se convierte
 * con el implementor (convertFromUsd), de modo que la misma regla produce
 * $97.500 COP, US$ 25 o 23 EUR segun la moneda elegida. Esa es la
 * separacion del Bridge en accion.
 */
class CommercialBill extends EnergyBill
{
    public const PROFILE = 'commercial';

    private const SURCHARGE_RATE = 0.02;
    private const FLAT_FEE_USD = 25.0;

    public function getProfileKey(): string
    {
        return self::PROFILE;
    }

    public function getProfileName(): string
    {
        return 'Tarifa comercial';
    }

    public function getProfileDescription(): string
    {
        return 'Local o negocio con recargo comercial del 2% y tarifa de servicio de US$ 25 convertida a la moneda de liquidacion.';
    }

    protected function applyProfileRules(float $subtotal, array $data): array
    {
        return [
            [
                'label' => 'Recargo comercial (' . (self::SURCHARGE_RATE * 100) . '%)',
                'amount' => round($subtotal * self::SURCHARGE_RATE, 2),
            ],
            [
                'label' => 'Tarifa de servicio comercial (US$ ' . self::FLAT_FEE_USD . ')',
                'amount' => round($this->currency->convertFromUsd(self::FLAT_FEE_USD), 2),
            ],
        ];
    }
}
