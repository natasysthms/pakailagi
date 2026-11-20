<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Satu tabel untuk transaksi preloved dan donasi.
// Jalur (preloved/donasi) dan pemilik pakaian dibaca dari tabel garments, tidak disimpan ulang di sini.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('garment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('requester_id')->constrained('users')->cascadeOnDelete(); // pembeli / penerima
            $table->enum('status', ['diajukan', 'disepakati', 'selesai', 'dibatalkan'])->default('diajukan');
            $table->unsignedInteger('agreed_price')->nullable(); // riwayat harga yang disepakati (null untuk donasi)
            $table->text('message')->nullable();
            $table->timestamp('agreed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
