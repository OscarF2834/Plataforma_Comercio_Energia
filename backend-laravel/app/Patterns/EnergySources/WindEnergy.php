<?php

namespace App\Patterns\EnergySources;

class WindEnergy extends EnergySource
{
    public function getType(): string
    {
        return 'wind';
    }

    public function getName(): string
    {
        return 'Energia Eolica';
    }

    public function getDescription(): string
    {
        return 'Aprovecha el viento mediante aerogeneradores para producir electricidad renovable.';
    }

    public function getEfficiency(): int
    {
        return 70;
    }

    public function getColor(): string
    {
        return '#3498db';
    }
}
