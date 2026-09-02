<?php

namespace App\Patterns\EnergySources;

class HydroEnergy extends EnergySource
{
    public function getType(): string
    {
        return 'hydro';
    }

    public function getName(): string
    {
        return 'Energia Hidraulica';
    }

    public function getDescription(): string
    {
        return 'Convierte la energia del agua en movimiento en electricidad aprovechando embalses y corrientes.';
    }

    public function getEfficiency(): int
    {
        return 92;
    }

    public function getColor(): string
    {
        return '#2ecc71';
    }
}
