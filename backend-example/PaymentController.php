<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Initier un paiement Orange Money
     */
    public function initiateOrangeMoney(Request $request)
    {
        $validated = $request->validate([
            'plan' => 'required|string',
            'user_id' => 'required',
            'phone' => 'required|string',
            'email' => 'required|email'
        ]);

        // Configuration du plan
        $plans = [
            'essentiel' => 2900,
            'elite' => 4900,
            'prestige' => 7900,
            'prestige-femme' => 2000
        ];

        $amount = $plans[$validated['plan']] ?? 4900;

        // Créer l'enregistrement dans la base de données
        $payment = Payment::create([
            'user_id' => $validated['user_id'],
            'plan' => $validated['plan'],
            'amount' => $amount,
            'method' => 'orange-money',
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'status' => 'pending',
            'transaction_id' => 'TRX-' . time() . '-' . rand(1000, 9999)
        ]);

        // Appeler l'API Orange Money
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.orange.token'),
                'Content-Type' => 'application/json'
            ])->post('https://api.orange.com/orange-money-webpay/dev/v1/webpayment', [
                'merchant_key' => config('services.orange.merchant_key'),
                'currency' => 'XOF',
                'order_id' => $payment->transaction_id,
                'amount' => $amount,
                'return_url' => config('app.url') . '/payment/success',
                'cancel_url' => config('app.url') . '/payment/cancel',
                'notif_url' => config('app.url') . '/api/payment/notify',
                'lang' => 'fr',
                'reference' => $payment->id
            ]);

            $data = $response->json();

            if (isset($data['payment_url'])) {
                $payment->update(['payment_url' => $data['payment_url']]);
                
                return response()->json([
                    'success' => true,
                    'payment_url' => $data['payment_url'],
                    'transaction_id' => $payment->transaction_id
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'initialisation du paiement'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Orange Money Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur de connexion à Orange Money'
            ], 500);
        }
    }

    /**
     * Initier un paiement Wave
     */
    public function initiateWave(Request $request)
    {
        $validated = $request->validate([
            'plan' => 'required|string',
            'user_id' => 'required',
            'phone' => 'required|string',
            'email' => 'required|email'
        ]);

        $plans = [
            'essentiel' => 2900,
            'elite' => 4900,
            'prestige' => 7900,
            'prestige-femme' => 2000
        ];

        $amount = $plans[$validated['plan']] ?? 4900;

        // Créer l'enregistrement
        $payment = Payment::create([
            'user_id' => $validated['user_id'],
            'plan' => $validated['plan'],
            'amount' => $amount,
            'method' => 'wave',
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'status' => 'pending',
            'transaction_id' => 'WAVE-' . time() . '-' . rand(1000, 9999)
        ]);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.wave.api_key'),
                'Content-Type' => 'application/json'
            ])->post('https://api.wave.com/v1/checkout/sessions', [
                'amount' => $amount * 100, // Wave utilise les centimes
                'currency' => 'XOF',
                'error_url' => config('app.url') . '/payment/error',
                'success_url' => config('app.url') . '/payment/success?transaction=' . $payment->transaction_id,
                'metadata' => [
                    'payment_id' => $payment->id,
                    'user_id' => $validated['user_id'],
                    'plan' => $validated['plan']
                ]
            ]);

            $data = $response->json();

            if (isset($data['wave_launch_url'])) {
                $payment->update(['payment_url' => $data['wave_launch_url']]);
                
                return response()->json([
                    'success' => true,
                    'payment_url' => $data['wave_launch_url'],
                    'transaction_id' => $payment->transaction_id
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'initialisation du paiement Wave'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Wave Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur de connexion à Wave'
            ], 500);
        }
    }

    /**
     * Webhook de notification (appelé par Orange Money ou Wave)
     */
    public function notify(Request $request)
    {
        Log::info('Payment Notification Received', $request->all());

        // Vérifier la signature pour la sécurité
        // $signature = $request->header('X-Signature');
        // if (!$this->verifySignature($signature, $request->all())) {
        //     return response()->json(['error' => 'Invalid signature'], 403);
        // }

        $paymentId = $request->input('reference');
        $status = $request->input('status');
        $transactionId = $request->input('transaction_id');

        $payment = Payment::find($paymentId);

        if (!$payment) {
            Log::error('Payment not found: ' . $paymentId);
            return response()->json(['error' => 'Payment not found'], 404);
        }

        // Mettre à jour le statut
        $payment->update([
            'status' => $status === 'SUCCESS' ? 'completed' : 'failed',
            'external_transaction_id' => $transactionId,
            'completed_at' => $status === 'SUCCESS' ? now() : null
        ]);

        // Si paiement réussi, activer le Premium
        if ($status === 'SUCCESS') {
            $user = User::find($payment->user_id);
            
            $user->update([
                'premium_tier' => $payment->plan,
                'premium_started_at' => now(),
                'premium_expires_at' => now()->addMonth()
            ]);

            // Envoyer un email de confirmation
            // Mail::to($user->email)->send(new PremiumActivated($user, $payment));

            Log::info('Premium activated for user: ' . $user->id);
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function verify(Request $request)
    {
        $transactionId = $request->input('transaction_id');
        
        $payment = Payment::where('transaction_id', $transactionId)->first();

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'status' => $payment->status,
            'plan' => $payment->plan,
            'amount' => $payment->amount,
            'completed_at' => $payment->completed_at
        ]);
    }

    /**
     * Vérifier la signature du webhook
     */
    private function verifySignature($signature, $data)
    {
        $secret = config('services.orange.webhook_secret');
        $computed = hash_hmac('sha256', json_encode($data), $secret);
        
        return hash_equals($computed, $signature);
    }
}
