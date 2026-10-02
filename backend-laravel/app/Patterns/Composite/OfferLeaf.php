<?php

namespace App\Patterns\Composite;

/** Patron Composite - HOJA. Una oferta individual sin hijos. */
class OfferLeaf implements BundleComponent
{
    public function __construct(
        private string $name,
        private float $kwh,
        private float $pricePerKwh,
        private string $energyType = 'solar',
    ) {}

    public function getName(): string
    {
        return $this->name;
    }

    public function getTotalKwh(): float
    {
        return $this->kwh;
    }

    public function getTotalPrice(): float
    {
        return $this->kwh * $this->pricePerKwh;
    }

    public function countLeaves(): int
    {
        return 1;
    }

    public function getChildren(): array
    {
        return [];
    }

    public function toArray(): array
    {
        return [
            'type' => 'offer',
            'name' => $this->name,
            'energyType' => $this->energyType,
            'kwh' => round($this->kwh, 2),
            'pricePerKwh' => round($this->pricePerKwh, 2),
            'totalKwh' => round($this->getTotalKwh(), 2),
            'totalPrice' => round($this->getTotalPrice(), 2),
            'children' => [],
        ];
    }
}
