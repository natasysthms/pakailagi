<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Specialty extends Model
{
    protected $fillable = ['code', 'name'];

    public function repairServices(): BelongsToMany
    {
        return $this->belongsToMany(RepairService::class);
    }
}