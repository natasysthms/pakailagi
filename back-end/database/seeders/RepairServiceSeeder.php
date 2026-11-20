<?php

namespace Database\Seeders;

use App\Models\RepairService;
use Illuminate\Database\Seeder;
use App\Models\Specialty;

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
                'specialties' => ['sashiko', 'alterasi'],
                'description' => 'Mengubah cacat sobekan pakaian menjadi karya seni dekoratif bergaya boro jepang dan tenun nusantara dengan benang katun organik.',
                'opening_hours' => 'Senin - Sabtu (09.00 - 18.00 WIB)',
                'is_verified' => true,
            ],
            [
                'name' => 'Denim Doctor & Heavy Stitch',
                'city' => 'Jakarta Selatan',
                'address' => 'Kemang Timur No. 18B',
                'phone' => '6281388991122',
                'specialties' => ['denim', 'alterasi'],
                'description' => 'Bengkel reparasi khusus celana jeans selvedge dan jaket canvas vintage menggunakan mesin Union Special 43200G klasik.',
                'opening_hours' => 'Selasa - Minggu (10.00 - 19.00 WIB)',
                'is_verified' => true,
            ],
            [
                'name' => 'Penjahit Lestari Pak Joko',
                'city' => 'Yogyakarta',
                'address' => 'Prawirotaman MG III No. 560',
                'phone' => '6281877665544',
                'specialties' => ['alterasi'],
                'description' => 'Pengrajin jahit tradisional generasi kedua dengan presisi tinggi untuk fitting proporsi tubuh dan restorasi busana vintage.',
                'opening_hours' => 'Setiap Hari (08.30 - 20.00 WIB)',
                'is_verified' => true,
            ],
            [
                'name' => 'Bengkel Pewarnaan Alami Daun Lestari',
                'city' => 'Solo',
                'address' => 'Laweyan No. 24',
                'phone' => '6282122334455',
                'specialties' => ['pewarnaan'],
                'description' => 'Mengembalikan warna baju kusam atau terkena noda membandel menjadi hitam arang, navy indigo, atau cokelat mahoni alami.',
                'opening_hours' => 'Senin - Jumat (09.00 - 17.00 WIB)',
                'is_verified' => true,
            ],
            [
                'name' => 'Re-Craft Leather & Outerwear Lab',
                'city' => 'Jakarta Selatan',
                'address' => 'Pasar Santa Lt. 1',
                'phone' => '6281199887766',
                'specialties' => ['kulit', 'tas-sepatu'],
                'description' => 'Ahli penanganan jaket kulit lapuk, pemulihan kelembutan material hewani vintage, dan penggantian aksesoris logam.',
                'opening_hours' => 'Rabu - Senin (11.00 - 20.00 WIB)',
                'is_verified' => true,
            ],
            [
                'name' => 'Rumah Jahit & Bordir Kencana',
                'city' => 'Surabaya',
                'address' => 'Gubeng Kertajaya V No. 12',
                'phone' => '6285744332211',
                'specialties' => ['alterasi', 'sashiko'],
                'description' => 'Layanan cepat permak kancing lepas, hem celana bahan, dan penutupan sobekan halus dengan aksen bordir floral minimalis.',
                'opening_hours' => 'Senin - Sabtu (08.00 - 17.00 WIB)',
                'is_verified' => true,
            ],
        ];

        $specialtyIds = Specialty::pluck('id', 'code');

        foreach ($services as $data) {
            $codes = $data['specialties'];
            unset($data['specialties']);

            RepairService::create($data)
                ->specialties()
                ->attach($specialtyIds->only($codes)->values()); // isi tabel penghubung
        }
    }
}
