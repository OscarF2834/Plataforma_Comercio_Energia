<?php

namespace App\Patterns\Bridges;

/**
 * Patron Bridge - IMPLEMENTOR CONCRETO: euro.
 *
 * Formato local: dos decimales, punto de miles y simbolo al final.
 */
class EurCurrency implements CurrencyBridge
{
    private const USD_RATE = 0.92; // 1 USD = 0.92 EUR
    private const TAX_RATE = 0.21; // IVA Europa

    public function getCode(): string
    {
        return 'EUR';
    }

    public function getSymbol(): string
    {
        return "\u{20AC}";
    }

    public function getLabel(): string
    {
        return 'Euros';
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
        return number_format($amount, 2, ',', '.') . ' ' . $this->getSymbol();
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
