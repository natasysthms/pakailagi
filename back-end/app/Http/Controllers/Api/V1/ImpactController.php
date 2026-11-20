<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\EmissionFactor;
use App\Services\ImpactCalculator;
use App\Support\Labels;
use Illuminate\Http\JsonResponse;

/**
 * Dashboard indikator keberlanjutan & estimasi CO2e (FR-E1 s.d. FR-E4).
 * Semua angka berasal dari ImpactCalculator yang membaca tabel ringkasan + cache.
 */
class ImpactController extends Controller
{
    /** Front end memakai kunci "standar" untuk skenario dasar */
    private const FRONTEND_KEYS = ['konservatif' => 'konservatif', 'dasar' => 'standar', 'optimis' => 'optimis'];
    private const LABELS = ['konservatif' => 'Skenario Konservatif', 'dasar' => 'Skenario Dasar (Default)', 'optimis' => 'Skenario Optimis'];

    public function __construct(private ImpactCalculator $impact)
    {
    }

    /** GET /impact/summary — jumlah transaksi preloved & donasi selesai, jumlah reparasi, total per skenario */
    public function summary(): JsonResponse
    {
        $summary = $this->impact->summary();

        return response()->json([
            'prelovedCompleted' => $summary['counts']['preloved_completed'],
            'donationCompleted' => $summary['counts']['donation_completed'],
            'repairsCount' => $summary['counts']['repairs'],
            'avoidedKg' => collect($summary['scenarios'])
                ->mapWithKeys(fn ($s, $key) => [self::FRONTEND_KEYS[$key] => round($s['total_kg'], 2)]),
            'disclaimer' => $summary['disclaimer'],
            'calculatedAt' => $summary['calculated_at'],
        ]);
    }

    /** GET /impact/scenarios — semua skenario, kunci: konservatif | standar | optimis */
    public function scenarios(): JsonResponse
    {
        $summary = $this->impact->summary();

        return response()->json(collect(ImpactCalculator::SCENARIOS)->mapWithKeys(
            fn ($scenario) => [self::FRONTEND_KEYS[$scenario] => $this->formatScenario($scenario, $summary)]
        ));
    }

    /** GET /impact/scenarios/{key} */
    public function scenario(string $key): JsonResponse
    {
        $scenario = array_search($key, self::FRONTEND_KEYS, true) ?: (in_array($key, ImpactCalculator::SCENARIOS, true) ? $key : null);
        abort_unless($scenario, 404, 'Skenario tidak dikenal.');

        return response()->json($this->formatScenario($scenario, $this->impact->summary()));
    }

    /** GET /impact/categories — rincian emisi dihindari per kategori (skenario dasar) */
    public function categories(): JsonResponse
    {
        $categories = collect($this->impact->summary()['categories']);
        $total = $categories->sum('avoided_kg');

        return response()->json($categories->sortByDesc('avoided_kg')->values()->map(fn ($c) => [
            'name' => $c['name'],
            'items' => $c['items'],
            'emission' => Labels::kg($c['avoided_kg']).' kg CO₂e',
            'emissionKg' => round($c['avoided_kg'], 2),
            'percentage' => $total > 0 ? (int) round($c['avoided_kg'] / $total * 100) : 0,
        ]));
    }

    /** GET /impact/emission-factors — transparansi parameter P beserta sumbernya */
    public function emissionFactors(): JsonResponse
    {
        return response()->json(
            EmissionFactor::query()->with('category:id,name')->get()->map(fn (EmissionFactor $f) => [
                'material' => $f->category->name,   // nama field mengikuti front end
                'category' => $f->category->name,
                'ef' => (float) $f->kg_co2e_per_item,
                'unit' => 'kg CO₂e per potong',
                'systemBoundary' => $f->system_boundary,
                'source' => $f->source_ref,
                'isProxy' => $f->is_proxy,
                'water' => null,
            ])
        );
    }

    private function formatScenario(string $scenario, array $summary): array
    {
        $data = $summary['scenarios'][$scenario];
        $preloved = $summary['rates']["preloved.{$scenario}"] ?? 0;
        $donation = $summary['rates']["donasi.{$scenario}"] ?? 0;
        $percent = fn (float $r) => rtrim(rtrim(number_format($r * 100, 1, ',', '.'), '0'), ',').'%';
        $prelovedText = $percent($preloved);
        $donationText = $percent($donation);

        return [
            'key' => self::FRONTEND_KEYS[$scenario],
            'label' => self::LABELS[$scenario],
            'rateNumber' => round($preloved * 100, 1),
            'rateText' => $prelovedText,
            'rates' => ['preloved' => $preloved, 'donasi' => $donation],
            'emission' => Labels::kg($data['total_kg']),
            'emissionKg' => round($data['total_kg'], 2),
            'metricTotal' => Labels::kg($data['total_kg']).' KG',
            'byPathway' => [
                'preloved' => round($data['by_pathway']['preloved'], 2),
                'donasi' => round($data['by_pathway']['donasi'], 2),
            ],
            'desc' => "Mengasumsikan {$prelovedText} transaksi preloved dan {$donationText} donasi "
                .'benar-benar menggantikan pembelian pakaian baru (displacement rate).',
            'equiv' => null,
            'trees' => null,
            'disclaimer' => $summary['disclaimer'],
        ];
    }
}
