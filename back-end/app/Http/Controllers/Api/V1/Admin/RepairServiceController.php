<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArtisanResource;
use App\Models\RepairService;
use App\Models\Specialty;
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
                ->with('specialties:id,code,name')
                ->when($request->has('verified'), fn ($q) => $q->where('is_verified', $request->boolean('verified')))
                ->latest()
                ->get()
        );
    }

    /** PUT /admin/repair-services/{repairService} — specialties berisi daftar kode, contoh ["denim","alterasi"] */
    public function update(Request $request, RepairService $repairService): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:150'],
            'city' => ['sometimes', 'string', 'max:100'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'opening_hours' => ['sometimes', 'nullable', 'string', 'max:100'],
            'is_verified' => ['sometimes', 'boolean'],
            'specialties' => ['sometimes', 'array'],
            'specialties.*' => ['string', 'exists:specialties,code'],
        ]);

        $repairService->update(collect($data)->except('specialties')->all());

        if (array_key_exists('specialties', $data)) {
            $repairService->specialties()->sync(Specialty::whereIn('code', $data['specialties'])->pluck('id'));
        }

        Cache::forget('admin.stats');

        return response()->json([
            'success' => true,
            'message' => 'Layanan reparasi diperbarui.',
            'data' => new ArtisanResource($repairService->load('specialties:id,code,name')),
        ]);
    }

    /** DELETE /admin/repair-services/{repairService} */
    public function destroy(RepairService $repairService): JsonResponse
    {
        $repairService->delete(); // baris di tabel penghubung ikut terhapus (cascade)
        Cache::forget('admin.stats');

        return response()->json(['success' => true, 'message' => 'Layanan reparasi dihapus.']);
    }
}