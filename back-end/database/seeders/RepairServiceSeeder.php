<?php

namespace Database\Seeders;

use App\Models\GarmentCategory;
use App\Models\RepairRecord;
use App\Models\RepairService;
use App\Models\User;
use Illuminate\Database\Seeder;

class RepairServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Dari mockData/artisans.js
        $services = [
            [
                'name' => 'Atelier Sashiko Nusantara',
                'city' => 'Bandung',
                'address' => 'Jl. Riau No. 42, Riau',
                'phone' => '6281234567890',
                'specialty' => 'Visible Mending, Sashiko Kuno, & Darning Rajut',
                'description' => 'Mengubah cacat sobekan pakaian menjadi karya seni dekoratif bergaya boro jepang dan tenun nusantara dengan benang katun organik.',
                'opening_hours' => 'Senin - Sabtu (09.00 - 18.00 WIB)',
                'is_verified' => true,
            ],
            [
                'name' => 'Denim Doctor & Heavy Stitch',
                'city' => 'Jakarta Selatan',
                'address' => 'Kemang Timur No. 18B',
                'phone' => '6281388991122',
                'specialty' => 'Chainstitch Hemming, Darning Selvedge, & Rivet',
                'description' => 'Bengkel reparasi khusus celana jeans selvedge dan jaket canvas vintage menggunakan mesin Union Special 43200G klasik.',
                'opening_hours' => 'Selasa - Minggu (10.00 - 19.00 WIB)',
                'is_verified' => true,
            ],
            [
                'name' => 'Penjahit Lestari Pak Joko',
                'city' => 'Yogyakarta',
                'address' => 'Prawirotaman MG III No. 560',
                'phone' => '6281877665544',
                'specialty' => 'Permak Jas, Alterasi Gaun, & Fitting Custom',
                'description' => 'Pengrajin jahit tradisional generasi kedua dengan presisi tinggi untuk fitting proporsi tubuh dan restorasi busana vintage.',
                'opening_hours' => 'Setiap Hari (08.30 - 20.00 WIB)',
                'is_verified' => true,
            ],
            [
                'name' => 'Bengkel Pewarnaan Alami Daun Lestari',
                'city' => 'Solo',
                'address' => 'Laweyan No. 24',
                'phone' => '6282122334455',
                'specialty' => 'Overdyeing Alami, Indigo Fermentasi, Restorasi Pudar',
                'description' => 'Mengembalikan warna baju kusam atau terkena noda membandel menjadi hitam arang, navy indigo, atau cokelat mahoni alami.',
                'opening_hours' => 'Senin - Jumat (09.00 - 17.00 WIB)',
                'is_verified' => true,
            ],
            [
                'name' => 'Re-Craft Leather & Outerwear Lab',
                'city' => 'Jakarta Selatan',
                'address' => 'Pasar Santa Lt. 1',
                'phone' => '6281199887766',
                'specialty' => 'Restorasi Jaket Kulit, Furing, & Ritsleting YKK',
                'description' => 'Ahli penanganan jaket kulit lapuk, pemulihan kelembutan material hewani vintage, dan penggantian aksesoris logam.',
                'opening_hours' => 'Rabu - Senin (11.00 - 20.00 WIB)',
                'is_verified' => true,
            ],
            [
                'name' => 'Rumah Jahit & Bordir Kencana',
                'city' => 'Surabaya',
                'address' => 'Gubeng Kertajaya V No. 12',
                'phone' => '6285744332211',
                'specialty' => 'Bordir Tambal Artistik, Karet Pinggang, Permak Kemeja',
                'description' => 'Layanan cepat permak kancing lepas, hem celana bahan, dan penutupan sobekan halus dengan aksen bordir floral minimalis.',
                'opening_hours' => 'Senin - Sabtu (08.00 - 17.00 WIB)',
                'is_verified' => true,
            ],
        ];

        foreach ($services as $data) {
            RepairService::create($data);
        }

        // Catatan pakaian yang diperbaiki (data simulasi) untuk indikator dashboard
        $consumerId = User::where('email', 'konsumen@pakailagi.test')->value('id');
        $categories = GarmentCategory::pluck('id', 'code');
        $firstService = RepairService::value('id');

        RepairRecord::create(['user_id' => $consumerId, 'garment_category_id' => $categories['DENIM'], 'repair_service_id' => $firstService, 'repaired_at' => now()->subDays(10), 'notes' => 'Tambal lutut (simulasi)']);
        RepairRecord::create(['user_id' => $consumerId, 'garment_category_id' => $categories['ATASAN'], 'repair_service_id' => null, 'repaired_at' => now()->subDays(4), 'notes' => 'Ganti kancing sendiri (simulasi)']);
    }
}
