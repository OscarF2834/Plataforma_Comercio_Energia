<?php

namespace App\Patterns\Mediators;

use App\Patterns\Mementos\MarketCaretaker;
use App\Patterns\Mementos\MarketMemento;

/**
 * Patron Mediator — Colega concreto «Historial del mercado».
 *
 * Encapsula al caretaker del patrón Memento. Antes de cada compra el
 * mediador le pide capturar una instantánea del mercado, de modo que
 * la operación quede reversible (deshacer compra).
 */
class HistoryColleague implements Colleague
{
    private ?TransactionMediator $mediator = null;

    public function __construct(private MarketCaretaker $caretaker) {}

    public function setMediator(TransactionMediator $mediator): void
    {
        $this->mediator = $mediator;
    }

    public function getName(): string
    {
        return 'Historial del mercado (MarketCaretaker)';
    }

    /** Punto de restauración ANTES de aplicar la compra. */
    public function snapshotBefore(string $reason): MarketMemento
    {
        $memento = $this->caretaker->push($this->mediator?->requestMemento($reason));
        $this->mediator?->notify($this, 'memento.saved', ['reason' => $reason]);
        return $memento;
    }

    /** Deshacer: devuelve el mercado a la última instantánea guardada. */
    public function undo(): ?MarketMemento
    {
        $memento = $this->caretaker->pop();
        if ($memento === null) {
            return null;
        }
        $this->mediator?->restoreMarket($memento, $memento->reason);
        return $memento;
    }

    public function history(): array
    {
        return $this->caretaker->history();
    }

    public function count(): int
    {
        return $this->caretaker->count();
    }
}
