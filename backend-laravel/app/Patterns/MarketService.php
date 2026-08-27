<?php

namespace App\Patterns;

use App\Models\EnergyOffer;

class MarketService
{
    private static ?MarketService $instance = null;

    private array $offers = [];
    private int $nextId = 1;
    private int $transactionCount = 0;

    private string $dataFile;

    private function __construct()
    {
        $this->dataFile = storage_path('app/market_data.json');
        $this->load();
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function load(): void
    {
        if (file_exists($this->dataFile)) {
            $data = json_decode(file_get_contents($this->dataFile), true);
            $this->nextId = $data['nextId'] ?? 1;
            $this->transactionCount = $data['transactionCount'] ?? 0;

            foreach ($data['offers'] ?? [] as $o) {
                $offer = new EnergyOffer();
                $offer->id = $o['id'];
                $offer->producerName = $o['producerName'];
                $offer->totalKwh = $o['totalKwh'];
                $offer->availableKwh = $o['availableKwh'];
                $offer->pricePerKwh = $o['pricePerKwh'];
                $offer->description = $o['description'] ?? '';
                $offer->createdAt = $o['createdAt'] ?? '';
                $this->offers[] = $offer;
            }
        }
    }

    private function save(): void
    {
        $data = [
            'nextId' => $this->nextId,
            'transactionCount' => $this->transactionCount,
            'offers' => array_map(fn($o) => $o->toArray(), $this->offers),
        ];
        file_put_contents($this->dataFile, json_encode($data, JSON_PRETTY_PRINT));
    }

    public function registerOffer(array $data): EnergyOffer
    {
        $offer = new EnergyOffer();
        $offer->id = $this->nextId++;
        $offer->producerName = $data['producerName'];
        $offer->totalKwh = $data['totalKwh'];
        $offer->availableKwh = $data['totalKwh'];
        $offer->pricePerKwh = $data['pricePerKwh'];
        $offer->description = $data['description'] ?? '';
        $offer->createdAt = now()->toIso8601String();

        $this->offers[] = $offer;
        $this->save();
        return $offer;
    }

    public function getAvailableOffers(): array
    {
        return array_filter($this->offers, fn($o) => $o->availableKwh > 0);
    }

    public function purchaseOffer(int $id, int $kwh): array
    {
        foreach ($this->offers as $offer) {
            if ($offer->id === $id) {
                if ($offer->availableKwh < $kwh) {
                    return ['success' => false, 'message' => 'KWh insuficientes disponibles'];
                }
                $offer->availableKwh -= $kwh;
                $this->transactionCount++;
                $this->save();
                return ['success' => true, 'message' => "Compra exitosa de {$kwh} KWh"];
            }
        }
        return ['success' => false, 'message' => 'Oferta no encontrada'];
    }

    public function getMetrics(): array
    {
        return [
            'totalOffers' => count($this->offers),
            'transactionCount' => $this->transactionCount,
        ];
    }
}
