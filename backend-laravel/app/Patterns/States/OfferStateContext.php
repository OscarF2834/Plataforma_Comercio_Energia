<?php

namespace App\Patterns\States;

use App\Models\EnergyOffer;

/**
 * Patron State — Contexto (rol «Context»).
 *
 * Mantiene una referencia al estado actual de la oferta y delega en
 * él el comportamiento de la compra. Las transiciones son automáticas
 * según la energía disponible que quede tras cada compra:
 *
 *   Available ──compra parcial──► PartiallySold ──llega a 0──► SoldOut
 */
class OfferStateContext
{
    public const STATE_NAMES = ['available', 'partially_sold', 'sold_out'];

    /** Resuelve el estado actual de la oferta (persistido o derivado). */
    public static function resolve(EnergyOffer $offer): OfferState
    {
        $state = match ($offer->state) {
            AvailableState::instance()->name() => AvailableState::instance(),
            PartiallySoldState::instance()->name() => PartiallySoldState::instance(),
            SoldOutState::instance()->name() => SoldOutState::instance(),
            default => self::derive($offer),
        };

        // Auto-corrección: el estado persistido nunca puede contradecir
        // la energía disponible real de la oferta.
        if ($state->name() !== self::derive($offer)->name()) {
            $state = self::derive($offer);
            $offer->state = $state->name();
        }

        return $state;
    }

    /** Deriva el estado a partir de la energía disponible (dato fuente). */
    public static function derive(EnergyOffer $offer): OfferState
    {
        if ($offer->availableKwh <= 0) {
            return SoldOutState::instance();
        }
        if ($offer->availableKwh < $offer->totalKwh) {
            return PartiallySoldState::instance();
        }
        return AvailableState::instance();
    }

    /** Nombre de estado derivado, para reconstruir ofertas sin 'state'. */
    public static function deriveName(float $availableKwh, float $totalKwh): string
    {
        if ($availableKwh <= 0) {
            return SoldOutState::instance()->name();
        }
        if ($availableKwh < $totalKwh) {
            return PartiallySoldState::instance()->name();
        }
        return AvailableState::instance()->name();
    }

    /**
     * Ejecuta una compra delegando en el estado actual y transiciona
     * el estado si la compra fue exitosa.
     */
    public static function handlePurchase(EnergyOffer $offer, int $kwh): array
    {
        $state = self::resolve($offer);
        $previous = $state->name();

        // El comportamiento depende del ESTADO (compra polimórfica).
        $result = $state->purchase($offer, $kwh);

        if ($result['success']) {
            $current = self::transition($offer);
            $offer->state = $current->name();
            $result['state'] = [
                'previous' => $previous,
                'current' => $current->name(),
                'label' => $current->label(),
                'changed' => $previous !== $current->name(),
            ];
        } else {
            $result['state'] = [
                'previous' => $previous,
                'current' => $previous,
                'label' => $state->label(),
                'changed' => false,
            ];
        }

        return $result;
    }

    /** Transición automática tras cambiar el stock disponible. */
    public static function transition(EnergyOffer $offer): OfferState
    {
        $state = self::derive($offer);
        $offer->state = $state->name();
        return $state;
    }
}
