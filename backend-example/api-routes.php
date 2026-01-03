<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes - AMALI Payment System
|--------------------------------------------------------------------------
*/

Route::prefix('payment')->group(function () {
    
    // Initier un paiement
    Route::post('/initiate/orange-money', [PaymentController::class, 'initiateOrangeMoney']);
    Route::post('/initiate/wave', [PaymentController::class, 'initiateWave']);
    
    // Webhook de notification (appelé par Orange Money ou Wave)
    Route::post('/notify', [PaymentController::class, 'notify']);
    
    // Vérifier le statut d'un paiement
    Route::post('/verify', [PaymentController::class, 'verify']);
    
    // Obtenir l'historique des paiements d'un utilisateur
    Route::get('/history/{userId}', [PaymentController::class, 'history']);
    
});

/*
|--------------------------------------------------------------------------
| Exemple d'utilisation depuis le frontend
|--------------------------------------------------------------------------
|
| // Dans payment-page/index.html
|
| async function processPayment() {
|     const response = await fetch('https://api.amali-app.com/api/payment/initiate/orange-money', {
|         method: 'POST',
|         headers: {
|             'Content-Type': 'application/json',
|             'Accept': 'application/json'
|         },
|         body: JSON.stringify({
|             plan: 'elite',
|             user_id: '123',
|             phone: '221771234567',
|             email: 'user@example.com'
|         })
|     });
|
|     const data = await response.json();
|     
|     if (data.success && data.payment_url) {
|         // Rediriger vers la page de paiement Orange Money
|         window.location.href = data.payment_url;
|     }
| }
|
*/
