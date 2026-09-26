<?php

namespace App\Patterns\Bridges;

/**
 * Patron Bridge - ABSTRACCION.
 *
 * Define la dimension "que reglas de liquidacion aplican" (perfil del
 * cliente). Es totally independiente de la dimension "en que moneda se
 * cobra" (CurrencyBridge): el Bridge impide que una se entrometa en la
 * otra. Cada metodo de la interfaz se apoya en el implementor para
 * formatear, convertir y aplicar impuestos, sin conocer su clase concreta.
 */
abstract class EnergyBill
{
    public function __construct(protected CurrencyBridge $currency) {}

    abstract public function getProfileKey(): string;

    abstract public function getProfileName(): string;

    abstract public function getProfileDescription(): string;

    /**
     * Reglas comerciales propias del perfil (subsidios, recargos, Tarifas).
     * Devuelve los conceptos que se suman (o restan) al subtotal.
     *
     * @return array<int, array{label: string, amount: float}>
     */
    abstract protected function applyProfileRules(float $subtotal, array $data): array;

    /**
     * Flujo comun de liquidacion. Es aqui donde la abstraccion usa el
     * implementor: el calculo es identico para cualquier moneda y solo
     * cambia el implementor inyectado.
     */
    public function build(array $data): array
    {
        $kwh = (float) $data['kwh'];
        $pricePerKwh = (float) $data['pricePerKwh'];

        $subtotal = $kwh * $pricePerKwh;
        $adjustments = $this->applyProfileRules($subtotal, $data);

        $adjustmentTotal = array_sum(array_column($adjustments, 'amount'));
        $base = $subtotal + $adjustmentTotal;
        $taxRate = $this->currency->getTaxRate();
        $tax = $base * $taxRate;
        $total = $base + $tax;

        return [
            'profile' => $this->getProfileKey(),
            'profileName' => $this->getProfileName(),
            'profileDescription' => $this->getProfileDescription(),
            'currency' => $this->currency->getCode(),
            'currencySymbol' => $this->currency->getSymbol(),
            'currencyLabel' => $this->currency->getLabel(),
            'kwh' => round($kwh, 2),
            'pricePerKwh' => round($pricePerKwh, 2),
            'pricePerKwhFormatted' => $this->currency->format($pricePerKwh),
            'subtotal' => round($subtotal, 2),
            'subtotalFormatted' => $this->currency->format($subtotal),
            'adjustments' => array_map(fn(array $item) => [
                'label' => $item['label'],
                'amount' => round($item['amount'], 2),
                'amountFormatted' => $this->currency->format($item['amount']),
            ], $adjustments),
            'adjustmentTotal' => round($adjustmentTotal, 2),
            'adjustmentTotalFormatted' => $this->currency->format($adjustmentTotal),
            'base' => round($base, 2),
            'baseFormatted' => $this->currency->format($base),
            'taxRate' => $taxRate,
            'tax' => round($tax, 2),
            'taxFormatted' => $this->currency->format($tax),
            'total' => round($total, 2),
            'totalFormatted' => $this->currency->format($total),
            'totalMinorUnits' => $this->currency->convertToMinorUnits($total),
            'issuedAt' => now()->toIso8601String(),
        ];
    }
}
