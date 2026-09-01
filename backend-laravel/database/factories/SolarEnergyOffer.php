<?php

namespace App\Patterns\Factory;

class SolarEnergyOffer implements EnergyOffer
{
    private array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function getType(): string
    {
        return 'solar';
    }

    public function getData(): array
    {
        return array_merge($this->data, [
            'type' => $this->getType(),
        ]);
    }
}