<?php

namespace App\Patterns\Predictors;

class DailyPredictor extends AbstractPredictor
{
    public function __construct(float $production = 0.0, float $consumption = 0.0, array $marketContext = [])
    {
        parent::__construct($production, $consumption, $marketContext);
    }

    public function getPeriod(): string
    {
        return 'daily';
    }

    public function getProductionEstimate(): float
    {
        return $this->production > 0 ? $this->production : 18.0;
    }

    public function getConsumptionEstimate(): float
    {
        return $this->consumption > 0 ? $this->consumption : 10.0;
    }

    public function getDescription(): string
    {
        return 'Prediccion diaria basada en la produccion y consumo registrados en el ultimo periodo.';
    }

    public function getColor(): string
    {
        return '#f39c12';
    }
}