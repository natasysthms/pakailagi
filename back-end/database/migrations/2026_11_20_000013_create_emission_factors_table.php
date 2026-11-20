<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Nilai P (kg CO2e per potong pakaian baru) per kategori.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emission_factors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('garment_category_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('kg_co2e_per_item', 8, 3);
            $table->string('system_boundary', 50);   // misalnya cradle-to-gate (harus sama untuk semua kategori)
            $table->string('source_ref');            // sumber literatur LCA
            $table->boolean('is_proxy')->default(false); // true jika memakai nilai kategori lain sebagai proksi
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emission_factors');
    }
};
