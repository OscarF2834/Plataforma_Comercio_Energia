<?php

namespace App\Patterns\Factory;

class WindEnergyOffer implements EnergyOffer
{
    private array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function getType(): string
    {
        return 'wind';
    }

    public function getData(): array
    {
        return array_merge($this->data, [
            'type' => $this->getType(),
        ]);
    }
}
