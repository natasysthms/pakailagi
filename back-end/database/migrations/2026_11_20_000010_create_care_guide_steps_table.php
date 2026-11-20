<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('care_guide_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('care_guide_id')->constrained()->cascadeOnDelete();
            $table->enum('step_type', ['cuci', 'kering', 'simpan', 'rawat']);
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->text('content');
            $table->timestamps();

            $table->index(['care_guide_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('care_guide_steps');
    }
};
