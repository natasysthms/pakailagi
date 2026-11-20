<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisplacementScenario extends Model
{
    protected $fillable = ['pathway', 'scenario', 'rate', 'source_ref'];

    protected $casts = ['rate' => 'decimal:4'];
}
