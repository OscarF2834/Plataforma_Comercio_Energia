<?php

namespace App\Patterns\Predictors;

class WeeklyPredictor extends AbstractPredictor
{
    public function __construct(float $production = 0.0, float $consumption = 0.0, array $marketContext = [])
    {
        parent::__construct($production, $consumption, $marketContext);
    }

    public function getPeriod(): string
    {
        return 'weekly';
    }

    public function getProductionEstimate(): float
    {
        return $this->production > 0 ? $this->production * 6 : 21.5;
    }

    public function getConsumptionEstimate(): float
    {
        return $this->consumption > 0 ? $this->consumption * 6 : 13.0;
    }

    public function getDescription(): string
    {
        return 'Prediccion semanal basada en el promedio ponderado de produccion y consumo de la ultima semana.';
    }

    public function getColor(): string
    {
        return '#3498db';
    }
}