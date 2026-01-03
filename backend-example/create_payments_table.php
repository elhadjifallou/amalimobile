<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('transaction_id')->unique();
            $table->string('external_transaction_id')->nullable();
            $table->string('plan'); // essentiel, elite, prestige, prestige-femme
            $table->decimal('amount', 10, 2);
            $table->string('method'); // orange-money, wave, card
            $table->string('phone')->nullable();
            $table->string('email');
            $table->string('status')->default('pending'); // pending, completed, failed, cancelled
            $table->string('payment_url')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Index pour améliorer les performances
            $table->index(['user_id', 'status']);
            $table->index('transaction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
