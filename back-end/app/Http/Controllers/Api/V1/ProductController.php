<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Concerns\HandlesGarmentInput;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductCardResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\TransactionResource;
use App\Models\Garment;
use App\Services\ImageService;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Marketplace preloved (FR-B1 s.d. FR-B8) */
class ProductController extends Controller
{
    use HandlesGarmentInput;

    private const PER_PAGE = 24;

    /** Relasi minimal untuk kartu katalog (hanya 1 gambar, kolom seperlunya) */
    private const CARD_RELATIONS = [
        'category:id,name',
        'fabricType:id,name',
        'coverImage',
        'owner:id,name,phone',
        'owner.partnerProfile:id,user_id,name,city,phone,is_verified',
    ];

    /**
     * GET /products?category=&size=&condition=&min_price=&max_price=&q=&page=
     * Green SE: simplePaginate (tanpa query COUNT) + hanya thumbnail.
     * Body tetap berupa array agar cocok dengan front end; info halaman ada di header X-Has-More-Pages.
     */
    public function index(Request $request): JsonResponse
    {
        $page = Garment::query()
            ->select(['id', 'user_id', 'garment_category_id', 'fabric_type_id', 'listing_type', 'title', 'slug',
                'size', 'condition', 'price', 'status', 'is_featured', 'created_at'])
            ->preloved()
            ->available()
            ->with(self::CARD_RELATIONS)
            ->when($request->category, fn ($q, $c) => $q->whereHas('category', fn ($q) => $q->where('name', $c)->orWhere('code', $c)))
            ->when($request->size, fn ($q, $s) => $q->where('size', $s))
            ->when($request->condition, fn ($q, $c) => $q->where('condition', 'like', "%{$c}%"))
            ->when($request->min_price, fn ($q, $p) => $q->where('price', '>=', (int) $p))
            ->when($request->max_price, fn ($q, $p) => $q->where('price', '<=', (int) $p))
            ->when($request->q, fn ($q, $term) => $q->where('title', 'like', "%{$term}%"))
            ->latest()
            ->simplePaginate(self::PER_PAGE);

        return ProductCardResource::collection($page->items())
            ->response()
            ->header('X-Has-More-Pages', $page->hasMorePages() ? '1' : '0');
    }

    /** GET /products/featured — maksimal 4 untuk beranda */
    public function featured()
    {
        return ProductCardResource::collection(
            Garment::query()->preloved()->available()->where('is_featured', true)
                ->with(self::CARD_RELATIONS)->latest()->limit(4)->get()
        );
    }

    /** GET /products/{id atau slug} */
    public function show(string $id): ProductResource
    {
        $garment = Garment::query()
            ->with([...self::CARD_RELATIONS, 'images'])
            ->where(fn ($q) => $q->where('id', $id)->orWhere('slug', $id))
            ->firstOrFail();

        return new ProductResource($garment);
    }

    /** POST /products (FR-B1) — multipart/form-data jika ada foto */
    public function store(Request $request, ImageService $images): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'size' => ['required', 'string', 'max:50'],
            'condition' => ['required', 'string', 'max:100'],
            'price' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string', 'max:2000'],
            ...$this->photoRules(),
        ]);

        $garment = Garment::create([
            'user_id' => $request->user()->id,
            'garment_category_id' => $this->resolveCategoryId($request),
            'fabric_type_id' => $this->resolveFabricTypeId($request),
            'listing_type' => 'preloved',
            'title' => $data['title'],
            'slug' => $this->uniqueSlug($data['title']),
            'size' => $data['size'],
            'condition' => $data['condition'],
            'price' => $data['price'],
            'description' => $data['description'] ?? null,
        ]);

        $this->storePhotos($garment, $request, $images);

        return response()->json([
            'success' => true,
            'message' => 'Penawaran pakaian berhasil dibuat.',
            'data' => new ProductResource($garment->load([...self::CARD_RELATIONS, 'images'])),
        ], 201);
    }

    /** PUT/POST /products/{garment} (FR-B8) — hanya pemilik */
    public function update(Request $request, Garment $garment, ImageService $images): JsonResponse
    {
        $this->authorizeOwner($request, $garment);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:150'],
            'size' => ['sometimes', 'string', 'max:50'],
            'condition' => ['sometimes', 'string', 'max:100'],
            'price' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            ...$this->photoRules(),
        ]);

        if ($request->hasAny(['category', 'garment_category_id'])) {
            $data['garment_category_id'] = $this->resolveCategoryId($request);
        }
        if ($request->hasAny(['material', 'fabric_type_id'])) {
            $data['fabric_type_id'] = $this->resolveFabricTypeId($request);
        }
        unset($data['photos']);

        $garment->update($data);
        $this->storePhotos($garment, $request, $images);

        return response()->json([
            'success' => true,
            'message' => 'Penawaran berhasil diperbarui.',
            'data' => new ProductResource($garment->load([...self::CARD_RELATIONS, 'images'])),
        ]);
    }

    /** DELETE /products/{garment} — diarsipkan (bukan dihapus) agar riwayat transaksi tetap utuh */
    public function destroy(Request $request, Garment $garment): JsonResponse
    {
        $this->authorizeOwner($request, $garment);

        if ($garment->status === Garment::STATUS_DIPESAN) {
            return response()->json(['message' => 'Pakaian sedang dalam proses transaksi dan belum bisa diarsipkan.'], 422);
        }

        $garment->update(['status' => Garment::STATUS_DIARSIPKAN]);

        return response()->json(['success' => true, 'message' => 'Penawaran diarsipkan.']);
    }

    /** POST /products/{garment}/purchase (FR-B4) — body: { notes | message } */
    public function purchase(Request $request, Garment $garment, TransactionService $transactions): JsonResponse
    {
        $request->validate([
            'notes' => ['nullable', 'string', 'max:1000'],
            'message' => ['nullable', 'string', 'max:1000'],
        ]);

        abort_if($garment->listing_type !== 'preloved', 404);

        $transaction = $transactions->request($garment, $request->user(), $request->input('notes', $request->input('message')));

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan pembelian berhasil dikirim ke penjual.',
            'data' => new TransactionResource($transaction->load(['garment.coverImage', 'garment.owner', 'requester'])),
        ], 201);
    }

    private function authorizeOwner(Request $request, Garment $garment): void
    {
        $user = $request->user()->loadMissing('role');
        abort_unless((int) $garment->user_id === (int) $user->id || $user->hasRole('admin'), 403, 'Hanya pemilik penawaran yang dapat mengubahnya.');
    }
}
