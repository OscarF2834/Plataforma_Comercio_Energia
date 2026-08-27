<?php

use App\Http\Controllers\EnergyController;
use Illuminate\Support\Facades\Route;

Route::prefix('energy')->group(function () {
    Route::post('/offers', [EnergyController::class, 'createOffer']);
    Route::get('/offers', [EnergyController::class, 'getAvailableOffers']);
    Route::post('/offers/{id}/purchase', [EnergyController::class, 'purchaseOffer']);
    Route::get('/metrics', [EnergyController::class, 'getMetrics']);
});
