<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArtisanResource;
use App\Models\RepairService;
use App\Models\Specialty;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/** Direktori layanan reparasi / "artisan" (FR-D3) */
class ArtisanController extends Controller
{
    /** GET /artisans?city=&specialty=&q= — hanya yang sudah diverifikasi admin */
    public function index(Request $request)
    {
        return ArtisanResource::collection(
            RepairService::query()
                ->with('specialties:id,code,name')
                ->where('is_verified', true)
                ->when($request->city, fn ($q, $c) => $q->where('city', $c))
                ->when($request->specialty, fn ($q, $code) => $q->whereHas('specialties', fn ($s) => $s->where('code', $code)))
                ->when($request->q, fn ($q, $term) => $q->where(fn ($w) => $w->where('name', 'like', "%{$term}%")
                    ->orWhereHas('specialties', fn ($s) => $s->where('name', 'like', "%{$term}%"))))
                ->orderBy('city')->orderBy('name')
                ->get()
        );
    }

    /** GET /artisans/{repairService} */
    public function show(RepairService $repairService): ArtisanResource
    {
        abort_unless($repairService->is_verified, 404);

        return new ArtisanResource($repairService->load('specialties:id,code,name'));
    }

    /**
     * POST /artisans/register — pendaftaran layanan reparasi baru.
     * Data masuk dengan status belum terverifikasi dan baru tampil setelah disetujui admin.
     * Body: name, city, phone, specialties[] (kode, contoh: ["sashiko","alterasi"]), bio?, address?, hours?
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'city' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'specialties' => ['nullable', 'array', 'max:6'],
            'specialties.*' => ['string', 'exists:specialties,code'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'hours' => ['nullable', 'string', 'max:100'],
        ]);

        $service = DB::transaction(function () use ($data) {
            $service = RepairService::create([
                'name' => $data['name'],
                'city' => $data['city'],
                'address' => $data['address'] ?? null,
                'phone' => $data['phone'],
                'description' => $data['bio'] ?? null,
                'opening_hours' => $data['hours'] ?? null,
                'is_verified' => false,
            ]);

            $service->specialties()->sync(
                Specialty::whereIn('code', $data['specialties'] ?? [])->pluck('id')
            );

            return $service;
        });

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran layanan reparasi terkirim dan menunggu verifikasi admin.',
            'data' => new ArtisanResource($service->load('specialties:id,code,name')),
        ], 201);
    }
}