<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Orange Money Configuration
    |--------------------------------------------------------------------------
    */

    'orange' => [
        'merchant_key' => env('ORANGE_MERCHANT_KEY', ''),
        'token' => env('ORANGE_TOKEN', ''),
        'webhook_secret' => env('ORANGE_WEBHOOK_SECRET', ''),
        'sandbox' => env('ORANGE_SANDBOX', true),
        'api_url' => env('ORANGE_SANDBOX', true) 
            ? 'https://api.orange.com/orange-money-webpay/dev/v1'
            : 'https://api.orange.com/orange-money-webpay/prod/v1',
    ],

    /*
    |--------------------------------------------------------------------------
    | Wave Configuration
    |--------------------------------------------------------------------------
    */

    'wave' => [
        'api_key' => env('WAVE_API_KEY', ''),
        'secret_key' => env('WAVE_SECRET_KEY', ''),
        'sandbox' => env('WAVE_SANDBOX', true),
        'api_url' => env('WAVE_SANDBOX', true)
            ? 'https://api.wave.com/v1'
            : 'https://api.wave.com/v1',
    ],

    /*
    |--------------------------------------------------------------------------
    | Stripe Configuration (pour cartes bancaires)
    |--------------------------------------------------------------------------
    */

    'stripe' => [
        'public_key' => env('STRIPE_PUBLIC_KEY', ''),
        'secret_key' => env('STRIPE_SECRET_KEY', ''),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET', ''),
    ],

    /*
    |--------------------------------------------------------------------------
    | Payment Settings
    |--------------------------------------------------------------------------
    */

    'plans' => [
        'essentiel' => [
            'name' => 'Essentiel',
            'price' => 2900,
            'duration' => 30, // jours
            'features' => [
                '80 likes par jour',
                '5 super likes par jour'
            ]
        ],
        'elite' => [
            'name' => 'Élite',
            'price' => 4900,
            'duration' => 30,
            'features' => [
                '100 likes par jour',
                'Voir qui vous a aimé',
                'Annuler un swipe',
                'Visibilité accrue'
            ]
        ],
        'prestige' => [
            'name' => 'Prestige',
            'price' => 7900,
            'duration' => 30,
            'features' => [
                'Likes illimités',
                'Appels vidéo',
                'Visibilité maximale',
                'Statistiques de popularité'
            ]
        ],
        'prestige-femme' => [
            'name' => 'Prestige Femme',
            'price' => 2000,
            'duration' => 30,
            'features' => [
                'Likes illimités',
                'Sécurité renforcée',
                'Priorité modérée'
            ]
        ]
    ],

];
