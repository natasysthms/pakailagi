<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partner_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete(); // relasi 1 : 0..1
            $table->enum('partner_type', ['thrift_shop', 'organisasi_donasi']);
            $table->string('name');
            $table->string('city', 100)->nullable();
            $table->string('address')->nullable();
            $table->string('phone', 20)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();

            $table->index('partner_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_profiles');
    }
};
