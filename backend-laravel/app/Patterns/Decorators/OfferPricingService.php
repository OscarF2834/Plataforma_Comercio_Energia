<?php

namespace App\Patterns\Decorators;

/**
 * Patron Decorator - CLIENTE.
 *
 * Arranca desde un BasicOffer y lo envuelve con los decoradores elegidos
 * por el usuario (en cualquier orden y cantidad), sin condicionales
 * anidados ni clases nuevas por combinacion.
 */
class OfferPricingService
{
    /** @var array<string, array{class: class-string<OfferDecorator>, name: string, description: string, rule: string}> */
    private array $catalog = [
        'green' => [
            'class' => GreenCertificationDecorator::class,
            'name' => 'Certificacion Verde',
            'description' => 'Garantiza que la energia proviene de fuentes 100% renovables.',
            'rule' => '+5% sobre el subtotal base',
        ],
        'insurance' => [
            'class' => InsuranceDecorator::class,
            'name' => 'Seguro de suministro',
            'description' => 'Cubre perdidas de suministro durante el periodo contratado.',
            'rule' => '+3% sobre el subtotal base',
        ],
        'priority' => [
            'class' => PriorityDeliveryDecorator::class,
            'name' => 'Entrega prioritaria',
            'description' => 'Prioriza la entrega de la energia en la red virtual.',
            'rule' => '+$8.000 COP tarifa fija',
        ],
    ];

    /** @return array<int, array{key: string, name: string, description: string, rule: string}> */
    public function getExtrasCatalog(): array
    {
        $items = [];
        foreach ($this->catalog as $key => $extra) {
            $items[] = [
                'key' => $key,
                'name' => $extra['name'],
                'description' => $extra['description'],
                'rule' => $extra['rule'],
            ];
        }
        return $items;
    }

    /**
     * Envuelve un BasicOffer con cada decorador solicitado, en orden.
     *
     * @param array<int, string> $extras
     */
    public function quote(float $kwh, float $pricePerKwh, array $extras): array
    {
        $offer = new BasicOffer($kwh, $pricePerKwh);

        foreach ($extras as $extra) {
            $key = strtolower($extra);
            if (!isset($this->catalog[$key])) {
                throw new \InvalidArgumentException("Extra desconocido: {$extra}");
            }
            $class = $this->catalog[$key]['class'];
            $offer = new $class($offer);
        }

        return [
            'kwh' => round($kwh, 2),
            'pricePerKwh' => round($pricePerKwh, 2),
            'description' => $offer->getDescription(),
            'basePrice' => round($offer->getBasePrice(), 2),
            'extrasTotal' => round($offer->getExtrasTotal(), 2),
            'total' => round($offer->getTotal(), 2),
            'adjustments' => $offer->getAdjustments(),
            'extrasApplied' => array_values($extras),
        ];
    }
}
