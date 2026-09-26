<?php

namespace App\Patterns\Bridges;

/**
 * Patron Bridge - CLIENTE.
 *
 * Compone las dos jerarquias: elige una abstraccion refinada (EnergyBill)
 * y un implementor concreto (CurrencyBridge) y las conecta. Es el unico
 * punto del sistema que conoce ambas clases concretas; ni EnergyBill ni
 * CurrencyBridge se conocen entre si.
 *
 * El producto cartesiano perfiles x monedas se soporta sin condicionales
 * anidados: por eso la matriz de liquidaciones es 2 x 3 y no 6 clases.
 */
class SettlementService
{
    /** @var array<string, CurrencyBridge> */
    private array $currencies;

    /** @var array<string, class-string<EnergyBill>> */
    private array $profiles;

    public function __construct()
    {
        $currencies = [new CopCurrency(), new UsdCurrency(), new EurCurrency()];

        $this->currencies = [];
        foreach ($currencies as $currency) {
            $this->currencies[$currency->getCode()] = $currency;
        }

        $this->profiles = [
            ResidentialBill::PROFILE => ResidentialBill::class,
            CommercialBill::PROFILE => CommercialBill::class,
        ];
    }

    /** @return array<int, array<string, mixed>> */
    public function getCurrencies(): array
    {
        return array_values(array_map(fn(CurrencyBridge $c) => $c->toArray(), $this->currencies));
    }

    /** @return array<int, array{key: string, name: string, description: string}> */
    public function getProfiles(): array
    {
        $profiles = [];

        foreach ($this->profiles as $key => $class) {
            $profile = new $class(new CopCurrency());
            $profiles[] = [
                'key' => $profile->getProfileKey(),
                'name' => $profile->getProfileName(),
                'description' => $profile->getProfileDescription(),
            ];
        }

        return $profiles;
    }

    /**
     * Matriz de combinaciones soportadas: evidencia de que abstraccion e
     * implementor varian de forma independiente.
     */
    public function getMatrix(): array
    {
        $combinations = [];

        foreach ($this->getProfiles() as $profile) {
            foreach ($this->getCurrencies() as $currency) {
                $combinations[] = $profile['key'] . '+' . $currency['code'];
            }
        }

        return [
            'profiles' => $this->getProfiles(),
            'currencies' => $this->getCurrencies(),
            'combinations' => $combinations,
            'totalCombinations' => count($combinations),
        ];
    }

    public function quote(string $profile, string $currencyCode, array $data): array
    {
        $bill = $this->createBill($profile, $this->resolveCurrency($currencyCode));

        return $bill->build($data);
    }

    /**
     * Instanciacion tipica del cliente en el patron Bridge:
     * una refinacion de la abstraccion + un implementor, sin herencia
     * entre ambas jerarquias.
     */
    private function createBill(string $profile, CurrencyBridge $currency): EnergyBill
    {
        $class = $this->profiles[$profile] ?? null;

        if ($class === null) {
            throw new \InvalidArgumentException('Perfil de liquidacion desconocido: ' . $profile);
        }

        return new $class($currency);
    }

    private function resolveCurrency(string $code): CurrencyBridge
    {
        $currency = $this->currencies[$code] ?? null;

        if ($currency === null) {
            throw new \InvalidArgumentException('Moneda no soportada: ' . $code);
        }

        return $currency;
    }
}
