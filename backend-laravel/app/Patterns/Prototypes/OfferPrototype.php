<?php

namespace App\Patterns\Prototypes;

use App\Models\EnergyOffer;

class OfferPrototype implements Prototype
{
    public function __construct(private EnergyOffer $offer) {}

    public static function from(EnergyOffer $offer): self
    {
        return new self($offer);
    }

    public function getOffer(): EnergyOffer
    {
        return $this->offer;
    }

    public function copy(): Prototype
    {
        $copy = clone $this->offer;
        $copy->id = null;
        $copy->availableKwh = $copy->totalKwh;
        $copy->createdAt = '';

        return new self($copy);
    }

    public function setProducer(string $producerName): self
    {
        $this->offer->producerName = trim($producerName);
        return $this;
    }

    public function setQuantity(float $totalKwh): self
    {
        if ($totalKwh <= 0) {
            throw new \InvalidArgumentException('La cantidad de energia debe ser mayor a cero');
        }
        $this->offer->totalKwh = $totalKwh;
        $this->offer->availableKwh = $totalKwh;
        return $this;
    }

    public function setPricePerKwh(float $price): self
    {
        if ($price < 0) {
            throw new \InvalidArgumentException('El precio no puede ser negativo');
        }
        $this->offer->pricePerKwh = $price;
        return $this;
    }

    public function setDescription(string $description): self
    {
        $this->offer->description = $description;
        return $this;
    }

    public function toArray(): array
    {
        return $this->offer->toArray();
    }
}