<?php

namespace App\Patterns\EnergySources;

class SolarEnergy extends EnergySource
{
    public function getType(): string
    {
        return 'solar';
    }

    public function getName(): string
    {
        return 'Energia Solar';
    }

    public function getDescription(): string
    {
        return 'Captura la luz del sol mediante paneles fotovoltaicos para generar electricidad de forma limpia.';
    }

    public function getEfficiency(): int
    {
        return 85;
    }

    public function getColor(): string
    {
        return '#f39c12';
    }
}
