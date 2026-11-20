<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['role_id', 'name', 'email', 'phone', 'password', 'is_active'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function partnerProfile(): HasOne
    {
        return $this->hasOne(PartnerProfile::class);
    }

    public function garments(): HasMany
    {
        return $this->hasMany(Garment::class);
    }

    public function requestedTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'requester_id');
    }

    public function repairRecords(): HasMany
    {
        return $this->hasMany(RepairRecord::class);
    }

    public function hasRole(string ...$roles): bool
    {
        return in_array($this->role?->name, $roles, true);
    }
}
