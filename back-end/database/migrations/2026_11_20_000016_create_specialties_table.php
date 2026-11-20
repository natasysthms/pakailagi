<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Data master keahlian reparasi (sashiko, denim, alterasi, ...)
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('specialties', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();   // dipakai filter front end, contoh: sashiko
            $table->string('name', 100);            // label tampilan, contoh: Sashiko & Darning
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('specialties');
    }
};