<?php

namespace App\Services;

use App\Models\DisplacementScenario;
use App\Models\EmissionFactor;
use App\Models\GarmentCategory;
use App\Models\RepairRecord;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Service CO2e (konteks sistem 3.2.2 b dan 3.2.3).
 *
 * Rumus WRAP (2025): N = E − (P × D), dengan E = 0 (tidak dihitung, dicatat sebagai keterbatasan).
 * Emisi yang dihindari = Σ (jumlah pakaian selesai × P kategori × D jalur & skenario).
 *
 * Green SE:
 * - Membaca tabel ringkasan dashboard_daily_counts, bukan memindai seluruh tabel transactions.
 * - Hasil disimpan di cache dan baru dihitung ulang setelah ada transaksi selesai, reparasi baru,
 *   atau parameter diubah admin (lihat forget()).
 */
class ImpactCalculator
{
    public const SCENARIOS = ['konservatif', 'dasar', 'optimis'];
    public const PATHWAYS = ['preloved', 'donasi'];

    private const SUMMARY_KEY = 'impact.summary';
    private const PARAMETERS_KEY = 'impact.parameters';

    public const DISCLAIMER = 'Angka merupakan estimasi potensi emisi CO₂e yang dihindari berdasarkan data simulasi, '
        .'faktor emisi dari literatur, dan asumsi displacement rate (WRAP, 2025). Bukan hasil pengukuran langsung. '
        .'Emisi operasional (transportasi, pengemasan, pencucian) tidak dihitung.';

    /** Hapus cache. Dipanggil setiap kali data atau parameter yang memengaruhi perhitungan berubah. */
    public static function forget(): void
    {
        Cache::forget(self::SUMMARY_KEY);
        Cache::forget(self::PARAMETERS_KEY);
    }

    /**
     * @return array{factors: array<int, float>, rates: array<string, float>}
     */
    public function parameters(): array
    {
        return Cache::rememberForever(self::PARAMETERS_KEY, fn () => [
            'factors' => EmissionFactor::query()
                ->pluck('kg_co2e_per_item', 'garment_category_id')
                ->map(fn ($value) => (float) $value)
                ->all(),
            'rates' => DisplacementScenario::query()
                ->get(['pathway', 'scenario', 'rate'])
                ->mapWithKeys(fn ($row) => ["{$row->pathway}.{$row->scenario}" => (float) $row->rate])
                ->all(),
        ]);
    }

    public function rate(string $pathway, string $scenario): float
    {
        return $this->parameters()['rates']["{$pathway}.{$scenario}"] ?? 0.0;
    }

    /** Estimasi untuk SATU potong pakaian (P × D). Dipakai untuk label estimasi per produk dan per pengguna. */
    public function perItem(int $categoryId, string $pathway, string $scenario = 'dasar'): float
    {
        $factor = $this->parameters()['factors'][$categoryId] ?? 0.0;

        return $factor * $this->rate($pathway, $scenario);
    }

    /**
     * Ringkasan dashboard lengkap (dari cache bila tersedia).
     */
    public function summary(): array
    {
        return Cache::rememberForever(self::SUMMARY_KEY, fn () => $this->calculate());
    }

    private function calculate(): array
    {
        $parameters = $this->parameters();

        // Tabel kecil: satu baris per (tanggal, kategori, jalur)
        $rows = DB::table('dashboard_daily_counts')
            ->select('garment_category_id', 'pathway', DB::raw('SUM(completed_count) AS total'))
            ->groupBy('garment_category_id', 'pathway')
            ->get();

        $categoryNames = GarmentCategory::query()->pluck('name', 'id');

        $counts = array_fill_keys(self::PATHWAYS, 0);
        $scenarios = [];
        foreach (self::SCENARIOS as $scenario) {
            $scenarios[$scenario] = ['total_kg' => 0.0, 'by_pathway' => array_fill_keys(self::PATHWAYS, 0.0)];
        }
        $categories = [];

        foreach ($rows as $row) {
            $quantity = (int) $row->total;
            $factor = $parameters['factors'][$row->garment_category_id] ?? 0.0;
            $counts[$row->pathway] += $quantity;

            $categories[$row->garment_category_id] ??= [
                'id' => (int) $row->garment_category_id,
                'name' => $categoryNames[$row->garment_category_id] ?? '-',
                'items' => 0,
                'avoided_kg' => 0.0, // skenario dasar
            ];
            $categories[$row->garment_category_id]['items'] += $quantity;

            foreach (self::SCENARIOS as $scenario) {
                $avoided = $quantity * $factor * ($parameters['rates']["{$row->pathway}.{$scenario}"] ?? 0.0);
                $scenarios[$scenario]['total_kg'] += $avoided;
                $scenarios[$scenario]['by_pathway'][$row->pathway] += $avoided;

                if ($scenario === 'dasar') {
                    $categories[$row->garment_category_id]['avoided_kg'] += $avoided;
                }
            }
        }

        return [
            'counts' => [
                'preloved_completed' => $counts['preloved'],
                'donation_completed' => $counts['donasi'],
                'repairs' => RepairRecord::query()->count(), // indikator saja, tidak masuk perhitungan CO2e
            ],
            'scenarios' => $scenarios,
            'categories' => array_values($categories),
            'rates' => $parameters['rates'],
            'disclaimer' => self::DISCLAIMER,
            'calculated_at' => now()->toIso8601String(),
        ];
    }
}
