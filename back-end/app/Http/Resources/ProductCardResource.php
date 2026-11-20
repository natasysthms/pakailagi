<?php

namespace App\Http\Resources;

use App\Services\ImageService;
use App\Services\ImpactCalculator;
use App\Support\Labels;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Kartu pakaian di katalog. Green SE: hanya mengirim SATU thumbnail dan field yang dipakai kartu,
 * bukan seluruh foto ukuran penuh.
 * Butuh relasi: category, fabricType, coverImage, owner.partnerProfile
 */
class ProductCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $partner = $this->owner->partnerProfile;

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'category' => $this->category->name,
            'price' => $this->price,
            'originalPrice' => null,      // tidak ada di ERD
            'size' => $this->size,
            'sizeShort' => $this->size,
            'condition' => $this->condition,
            'grade' => $this->condition,
            'material' => $this->fabricType?->name,
            'status' => Labels::garmentStatus($this->status, $this->listing_type),
            'featured' => $this->is_featured,
            'location' => $partner?->city,
            'avoidedCo2' => round(app(ImpactCalculator::class)->perItem($this->garment_category_id, $this->listing_type), 1),
            'conservedWater' => null,     // tidak ada faktor air di ERD/literatur proyek
            'images' => array_values(array_filter([ImageService::url($this->coverImage?->thumbnail_path ?? $this->coverImage?->path)])),
            'curator' => [
                'name' => $partner?->name ?? $this->owner->name,
                'initials' => Labels::initials($partner?->name ?? $this->owner->name),
                'location' => $partner?->city,
                'verified' => (bool) $partner?->is_verified,
            ],
        ];
    }
}
