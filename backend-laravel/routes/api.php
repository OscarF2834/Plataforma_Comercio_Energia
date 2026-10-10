<?php

use App\Http\Controllers\EnergyController;
use Illuminate\Support\Facades\Route;

Route::prefix('energy')->group(function () {
    Route::post('/offers', [EnergyController::class, 'createOffer']);
    Route::post('/offers/express', [EnergyController::class, 'createExpressOffer']);
    Route::post('/offers/clone-template', [EnergyController::class, 'createOfferFromTemplate']);
    Route::post('/offers/{id}/clone', [EnergyController::class, 'cloneOffer']);
    Route::get('/offers', [EnergyController::class, 'getAvailableOffers']);
    Route::post('/offers/{id}/purchase', [EnergyController::class, 'purchaseOffer']);
    Route::get('/metrics', [EnergyController::class, 'getMetrics']);
    Route::get('/source-catalog', [EnergyController::class, 'getSourceCatalog']);
    Route::get('/prototype-templates', [EnergyController::class, 'getPrototypeTemplates']);
    Route::get('/predictions', [EnergyController::class, 'getPredictions']);

    // Patron Adapter: consumidos por el subsistema IoT y por los Adapter del frontend.
    Route::get('/legacy/meters', [EnergyController::class, 'getLegacyMeterDumps']);
    Route::get('/legacy/inverters', [EnergyController::class, 'getLegacyInverterPolls']);
    Route::get('/devices', [EnergyController::class, 'getDevices']);
    Route::get('/devices/telemetry/summary', [EnergyController::class, 'getTelemetrySummary']);
    Route::get('/devices/{deviceId}/telemetry', [EnergyController::class, 'getDeviceTelemetry']);

    // Patron Bridge: matriz de liquidaciones (perfil x moneda) y emision.
    Route::get('/settlements/matrix', [EnergyController::class, 'getSettlementMatrix']);
    Route::post('/settlements/quote', [EnergyController::class, 'quoteSettlement']);

    // Patron Decorator: catalogo de extras y cotizacion de una oferta decorada.
    Route::get('/extras', [EnergyController::class, 'getExtrasCatalog']);
    Route::post('/offers/quote-extras', [EnergyController::class, 'quoteWithExtras']);

    // Patron Composite: arbol de ejemplo y evaluacion de paquetes anidados.
    Route::get('/bundles/sample', [EnergyController::class, 'getSampleBundle']);
    Route::post('/bundles/evaluate', [EnergyController::class, 'evaluateBundle']);

    // Patron Facade: interfaz unificada a todos los subsistemas.
    Route::get('/platform/dashboard', [EnergyController::class, 'getPlatformDashboard']);
    Route::post('/platform/publish-surplus', [EnergyController::class, 'publishSurplus']);
    Route::post('/platform/buy', [EnergyController::class, 'buyEnergy']);
    Route::get('/platform/advice', [EnergyController::class, 'getSurplusAdvice']);
    Route::get('/platform/iot-status', [EnergyController::class, 'getIoTNetworkStatus']);
});
