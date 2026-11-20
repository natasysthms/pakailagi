<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    public const STATUS_DIAJUKAN = 'diajukan';
    public const STATUS_DISEPAKATI = 'disepakati';
    public const STATUS_SELESAI = 'selesai';
    public const STATUS_DIBATALKAN = 'dibatalkan';

    protected $fillable = [
        'garment_id', 'requester_id', 'status', 'agreed_price', 'message',
        'agreed_at', 'completed_at', 'cancelled_at',
    ];

    protected $casts = [
        'agreed_price' => 'integer',
        'agreed_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function garment(): BelongsTo
    {
        return $this->belongsTo(Garment::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }
}
