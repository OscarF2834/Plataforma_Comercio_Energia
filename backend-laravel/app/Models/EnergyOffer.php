<?php

namespace App\Models;

use App\Patterns\Visitors\MarketElementVisitor;

class EnergyOffer
{
    public ?int $id = null;
    public string $producerName = '';
    public float $totalKwh = 0;
    public float $availableKwh = 0;
    public float $pricePerKwh = 0;
    public string $description = '';
    public string $energyType = '';
    public string $createdAt = '';

    /** Patron State: nombre del estado del ciclo de vida de la oferta. */
    public ?string $state = null;

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'producerName' => $this->producerName,
            'totalKwh' => $this->totalKwh,
            'availableKwh' => $this->availableKwh,
            'pricePerKwh' => $this->pricePerKwh,
            'description' => $this->description,
            'energyType' => $this->energyType,
            'createdAt' => $this->createdAt,
            'state' => $this->state,
        ];
    }

    /**
     * Patron Visitor — acepta un visitante (doble despacho):
     * la oferta decide qué método visit corresponde a su clase.
     */
    public function accept(MarketElementVisitor $visitor): void
    {
        $visitor->visitOffer($this);
    }
}
