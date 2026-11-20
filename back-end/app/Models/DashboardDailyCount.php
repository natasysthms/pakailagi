<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Tabel ringkasan dengan primary key komposit (date, garment_category_id, pathway).
 * Eloquent tidak mendukung primary key komposit, jadi model ini hanya untuk MEMBACA.
 * Penambahan hitungan dilakukan lewat query INSERT ... ON DUPLICATE KEY UPDATE.
 */
class DashboardDailyCount extends Model
{
    protected $primaryKey = null;
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = ['date', 'garment_category_id', 'pathway', 'completed_count'];

    protected $casts = [
        'date' => 'date',
        'completed_count' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(GarmentCategory::class, 'garment_category_id');
    }
}
