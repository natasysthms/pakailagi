<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\HandlesGarmentInput;
use App\Http\Controllers\Controller;
use App\Http\Resources\DonorItemResource;
use App\Http\Resources\OrgNeedResource;
use App\Http\Resources\TransactionResource;
use App\Models\Garment;
use App\Models\PartnerProfile;
use App\Models\Transaction;
use App\Models\User;
use App\Services\ImageService;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/** Clothing Donation Hub (FR-C1 s.d. FR-C5) */
class DonationController extends Controller
{
    use HandlesGarmentInput;

    private const ITEM_RELATIONS = [
        'category:id,name',
        'fabricType:id,name',
        'coverImage',
        'owner:id,name',
        'owner.partnerProfile:id,user_id,city',
    ];

    /** GET /donations/org-needs — direktori organisasi penerima donasi (FR-C5) */
    public function orgNeeds()
    {
        $organisations = PartnerProfile::query()
            ->where('partner_type', 'organisasi_donasi')
            ->orderByDesc('is_verified')
            ->orderBy('name')
            ->get();

        // Jumlah donasi selesai yang diterima tiap organisasi — satu query GROUP BY untuk semua organisasi
        $collected = Transaction::query()
            ->where('status', Transaction::STATUS_SELESAI)
            ->whereIn('requester_id', $organisations->pluck('user_id'))
            ->whereHas('garment', fn ($q) => $q->where('listing_type', 'donasi'))
            ->selectRaw('requester_id, COUNT(*) AS total')
            ->groupBy('requester_id')
            ->pluck('total', 'requester_id');

        $organisations->each(fn ($org) => $org->setAttribute('collected', $collected[$org->user_id] ?? 0));

        return OrgNeedResource::collection($organisations);
    }

    /** GET /donations/donor-items?category=&q= — pakaian donasi yang tersedia / menunggu pengambilan (FR-C2) */
    public function donorItems(Request $request): JsonResponse
    {
        $page = Garment::query()
            ->donation()
            ->whereIn('status', [Garment::STATUS_TERSEDIA, Garment::STATUS_DIPESAN])
            ->with(self::ITEM_RELATIONS)
            ->when($request->category, fn ($q, $c) => $q->whereHas('category', fn ($q) => $q->where('name', $c)->orWhere('code', $c)))
            ->when($request->q, fn ($q, $term) => $q->where('title', 'like', "%{$term}%"))
            ->latest()
            ->simplePaginate(24);

        return DonorItemResource::collection($page->items())
            ->response()
            ->header('X-Has-More-Pages', $page->hasMorePages() ? '1' : '0');
    }

    /**
     * POST /donations/upload (FR-C1) — menawarkan pakaian sebagai donasi.
     * Body (multipart): title, category, condition, size?, quantity?, notes?, material?, photos[]
     */
    public function upload(Request $request, ImageService $images): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'condition' => ['required', 'string', 'max:100'],
            'size' => ['nullable', 'string', 'max:50'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:100'],
            'notes' => ['nullable', 'string', 'max:2000'],
            ...$this->photoRules(),
        ]);

        $garment = Garment::create([
            'user_id' => $request->user()->id,
            'garment_category_id' => $this->resolveCategoryId($request),
            'fabric_type_id' => $this->resolveFabricTypeId($request),
            'listing_type' => 'donasi',
            'title' => $data['title'],
            'slug' => $this->uniqueSlug($data['title']),
            'size' => $data['size'] ?? 'All Size',
            'condition' => $data['condition'],
            'price' => null,
            'description' => trim(($data['notes'] ?? '').(isset($data['quantity']) ? "\nJumlah: {$data['quantity']} pcs" : '')),
        ]);

        $this->storePhotos($garment, $request, $images);

        return response()->json([
            'success' => true,
            'message' => 'Pakaian berhasil didaftarkan sebagai donasi siap salur.',
            'data' => new DonorItemResource($garment->load(self::ITEM_RELATIONS)),
        ], 201);
    }

    /** POST /donations/{garment}/request (FR-C3) — penerima meminta pakaian donasi tertentu. */
    public function requestItem(Request $request, TransactionService $transactions, Garment $garment): JsonResponse
    {
        return $this->createRequest($request, $transactions, $garment);
    }

    /** POST /donations/request — sama seperti di atas, id pakaian dikirim di body sebagai itemId (format front end). */
    public function requestByBody(Request $request, TransactionService $transactions): JsonResponse
    {
        $request->validate(['itemId' => ['required', 'integer', 'exists:garments,id']]);

        return $this->createRequest($request, $transactions, Garment::findOrFail($request->integer('itemId')));
    }

    /** Body: orgName?, phone?, address?, reason? */
    private function createRequest(Request $request, TransactionService $transactions, Garment $garment): JsonResponse
    {
        $data = $request->validate([
            'orgName' => ['nullable', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        abort_if($garment->listing_type !== 'donasi', 404);

        $message = collect([
            ! empty($data['orgName']) ? "Penerima: {$data['orgName']}" : null,
            ! empty($data['phone']) ? "Kontak: {$data['phone']}" : null,
            ! empty($data['address']) ? "Alamat: {$data['address']}" : null,
            $data['reason'] ?? null,
        ])->filter()->implode("\n");

        $transaction = $transactions->request($garment, $request->user(), $message ?: null);

        return response()->json([
            'success' => true,
            'message' => 'Permintaan donasi berhasil dikirim ke pemberi.',
            'data' => new TransactionResource($transaction->load(['garment.coverImage', 'garment.owner', 'requester'])),
        ], 201);
    }

    /**
     * POST /donations/commit — donatur menyalurkan pakaian langsung ke organisasi yang dipilih.
     * Sistem membuat pakaian donasi + transaksi "disepakati" (donatur sudah memilih penerima).
     * Donatur menandai selesai setelah serah terima (POST /transactions/{id}/complete).
     * Body: targetId (id organisasi dari org-needs), category, title?/items?, quantity?, method?, phone?, notes?
     */
    public function commit(Request $request): JsonResponse
    {
        $data = $request->validate([
            'targetId' => ['required', 'integer'],
            'title' => ['nullable', 'string', 'max:150'],
            'items' => ['nullable', 'string', 'max:150'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:100'],
            'method' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:20'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $organisation = User::query()
            ->whereKey($data['targetId'])
            ->whereHas('partnerProfile', fn ($q) => $q->where('partner_type', 'organisasi_donasi'))
            ->with('partnerProfile:id,user_id,name')
            ->firstOrFail();

        $donor = $request->user();
        abort_if((int) $donor->id === (int) $organisation->id, 422, 'Tidak dapat berdonasi ke akun sendiri.');

        $categoryId = $this->resolveCategoryId($request);
        $title = $data['title'] ?? $data['items'] ?? 'Donasi untuk '.$organisation->partnerProfile->name;

        $transaction = DB::transaction(function () use ($data, $donor, $organisation, $categoryId, $title) {
            $garment = Garment::create([
                'user_id' => $donor->id,
                'garment_category_id' => $categoryId,
                'listing_type' => 'donasi',
                'title' => $title,
                'slug' => $this->uniqueSlug($title),
                'size' => 'All Size',
                'condition' => 'Layak Pakai',
                'description' => trim(($data['notes'] ?? '').(isset($data['quantity']) ? "\nJumlah: {$data['quantity']} pcs" : '')),
                'status' => Garment::STATUS_DIPESAN,
            ]);

            return Transaction::create([
                'garment_id' => $garment->id,
                'requester_id' => $organisation->id,
                'status' => Transaction::STATUS_DISEPAKATI,
                'agreed_at' => now(),
                'message' => collect([
                    ! empty($data['method']) ? "Metode serah terima: {$data['method']}" : null,
                    ! empty($data['phone']) ? "Kontak donatur: {$data['phone']}" : null,
                ])->filter()->implode("\n") ?: null,
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Komitmen donasi tercatat. Tandai selesai setelah pakaian diserahkan ke organisasi.',
            'data' => new TransactionResource($transaction->load(['garment.coverImage', 'garment.owner', 'requester'])),
        ], 201);
    }
}
