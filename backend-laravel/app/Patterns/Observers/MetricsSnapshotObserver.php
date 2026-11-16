<?php

namespace App\Patterns\Observers;

use App\Models\EnergyOffer;

/**
 * Patron Observer — Observador concreto «Métricas del mercado».
 *
 * Mantiene contadores agregados del mercado (ofertas registradas,
 * compras realizadas y kWh vendidos) y los persiste en JSON. Es el
 * observador que alimenta las estadísticas del panel.
 */
class MetricsSnapshotObserver implements MarketObserver
{
    private string $dataFile;

    private array $stats = [
        'offersRegistered' => 0,
        'purchases' => 0,
        'kwhSold' => 0,
        'kwhAvailable' => 0,
    ];

    public function __construct()
    {
        $this->dataFile = storage_path('app/observer_stats.json');
        $this->load();
    }

    private function load(): void
    {
        if (file_exists($this->dataFile)) {
            $this->stats = array_merge($this->stats, json_decode(file_get_contents($this->dataFile), true) ?? []);
        }
    }

    private function persist(): void
    {
        file_put_contents($this->dataFile, json_encode($this->stats, JSON_PRETTY_PRINT));
    }

    public function getName(): string
    {
        return 'Métricas del mercado (MetricsSnapshotObserver)';
    }

    public function onOfferRegistered(EnergyOffer $offer): void
    {
        $this->stats['offersRegistered']++;
        $this->persist();
    }

    public function onOfferPurchased(EnergyOffer $offer, int $kwh, array $result = []): void
    {
        $this->stats['purchases']++;
        $this->stats['kwhSold'] += $kwh;
        $this->stats['kwhAvailable'] = round($offer->availableKwh, 2);
        $this->persist();
    }

    public function getStats(): array
    {
        return $this->stats;
    }
}
