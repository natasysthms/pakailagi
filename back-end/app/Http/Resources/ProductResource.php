<?php

namespace App\Http\Resources;

use App\Services\ImageService;
use Illuminate\Http\Request;

/**
 * Detail pakaian: semua foto ukuran penuh + kontak penjual.
 * Butuh relasi: category, fabricType, images, coverImage, owner.partnerProfile
 */
class ProductResource extends ProductCardResource
{
    public function toArray(Request $request): array
    {
        $card = parent::toArray($request);
        $partner = $this->owner->partnerProfile;

        return array_merge($card, [
            'categoryLabel' => $this->category->name,
            'description' => $this->description,
            'listingType' => $this->listing_type,
            'color' => null,
            'images' => $this->images->map(fn ($image) => ImageService::url($image->path))->values()->all(),
            'curator' => array_merge($card['curator'], [
                'whatsapp' => $partner?->phone ?? $this->owner->phone,
                'totalGarments' => null,
                'rating' => null,
            ]),
            'ownerId' => $this->user_id,
            'createdAt' => $this->created_at?->toIso8601String(),
        ]);
    }
}
