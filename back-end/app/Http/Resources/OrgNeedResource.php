<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Organisasi penerima donasi (partner_profiles bertipe organisasi_donasi), untuk tab "Saya Ingin Memberi".
 * Field urgency/target/category tidak ada di ERD, sehingga diisi nilai netral.
 * Atribut tambahan "collected" diisi controller (jumlah donasi selesai yang diterima).
 */
class OrgNeedResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->user_id,     // id pengguna organisasi (dipakai sebagai targetId saat donasi)
            'orgName' => $this->name,
            'location' => $this->address ?? $this->city,
            'requirement' => $this->description,
            'category' => 'Umum',
            'urgency' => 'Aktif',
            'collected' => (int) ($this->collected ?? 0),
            'target' => null,
            'verified' => $this->is_verified,
            'phone' => $this->phone,
            'image' => null,
        ];
    }
}
