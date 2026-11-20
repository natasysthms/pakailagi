<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Tabel users dibuat oleh migration bawaan Laravel (0001_01_01_000000_create_users_table).
// Migration ini hanya menambahkan kolom sesuai ERD.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->after('id')->constrained('roles');
            $table->string('phone', 20)->nullable()->after('email');
            $table->boolean('is_active')->default(true)->after('password');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('role_id');
            $table->dropColumn(['phone', 'is_active']);
        });
    }
};
