<?php

namespace App\Patterns;

class ConfigService
{
    private static ?ConfigService $instance = null;

    private array $config = [
        'marketName' => 'Plataforma de Comercio de Energia',
        'defaultPricePerKwh' => 500,
        'currency' => 'COP',
        'maxOfferKwh' => 1000,
        // Politica usada por el Proxy de protección (MarketProxy).
        'minPurchaseKwh' => 1,
        'maxPurchaseKwh' => 100,
        // TTL (segundos) de la caché del Proxy de caché (MarketProxy).
        'offersCacheTtl' => 10,
    ];

    private function __construct() {}

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function get(string $key): mixed
    {
        return $this->config[$key] ?? null;
    }

    public function getAll(): array
    {
        return $this->config;
    }
}
