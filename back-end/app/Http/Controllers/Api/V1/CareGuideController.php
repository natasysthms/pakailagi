<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CareGuideResource;
use App\Models\CareGuide;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

/** Clothing Care Guide (FR-D1). Konten jarang berubah, jadi disimpan di cache sampai admin mengubahnya. */
class CareGuideController extends Controller
{
    public const CACHE_KEY = 'care-guides';

    /** GET /care-guides */
    public function index(): JsonResponse
    {
        $guides = Cache::rememberForever(self::CACHE_KEY, fn () => CareGuideResource::collection(
            CareGuide::query()->with(['fabricType:id,name', 'steps'])->orderBy('id')->get()
        )->resolve());

        return response()->json($guides);
    }

    /** GET /care-guides/{slug} */
    public function show(string $slug): CareGuideResource
    {
        return new CareGuideResource(
            CareGuide::query()->with(['fabricType:id,name', 'steps'])->where('slug', $slug)->firstOrFail()
        );
    }
}
