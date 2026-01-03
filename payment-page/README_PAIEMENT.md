# 💳 SYSTÈME DE PAIEMENT EXTERNE - GUIDE COMPLET

## 🎯 Pourquoi un paiement externe ?

### Avantages :
✅ **Pas de commission** Google (15-30%) et Apple (15-30%)
✅ **Évite les restrictions** des stores (compte dev personnel)
✅ **Plus de contrôle** sur les méthodes de paiement
✅ **Conforme** aux règles Google Play et App Store
✅ **Paiements locaux** (Orange Money, Wave)

### Comment ça marche ?
```
App AMALI → Bouton "Souscrire" → Site Web Externe → Paiement → Retour App
```

---

## 📂 Structure des fichiers

```
amali-app/
├── payment-page/          ← PAGE DE PAIEMENT EXTERNE
│   ├── index.html         ← Page de paiement (Orange Money, Wave, CB)
│   └── success.html       ← Page de confirmation
└── src/
    └── components/
        └── PremiumScreen.tsx  ← Redirige vers payment-page
```

---

## 🚀 ÉTAPE 1 : Héberger la page de paiement

### Option A : Hébergement gratuit (Netlify/Vercel)

**Netlify (Recommandé - 100% gratuit):**
```bash
# 1. Installer Netlify CLI
npm install -g netlify-cli

# 2. Se connecter
netlify login

# 3. Déployer le dossier payment-page
cd amali-app/payment-page
netlify deploy --prod

# Tu obtiendras une URL comme:
# https://amali-payment.netlify.app
```

**Vercel (Alternative):**
```bash
npm install -g vercel
cd amali-app/payment-page
vercel --prod
```

### Option B : Ton propre domaine

**Avec cPanel / hébergement partagé:**
1. Acheter un domaine : `payment.amali-app.com`
2. Uploader les fichiers dans `/public_html/`
3. Accessible via : `https://payment.amali-app.com`

**Avec VPS (DigitalOcean, Hostinger, etc):**
```bash
# Installer Nginx
sudo apt update
sudo apt install nginx

# Copier les fichiers
sudo mkdir -p /var/www/payment.amali-app.com
sudo cp index.html success.html /var/www/payment.amali-app.com/

# Configurer Nginx
sudo nano /etc/nginx/sites-available/payment.amali-app.com
```

---

## 🔧 ÉTAPE 2 : Configurer l'app React

### Fichier : `src/components/PremiumScreen.tsx`

```typescript
const handleSubscribe = () => {
  // CHANGE CETTE URL avec ton domaine réel
  const paymentUrl = 'https://payment.amali-app.com';
  
  // OU si tu utilises Netlify :
  // const paymentUrl = 'https://amali-payment.netlify.app';
  
  const userId = localStorage.getItem('userId') || 'guest';
  const fullUrl = `${paymentUrl}/?plan=${selectedPlan}&user=${userId}`;
  
  // Ouvrir dans un nouvel onglet
  window.open(fullUrl, '_blank');
};
```

---

## 💰 ÉTAPE 3 : Intégrer les APIs de paiement

### A. Orange Money (Sénégal)

```javascript
// Dans index.html, remplace la section "Traiter le paiement"

async function processOrangeMoneyPayment(data) {
  const response = await fetch('https://api.orange.com/orange-money-webpay/dev/v1/webpayment', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer TON_TOKEN_ORANGE',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      merchant_key: 'TA_CLE_MARCHANDE',
      currency: 'XOF',
      order_id: generateOrderId(),
      amount: data.amount.replace(' ', ''),
      return_url: 'https://payment.amali-app.com/success.html',
      cancel_url: 'https://payment.amali-app.com/?error=cancelled',
      notif_url: 'https://ton-backend.com/api/payment/notify',
      lang: 'fr',
      reference: data.userId
    })
  });
  
  const result = await response.json();
  if (result.payment_url) {
    window.location.href = result.payment_url;
  }
}
```

**Documentation:** https://developer.orange.com/apis/orange-money-webpay

### B. Wave (Sénégal)

```javascript
async function processWavePayment(data) {
  const response = await fetch('https://api.wave.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer TON_TOKEN_WAVE',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: data.amount.replace(' ', '') + '00', // en centimes
      currency: 'XOF',
      error_url: 'https://payment.amali-app.com/?error=failed',
      success_url: 'https://payment.amali-app.com/success.html'
    })
  });
  
  const result = await response.json();
  if (result.wave_launch_url) {
    window.location.href = result.wave_launch_url;
  }
}
```

**Documentation:** https://developers.wave.com/

### C. Carte bancaire (Stripe - International)

```javascript
// Ajouter le script Stripe
<script src="https://js.stripe.com/v3/"></script>

const stripe = Stripe('pk_test_TON_CLE_PUBLIQUE');

async function processCardPayment(data) {
  const response = await fetch('https://ton-backend.com/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan: data.plan,
      userId: data.userId
    })
  });
  
  const session = await response.json();
  stripe.redirectToCheckout({ sessionId: session.id });
}
```

---

## 🔐 ÉTAPE 4 : Backend Laravel (API)

### Créer l'API de paiement

```bash
# Créer le controller
php artisan make:controller Api/PaymentController
```

**Fichier: `app/Http/Controllers/Api/PaymentController.php`**

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\User;

class PaymentController extends Controller
{
    // Initier le paiement
    public function initiate(Request $request)
    {
        $validated = $request->validate([
            'plan' => 'required|string',
            'method' => 'required|string',
            'user_id' => 'required',
            'amount' => 'required|numeric'
        ]);

        // Créer l'enregistrement de paiement
        $payment = Payment::create([
            'user_id' => $validated['user_id'],
            'plan' => $validated['plan'],
            'amount' => $validated['amount'],
            'method' => $validated['method'],
            'status' => 'pending'
        ]);

        // Appeler l'API Orange Money ou Wave selon la méthode
        if ($validated['method'] === 'orange-money') {
            return $this->processOrangeMoney($payment);
        } elseif ($validated['method'] === 'wave') {
            return $this->processWave($payment);
        }

        return response()->json(['error' => 'Invalid method'], 400);
    }

    // Webhook de confirmation (appelé par Orange/Wave)
    public function notify(Request $request)
    {
        $paymentId = $request->input('reference');
        $status = $request->input('status');

        $payment = Payment::find($paymentId);
        
        if ($status === 'SUCCESS') {
            $payment->update(['status' => 'completed']);
            
            // Activer le Premium pour l'utilisateur
            $user = User::find($payment->user_id);
            $user->update([
                'premium_tier' => $payment->plan,
                'premium_expires_at' => now()->addMonth()
            ]);
        }

        return response()->json(['status' => 'ok']);
    }
}
```

**Routes API (`routes/api.php`):**

```php
Route::post('/payment/initiate', [PaymentController::class, 'initiate']);
Route::post('/payment/notify', [PaymentController::class, 'notify']);
Route::get('/payment/verify/{id}', [PaymentController::class, 'verify']);
```

---

## 📱 ÉTAPE 5 : Deep Links (Retour vers l'app)

### Pour retourner vers l'app mobile

**success.html:**
```javascript
function returnToApp() {
  // Deep link vers ton app
  window.location.href = 'amali://premium/success?plan=elite';
  
  // Fallback après 2 secondes si l'app n'ouvre pas
  setTimeout(() => {
    window.location.href = 'https://amali-app.com/download';
  }, 2000);
}
```

**Configurer le deep link dans React Native:**
```javascript
// Dans ton app.json ou AndroidManifest.xml
{
  "scheme": "amali",
  "host": "premium"
}
```

---

## ✅ CHECKLIST DE DÉPLOIEMENT

### Avant de lancer en production :

- [ ] Héberger payment-page sur un domaine HTTPS
- [ ] Obtenir les clés API Orange Money
- [ ] Obtenir les clés API Wave
- [ ] Créer l'API Laravel pour les webhooks
- [ ] Tester les paiements en mode sandbox
- [ ] Configurer les deep links
- [ ] Ajouter Google Analytics sur la page de paiement
- [ ] Mettre en place les emails de confirmation
- [ ] Tester le flow complet : App → Paiement → Retour App

---

## 🔒 Sécurité

### Points importants :

1. **HTTPS obligatoire** - Achète un certificat SSL (gratuit avec Let's Encrypt)
2. **Valider les webhooks** - Vérifier la signature des notifications Orange/Wave
3. **Logs de paiement** - Enregistrer tous les paiements dans la base de données
4. **Timeout** - Annuler les paiements en attente après 30 minutes
5. **Prévenir la fraude** - Limiter le nombre de tentatives par utilisateur

---

## 💡 Conseils pratiques

### Développement :
```bash
# Tester localement avec ngrok
ngrok http 8000  # Pour Laravel
ngrok http 5173  # Pour React

# Utiliser ces URLs pour les webhooks de test
```

### Production :
- **Domaine recommandé:** `pay.amali-app.com` (court et mémorable)
- **Hébergement:** Netlify (gratuit) ou ton propre serveur
- **Backend:** Laravel sur DigitalOcean ou Hostinger

---

## 📊 Tracking des conversions

**Ajouter Google Analytics dans index.html:**

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
  
  // Track payment initiation
  gtag('event', 'begin_checkout', {
    'value': 4900,
    'currency': 'XOF'
  });
</script>
```

---

## 🆘 Support

**Problèmes courants:**

1. **Page de paiement ne s'ouvre pas**
   - Vérifier que l'URL est bien HTTPS
   - Vérifier les paramètres dans l'URL

2. **Paiement bloqué**
   - Vérifier les clés API
   - Vérifier que le compte marchand est activé

3. **Retour à l'app ne fonctionne pas**
   - Configurer les deep links correctement
   - Tester le fallback URL

---

**Besoin d'aide ? Contacte-moi pour l'intégration !** 🚀
