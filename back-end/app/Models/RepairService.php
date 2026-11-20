<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RepairService extends Model
{
    protected $fillable = ['name', 'city', 'address', 'phone', 'specialty', 'description', 'opening_hours', 'is_verified'];

    protected $casts = ['is_verified' => 'boolean'];

    public function repairRecords(): HasMany
    {
        return $this->hasMany(RepairRecord::class);
    }
}
