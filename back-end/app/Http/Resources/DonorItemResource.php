<?php

namespace App\Http\Resources;

use App\Services\ImageService;
use App\Support\Labels;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Pakaian donasi siap salur. Butuh relasi: category, fabricType, coverImage, owner.partnerProfile */
class DonorItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category->name,
            'donorName' => $this->owner->name,
            'donorLocation' => $this->owner->partnerProfile?->city,
            'status' => Labels::garmentStatus($this->status, 'donasi'),
            'tags' => array_values(array_filter([
                "Ukuran: {$this->size}",
                "Kondisi: {$this->condition}",
                $this->fabricType?->name,
            ])),
            'description' => $this->description,
            'image' => ImageService::url($this->coverImage?->thumbnail_path ?? $this->coverImage?->path),
        ];
    }
}
