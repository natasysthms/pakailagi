<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\DisplacementScenario;
use App\Models\EmissionFactor;
use App\Services\ImpactCalculator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Parameter perhitungan CO2e (FR-F1, FR-F2).
 * Parameter disimpan di basis data (bukan di kode), sehingga asumsi bisa diubah tanpa mengubah program.
 * Setiap perubahan menghapus cache dashboard agar hasil mengikuti parameter baru.
 */
class ParameterController extends Controller
{
    /** GET /admin/emission-factors */
    public function emissionFactors(): JsonResponse
    {
        return response()->json(EmissionFactor::query()->with('category:id,code,name')->get());
    }

    /** PUT /admin/emission-factors/{emissionFactor} */
    public function updateEmissionFactor(Request $request, EmissionFactor $emissionFactor): JsonResponse
    {
        $data = $request->validate([
            'kg_co2e_per_item' => ['required', 'numeric', 'min:0', 'max:9999'],
            'system_boundary' => ['required', 'string', 'max:50'],
            'source_ref' => ['required', 'string', 'max:255'],
            'is_proxy' => ['sometimes', 'boolean'],
        ]);

        $emissionFactor->update($data);
        ImpactCalculator::forget();

        return response()->json(['success' => true, 'message' => 'Faktor emisi diperbarui.', 'data' => $emissionFactor]);
    }

    /** GET /admin/displacement-scenarios */
    public function displacementScenarios(): JsonResponse
    {
        return response()->json(DisplacementScenario::query()->orderBy('pathway')->orderBy('id')->get());
    }

    /** PUT /admin/displacement-scenarios/{displacementScenario} — rate dalam desimal (0.646 = 64,6%) */
    public function updateDisplacementScenario(Request $request, DisplacementScenario $displacementScenario): JsonResponse
    {
        $data = $request->validate([
            'rate' => ['required', 'numeric', 'min:0', 'max:1'],
            'source_ref' => ['required', 'string', 'max:255'],
        ]);

        $displacementScenario->update($data);
        ImpactCalculator::forget();

        return response()->json(['success' => true, 'message' => 'Displacement rate diperbarui.', 'data' => $displacementScenario]);
    }
}
