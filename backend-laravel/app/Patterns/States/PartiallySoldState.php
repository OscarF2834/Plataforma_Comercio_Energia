<?php

namespace App\Patterns\States;

use App\Models\EnergyOffer;

/**
 * Patron State — Estado concreto «Parcialmente vendida».
 *
 * Parte de la energía ya fue comprada pero queda stock disponible.
 * La compra sigue permitiéndose; el contexto decidirá si transiciona
 * a «Agotada» cuando llegue a cero.
 */
class PartiallySoldState implements OfferState
{
    private static ?PartiallySoldState $instance = null;

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
        return 'partially_sold';
    }

    public function label(): string
    {
        return 'Parcialmente vendida';
    }

    public function color(): string
    {
        return '#f39c12';
    }

    public function canPurchase(): bool
    {
        return true;
    }

    public function purchase(EnergyOffer $offer, int $kwh): array
    {
        if ($kwh > $offer->availableKwh) {
            return [
                'success' => false,
                'message' => "KWh insuficientes: quedan {$offer->availableKwh} kWh en esta oferta",
            ];
        }

        $offer->availableKwh -= $kwh;
        return ['success' => true, 'message' => "Compra exitosa de {$kwh} KWh"];
    }
}
