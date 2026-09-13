<?php

namespace App\Patterns\Builders;

use App\Models\EnergyOffer;
use App\Patterns\ConfigService;

class OfferDirector
{
    public function __construct(private EnergyOfferBuilder $builder) {}

    /**
     * Construye una oferta personalizada paso a paso con los datos del usuario.
     * Representa el flujo habitual: datos exactos proporcionados por el productor.
     */
    public function buildFromRequest(array $data): EnergyOffer
    {
        return $this->builder
            ->reset()
            ->setProducer($data['producerName'])
            ->setEnergyType($data['energyType'] ?? '')
            ->setQuantity((float) $data['totalKwh'])
            ->setPricePerKwh((float) $data['pricePerKwh'])
            ->setDescription($data['description'] ?? '')
            ->build();
    }

    /**
     * Oferta expres: el Director completa los pasos faltantes con valores
     * por defecto tomados de ConfigService (configuracion central del mercado).
     */
    public function buildExpressOffer(string $producerName, float $totalKwh, string $type, string $description = ''): EnergyOffer
    {
        $defaultPrice = (float) ConfigService::getInstance()->get('defaultPricePerKwh');

        return $this->builder
            ->reset()
            ->setProducer($producerName)
            ->setEnergyType($type)
            ->setQuantity($totalKwh)
            ->setPricePerKwh($defaultPrice)
            ->setDescription($description ?: 'Oferta expres construida por el Director con el precio por defecto del mercado')
            ->build();
    }
}