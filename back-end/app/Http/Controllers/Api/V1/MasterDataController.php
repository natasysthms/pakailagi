<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\FabricType;
use App\Models\GarmentCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

/** Data master untuk pilihan di form (kategori & jenis kain). Hampir tidak pernah berubah → cache. */
class MasterDataController extends Controller
{
    /** GET /categories */
    public function categories(): JsonResponse
    {
        return response()->json(Cache::rememberForever('master.categories',
            fn () => GarmentCategory::query()->orderBy('name')->get(['id', 'code', 'name'])->toArray()));
    }

    /** GET /fabric-types */
    public function fabricTypes(): JsonResponse
    {
        return response()->json(Cache::rememberForever('master.fabric-types',
            fn () => FabricType::query()->orderBy('name')->get(['id', 'name'])->toArray()));
    }
}
