<?php

namespace App\Patterns\Mementos;

use App\Models\EnergyOffer;

/**
 * Patron Memento — Recuerdo del estado del mercado (rol «Memento»).
 *
 * Almacena una instantánea inmutable del mercado: el arreglo completo
 * de ofertas (con availableKwh incluido), el contador de ids y el
 * contador de transacciones. Los mementos NO exponen setters: solo el
 * MarketService (el originator) puede leerlos para restaurarse.
 *
 * Se persiste en JSON para que las instantáneas sobrevivan entre
 * peticiones, igual que el resto del estado del prototipo.
 */
class MarketMemento
{
    /** @var array Estado serializado de las ofertas. */
    private array $offers;

    private function __construct(
        array $offers,
        public readonly int $nextId,
        public readonly int $transactionCount,
        public readonly string $reason,
        public readonly string $createdAt,
    ) {
        $this->offers = $offers;
    }

    /**
     * Captura una instantánea a partir del estado serializado del mercado.
     *
     * @param array $offers Ofertas en formato toArray().
     */
    public static function capture(array $offers, int $nextId, int $transactionCount, string $reason): self
    {
        return new self(
            array_map(fn (EnergyOffer|array $o) => $o instanceof EnergyOffer ? $o->toArray() : $o, $offers),
            $nextId,
            $transactionCount,
            $reason,
            now()->toIso8601String(),
        );
    }

    /** Reconstruye un memento guardado en JSON (uso exclusivo del caretaker). */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['offers'] ?? [],
            (int) ($data['nextId'] ?? 1),
            (int) ($data['transactionCount'] ?? 0),
            (string) ($data['reason'] ?? 'instantanea'),
            (string) ($data['createdAt'] ?? ''),
        );
    }

    public function toArray(): array
    {
        return [
            'offers' => $this->offers,
            'nextId' => $this->nextId,
            'transactionCount' => $this->transactionCount,
            'reason' => $this->reason,
            'createdAt' => $this->createdAt,
        ];
    }

    // Solo el originator (MarketService) consume estos accesores.

    /** @return EnergyOffer[] */
    public function offers(): array
    {
        return array_map(function (array $o) {
            $offer = new EnergyOffer();
            $offer->id = $o['id'];
            $offer->producerName = $o['producerName'];
            $offer->totalKwh = $o['totalKwh'];
            $offer->availableKwh = $o['availableKwh'];
            $offer->pricePerKwh = $o['pricePerKwh'];
            $offer->description = $o['description'] ?? '';
            $offer->energyType = $o['energyType'] ?? '';
            $offer->createdAt = $o['createdAt'] ?? '';
            $offer->state = $o['state'] ?? null;
            return $offer;
        }, $this->offers);
    }
}
