<?php

namespace App\Patterns\Bridges;

/**
 * Patron Bridge - IMPLEMENTOR CONCRETO: dolar estadounidense.
 *
 * Formato local: dos decimales, coma de miles y sufijo USD.
 */
class UsdCurrency implements CurrencyBridge
{
    private const USD_RATE = 1.0;
    private const TAX_RATE = 0.10;

    public function getCode(): string
    {
        return 'USD';
    }

    public function getSymbol(): string
    {
        return 'US$';
    }

    public function getLabel(): string
    {
        return 'Dolares estadounidenses';
    }

    public function getDecimals(): int
    {
        return 2;
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
        return (int) round($amount * 100);
    }

    public function format(float $amount): string
    {
        return 'US$ ' . number_format($amount, 2, '.', ',') . ' USD';
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
