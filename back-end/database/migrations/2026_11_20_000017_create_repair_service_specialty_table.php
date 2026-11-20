<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Tabel penghubung many-to-many: satu layanan reparasi punya banyak keahlian, satu keahlian dimiliki banyak layanan
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_service_specialty', function (Blueprint $table) {
            $table->foreignId('repair_service_id')->constrained()->cascadeOnDelete();
            $table->foreignId('specialty_id')->constrained()->cascadeOnDelete();

            $table->primary(['repair_service_id', 'specialty_id']);
            $table->index('specialty_id'); // untuk filter "layanan dengan keahlian X"
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_service_specialty');
    }
};