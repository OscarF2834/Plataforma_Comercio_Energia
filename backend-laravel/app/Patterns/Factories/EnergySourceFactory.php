<?php

namespace App\Patterns\Factories;

use App\Patterns\EnergySources\EnergySource;
use App\Patterns\EnergySources\HydroEnergy;
use App\Patterns\EnergySources\SolarEnergy;
use App\Patterns\EnergySources\WindEnergy;

class EnergySourceFactory
{
    public const TYPES = ['solar', 'wind', 'hydro'];

    public function create(string $type): EnergySource
    {
        return match (strtolower($type)) {
            'solar' => new SolarEnergy(),
            'wind'  => new WindEnergy(),
            'hydro' => new HydroEnergy(),
            default => throw new \InvalidArgumentException("Tipo de energia no soportado: {$type}"),
        };
    }

    public function createAll(): array
    {
        return array_map(fn(string $type) => $this->create($type), self::TYPES);
    }
}
