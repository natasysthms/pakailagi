<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RepairService extends Model
{
    protected $fillable = ['name', 'city', 'address', 'phone', 'description', 'opening_hours', 'is_verified'];

    protected $casts = ['is_verified' => 'boolean'];

    public function specialties(): BelongsToMany
    {
        return $this->belongsToMany(Specialty::class)->orderBy('specialties.id');
    }

    public function repairRecords(): HasMany
    {
        return $this->hasMany(RepairRecord::class);
    }
}