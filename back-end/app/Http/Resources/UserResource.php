<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Data akun ringkas (dikirim saat login/register). */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role->name,
            'roleLabel' => $this->role->label,
            'isActive' => $this->is_active,
            'partner' => $this->whenLoaded('partnerProfile', fn () => $this->partnerProfile ? [
                'type' => $this->partnerProfile->partner_type,
                'name' => $this->partnerProfile->name,
                'city' => $this->partnerProfile->city,
                'verified' => $this->partnerProfile->is_verified,
            ] : null),
        ];
    }
}
