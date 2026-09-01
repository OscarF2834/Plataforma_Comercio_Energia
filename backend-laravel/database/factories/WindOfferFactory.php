<?php

namespace App\Patterns\Factory;

class WindOfferFactory extends EnergyOfferFactory
{
    public function createOffer(array $data): EnergyOffer
    {
        return new WindEnergyOffer($data);
    }
}