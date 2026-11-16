<?php

namespace App\Patterns\Mediators;

/**
 * Patron Mediator — Interfaz del colega (rol «Colleague»).
 *
 * Todos los subsistemas que participan en la coordinación de la
 * plataforma (mercado, log, historial) implementan esta interfaz:
 * guardan una referencia al mediador y le notifican eventos, pero
 * NUNCA se comunican directamente entre sí.
 */
interface Colleague
{
    /** El mediador se inyecta al registrar el colega. */
    public function setMediator(TransactionMediator $mediator): void;

    /** Nombre visible del colega (para el panel de estadísticas). */
    public function getName(): string;
}
