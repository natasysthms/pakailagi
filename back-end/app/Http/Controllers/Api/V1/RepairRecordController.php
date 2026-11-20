<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\HandlesGarmentInput;
use App\Http\Controllers\Controller;
use App\Models\RepairRecord;
use App\Services\ImpactCalculator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Pencatatan pakaian yang diperbaiki (FR-D4). Hanya indikator, tidak masuk perhitungan CO2e. */
class RepairRecordController extends Controller
{
    use HandlesGarmentInput;

    /** GET /repair-records — catatan milik pengguna yang login */
    public function index(Request $request): JsonResponse
    {
        $records = RepairRecord::query()
            ->where('user_id', $request->user()->id)
            ->with(['category:id,name', 'repairService:id,name'])
            ->latest('repaired_at')
            ->get()
            ->map(fn (RepairRecord $r) => [
                'id' => $r->id,
                'category' => $r->category->name,
                'repairService' => $r->repairService?->name,
                'repairedAt' => $r->repaired_at->toDateString(),
                'notes' => $r->notes,
            ]);

        return response()->json($records);
    }

    /** POST /repair-records — body: category, repairedAt, repairServiceId?, notes? */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'repairedAt' => ['required', 'date', 'before_or_equal:today'],
            'repairServiceId' => ['nullable', 'integer', 'exists:repair_services,id'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $record = RepairRecord::create([
            'user_id' => $request->user()->id,
            'garment_category_id' => $this->resolveCategoryId($request),
            'repair_service_id' => $data['repairServiceId'] ?? null,
            'repaired_at' => $data['repairedAt'],
            'notes' => $data['notes'] ?? null,
        ]);

        ImpactCalculator::forget(); // jumlah reparasi di dashboard ikut berubah

        return response()->json(['success' => true, 'message' => 'Catatan reparasi tersimpan.', 'id' => $record->id], 201);
    }
}
