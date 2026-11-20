<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArtisanResource;
use App\Models\RepairService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Direktori layanan reparasi / "artisan" (FR-D3) */
class ArtisanController extends Controller
{
    /** GET /artisans?city=&specialty=&q= — hanya yang sudah diverifikasi admin */
    public function index(Request $request)
    {
        return ArtisanResource::collection(
            RepairService::query()
                ->where('is_verified', true)
                ->when($request->city, fn ($q, $c) => $q->where('city', $c))
                ->when($request->specialty, fn ($q, $s) => $q->where('specialty_tags', 'like', "%{$s}%"))
                ->when($request->q, fn ($q, $term) => $q->where(fn ($w) => $w->where('name', 'like', "%{$term}%")
                    ->orWhere('specialty', 'like', "%{$term}%")))
                ->orderBy('city')->orderBy('name')
                ->get()
        );
    }

    /** GET /artisans/{repairService} */
    public function show(RepairService $repairService): ArtisanResource
    {
        abort_unless($repairService->is_verified, 404);

        return new ArtisanResource($repairService);
    }

    /**
     * POST /artisans/register — pendaftaran layanan reparasi baru.
     * Data masuk dengan status belum terverifikasi dan baru tampil setelah disetujui admin.
     * Body: name, city, phone, specialties[] (kode), specialtyLabel?, bio?, address?, hours?
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'city' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'specialties' => ['nullable', 'array', 'max:6'],
            'specialties.*' => ['string', 'max:30'],
            'specialtyLabel' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'hours' => ['nullable', 'string', 'max:100'],
        ]);

        $service = RepairService::create([
            'name' => $data['name'],
            'city' => $data['city'],
            'address' => $data['address'] ?? null,
            'phone' => $data['phone'],
            'specialty_tags' => implode(',', $data['specialties'] ?? []),
            'specialty' => $data['specialtyLabel'] ?? implode(', ', $data['specialties'] ?? []),
            'description' => $data['bio'] ?? null,
            'opening_hours' => $data['hours'] ?? null,
            'is_verified' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran layanan reparasi terkirim dan menunggu verifikasi admin.',
            'data' => new ArtisanResource($service),
        ], 201);
    }
}
