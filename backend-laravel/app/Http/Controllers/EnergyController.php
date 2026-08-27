<?php

namespace App\Http\Controllers;

use App\Patterns\MarketService;
use App\Patterns\LoggerService;
use App\Patterns\ConfigService;
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
        ]);

        $offer = $this->market->registerOffer($data);
        $this->logger->incrementOffers();
        $this->logger->log("Oferta creada por {$data['producerName']}");

        return response()->json($offer->toArray(), 201);
    }

    public function getAvailableOffers(): JsonResponse
    {
        $offers = array_map(
            fn($o) => $o->toArray(),
            $this->market->getAvailableOffers()
        );

        return response()->json($offers);
    }

    public function purchaseOffer(int $id, Request $request): JsonResponse
    {
        $data = $request->validate(['kwh' => 'required|numeric|min:1']);

        $result = $this->market->purchaseOffer($id, $data['kwh']);

        if ($result['success']) {
            $this->logger->incrementTransactions();
            $this->logger->log("Compra de {$data['kwh']} KWh en oferta #{$id}");
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
