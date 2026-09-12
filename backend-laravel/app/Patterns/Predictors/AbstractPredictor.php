<?php

namespace App\Patterns\Predictors;

abstract class AbstractPredictor
{
    protected float $production;
    protected float $consumption;
    protected array $marketContext;

    public function __construct(float $production = 0.0, float $consumption = 0.0, array $marketContext = [])
    {
        $this->production = $production;
        $this->consumption = $consumption;
        $this->marketContext = $marketContext;
    }

    public function setData(float $production, float $consumption): self
    {
        $this->production = $production;
        $this->consumption = $consumption;
        return $this;
    }

    abstract public function getPeriod(): string;

    abstract public function getProductionEstimate(): float;

    abstract public function getConsumptionEstimate(): float;

    abstract public function getDescription(): string;

    abstract public function getColor(): string;

    final public function predict(): array
    {
        $production = $this->getProductionEstimate();
        $consumption = $this->getConsumptionEstimate();
        $surplus = $production - $consumption;

        return [
            'period' => $this->getPeriod(),
            'description' => $this->getDescription(),
            'color' => $this->getColor(),
            'productionEstimate' => round($production, 2),
            'consumptionEstimate' => round($consumption, 2),
            'surplusEstimate' => round(max(0, $surplus), 2),
            'deficitEstimate' => round(max(0, -$surplus), 2),
            'action' => $this->getAction($surplus),
            'recommendation' => $this->buildRecommendation($surplus),
            'market' => $this->marketContext,
        ];
    }

    protected function getAction(float $surplus): string
    {
        if ($surplus > 0) {
            return 'publish';
        }
        if ($surplus < 0) {
            return 'buy';
        }
        return 'none';
    }

    protected function buildRecommendation(float $surplus): string
    {
        $avgPrice = round($this->marketContext['avgPricePerKwh'] ?? 0, 2);
        $available = $this->marketContext['totalAvailableKwh'] ?? 0;
        $activeOffers = $this->marketContext['activeOffers'] ?? 0;

        if ($surplus > 0) {
            return "Se estima un excedente de {$surplus} kWh. Puedes venderlo: el mercado promedia {$avgPrice} COP/kWh.";
        }

        if ($surplus < 0) {
            return "Se estima un deficit de " . abs($surplus) . " kWh. El mercado dispone de {$available} kWh en {$activeOffers} ofertas activas; compra para cubrir tu consumo.";
        }

        return 'Tu produccion estimada cubre tu consumo; no necesitas comprar ni vender.';
    }
}