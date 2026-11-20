<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Format sama dengan FIBER_PROTOCOLS di CareGuidePage.jsx. Butuh relasi: fabricType, steps */
class CareGuideResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $step = fn (string $type) => $this->steps->firstWhere('step_type', $type)?->content;
        $tip = $step('rawat');

        return [
            'id' => $this->slug,
            'name' => $this->title,
            'category' => $this->fabricType->name,
            'subtitle' => $this->subtitle,
            'icon' => $this->icon,
            'wash' => $step('cuci'),
            'dry' => $step('kering'),
            'store' => $step('simpan'),
            'tip' => $tip ? "💡 Tip Kurator: {$tip}" : null,
            'steps' => $this->steps->map(fn ($s) => [
                'id' => $s->id,
                'type' => $s->step_type,
                'order' => $s->sort_order,
                'content' => $s->content,
            ])->values()->all(),
        ];
    }
}
