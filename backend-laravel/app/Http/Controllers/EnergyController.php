<?php

namespace App\Http\Controllers;

use App\Patterns\MarketService;
use App\Patterns\LoggerService;
use App\Patterns\ConfigService;
use App\Patterns\Factories\EnergySourceFactory;
use App\Patterns\Factories\PredictorFactory;
use App\Patterns\Predictors\AbstractPredictor;
use App\Patterns\Prototypes\PrototypeRegistry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnergyController extends Controller
{
    private MarketService $market;
    private LoggerService $logger;
    private ConfigService $config;
    private EnergySourceFactory $sourceFactory;
    private PredictorFactory $predictorFactory;

    public function __construct()
    {
        $this->market = MarketService::getInstance();
        $this->logger = LoggerService::getInstance();
        $this->config = ConfigService::getInstance();
        $this->sourceFactory = new EnergySourceFactory();
        $this->predictorFactory = new PredictorFactory();
    }

    public function createOffer(Request $request): JsonResponse
    {
        $data = $request->validate([
            'producerName' => 'required|string',
            'totalKwh' => 'required|numeric|min:1',
            'pricePerKwh' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'energyType' => 'nullable|string|in:solar,wind,hydro',
        ]);

        try {
            $offer = $this->market->registerOffer($data);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $this->logger->incrementOffers();
        $this->logger->log("Oferta creada por {$data['producerName']} ({$offer->energyType})");

        return response()->json($offer->toArray(), 201);
    }

    public function createExpressOffer(Request $request): JsonResponse
    {
        $data = $request->validate([
            'producerName' => 'required|string',
            'totalKwh' => 'required|numeric|min:1',
            'energyType' => 'required|string|in:solar,wind,hydro',
        ]);

        try {
            $offer = $this->market->registerExpressOffer($data);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $this->logger->incrementOffers();
        $this->logger->log("Oferta expres creada por {$data['producerName']} ({$offer->energyType})");

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

    public function getSourceCatalog(): JsonResponse
    {
        $sources = array_map(
            fn($source) => $source->toArray(),
            $this->sourceFactory->createAll()
        );

        return response()->json($sources);
    }

    public function getPredictions(Request $request): JsonResponse
    {
        $production = (float) $request->query('production', 0);
        $consumption = (float) $request->query('consumption', 0);

        $marketContext = $this->market->getMarketContext();

        $predictions = array_map(
            fn(AbstractPredictor $predictor) => $predictor->predict(),
            $this->predictorFactory->createAll($production, $consumption, $marketContext)
        );

        $this->logger->log("Consulta de predicciones (produccion: {$production}, consumo: {$consumption})");

        return response()->json($predictions);
    }

    public function cloneOffer(int $id, Request $request): JsonResponse
    {
        $adjustments = $request->validate([
            'producerName' => 'nullable|string',
            'totalKwh' => 'nullable|numeric|min:0.1',
            'pricePerKwh' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        try {
            // Patron Prototype: el backend clona la oferta existente.
            $offer = $this->market->cloneOffer($id, $adjustments);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }

        $this->logger->incrementOffers();
        $this->logger->log("Oferta #{$id} clonada con el patron Prototype (nueva oferta #{$offer->id})");

        return response()->json($offer->toArray(), 201);
    }

    public function getPrototypeTemplates(): JsonResponse
    {
        return response()->json(PrototypeRegistry::getInstance()->listTemplates());
    }

    public function createOfferFromTemplate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'energyType' => 'required|string|in:solar,wind,hydro',
            'producerName' => 'required|string',
            'totalKwh' => 'required|numeric|min:1',
            'pricePerKwh' => 'nullable|numeric|min:0',
        ]);

        try {
            // Patron Prototype: el backend clona la plantilla registrada.
            $offer = $this->market->createOfferFromTemplate($data['energyType'], $data);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $this->logger->incrementOffers();
        $this->logger->log("Oferta creada clonando la plantilla {$offer->energyType} (Prototype) por {$offer->producerName}");

        return response()->json($offer->toArray(), 201);
    }
}
