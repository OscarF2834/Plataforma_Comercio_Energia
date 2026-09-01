<?php

namespace App\Patterns\Factory;

abstract class EnergyOfferFactory
{
    /**
     * Factory Method
     */
    abstract public function createOffer(array $data): EnergyOffer;

    /**
     * Lógica común del negocio
     */
    public function buildOffer(array $data): EnergyOffer
    {
        $offer = $this->createOffer($data);

        return $offer;
    }
}