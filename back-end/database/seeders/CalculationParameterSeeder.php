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
            ['preloved', 'konservatif', 0.4000, 'Vinted (2023) dalam WRAP (2025)'],
            ['preloved', 'dasar', 0.6460, 'Rata-rata resale peer-to-peer Inggris, WRAP (2025)'],
            ['preloved', 'optimis', 0.8000, 'Vestiaire Collective (2023) dalam WRAP (2025)'],
            ['donasi', 'konservatif', 0, 'BELUM DIISI - asumsi tim'],
            ['donasi', 'dasar', 0, 'BELUM DIISI - asumsi tim'],
            ['donasi', 'optimis', 0, 'BELUM DIISI - asumsi tim'],
        ];

        foreach ($scenarios as [$pathway, $scenario, $rate, $source]) {
            DisplacementScenario::create([
                'pathway' => $pathway,
                'scenario' => $scenario,
                'rate' => $rate,
                'source_ref' => $source,
            ]);
        }

        // ── Faktor emisi produksi pakaian baru (P), kg CO2e per potong ──
        // PRD: "Diisi tim" dari literatur LCA dengan batas sistem yang SAMA untuk semua kategori.
        // Nilai 0 adalah PLACEHOLDER. Isi lewat fitur admin (FR-F1) atau ubah di sini sebelum demo.
        foreach (GarmentCategory::all() as $category) {
            EmissionFactor::create([
                'garment_category_id' => $category->id,
                'kg_co2e_per_item' => 0,
                'system_boundary' => 'cradle-to-gate',
                'source_ref' => 'BELUM DIISI - literatur LCA',
                'is_proxy' => false,
            ]);
        }
    }
}
