<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Data dummy PakaiLagi. Sebagian besar disalin dari mock data front end (repo pakailagi),
 * ditambah data simulasi transaksi untuk menguji dashboard CO2e.
 * Semua akun memakai password: password
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Urutan penting: data master dulu, lalu data yang bergantung padanya.
        $this->call([
            RoleSeeder::class,
            MasterDataSeeder::class,
            UserSeeder::class,
            GarmentSeeder::class,
            TransactionSeeder::class,
            CareGuideSeeder::class,
            RepairServiceSeeder::class,
            CalculationParameterSeeder::class,
        ]);
    }
}
