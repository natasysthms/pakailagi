<?php

namespace App\Http\Resources;

use App\Services\ImageService;
use App\Support\Labels;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Butuh relasi: garment.coverImage, garment.owner, requester */
class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $garment = $this->garment;

        return [
            'id' => $this->id,
            'status' => $this->status,
            'statusLabel' => Labels::transactionStatus($this->status),
            'statusType' => Labels::transactionStatusType($this->status),
            'pathway' => $garment->listing_type,
            'agreedPrice' => $this->agreed_price,
            'message' => $this->message,
            'garment' => [
                'id' => $garment->id,
                'title' => $garment->title,
                'size' => $garment->size,
                'price' => $garment->price,
                'image' => ImageService::url($garment->coverImage?->thumbnail_path ?? $garment->coverImage?->path),
            ],
            'owner' => ['id' => $garment->owner->id, 'name' => $garment->owner->name, 'phone' => $garment->owner->phone],
            'requester' => ['id' => $this->requester->id, 'name' => $this->requester->name, 'phone' => $this->requester->phone],
            'createdAt' => $this->created_at?->toIso8601String(),
            'agreedAt' => $this->agreed_at?->toIso8601String(),
            'completedAt' => $this->completed_at?->toIso8601String(),
            'cancelledAt' => $this->cancelled_at?->toIso8601String(),
        ];
    }
}
