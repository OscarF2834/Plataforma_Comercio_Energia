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
