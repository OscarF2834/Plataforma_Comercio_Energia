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
});
