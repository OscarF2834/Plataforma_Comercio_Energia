<?php

namespace App\Patterns\Visitors;

use App\Models\DeviceTelemetry;
use App\Models\EnergyOffer;
use App\Patterns\EnergySources\EnergySource;

/**
 * Patron Visitor — Interfaz del visitante (rol «Visitor»).
 *
 * Un visit por cada tipo de elemento del inventario del mercado
 * (ofertas de excedente, fuentes de energía y telemetría IoT).
 * Así se pueden ejecutar operaciones distintas —reporte, auditoría,
 * exportación— sobre los mismos elementos sin modificarlos.
 */
interface MarketElementVisitor
{
    public function visitOffer(EnergyOffer $offer): void;

    public function visitSource(EnergySource $source): void;

    public function visitDevice(DeviceTelemetry $telemetry): void;

    /** Resultado acumulado tras recorrer todos los elementos. */
    public function result(): array;
}
