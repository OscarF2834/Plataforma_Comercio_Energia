<?php

namespace App\Patterns\States;

use App\Models\EnergyOffer;

/**
 * Patron State — Estado concreto «Disponible».
 *
 * La oferta tiene TODA su energía sin vender. La compra se permite
 * mientras alcance la cantidad pedida; al comprar se descuenta del
 * stock y el contexto decide la transición de estado.
 */
class AvailableState implements OfferState
{
    private static ?AvailableState $instance = null;

    private function __construct() {}

    public static function instance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function name(): string
    {
        return 'available';
    }

    public function label(): string
    {
        return 'Disponible';
    }

    public function color(): string
    {
        return '#16c784';
    }

    public function canPurchase(): bool
    {
        return true;
    }

    public function purchase(EnergyOffer $offer, int $kwh): array
    {
        if ($kwh > $offer->availableKwh) {
            return ['success' => false, 'message' => 'KWh insuficientes disponibles'];
        }

        $offer->availableKwh -= $kwh;
        return ['success' => true, 'message' => "Compra exitosa de {$kwh} KWh"];
    }
}
