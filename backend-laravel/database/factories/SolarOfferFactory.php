<?php

namespace App\Patterns\Factory;

class SolarOfferFactory extends EnergyOfferFactory
{
    public function createOffer(array $data): EnergyOffer
    {
        return new SolarEnergyOffer($data);
    }
}