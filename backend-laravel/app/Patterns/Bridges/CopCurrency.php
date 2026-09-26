<?php

namespace App\Patterns\Bridges;

/**
 * Patron Bridge - IMPLEMENTOR CONCRETO: peso colombiano.
 *
 * Formato local: sin decimales, punto de miles y sufijo COP.
 */
class CopCurrency implements CurrencyBridge
{
    private const USD_RATE = 3900.0; // 1 USD = 3.900 COP
    private const TAX_RATE = 0.19;   // IVA Colombia

    public function getCode(): string
    {
        return 'COP';
    }

    public function getSymbol(): string
    {
        return '$';
    }

    public function getLabel(): string
    {
        return 'Pesos colombianos';
    }

    public function getDecimals(): int
    {
        return 0;
    }

    public function getTaxRate(): float
    {
        return self::TAX_RATE;
    }

    public function getUsdRate(): float
    {
        return self::USD_RATE;
    }

    public function convertFromUsd(float $usdAmount): float
    {
        return $usdAmount * self::USD_RATE;
    }

    public function convertToMinorUnits(float $amount): int
    {
        return (int) round($amount);
    }

    public function format(float $amount): string
    {
        return '$ ' . number_format($amount, 0, ',', '.') . ' COP';
    }

    public function toArray(): array
    {
        return [
            'code' => $this->getCode(),
            'symbol' => $this->getSymbol(),
            'label' => $this->getLabel(),
            'decimals' => $this->getDecimals(),
            'taxRate' => $this->getTaxRate(),
            'usdRate' => $this->getUsdRate(),
        ];
    }
}
