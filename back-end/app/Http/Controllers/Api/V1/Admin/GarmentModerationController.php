<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Garment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

/** Moderasi penawaran (FR-F3) */
class GarmentModerationController extends Controller
{
    /** GET /admin/garments?status=&listing_type=&page= */
    public function index(Request $request)
    {
        return ProductResource::collection(
            Garment::query()
                ->with(['category:id,name', 'fabricType:id,name', 'coverImage', 'images', 'owner:id,name,phone',
                    'owner.partnerProfile:id,user_id,name,city,phone,is_verified'])
                ->when($request->status, fn ($q, $s) => $q->where('status', $s))
                ->when($request->listing_type, fn ($q, $t) => $q->where('listing_type', $t))
                ->latest()
                ->paginate(20)
        );
    }

    /** PATCH /admin/garments/{garment}/archive — menurunkan penawaran yang tidak sesuai */
    public function archive(Garment $garment): JsonResponse
    {
        abort_if($garment->status === Garment::STATUS_SELESAI, 422, 'Pakaian dengan transaksi selesai tidak dapat diarsipkan.');

        $garment->update(['status' => Garment::STATUS_DIARSIPKAN]);
        Cache::forget('admin.stats');

        return response()->json(['success' => true, 'message' => 'Penawaran diarsipkan oleh admin.']);
    }
}
