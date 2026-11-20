<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('garments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();      // pemilik / penawar
            $table->foreignId('garment_category_id')->constrained();
            $table->foreignId('fabric_type_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('listing_type', ['preloved', 'donasi']);               // jalur sirkular
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('size', 50);
            $table->string('condition', 100);
            $table->unsignedInteger('price')->nullable();                        // null untuk donasi
            $table->text('description')->nullable();
            // Denormalisasi terkontrol: status disimpan di sini agar katalog bisa difilter tanpa join ke transactions
            $table->enum('status', ['tersedia', 'dipesan', 'selesai', 'diarsipkan'])->default('tersedia');
            $table->boolean('is_featured')->default(false);                      // kebutuhan front end (beranda)
            $table->timestamps();

            // Indeks untuk query katalog: WHERE listing_type = ? AND status = ? [AND garment_category_id = ?]
            $table->index(['listing_type', 'status', 'garment_category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('garments');
    }
};
