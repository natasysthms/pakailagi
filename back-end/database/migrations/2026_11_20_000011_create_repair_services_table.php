<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('city', 100);
            $table->string('address')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('specialty')->nullable();   // label keahlian, dipakai filter halaman reparasi
            $table->text('description')->nullable();
            $table->string('opening_hours', 100)->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();

            $table->index('city');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_services');
    }
};
