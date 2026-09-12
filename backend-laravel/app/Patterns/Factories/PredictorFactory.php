<?php

namespace App\Patterns\Factories;

use App\Patterns\Predictors\AbstractPredictor;
use App\Patterns\Predictors\DailyPredictor;
use App\Patterns\Predictors\WeeklyPredictor;

class PredictorFactory
{
    public const TYPES = ['daily', 'weekly'];

    public function create(string $period, float $production = 0.0, float $consumption = 0.0, array $marketContext = []): AbstractPredictor
    {
        return match (strtolower($period)) {
            'daily'  => new DailyPredictor($production, $consumption, $marketContext),
            'weekly' => new WeeklyPredictor($production, $consumption, $marketContext),
            default => throw new \InvalidArgumentException("Periodo de prediccion no soportado: {$period}"),
        };
    }

    public function createAll(float $production = 0.0, float $consumption = 0.0, array $marketContext = []): array
    {
        return array_map(
            fn(string $period) => $this->create($period, $production, $consumption, $marketContext),
            self::TYPES
        );
    }
}