<?php

namespace App\Http\Controllers\Api\V1\Concerns;

use App\Models\FabricType;
use App\Models\Garment;
use App\Models\GarmentCategory;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/** Logika bersama untuk membuat/mengubah pakaian (preloved maupun donasi). */
trait HandlesGarmentInput
{
    /** Front end boleh mengirim id kategori, kode (ATASAN), atau nama (Atasan). */
    protected function resolveCategoryId(Request $request, bool $required = true): ?int
    {
        $value = $request->input('garment_category_id', $request->input('category'));

        if ($value === null || $value === '') {
            if ($required) {
                throw ValidationException::withMessages(['category' => 'Kategori pakaian wajib diisi.']);
            }

            return null;
        }

        $id = GarmentCategory::query()
            ->where('id', $value)->orWhere('code', $value)->orWhere('name', $value)
            ->value('id');

        if (! $id) {
            throw ValidationException::withMessages(['category' => 'Kategori pakaian tidak dikenal.']);
        }

        return $id;
    }

    protected function resolveFabricTypeId(Request $request): ?int
    {
        $value = $request->input('fabric_type_id', $request->input('material'));

        return $value ? FabricType::query()->where('id', $value)->orWhere('name', $value)->value('id') : null;
    }

    protected function photoRules(): array
    {
        return [
            'photos' => ['nullable', 'array', 'max:5'],
            'photos.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'], // maks 4 MB per foto
        ];
    }

    protected function uniqueSlug(string $title): string
    {
        return Str::slug($title).'-'.Str::lower(Str::random(5));
    }

    /** Simpan foto yang diunggah sebagai WebP + thumbnail. */
    protected function storePhotos(Garment $garment, Request $request, ImageService $images): void
    {
        $order = (int) $garment->images()->max('sort_order') + ($garment->images()->exists() ? 1 : 0);

        foreach ((array) $request->file('photos', []) as $file) {
            $garment->images()->create($images->storeGarmentImage($file) + ['sort_order' => $order++]);
        }
    }
}
