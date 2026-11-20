<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\CareGuideController as PublicCareGuideController;
use App\Http\Controllers\Controller;
use App\Http\Resources\CareGuideResource;
use App\Models\CareGuide;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/** Admin mengelola panduan perawatan dan langkahnya (FR-D2). Cache panduan dihapus setiap ada perubahan. */
class CareGuideController extends Controller
{
    /** POST /admin/care-guides */
    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);

        $guide = DB::transaction(function () use ($data) {
            $guide = CareGuide::create(collect($data)->except('steps')->all());
            $this->syncSteps($guide, $data['steps']);

            return $guide;
        });

        return $this->respond($guide, 'Panduan ditambahkan.', 201);
    }

    /** PUT /admin/care-guides/{careGuide} */
    public function update(Request $request, CareGuide $careGuide): JsonResponse
    {
        $data = $this->validated($request, $careGuide);

        DB::transaction(function () use ($careGuide, $data) {
            $careGuide->update(collect($data)->except('steps')->all());
            $this->syncSteps($careGuide, $data['steps']);
        });

        return $this->respond($careGuide, 'Panduan diperbarui.');
    }

    /** DELETE /admin/care-guides/{careGuide} */
    public function destroy(CareGuide $careGuide): JsonResponse
    {
        $careGuide->delete(); // langkah ikut terhapus (cascade)
        Cache::forget(PublicCareGuideController::CACHE_KEY);

        return response()->json(['success' => true, 'message' => 'Panduan dihapus.']);
    }

    private function validated(Request $request, ?CareGuide $guide = null): array
    {
        return $request->validate([
            'fabric_type_id' => ['required', 'exists:fabric_types,id', Rule::unique('care_guides', 'fabric_type_id')->ignore($guide?->id)],
            'slug' => ['required', 'alpha_dash', 'max:50', Rule::unique('care_guides', 'slug')->ignore($guide?->id)],
            'title' => ['required', 'string', 'max:150'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:50'],
            'steps' => ['required', 'array', 'min:1'],
            'steps.*.step_type' => ['required', Rule::in(['cuci', 'kering', 'simpan', 'rawat'])],
            'steps.*.content' => ['required', 'string', 'max:2000'],
        ]);
    }

    private function syncSteps(CareGuide $guide, array $steps): void
    {
        $guide->steps()->delete();

        foreach (array_values($steps) as $order => $step) {
            $guide->steps()->create([
                'step_type' => $step['step_type'],
                'content' => $step['content'],
                'sort_order' => $order,
            ]);
        }
    }

    private function respond(CareGuide $guide, string $message, int $status = 200): JsonResponse
    {
        Cache::forget(PublicCareGuideController::CACHE_KEY);

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => new CareGuideResource($guide->load(['fabricType:id,name', 'steps'])),
        ], $status);
    }
}
