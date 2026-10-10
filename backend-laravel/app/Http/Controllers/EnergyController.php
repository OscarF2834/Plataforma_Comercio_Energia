<?php

namespace App\Http\Controllers;

use App\Patterns\MarketService;
use App\Patterns\LoggerService;
use App\Patterns\ConfigService;
use App\Patterns\Facades\EnergyPlatformFacade;
use App\Patterns\Adapters\DeviceGatewayRegistry;
use App\Patterns\Adapters\DeviceMonitorService;
use App\Patterns\Composite\BundleService;
use App\Patterns\Decorators\OfferPricingService;
use App\Patterns\Bridges\SettlementService;
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
    private DeviceMonitorService $devices;
    private DeviceGatewayRegistry $deviceRegistry;
    private SettlementService $settlements;
    private OfferPricingService $pricing;
    private BundleService $bundles;
    private EnergyPlatformFacade $platform;

    public function __construct()
    {
        $this->market = MarketService::getInstance();
        $this->logger = LoggerService::getInstance();
        $this->config = ConfigService::getInstance();
        $this->sourceFactory = new EnergySourceFactory();
        $this->predictorFactory = new PredictorFactory();

        // Patron Adapter: el registro arma un Adapter por dispositivo y el
        // cliente recibe gateways que solo cumpla la interfaz DeviceGateway.
        $this->deviceRegistry = new DeviceGatewayRegistry();
        $this->devices = new DeviceMonitorService($this->deviceRegistry->all());

        // Patron Bridge: el cliente compone abstraccion (EnergyBill) e
        // implementor (CurrencyBridge) segun el perfil y la moneda pedidos.
        $this->settlements = new SettlementService();

        // Patron Decorator: oferta base + extras envolvientes.
        $this->pricing = new OfferPricingService();

        // Patron Composite: paquetes de energia con totales recursivos.
        $this->bundles = new BundleService();

        // Patron Facade: interfaz unificada a TODOS los subsistemas.
        $this->platform = new EnergyPlatformFacade();
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

    public function getDevices(): JsonResponse
    {
        // Patron Adapter: inventario ya normalizado. El controlador solo
        // conoce la interfaz DeviceGateway, no los dispositivos heredados.
        $devices = $this->devices->listDevices();

        $this->logger->log('Consulta del inventario IoT: ' . count($devices) . ' dispositivos (Adapter)');

        return response()->json($devices);
    }

    public function getDeviceTelemetry(string $deviceId): JsonResponse
    {
        try {
            $telemetry = $this->devices->readTelemetry($deviceId);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }

        $this->logger->log("Telemetria de {$deviceId} normalizada por el Adapter ({$telemetry->provider})");

        return response()->json($telemetry->toArray());
    }

    public function getTelemetrySummary(): JsonResponse
    {
        return response()->json($this->devices->getSummary());
    }

    public function getLegacyMeterDumps(): JsonResponse
    {
        // Datos crudos del Adaptee (registros SCADA). Se exponen sin adaptar
        // para mostrar el "antes" y consumir el Adapter del frontend.
        return response()->json($this->deviceRegistry->rawMeterDumps());
    }

    public function getLegacyInverterPolls(): JsonResponse
    {
        // Datos crudos del Adaptee (payload JSON del inversor).
        return response()->json($this->deviceRegistry->rawInverterPolls());
    }

    public function getSettlementMatrix(): JsonResponse
    {
        // Patron Bridge: perfiles x monedas soportados.
        return response()->json($this->settlements->getMatrix());
    }

    public function quoteSettlement(Request $request): JsonResponse
    {
        $data = $request->validate([
            'profile' => 'required|string|in:residential,commercial',
            'currency' => 'required|string|in:COP,USD,EUR',
            'kwh' => 'required|numeric|min:0.1',
            'pricePerKwh' => 'required|numeric|min:0',
        ]);

        try {
            // Patron Bridge: el cliente conecta EnergyBill + CurrencyBridge.
            $bill = $this->settlements->quote($data['profile'], $data['currency'], $data);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $this->logger->log("Liquidacion {$bill['profile']} en {$bill['currency']} por {$data['kwh']} kWh: {$bill['totalFormatted']} (Bridge)");

        return response()->json($bill, 201);
    }

    public function getExtrasCatalog(): JsonResponse
    {
        // Patron Decorator: catalogo de decoradores disponibles para envolver una oferta.
        return response()->json($this->pricing->getExtrasCatalog());
    }

    public function quoteWithExtras(Request $request): JsonResponse
    {
        $data = $request->validate([
            'kwh' => 'required|numeric|min:0.1',
            'pricePerKwh' => 'required|numeric|min:0',
            'extras' => 'nullable|array',
            'extras.*' => 'string|in:green,insurance,priority',
        ]);

        try {
            // Patron Decorator: BasicOffer envuelto con los decoradores elegidos.
            $quote = $this->pricing->quote(
                (float) $data['kwh'],
                (float) $data['pricePerKwh'],
                $data['extras'] ?? [],
            );
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $this->logger->log("Cotizacion con extras (Decorator): +" . implode(',', $data['extras'] ?? []) . " -> {$quote['total']} COP");

        return response()->json($quote, 201);
    }

    public function getSampleBundle(): JsonResponse
    {
        // Patron Composite: arbol de demostracion con totales recursivos.
        return response()->json($this->bundles->getSampleTree());
    }

    public function evaluateBundle(Request $request): JsonResponse
    {
        $tree = $request->all();

        try {
            // Patron Composite: re-evalua el arbol JSON con totales recursivos.
            $evaluated = $this->bundles->evaluate($tree);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $this->logger->log("Paquete evaluado (Composite): {$evaluated['totalKwh']} kWh, {$evaluated['totalPrice']} COP");

        return response()->json($evaluated);
    }

    // ------------------------------------------------------------------
    // Patron Facade: una sola llamada coordina todos los subsistemas.
    // ------------------------------------------------------------------

    public function getPlatformDashboard(): JsonResponse
    {
        // Patron Facade: el panel unificado agrega mercado, ofertas,
        // red IoT, configuracion y actividad en UNA sola llamada.
        $this->logger->log('Consulta del panel unificado de la plataforma (Facade)');

        return response()->json($this->platform->getDashboard());
    }

    public function publishSurplus(Request $request): JsonResponse
    {
        $data = $request->validate([
            'producerName' => 'required|string',
            'totalKwh' => 'required|numeric|min:1',
            'pricePerKwh' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'energyType' => 'nullable|string|in:solar,wind,hydro',
        ]);

        try {
            // Patron Facade: construye (Builder), registra, contabiliza
            // y logea el excedente en una sola operacion.
            $result = $this->platform->publishSurplus($data);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        return response()->json($result, 201);
    }

    public function buyEnergy(Request $request): JsonResponse
    {
        $data = $request->validate([
            'offerId' => 'required|integer',
            'kwh' => 'required|numeric|min:0.1',
            'profile' => 'nullable|string|in:residential,commercial',
            'currency' => 'nullable|string|in:COP,USD,EUR',
        ]);

        // Patron Facade: compra en el mercado + liquidacion (Bridge)
        // de la energia adquirida, todo en una sola llamada.
        $result = $this->platform->buyEnergy(
            (int) $data['offerId'],
            (float) $data['kwh'],
            $data['profile'] ?? 'residential',
            $data['currency'] ?? 'COP',
        );

        return response()->json($result, $result['success'] ? 200 : 422);
    }

    public function getSurplusAdvice(Request $request): JsonResponse
    {
        $production = (float) $request->query('production', 0);
        $consumption = (float) $request->query('consumption', 0);

        // Patron Facade: predicciones (Abstract Method) + contexto
        // real del mercado + recomendacion accionable.
        $advice = $this->platform->getSurplusAdvice($production, $consumption);

        $this->logger->log("Asesoria de excedente via Facade (produccion: {$production}, consumo: {$consumption})");

        return response()->json($advice);
    }

    public function getIoTNetworkStatus(): JsonResponse
    {
        // Patron Facade: inventario + resumen de la red IoT.
        return response()->json($this->platform->getIoTNetworkStatus());
    }
}
