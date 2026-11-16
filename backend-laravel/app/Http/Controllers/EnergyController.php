<?php

namespace App\Http\Controllers;

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
use App\Patterns\Flyweights\EnergySourceFlyweightFactory;
use App\Patterns\Iterators\OfferCollection;
use App\Patterns\Mediators\HistoryColleague;
use App\Patterns\Mediators\LoggerColleague;
use App\Patterns\Mediators\MarketServiceColleague;
use App\Patterns\Mediators\TransactionMediator;
use App\Patterns\Mementos\MarketCaretaker;
use App\Patterns\Observers\MetricsSnapshotObserver;
use App\Patterns\Proxies\MarketProxy;
use App\Patterns\Predictors\AbstractPredictor;
use App\Patterns\Prototypes\PrototypeRegistry;
use App\Patterns\States\OfferStateContext;
use App\Patterns\Visitors\MarketAuditVisitor;
use App\Patterns\Visitors\MarketReportVisitor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnergyController extends Controller
{
    private MarketProxy $marketProxy;
    private EnergySourceFlyweightFactory $sourceFlyweights;
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
    private TransactionMediator $mediator;
    private MarketCaretaker $caretaker;

    public function __construct()
    {
        // Patron Proxy: el MarketProxy sustituye al MarketService y controla
        // el acceso (caché de ofertas + protección de compras). Internamente
        // el Proxy crea el MarketService (Singleton) cuando hace falta.
        $this->marketProxy = MarketProxy::getInstance();

        // Patron Flyweight: pool compartido de descriptores por tipo de energía.
        $this->sourceFlyweights = EnergySourceFlyweightFactory::getInstance();

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

        // Patron Mediator: el mediador coordina Mercado + Registro de
        // actividad + Historial de instantáneas (Memento) en cada
        // publicación y compra. Los colegas ya no se conocen entre sí.
        $this->mediator = new TransactionMediator(
            new MarketServiceColleague(MarketProxy::getInstance()),
            new LoggerColleague(LoggerService::getInstance()),
            new HistoryColleague(new MarketCaretaker()),
        );

        // Patron Memento: guardian de las instantáneas del mercado.
        $this->caretaker = new MarketCaretaker();
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
            // Patron Mediator: el mediador coordina mercado + registro de
            // actividad (el controlador ya no orquesta a mano).
            $offer = $this->mediator->publishOffer($data);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

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
            $offer = $this->marketProxy->registerExpressOffer($data);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        $this->logger->incrementOffers();
        $this->logger->log("Oferta expres creada por {$data['producerName']} ({$offer->energyType})");

        return response()->json($offer->toArray(), 201);
    }

    public function getAvailableOffers(): JsonResponse
    {
        // Patron Proxy: usa el proxy para obtener ofertas (caché + virtual).
        $offers = array_map(
            fn ($o) => $o->toArray(),
            $this->marketProxy->getAvailableOffers()
        );

        // Patron Flyweight: enriquece cada oferta con su descriptor compartido.
        $offers = array_map(function (array $offer) {
            $type = $offer['energyType'] ?? '';
            if ($type === '') {
                return $offer;
            }

            return array_merge(
                $offer,
                ['energySource' => $this->sourceFlyweights->describe($type)]
            );
        }, $offers);

        return response()->json($offers);
    }

    public function purchaseOffer(int $id, Request $request): JsonResponse
    {
        $data = $request->validate(['kwh' => 'required|numeric|min:1']);

        // Patron Mediator: el mediador coordina la compra completa:
        // 1) captura una instantánea del mercado (Memento),
        // 2) el Proxy protege y ejecuta la compra,
        // 3) el Logger registra el resultado.
        $result = $this->mediator->purchaseOffer($id, (int) round($data['kwh']));

        return response()->json($result);
    }

    public function getMetrics(): JsonResponse
    {
        return response()->json([
            'market' => $this->marketProxy->getMetrics(),
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

        $marketContext = $this->marketProxy->getMarketContext();

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
            $offer = $this->marketProxy->cloneOffer($id, $adjustments);
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
            $offer = $this->marketProxy->createOfferFromTemplate($data['energyType'], $data);
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
    // Patron Flyweight: estadísticas del pool de descriptores de energía.
    // ------------------------------------------------------------------

    public function getFlyweightStats(): JsonResponse
    {
        $this->logger->log('Consulta de estadísticas del Flyweight (descriptores compartidos por tipo de energia)');
        return response()->json($this->sourceFlyweights->getStats());
    }

    // ------------------------------------------------------------------
    // Patron Proxy: estado de la caché y políticas.
    // ------------------------------------------------------------------

    public function getProxyStats(): JsonResponse
    {
        $this->logger->log('Consulta de estadísticas del Proxy (caché y protección de compras)');
        return response()->json([
            'cache' => $this->marketProxy->getCacheStatus(),
            'config' => $this->config->getAll(),
        ]);
    }

    public function getPlatformDashboard(): JsonResponse
    {
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

    // ------------------------------------------------------------------
    // Patron Iterator: recorrer el mercado con distintas estrategias sin
    // exponer el arreglo interno de ofertas.
    // ------------------------------------------------------------------

    public function iterateOffers(Request $request): JsonResponse
    {
        $strategy = (string) $request->query('strategy', 'available');
        $energyType = strtolower((string) $request->query('energyType', ''));

        try {
            // La colección agregada crea el iterador concreto según la estrategia.
            $iterator = $this->marketProxy
                ->getOfferCollection()
                ->createIterator($strategy, ['energyType' => $energyType]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        // Recorrido con la interfaz hasNext()/next(): el cliente nunca
        // toca el arreglo de ofertas del mercado.
        $offers = [];
        $walked = 0;
        while ($iterator->hasNext()) {
            $offer = $iterator->next();
            $walked++;
            if ($offer !== null) {
                $offers[] = $offer->toArray();
            }
        }

        $totalKwh = round(array_sum(array_map(fn ($o) => $o['availableKwh'], $offers)), 2);
        $avgPrice = $offers !== []
            ? round(array_sum(array_map(fn ($o) => $o['pricePerKwh'], $offers)) / count($offers), 2)
            : 0.0;

        $this->logger->log("Consulta del mercado con el patron Iterator (estrategia: {$strategy})");

        return response()->json([
            'strategy' => $strategy,
            'filters' => $strategy === 'type' ? ['energyType' => $energyType] : [],
            'total' => count($offers),
            'walked' => $walked,
            'totalAvailableKwh' => $totalKwh,
            'avgPricePerKwh' => $avgPrice,
            'offers' => $offers,
        ]);
    }

    // ------------------------------------------------------------------
    // Patron Mediator: estadísticas del mediador de transacciones.
    // ------------------------------------------------------------------

    public function getMediatorStats(): JsonResponse
    {
        $this->logger->log('Consulta de estadísticas del Mediator (coordinación compra/venta)');
        return response()->json($this->mediator->getStats());
    }

    // ------------------------------------------------------------------
    // Patron Memento: historial de instantáneas del mercado y deshacer
    // la última compra (el mediador restaura el estado anterior).
    // ------------------------------------------------------------------

    public function getMarketHistory(): JsonResponse
    {
        return response()->json([
            'snapshots' => $this->mediator->getMarketHistory(),
            'count' => $this->caretaker->count(),
        ]);
    }

    public function undoLastPurchase(): JsonResponse
    {
        $result = $this->mediator->undoLastPurchase();
        return response()->json($result, $result['success'] ? 200 : 404);
    }

    // ------------------------------------------------------------------
    // Patron Observer: estadísticas de los observadores del mercado.
    // ------------------------------------------------------------------

    public function getObserverStats(): JsonResponse
    {
        $subject = $this->marketProxy->getMarketSubject();

        $this->logger->log('Consulta de estadísticas del Observer (observadores del mercado)');
        return response()->json([
            'observers' => $subject->observerNames(),
            'eventsHandled' => $subject->countEvents(),
            'recentEvents' => array_slice($subject->getEventLog(), -5),
            'metrics' => (new MetricsSnapshotObserver())->getStats(),
        ]);
    }

    // ------------------------------------------------------------------
    // Patron State: ciclo de vida de las ofertas del mercado.
    // ------------------------------------------------------------------

    public function getOfferStates(): JsonResponse
    {
        $states = [];
        $summary = [];

        // El Iterator provee todas las ofertas; se resuelve el estado de cada una.
        foreach ($this->marketOffers() as $offer) {
            $state = OfferStateContext::resolve($offer);
            $states[] = [
                'id' => $offer->id,
                'producerName' => $offer->producerName,
                'energyType' => $offer->energyType,
                'totalKwh' => $offer->totalKwh,
                'availableKwh' => $offer->availableKwh,
                'state' => [
                    'name' => $state->name(),
                    'label' => $state->label(),
                    'color' => $state->color(),
                    'canPurchase' => $state->canPurchase(),
                ],
            ];
            $summary[$state->label()] = ($summary[$state->label()] ?? 0) + 1;
        }

        $this->logger->log('Consulta de estados del ciclo de vida de las ofertas (State)');
        return response()->json([
            'states' => $states,
            'summary' => $summary,
        ]);
    }

    /** Todas las ofertas del mercado (incluidas las agotadas). */
    private function marketOffers(): array
    {
        // Se accede al subject real vía el proxy: la colección envuelve todas.
        $collection = $this->marketProxy->getOfferCollection();
        $iterator = $collection->createIterator('cheapest');
        $offers = [];
        while ($iterator->hasNext()) {
            $offer = $iterator->next();
            if ($offer !== null) {
                $offers[] = $offer;
            }
        }
        return $offers;
    }

    // ------------------------------------------------------------------
    // Patron Visitor: reporte y auditoría del inventario del mercado.
    // ------------------------------------------------------------------

    public function getVisitorReport(Request $request): JsonResponse
    {
        $type = (string) $request->query('type', 'report');

        // Visitante concreto elegido por parámetro: mismo recorrido,
        // operación distinta.
        $visitor = match ($type) {
            'audit' => new MarketAuditVisitor(),
            'report' => new MarketReportVisitor(),
            default => null,
        };

        if ($visitor === null) {
            return response()->json(['error' => "Tipo de visitante no soportado: {$type}"], 422);
        }

        // Elementos del inventario: ofertas (todas), fuentes de energía
        // y telemetría de la red IoT. Cada uno se acepta con doble despacho.
        foreach ($this->marketOffers() as $offer) {
            $offer->accept($visitor);
        }
        foreach ($this->sourceFactory->createAll() as $source) {
            $source->accept($visitor);
        }
        foreach ($this->devices->allTelemetry() as $telemetry) {
            $telemetry->accept($visitor);
        }

        $this->logger->log("Consulta del inventario con el patron Visitor (visitante: {$type})");
        return response()->json($visitor->result());
    }
}
