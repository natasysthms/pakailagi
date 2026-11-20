<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArtisanResource;
use App\Models\RepairService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/** Admin memverifikasi dan mengelola direktori layanan reparasi */
class RepairServiceController extends Controller
{
    /** GET /admin/repair-services?verified=0|1 */
    public function index(Request $request)
    {
        return ArtisanResource::collection(
            RepairService::query()
                ->when($request->has('verified'), fn ($q) => $q->where('is_verified', $request->boolean('verified')))
                ->latest()
                ->get()
        );
    }

    /** PUT /admin/repair-services/{repairService} */
    public function update(Request $request, RepairService $repairService): JsonResponse
    {
        $repairService->update($request->validate([
            'name' => ['sometimes', 'string', 'max:150'],
            'city' => ['sometimes', 'string', 'max:100'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'specialty' => ['sometimes', 'nullable', 'string', 'max:255'],
            'specialty_tags' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'opening_hours' => ['sometimes', 'nullable', 'string', 'max:100'],
            'is_verified' => ['sometimes', 'boolean'],
        ]));

        Cache::forget('admin.stats');

        return response()->json(['success' => true, 'message' => 'Layanan reparasi diperbarui.', 'data' => new ArtisanResource($repairService)]);
    }

    /** DELETE /admin/repair-services/{repairService} */
    public function destroy(RepairService $repairService): JsonResponse
    {
        $repairService->delete();
        Cache::forget('admin.stats');

        return response()->json(['success' => true, 'message' => 'Layanan reparasi dihapus.']);
    }
}
