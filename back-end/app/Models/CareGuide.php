<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CareGuide extends Model
{
    protected $fillable = ['fabric_type_id', 'slug', 'title', 'subtitle', 'icon'];

    public function fabricType(): BelongsTo
    {
        return $this->belongsTo(FabricType::class);
    }

    public function steps(): HasMany
    {
        return $this->hasMany(CareGuideStep::class)->orderBy('sort_order');
    }
}
