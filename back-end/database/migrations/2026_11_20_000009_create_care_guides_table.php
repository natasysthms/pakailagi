<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('care_guides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fabric_type_id')->unique()->constrained()->cascadeOnDelete(); // 1 : 1 dengan jenis kain
            $table->string('slug', 50)->unique();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('icon', 50)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('care_guides');
    }
};
