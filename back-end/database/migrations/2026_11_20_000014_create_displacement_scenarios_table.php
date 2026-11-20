<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Nilai D (displacement rate) per jalur dan skenario.
// Dihubungkan ke dashboard_daily_counts lewat nilai pathway di tingkat aplikasi (bukan foreign key).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('displacement_scenarios', function (Blueprint $table) {
            $table->id();
            $table->enum('pathway', ['preloved', 'donasi']);
            $table->enum('scenario', ['konservatif', 'dasar', 'optimis']);
            $table->decimal('rate', 5, 4);   // 0.6460 = 64,6%
            $table->string('source_ref');
            $table->timestamps();

            $table->unique(['pathway', 'scenario']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('displacement_scenarios');
    }
};
