<?php

namespace App\Patterns\Visitors;

use App\Models\DeviceTelemetry;
use App\Models\EnergyOffer;
use App\Patterns\EnergySources\EnergySource;

/**
 * Patron Visitor — Visitante concreto «Reporte del mercado».
 *
 * Recorre ofertas, fuentes de energía y dispositivos IoT acumulando
 * un reporte consolidado: oferta y energía por tipo de energía,
 * estadísticas de precio, catálogo de fuentes y estado de la red IoT.
 * Apoya los objetivos de clasificar los tipos de energía y de dar
 * información organizada sobre las operaciones.
 */
class MarketReportVisitor implements MarketElementVisitor
{
    private array $offers = [];
    private array $kwhByType = [];
    private array $offersByType = [];
    private array $prices = [];

    private array $sources = [];
    private float $efficiencySum = 0.0;

    private int $totalDevices = 0;
    private int $onlineDevices = 0;
    private float $totalPowerKw = 0.0;

    public function visitOffer(EnergyOffer $offer): void
    {
        $type = $offer->energyType !== '' ? $offer->energyType : 'sin_tipo';
        $this->offers[] = [
            'id' => $offer->id,
            'producerName' => $offer->producerName,
            'energyType' => $offer->energyType,
            'totalKwh' => $offer->totalKwh,
            'availableKwh' => $offer->availableKwh,
            'pricePerKwh' => $offer->pricePerKwh,
        ];
        $this->kwhByType[$type] = round(($this->kwhByType[$type] ?? 0) + $offer->availableKwh, 2);
        $this->offersByType[$type] = ($this->offersByType[$type] ?? 0) + 1;
        $this->prices[] = (float) $offer->pricePerKwh;
    }

    public function visitSource(EnergySource $source): void
    {
        $this->sources[] = [
            'type' => $source->getType(),
            'name' => $source->getName(),
            'efficiency' => $source->getEfficiency(),
        ];
        $this->efficiencySum += $source->getEfficiency();
    }

    public function visitDevice(DeviceTelemetry $telemetry): void
    {
        $this->totalDevices++;
        if ($telemetry->online) {
            $this->onlineDevices++;
            $this->totalPowerKw += $telemetry->powerKw;
        }
    }

    public function result(): array
    {
        $offerCount = count($this->offers);
        $avgPrice = $this->prices !== []
            ? round(array_sum($this->prices) / count($this->prices), 2)
            : 0.0;

        return [
            'visitor' => 'Reporte del mercado (MarketReportVisitor)',
            'generatedAt' => now()->toIso8601String(),
            'market' => [
                'totalOffers' => $offerCount,
                'kwhAvailableByType' => $this->kwhByType,
                'offersByType' => $this->offersByType,
                'minPricePerKwh' => $this->prices !== [] ? min($this->prices) : 0.0,
                'maxPricePerKwh' => $this->prices !== [] ? max($this->prices) : 0.0,
                'avgPricePerKwh' => $avgPrice,
            ],
            'sources' => [
                'items' => $this->sources,
                'avgEfficiency' => $this->sources !== []
                    ? round($this->efficiencySum / count($this->sources), 1)
                    : 0.0,
            ],
            'iot' => [
                'totalDevices' => $this->totalDevices,
                'onlineDevices' => $this->onlineDevices,
                'offlineDevices' => $this->totalDevices - $this->onlineDevices,
                'totalPowerKw' => round($this->totalPowerKw, 3),
            ],
        ];
    }
}
