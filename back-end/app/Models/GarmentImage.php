<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GarmentImage extends Model
{
    protected $fillable = ['garment_id', 'path', 'thumbnail_path', 'sort_order'];

    public function garment(): BelongsTo
    {
        return $this->belongsTo(Garment::class);
    }
}
