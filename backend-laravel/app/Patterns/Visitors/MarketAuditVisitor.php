<?php

namespace App\Patterns\Visitors;

use App\Models\DeviceTelemetry;
use App\Models\EnergyOffer;
use App\Patterns\EnergySources\EnergySource;

/**
 * Patron Visitor — Visitante concreto «Auditoría del mercado».
 *
 * MISMO recorrido, operación distinta: en lugar de un reporte,
 * detecta incidencias —ofertas agotadas o sin descripción, precios
 * en cero, productores duplicados, dispositivos fuera de línea y
 * fuentes con bajo rendimiento— sin cambiar ninguna clase visitada.
 */
class MarketAuditVisitor implements MarketElementVisitor
{
    /** @var array<string, int> Productores y cuántas ofertas tienen. */
    private array $producerCounts = [];

    private array $issues = [];

    public function visitOffer(EnergyOffer $offer): void
    {
        $this->producerCounts[$offer->producerName] = ($this->producerCounts[$offer->producerName] ?? 0) + 1;

        if ($offer->availableKwh <= 0) {
            $this->issues[] = [
                'severity' => 'info',
                'element' => 'oferta',
                'reference' => "#{$offer->id}",
                'message' => "La oferta #{$offer->id} de {$offer->producerName} está agotada (no tiene energía disponible)",
            ];
        }

        if (trim($offer->description) === '') {
            $this->issues[] = [
                'severity' => 'warning',
                'element' => 'oferta',
                'reference' => "#{$offer->id}",
                'message' => "La oferta #{$offer->id} no tiene descripción para los compradores",
            ];
        }

        if ((float) $offer->pricePerKwh <= 0) {
            $this->issues[] = [
                'severity' => 'error',
                'element' => 'oferta',
                'reference' => "#{$offer->id}",
                'message' => "La oferta #{$offer->id} tiene un precio de {$offer->pricePerKwh} COP/kWh",
            ];
        }
    }

    public function visitSource(EnergySource $source): void
    {
        if ($source->getEfficiency() < 75) {
            $this->issues[] = [
                'severity' => 'info',
                'element' => 'fuente',
                'reference' => $source->getType(),
                'message' => "La fuente {$source->getName()} tiene un rendimiento de {$source->getEfficiency()}%, por debajo del umbral de 75%",
            ];
        }
    }

    public function visitDevice(DeviceTelemetry $telemetry): void
    {
        if (!$telemetry->online) {
            $this->issues[] = [
                'severity' => 'error',
                'element' => 'dispositivo',
                'reference' => $telemetry->deviceId,
                'message' => "El dispositivo {$telemetry->displayName} ({$telemetry->deviceId}) está fuera de línea: sus lecturas no se actualizarán",
            ];
            return;
        }

        if ($telemetry->powerKw <= 0.0) {
            $this->issues[] = [
                'severity' => 'warning',
                'element' => 'dispositivo',
                'reference' => $telemetry->deviceId,
                'message' => "El dispositivo {$telemetry->displayName} está en línea pero reporta 0 kW de potencia",
            ];
        }
    }

    public function result(): array
    {
        // Ofertas duplicadas por productor (posible publicación repetida).
        foreach ($this->producerCounts as $producer => $count) {
            if ($count > 1) {
                $this->issues[] = [
                    'severity' => 'info',
                    'element' => 'oferta',
                    'reference' => $producer,
                    'message' => "{$producer} tiene {$count} ofertas activas: verificar que no sean publicaciones repetidas",
                ];
            }
        }

        $severity = ['error' => 0, 'warning' => 0, 'info' => 0];
        foreach ($this->issues as $issue) {
            $severity[$issue['severity']]++;
        }

        return [
            'visitor' => 'Auditoría del mercado (MarketAuditVisitor)',
            'generatedAt' => now()->toIso8601String(),
            'totalIssues' => count($this->issues),
            'bySeverity' => $severity,
            'issues' => $this->issues,
        ];
    }
}
