<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CareGuideStep extends Model
{
    protected $fillable = ['care_guide_id', 'step_type', 'sort_order', 'content'];

    public function careGuide(): BelongsTo
    {
        return $this->belongsTo(CareGuide::class);
    }
}
