<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class FabricType extends Model
{
    protected $fillable = ['name', 'description'];

    public function garments(): HasMany
    {
        return $this->hasMany(Garment::class);
    }

    public function careGuide(): HasOne
    {
        return $this->hasOne(CareGuide::class);
    }
}
