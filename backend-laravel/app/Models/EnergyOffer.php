<?php

namespace App\Models;

class EnergyOffer
{
    public ?int $id = null;
    public string $producerName = '';
    public float $totalKwh = 0;
    public float $availableKwh = 0;
    public float $pricePerKwh = 0;
    public string $description = '';
    public string $createdAt = '';

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'producerName' => $this->producerName,
            'totalKwh' => $this->totalKwh,
            'availableKwh' => $this->availableKwh,
            'pricePerKwh' => $this->pricePerKwh,
            'description' => $this->description,
            'createdAt' => $this->createdAt,
        ];
    }
}
