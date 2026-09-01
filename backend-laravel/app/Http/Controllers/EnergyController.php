<?php

namespace App\Http\Controllers;

use App\Patterns\MarketService;
use App\Patterns\LoggerService;
use App\Patterns\ConfigService;
use App\Patterns\Factory\EnergyOfferFactory;
use App\Patterns\Factory\SolarOfferFactory;
use App\Patterns\Factory\WindOfferFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnergyController extends Controller
{
    private MarketService $market;
    private LoggerService $logger;
    private ConfigService $config;

    public function __construct()
    {
        $this->market = MarketService::getInstance();
        $this->logger = LoggerService::getInstance();
        $this->config = ConfigService::getInstance();
    }

    public function createOffer(Request $request): JsonResponse
    {
        $data = $request->validate([
            'producerName' => 'required|string',
            'totalKwh' => 'required|numeric|min:1',
            'pricePerKwh' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'type' => 'required|string|in:solar,wind',
        ]);

        $factory = $this->getFactory($data['type']);

        $offer = $factory->buildOffer($data);

        $marketOffer = $this->market->registerOffer(
            $offer->getData()
        );

        $this->logger->incrementOffers();

        $this->logger->log(
            "Oferta {$offer->getType()} creada por {$data['producerName']}"
        );

        return response()->json(
            $marketOffer->toArray(),
            201
        );
    }

    /**
     * Selecciona el Factory Concreteo.
     */
    private function getFactory(string $type): EnergyOfferFactory
    {
        return match ($type) {
            'solar' => new SolarOfferFactory(),
            'wind' => new WindOfferFactory(),

            default => throw new \InvalidArgumentException(
                "Tipo de energía no soportado: {$type}"
            ),
        };
    }

    public function getAvailableOffers(): JsonResponse
    {
        $offers = array_map(
            fn($o) => $o->toArray(),
            $this->market->getAvailableOffers()
        );

        return response()->json($offers);
    }

    public function purchaseOffer(
        int $id,
        Request $request
    ): JsonResponse {
        $data = $request->validate([
            'kwh' => 'required|numeric|min:1'
        ]);

        $result = $this->market->purchaseOffer(
            $id,
            $data['kwh']
        );

        if ($result['success']) {
            $this->logger->incrementTransactions();

            $this->logger->log(
                "Compra de {$data['kwh']} KWh en oferta #{$id}"
            );
        }

        return response()->json($result);
    }

    public function getMetrics(): JsonResponse
    {
        return response()->json([
            'market' => $this->market->getMetrics(),
            'logger' => $this->logger->getMetrics(),
            'config' => $this->config->getAll(),
        ]);
    }
}