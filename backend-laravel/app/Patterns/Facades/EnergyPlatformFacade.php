<?php

namespace App\Patterns\Facades;

use App\Models\EnergyOffer;
use App\Patterns\Adapters\DeviceGatewayRegistry;
use App\Patterns\Adapters\DeviceMonitorService;
use App\Patterns\Bridges\SettlementService;
use App\Patterns\Composite\BundleService;
use App\Patterns\ConfigService;
use App\Patterns\Decorators\OfferPricingService;
use App\Patterns\Factories\PredictorFactory;
use App\Patterns\LoggerService;
use App\Patterns\MarketService;
use App\Patterns\Predictors\AbstractPredictor;

/**
 * Patron Facade.
 *
 * Proporciona una interfaz simplificada y unificada a los subsistemas
 * de la plataforma (mercado de excedentes, prediccion, dispositivos IoT,
 * liquidaciones, extras y paquetes de energia).
 *
 * El controlador y el frontend ya NO necesitan conocer cada servicio
 * interno (Singleton, Adapter, Bridge, Decorator, Composite, Factory
 * Method): el Facade es el unico punto de entrada y coordina todo.
 */
class EnergyPlatformFacade
{
    private MarketService $market;
    private LoggerService $logger;
    private ConfigService $config;
    private PredictorFactory $predictors;
    private DeviceMonitorService $devices;
    private SettlementService $settlements;
    private OfferPricingService $pricing;
    private BundleService $bundles;

    public function __construct()
    {
        // El Facade es el unico modulo que conoce a todos los
        // subsistemas internos y sus dependencias.
        $this->market = MarketService::getInstance();
        $this->logger = LoggerService::getInstance();
        $this->config = ConfigService::getInstance();
        $this->predictors = new PredictorFactory();

        $this->devices = new DeviceMonitorService((new DeviceGatewayRegistry())->all());
        $this->settlements = new SettlementService();
        $this->pricing = new OfferPricingService();
        $this->bundles = new BundleService();
    }

    /**
     * Panel unificado de la plataforma: UNA sola llamada agrega el
     * estado del mercado, las ofertas disponibles, la red IoT, la
     * configuracion global y la actividad reciente.
     */
    public function getDashboard(): array
    {
        return [
            'market' => $this->market->getMarketContext(),
            'offers' => array_map(
                fn(EnergyOffer $offer) => $offer->toArray(),
                $this->market->getAvailableOffers()
            ),
            'iot' => $this->devices->getSummary(),
            'config' => $this->config->getAll(),
            'activity' => $this->logger->getMetrics(),
        ];
    }

    /**
     * Publicar un excedente: construye la oferta (Builder), la registra
     * en el mercado, contabiliza la oferta y lo deja en el log.
     * El cliente envia los datos; el Facade orquesta el resto.
     */
    public function publishSurplus(array $data): array
    {
        $offer = $this->market->registerOffer($data);

        $this->logger->incrementOffers();
        $this->logger->log("Oferta creada por {$offer->producerName} ({$offer->energyType}) via Facade");

        return [
            'offer' => $offer->toArray(),
            'market' => $this->market->getMarketContext(),
        ];
    }

    /**
     * Comprar energia: ejecuta la compra en el mercado y, en la misma
     * operacion, emite la liquidacion (Bridge) de la energia adquirida
     * segun el perfil y la moneda solicitados.
     */
    public function buyEnergy(int $offerId, float $kwh, string $profile = 'residential', string $currency = 'COP'): array
    {
        $purchase = $this->market->purchaseOffer($offerId, (int) round($kwh));

        if (!($purchase['success'] ?? false)) {
            return [
                'success' => false,
                'message' => $purchase['message'] ?? 'Compra fallida',
            ];
        }

        $this->logger->incrementTransactions();
        $this->logger->log("Compra de {$kwh} KWh en oferta #{$offerId} via Facade");

        // Liquidacion de la energia adquirida (Bridge) en la misma operacion.
        $offer = $this->market->getOfferById($offerId);
        $bill = $this->settlements->quote($profile, $currency, [
            'kwh' => $kwh,
            'pricePerKwh' => $offer?->pricePerKwh ?? 0.0,
        ]);

        return [
            'success' => true,
            'message' => $purchase['message'],
            'purchase' => [
                'offerId' => $offerId,
                'kwh' => $kwh,
                'pricePerKwh' => $offer?->pricePerKwh ?? 0.0,
            ],
            'bill' => $bill,
            'market' => $this->market->getMarketContext(),
        ];
    }

    /**
     * Asesoria de excedente: genera las predicciones (Abstract Method)
     * ligadas al estado real del mercado y resume la accion sugerida.
     */
    public function getSurplusAdvice(float $production, float $consumption): array
    {
        $marketContext = $this->market->getMarketContext();

        $predictions = array_map(
            fn(AbstractPredictor $predictor) => $predictor->predict(),
            $this->predictors->createAll($production, $consumption, $marketContext)
        );

        return [
            'predictions' => $predictions,
            'market' => $marketContext,
            'advice' => $this->buildAdvice($predictions, $marketContext),
        ];
    }

    /**
     * Estado de la red IoT: inventario normalizado (Adapter) y resumen
     * consolidado de la red domestica.
     */
    public function getIoTNetworkStatus(): array
    {
        return [
            'summary' => $this->devices->getSummary(),
            'devices' => $this->devices->listDevices(),
        ];
    }

    /**
     * Resumen accionable de la prediccion diaria para apoyar la
     * toma de decisiones (objetivo especifico de prediccion).
     */
    private function buildAdvice(array $predictions, array $marketContext): string
    {
        $daily = $predictions[0] ?? null;

        if ($daily === null) {
            return 'No hay datos suficientes para emitir una recomendacion.';
        }

        $available = $marketContext['totalAvailableKwh'] ?? 0;
        $activeOffers = $marketContext['activeOffers'] ?? 0;
        $avgPrice = $marketContext['avgPricePerKwh'] ?? 0;

        return match ($daily['action'] ?? 'none') {
            'publish' => "VENDER: publica el excedente estimado de {$daily['surplusEstimate']} kWh; el mercado promedia {$avgPrice} COP/kWh en {$activeOffers} ofertas activas.",
            'buy' => "COMPRAR: cubre el deficit estimado de {$daily['deficitEstimate']} kWh; el mercado dispone de {$available} kWh en {$activeOffers} ofertas activas.",
            default => 'EQUILIBRADO: tu produccion estimada cubre tu consumo; no necesitas comprar ni vender.',
        };
    }
}
