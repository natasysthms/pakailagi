<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Garment extends Model
{
    public const STATUS_TERSEDIA = 'tersedia';
    public const STATUS_DIPESAN = 'dipesan';
    public const STATUS_SELESAI = 'selesai';
    public const STATUS_DIARSIPKAN = 'diarsipkan';

    protected $fillable = [
        'user_id', 'garment_category_id', 'fabric_type_id', 'listing_type', 'title', 'slug',
        'size', 'condition', 'price', 'description', 'status', 'is_featured',
    ];

    protected $casts = [
        'price' => 'integer',
        'is_featured' => 'boolean',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(GarmentCategory::class, 'garment_category_id');
    }

    public function fabricType(): BelongsTo
    {
        return $this->belongsTo(FabricType::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(GarmentImage::class)->orderBy('sort_order');
    }

    /** Hanya gambar pertama: dipakai katalog agar tidak memuat semua foto (Green SE). */
    public function coverImage(): HasOne
    {
        return $this->hasOne(GarmentImage::class)->ofMany('sort_order', 'min');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function scopePreloved(Builder $query): Builder
    {
        return $query->where('listing_type', 'preloved');
    }

    public function scopeDonation(Builder $query): Builder
    {
        return $query->where('listing_type', 'donasi');
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_TERSEDIA);
    }
}
