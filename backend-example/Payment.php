<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'transaction_id',
        'external_transaction_id',
        'plan',
        'amount',
        'method',
        'phone',
        'email',
        'status',
        'payment_url',
        'completed_at'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'completed_at' => 'datetime'
    ];

    /**
     * Relation avec l'utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope pour les paiements complétés
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope pour les paiements en attente
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Vérifier si le paiement est complété
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Obtenir le nom du plan formaté
     */
    public function getPlanNameAttribute(): string
    {
        $plans = [
            'essentiel' => 'Essentiel',
            'elite' => 'Élite',
            'prestige' => 'Prestige',
            'prestige-femme' => 'Prestige Femme'
        ];

        return $plans[$this->plan] ?? $this->plan;
    }

    /**
     * Obtenir la méthode de paiement formatée
     */
    public function getMethodNameAttribute(): string
    {
        $methods = [
            'orange-money' => 'Orange Money',
            'wave' => 'Wave',
            'card' => 'Carte bancaire'
        ];

        return $methods[$this->method] ?? $this->method;
    }
}
