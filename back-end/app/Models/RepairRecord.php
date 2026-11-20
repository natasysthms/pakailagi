<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairRecord extends Model
{
    protected $fillable = ['user_id', 'garment_category_id', 'repair_service_id', 'repaired_at', 'notes'];

    protected $casts = ['repaired_at' => 'date'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(GarmentCategory::class, 'garment_category_id');
    }

    public function repairService(): BelongsTo
    {
        return $this->belongsTo(RepairService::class);
    }
}
