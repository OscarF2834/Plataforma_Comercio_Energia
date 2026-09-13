<?php

namespace App\Patterns\Builders;

use App\Models\EnergyOffer;
use App\Patterns\ConfigService;
use App\Patterns\Factories\EnergySourceFactory;

class EnergyOfferBuilder
{
    private EnergyOffer $offer;

    public function __construct()
    {
        $this->reset();
    }

    public function reset(): self
    {
        $this->offer = new EnergyOffer();
        return $this;
    }

    public function setProducer(string $producerName): self
    {
        $this->offer->producerName = trim($producerName);
        return $this;
    }

    public function setEnergyType(string $type): self
    {
        // Usa el Factory Method interno para validar y normalizar el tipo.
        $source = (new EnergySourceFactory())->create($type);
        $this->offer->energyType = $source->getType();
        return $this;
    }

    public function setQuantity(float $totalKwh): self
    {
        $maxKwh = (float) ConfigService::getInstance()->get('maxOfferKwh');

        if ($totalKwh <= 0) {
            throw new \InvalidArgumentException('La cantidad de energia debe ser mayor a cero');
        }
        if ($totalKwh > $maxKwh) {
            throw new \InvalidArgumentException("La cantidad no puede superar {$maxKwh} kWh");
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

    public function build(): EnergyOffer
    {
        $built = $this->offer;
        $this->reset();
        return $built;
    }
}