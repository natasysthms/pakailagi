<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmissionFactor extends Model
{
    protected $fillable = ['garment_category_id', 'kg_co2e_per_item', 'system_boundary', 'source_ref', 'is_proxy'];

    protected $casts = [
        'kg_co2e_per_item' => 'decimal:3',
        'is_proxy' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(GarmentCategory::class, 'garment_category_id');
    }
}
