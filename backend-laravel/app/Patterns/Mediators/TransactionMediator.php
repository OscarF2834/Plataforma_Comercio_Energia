<?php

namespace App\Patterns\Mediators;

use App\Models\EnergyOffer;
use App\Patterns\Mementos\MarketMemento;

/**
 * Patron Mediator — Mediador concreto (rol «Mediator»).
 *
 * Centraliza la coordinación de la compra y venta de excedentes: el
 * Mercado, el Registro de actividad y el Historial (mementos) ya NO se
 * conocen entre sí — solo hablan con el mediador.
 *
 * Antes el controlador orquestaba a mano: comprar → incrementar
 * transacciones → escribir log. Ahora esa coreografía vive aquí:
 *
 *   purchaseOffer():  HistoryColleague captura el memento (Memento) →
 *                     MarketServiceColleague ejecuta la compra →
 *                     LoggerColleague registra el resultado.
 */
class TransactionMediator
{
    /** @var Colleague[] Colegas registrados. */
    private array $colleagues = [];

    /** @var array Registro de eventos coordinados (persistido, para el panel). */
    private array $eventLog = [];

    private string $dataFile;

    public function __construct(
        private MarketServiceColleague $market,
        private LoggerColleague $logger,
        private HistoryColleague $history,
    ) {
        $this->dataFile = storage_path('app/mediator_events.json');
        $this->loadEvents();

        foreach ([$market, $logger, $history] as $colleague) {
            $colleague->setMediator($this);
            $this->colleagues[] = $colleague;
        }
    }

    private function loadEvents(): void
    {
        if (file_exists($this->dataFile)) {
            $this->eventLog = json_decode(file_get_contents($this->dataFile), true) ?? [];
        }
    }

    private function persistEvents(): void
    {
        file_put_contents($this->dataFile, json_encode($this->eventLog, JSON_PRETTY_PRINT));
    }

    // ------------------------------------------------------------------
    // Petición principal 1: publicar un excedente (venta).
    // ------------------------------------------------------------------

    public function publishOffer(array $data): EnergyOffer
    {
        // El mercado construye y registra la oferta (Builder + Prototype).
        $offer = $this->market->registerOffer($data);

        // El mediador notifica al registro de actividad.
        $this->logger->onOfferRegistered($offer->producerName, $offer->energyType);

        $this->record('offer.registered', "Oferta #{$offer->id} de {$offer->producerName}");
        $this->market->notifyMarketContext();

        return $offer;
    }

    // ------------------------------------------------------------------
    // Petición principal 2: comprar energía (coordina Memento + mercado).
    // ------------------------------------------------------------------

    public function purchaseOffer(int $id, int $kwh): array
    {
        // 1) El historial captura una instantánea ANTES de la compra (Memento).
        $this->history->snapshotBefore("Antes de comprar {$kwh} kWh en oferta #{$id}");

        // 2) El mercado aplica la compra (con la política del Proxy).
        $result = $this->market->purchaseOffer($id, $kwh);

        // 3) El mediador coordina el registro según el resultado.
        if ($result['success']) {
            $this->logger->onPurchaseSucceeded($id, $kwh);
            $this->record('offer.purchased', "Compra de {$kwh} kWh en oferta #{$id}");
            $this->market->notifyMarketContext();
        } else {
            $reason = $result['message'] ?? 'compra rechazada';
            $this->logger->onPurchaseRejected($id, $kwh, $reason);
            $this->record('offer.purchase.rejected', $reason);
        }

        return $result;
    }

    // ------------------------------------------------------------------
    // Deshacer la última compra (uso del memento guardado).
    // ------------------------------------------------------------------

    public function undoLastPurchase(): array
    {
        $memento = $this->history->undo();

        if ($memento === null) {
            $this->record('market.undo.empty', 'No hay instantáneas para restaurar');
            return [
                'success' => false,
                'message' => 'No hay compras para deshacer: el historial de instantáneas está vacío.',
            ];
        }

        $this->record('market.restored', "Mercado restaurado ({$memento->reason})");

        return [
            'success' => true,
            'message' => 'Compra deshecha: el mercado volvió al estado anterior.',
            'restoredTo' => [
                'reason' => $memento->reason,
                'createdAt' => $memento->createdAt,
                'transactionCount' => $memento->transactionCount,
            ],
            'market' => $this->market->getMarketContext(),
        ];
    }

    public function getMarketHistory(): array
    {
        return $this->history->history();
    }

    // ------------------------------------------------------------------
    // Comunicación entre colegas: solo pasa por el mediador.
    // ------------------------------------------------------------------

    /** Un colega notifica un evento; el mediador decide qué hacer. */
    public function notify(Colleague $sender, string $event, array $payload = []): void
    {
        $this->record($event, $sender->getName());
    }

    /** El historial pide al mercado (vía mediador) una instantánea. */
    public function requestMemento(string $reason): MarketMemento
    {
        return $this->market->createMemento($reason);
    }

    /** El historial pide al mercado (vía mediador) restaurarse. */
    public function restoreMarket(MarketMemento $memento, string $reason): void
    {
        $this->market->restoreFromMemento($memento);
        $this->logger->onMarketRestored($reason);
    }

    /** Estadísticas para el panel de patrones. */
    public function getStats(): array
    {
        return [
            'colleagues' => array_map(fn (Colleague $c) => $c->getName(), $this->colleagues),
            'eventsHandled' => count($this->eventLog),
            'recentEvents' => array_slice($this->eventLog, -5),
            'snapshots' => $this->history->count(),
        ];
    }    private function record(string $event, string $detail): void
    {
        $this->eventLog[] = [
            'event' => $event,
            'detail' => $detail,
            'at' => now()->toIso8601String(),
        ];
        if (count($this->eventLog) > 50) {
            $this->eventLog = array_slice($this->eventLog, -50);
        }
        $this->persistEvents();
    }
}
