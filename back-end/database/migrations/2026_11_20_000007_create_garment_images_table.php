<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('garment_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('garment_id')->constrained()->cascadeOnDelete();
            $table->string('path', 500);                        // gambar penuh (WebP), untuk halaman detail
            $table->string('thumbnail_path', 300)->nullable();  // thumbnail (WebP), untuk katalog
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['garment_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('garment_images');
    }
};
