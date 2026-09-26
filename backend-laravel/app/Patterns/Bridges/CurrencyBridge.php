<?php

namespace App\Patterns\Bridges;

/**
 * Patron Bridge - IMPLEMENTOR.
 *
 * Define la dimension "como se expresa y convierte el dinero". No sabe
 * nada de facturas, perfiles de cliente ni de la plataforma energetica:
 * solo de moneda. Gracias a esta separacion, agregar una moneda no obliga a
 * tocar la jerarquia de facturas, y viceversa.
 */
interface CurrencyBridge
{
    public function getCode(): string;

    public function getSymbol(): string;

    public function getLabel(): string;

    /** Decimales de la moneda (0 para COP, 2 para USD/EUR). */
    public function getDecimals(): int;

    /** Tasa de impuesto que aplica la moneda a la liquidacion. */
    public function getTaxRate(): float;

    /** Cuantas unidades de esta moneda equivalen a 1 USD. */
    public function getUsdRate(): float;

    /** Convierte un monto expresado en USD a esta moneda. */
    public function convertFromUsd(float $usdAmount): float;

    /** Convierte un monto de esta moneda a unidades minimas (centavos). */
    public function convertToMinorUnits(float $amount): int;

    /** Representacion textual del monto con el formato local de la moneda. */
    public function format(float $amount): string;

    public function toArray(): array;
}
