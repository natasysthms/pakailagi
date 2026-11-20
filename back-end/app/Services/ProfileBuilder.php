<?php

namespace App\Services;

use App\Models\Garment;
use App\Models\RepairRecord;
use App\Models\Transaction;
use App\Models\User;
use App\Support\Labels;

/**
 * Menyusun data halaman Profil (format sama dengan mockData/profile.js).
 * Setiap bagian memakai satu query dengan eager loading, tanpa N+1.
 */
class ProfileBuilder
{
    public function __construct(private ImpactCalculator $impact)
    {
    }

    public function build(User $user): array
    {
        $user->loadMissing(['role', 'partnerProfile']);
        $partner = $user->partnerProfile;

        $activities = $this->activities($user);
        $completed = $this->completedTransactions($user);

        $avoided = $completed->sum(fn (Transaction $t) => $this->impact->perItem($t->garment->garment_category_id, $t->garment->listing_type));
        $repairs = RepairRecord::query()->where('user_id', $user->id)->count();

        $profile = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role->name,
            'avatar' => null,
            'badge' => $partner?->is_verified ? 'Mitra Terverifikasi PakaiLagi' : $user->role->label,
            'location' => $partner?->city,
            'memberSince' => $user->created_at?->translatedFormat('F Y'),
            'node' => $partner?->city,
            'bio' => $partner?->description,
            'stats' => [
                'circulatedPieces' => $completed->count().' Pcs',
                'avoidedCarbon' => Labels::kg($avoided).' kg',   // estimasi skenario dasar
                'repairsCount' => $repairs.'x Reparasi',
                'conservedWater' => null,
            ],
            'consumerActivities' => $activities,
            'sellerStore' => null,
        ];

        if ($user->hasRole('penjual') || $user->garments()->exists()) {
            $profile['sellerStore'] = [
                'storeName' => $partner?->name ?? $user->name,
                'node' => $partner?->city,
                'rating' => null,
                'reviewsCount' => null,
                'completedTransactions' => $completed->where('garment.user_id', $user->id)->count(),
                'accuracyRate' => null,
                'incomingRequests' => $this->incomingRequests($user),
                'inventory' => $this->inventory($user),
            ];
        }

        return $profile;
    }

    /** Riwayat aktivitas sebagai pengaju (beli/minta donasi) + catatan reparasi. */
    public function activities(User $user): array
    {
        $transactions = Transaction::query()
            ->where('requester_id', $user->id)
            ->with(['garment:id,user_id,garment_category_id,listing_type,title,price', 'garment.owner:id,name,phone', 'garment.coverImage'])
            ->latest()
            ->limit(30)
            ->get()
            ->map(function (Transaction $t) {
                $g = $t->garment;
                $isDonation = $g->listing_type === 'donasi';
                $date = ($t->completed_at ?? $t->agreed_at ?? $t->created_at)?->translatedFormat('j M Y');

                return [
                    'id' => ($isDonation ? 'DON-' : 'PKL-').$t->id,
                    'transactionId' => $t->id,
                    'category' => $g->listing_type,
                    'status' => Labels::transactionStatus($t->status),
                    'statusType' => Labels::transactionStatusType($t->status),
                    'typeLabel' => ($isDonation ? 'Program Donasi' : 'Beli Preloved').' • ID: '.$t->id,
                    'title' => $g->title,
                    'subtitle' => ($isDonation ? 'Pemberi: ' : 'Penjual: ').$g->owner->name
                        .($isDonation ? '' : ' • Rp '.number_format($t->agreed_price ?? $g->price, 0, ',', '.'))
                        .' • '.$date,
                    'note' => $t->message,
                    'image' => ImageService::url($g->coverImage?->thumbnail_path ?? $g->coverImage?->path),
                    'whatsapp' => $g->owner->phone,
                ];
            });

        $repairs = RepairRecord::query()
            ->where('user_id', $user->id)
            ->with(['category:id,name', 'repairService:id,name,phone'])
            ->latest('repaired_at')
            ->limit(20)
            ->get()
            ->map(fn (RepairRecord $r) => [
                'id' => 'REP-'.$r->id,
                'category' => 'reparasi',
                'status' => 'REPARASI TERCATAT',
                'statusType' => 'completed',
                'typeLabel' => 'Catatan Reparasi • ID: '.$r->id,
                'title' => 'Reparasi '.$r->category->name,
                'subtitle' => ($r->repairService ? 'Layanan: '.$r->repairService->name : 'Diperbaiki sendiri')
                    .' • '.$r->repaired_at->translatedFormat('j M Y'),
                'note' => $r->notes,
                'image' => null,
                'whatsapp' => $r->repairService?->phone,
            ]);

        return $transactions->concat($repairs)->values()->all();
    }

    /** Permintaan masuk untuk pakaian milik pengguna (antrian penjual). */
    public function incomingRequests(User $user): array
    {
        return Transaction::query()
            ->whereIn('status', [Transaction::STATUS_DIAJUKAN, Transaction::STATUS_DISEPAKATI])
            ->whereHas('garment', fn ($q) => $q->where('user_id', $user->id))
            ->with(['garment:id,title,price,size,listing_type', 'garment.coverImage', 'requester:id,name,phone'])
            ->latest()
            ->get()
            ->map(fn (Transaction $t) => [
                'id' => $t->id,
                'transactionId' => $t->id,
                'rawStatus' => $t->status,
                'pathway' => $t->garment->listing_type,
                'title' => $t->garment->title,
                'price' => $t->agreed_price ?? $t->garment->price ?? 0,
                'size' => $t->garment->size,
                'buyerName' => $t->requester->name,
                'buyerMessage' => $t->message,
                'time' => $t->created_at?->diffForHumans(),
                'status' => Labels::transactionStatus($t->status),
                'whatsapp' => $t->requester->phone,
                'image' => ImageService::url($t->garment->coverImage?->thumbnail_path ?? $t->garment->coverImage?->path),
            ])
            ->values()
            ->all();
    }

    /** Pakaian yang ditawarkan pengguna (belum selesai/diarsipkan). */
    public function inventory(User $user): array
    {
        return Garment::query()
            ->where('user_id', $user->id)
            ->whereIn('status', [Garment::STATUS_TERSEDIA, Garment::STATUS_DIPESAN])
            ->with(['fabricType:id,name', 'coverImage'])
            ->withCount(['transactions as pending_requests' => fn ($q) => $q->where('status', Transaction::STATUS_DIAJUKAN)])
            ->latest()
            ->get()
            ->map(fn (Garment $g) => [
                'id' => $g->id,
                'slug' => $g->slug,
                'title' => $g->title,
                'listingType' => $g->listing_type,
                'price' => $g->price ?? 0,
                'size' => trim($g->size.($g->fabricType ? ' • '.$g->fabricType->name : '')),
                'grade' => $g->condition,
                'statusBadge' => $g->pending_requests > 0 ? 'Ada Permintaan' : Labels::garmentStatus($g->status, $g->listing_type),
                'description' => $g->description,
                'image' => ImageService::url($g->coverImage?->thumbnail_path ?? $g->coverImage?->path),
            ])
            ->values()
            ->all();
    }

    /** Transaksi selesai di mana pengguna terlibat (sebagai pengaju atau pemilik pakaian). */
    private function completedTransactions(User $user)
    {
        return Transaction::query()
            ->where('status', Transaction::STATUS_SELESAI)
            ->where(fn ($q) => $q->where('requester_id', $user->id)
                ->orWhereHas('garment', fn ($g) => $g->where('user_id', $user->id)))
            ->with('garment:id,user_id,garment_category_id,listing_type')
            ->get();
    }
}
