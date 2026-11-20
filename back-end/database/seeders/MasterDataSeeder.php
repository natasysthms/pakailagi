<?php

namespace Database\Seeders;

use App\Models\FabricType;
use App\Models\GarmentCategory;
use App\Models\Specialty;
use Illuminate\Database\Seeder;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        // Kategori pakaian (disesuaikan dengan kategori yang dipakai front end)
        foreach ([
            'OUTERWEAR' => 'Outerwear',
            'ATASAN' => 'Atasan',
            'DENIM' => 'Denim',
            'CELANA_ROK' => 'Celana & Rok',
            'ANAK' => 'Pakaian Anak',
        ] as $code => $name) {
            GarmentCategory::create(['code' => $code, 'name' => $name]);
        }

        // Jenis kain (sama dengan kategori di halaman Panduan Perawatan front end)
        foreach ([
            'Katun (Cotton)',
            'Denim',
            'Wol (Wool)',
            'Linen',
            'Sutra & Wastra',
            'Poliester & Sintetis',
        ] as $name) {
            FabricType::create(['name' => $name]);
        }

        // Keahlian reparasi (kode sama dengan filter di halaman Reparasi front end)
        foreach ([
            'sashiko' => 'Sashiko & Darning',
            'denim' => 'Denim & Chainstitch',
            'alterasi' => 'Permak & Alterasi',
            'pewarnaan' => 'Pewarnaan Alami',
            'kulit' => 'Restorasi Kulit',
            'tas-sepatu' => 'Tas & Sepatu',
        ] as $code => $name) {
            Specialty::create(['code' => $code, 'name' => $name]);
        }
    }
}
