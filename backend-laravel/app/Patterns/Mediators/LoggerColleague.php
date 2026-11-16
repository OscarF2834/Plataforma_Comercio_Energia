<?php

namespace App\Patterns\Mediators;

use App\Patterns\LoggerService;

/**
 * Patron Mediator — Colega concreto «Registro de actividad».
 *
 * Encapsula al Singleton LoggerService. Atiende las notificaciones del
 * mediador (incrementar contadores, escribir eventos) sin conocer al
 * mercado ni al historial: solo responde a lo que el mediador le envía.
 */
class LoggerColleague implements Colleague
{
    private ?TransactionMediator $mediator = null;

    public function __construct(private LoggerService $logger) {}

    public function setMediator(TransactionMediator $mediator): void
    {
        $this->mediator = $mediator;
    }

    public function getName(): string
    {
        return 'Registro de actividad (LoggerService)';
    }

    /** Notificación del mediador: registrar una oferta nueva. */
    public function onOfferRegistered(string $producer, string $energyType): void
    {
        $this->logger->incrementOffers();
        $this->logger->log("Oferta creada por {$producer} ({$energyType}) via Mediator");
    }

    /** Notificación del mediador: registrar una compra exitosa. */
    public function onPurchaseSucceeded(int $offerId, int $kwh): void
    {
        $this->logger->incrementTransactions();
        $this->logger->log("Compra de {$kwh} KWh en oferta #{$offerId} via Mediator");
    }

    /** Notificación del mediador: una compra fue rechazada. */
    public function onPurchaseRejected(int $offerId, int $kwh, string $reason): void
    {
        $this->logger->log("Mediator: compra rechazada en oferta #{$offerId} ({$kwh} kWh): {$reason}");
    }

    /** Notificación del mediador: guardar un punto de restauración. */
    public function onMementoSaved(string $reason): void
    {
        $this->logger->log("Mediator: instantánea del mercado guardada ({$reason})");
    }

    /** Notificación del mediador: el mercado volvió a un punto anterior. */
    public function onMarketRestored(string $reason): void
    {
        $this->logger->log("Mediator: mercado restaurado a una instantánea anterior ({$reason})");
    }
}
