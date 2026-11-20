<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class GarmentCategory extends Model
{
    protected $fillable = ['code', 'name'];

    public function garments(): HasMany
    {
        return $this->hasMany(Garment::class);
    }

    public function emissionFactor(): HasOne
    {
        return $this->hasOne(EmissionFactor::class);
    }
}
