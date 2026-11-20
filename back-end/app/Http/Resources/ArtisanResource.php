<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Layanan reparasi (repair_services) dalam format "artisan" yang dipakai front end. */
class ArtisanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'city' => $this->city,
            'address' => trim($this->city.' • '.$this->address, ' •'),
            'specialties' => array_values(array_filter(explode(',', (string) $this->specialty_tags))),
            'specialtyLabel' => $this->specialty,
            'description' => $this->description,
            'hours' => $this->opening_hours,
            'whatsapp' => $this->phone,
            'verified' => $this->is_verified,
            'badge' => $this->is_verified ? 'Terverifikasi Kurator PakaiLagi' : 'Menunggu Verifikasi',
            'rating' => null,
            'estimate' => null,
            'image' => null,
        ];
    }
}
