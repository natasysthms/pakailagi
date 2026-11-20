<?php

namespace Database\Seeders;

use App\Models\DisplacementScenario;
use App\Models\EmissionFactor;
use App\Models\GarmentCategory;
use Illuminate\Database\Seeder;

class CalculationParameterSeeder extends Seeder
{
    public function run(): void
    {
        // ── Displacement rate (D) ──
        // Preloved: nilai dari PRD bagian 7.2 (benchmark WRAP, 2025).
        // Donasi: PRD menyebut "diisi tim" sebagai asumsi penelitian. Nilai 0 di bawah adalah PLACEHOLDER,
        //         ganti dengan nilai yang sudah disepakati tim beserta sumbernya. Jangan dikarang.
        $scenarios = [
            ['preloved', 'konservatif', 0.400, 'Vinted (2023) dalam WRAP (2025)'],
            ['preloved', 'dasar', 0.646, 'Rata-rata resale peer-to-peer Inggris, WRAP (2025)'],
            ['preloved', 'optimis', 0.800, 'Vestiaire Collective (2023) dalam WRAP (2025)'],
            ['donasi', 'konservatif', 0.100, 'Asumsi penelitian, mengacu pada penjelasan WRAP (2025)'],
            ['donasi', 'dasar', 0.200, 'Asumsi penelitian, mengacu pada penjelasan WRAP (2025)'],
            ['donasi', 'optimis', 0.300, 'Asumsi penelitian, mengacu pada penjelasan WRAP (2025)'],
        ];

        foreach ($scenarios as [$pathway, $scenario, $rate, $source]) {
            DisplacementScenario::create([
                'pathway' => $pathway,
                'scenario' => $scenario,
                'rate' => $rate,
                'source_ref' => $source,
            ]);
        }

        $factors = [
            // kode kategori => [nilai, batas sistem, sumber, proksi?]
            'ATASAN'     => [3.08, 'cradle-to-gate', 'Makov dan Vivanco (2025)', false],
            'CELANA_ROK' => [10.47, 'cradle-to-gate', 'Makov dan Vivanco (2025)', false],
            'DENIM'      => [10.47, 'cradle-to-gate', 'Makov dan Vivanco (2025)', true],
            'OUTERWEAR'  => [15.51, 'cradle-to-gate', 'Makov dan Vivanco (2025)', false],
            'ANAK'       => [3.08, 'cradle-to-gate', 'Makov dan Vivanco (2025)', true],  // true jika memakai nilai kategori lain
        ];
        
        foreach ($factors as $code => [$value, $boundary, $source, $isProxy]) {
            EmissionFactor::create([
                'garment_category_id' => GarmentCategory::where('code', $code)->value('id'),
                'kg_co2e_per_item' => $value,
                'system_boundary' => $boundary,
                'source_ref' => $source,
                'is_proxy' => $isProxy,
            ]);
        }
    }
}
