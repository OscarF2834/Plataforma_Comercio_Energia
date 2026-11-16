<?php

namespace App\Patterns\Mementos;

/**
 * Patron Memento — Guardián de las instantáneas (rol «Caretaker»).
 *
 * Mantiene una pila (máx. 10) de MarketMemento y la persiste en JSON
 * para que el «deshacer compra» funcione entre peticiones. El caretaker
 * nunca inspecciona el contenido de los mementos: solo los guarda, los
 * lista y los entrega al mediador para restaurarlos.
 */
class MarketCaretaker
{
    private const MAX_MEMENTOS = 10;

    private string $dataFile;

    /** @var MarketMemento[] */
    private array $mementos = [];

    public function __construct()
    {
        $this->dataFile = storage_path('app/market_mementos.json');
        $this->load();
    }

    private function load(): void
    {
        if (file_exists($this->dataFile)) {
            $raw = json_decode(file_get_contents($this->dataFile), true) ?? [];
            $this->mementos = array_map(
                fn (array $m) => MarketMemento::fromArray($m),
                $raw
            );
        }
    }

    private function persist(): void
    {
        file_put_contents(
            $this->dataFile,
            json_encode(array_map(fn (MarketMemento $m) => $m->toArray(), $this->mementos), JSON_PRETTY_PRINT)
        );
    }

    /** Guarda una instantánea en la pila (descarta las más antiguas). */
    public function push(MarketMemento $memento): MarketMemento
    {
        $this->mementos[] = $memento;
        if (count($this->mementos) > self::MAX_MEMENTOS) {
            $this->mementos = array_slice($this->mementos, -self::MAX_MEMENTOS);
        }
        $this->persist();
        return $memento;
    }

    /** Recupera y elimina la última instantánea (para deshacer). */
    public function pop(): ?MarketMemento
    {
        if ($this->mementos === []) {
            return null;
        }
        $memento = array_pop($this->mementos);
        $this->persist();
        return $memento;
    }

    /** Historial visible para el panel: metadatos sin las ofertas. */
    public function history(): array
    {
        return array_map(fn (MarketMemento $m) => [
            'reason' => $m->reason,
            'createdAt' => $m->createdAt,
            'transactionCount' => $m->transactionCount,
            'offers' => count($m->toArray()['offers']),
        ], $this->mementos);
    }

    public function count(): int
    {
        return count($this->mementos);
    }

    public function clear(): void
    {
        $this->mementos = [];
        $this->persist();
    }
}
