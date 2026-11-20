<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Tabel ringkasan (denormalisasi terkontrol). Dashboard membaca tabel kecil ini,
// bukan memindai seluruh tabel transactions. Diperbarui hanya saat transaksi menjadi "selesai".
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_daily_counts', function (Blueprint $table) {
            $table->date('date');
            $table->foreignId('garment_category_id')->constrained()->cascadeOnDelete();
            $table->enum('pathway', ['preloved', 'donasi']);
            $table->unsignedInteger('completed_count')->default(0);

            $table->primary(['date', 'garment_category_id', 'pathway']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_daily_counts');
    }
};
