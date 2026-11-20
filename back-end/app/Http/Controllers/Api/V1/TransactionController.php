<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Http\Request;

/** Pengelolaan status transaksi preloved & donasi (FR-B5, B6, B7, C4) */
class TransactionController extends Controller
{
    private const RELATIONS = ['garment.coverImage', 'garment.owner:id,name,phone', 'requester:id,name,phone'];

    public function __construct(private TransactionService $transactions)
    {
    }

    /** GET /transactions?as=requester|owner&status= — riwayat transaksi milik pengguna (FR-B7) */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Transaction::query()->with(self::RELATIONS)->latest();

        match ($request->query('as')) {
            'requester' => $query->where('requester_id', $user->id),
            'owner' => $query->whereHas('garment', fn ($q) => $q->where('user_id', $user->id)),
            default => $query->where(fn ($q) => $q->where('requester_id', $user->id)
                ->orWhereHas('garment', fn ($g) => $g->where('user_id', $user->id))),
        };

        $query->when($request->status, fn ($q, $s) => $q->where('status', $s));

        return TransactionResource::collection($query->limit(50)->get());
    }

    /** POST /transactions/{transaction}/approve — body: { agreedPrice? } */
    public function approve(Request $request, Transaction $transaction)
    {
        $this->authorizeOwner($request, $transaction);
        $data = $request->validate(['agreedPrice' => ['nullable', 'integer', 'min:0']]);

        return $this->respond($this->transactions->approve($transaction, $data['agreedPrice'] ?? null), 'Permintaan disetujui.');
    }

    /** POST /transactions/{transaction}/reject */
    public function reject(Request $request, Transaction $transaction)
    {
        $this->authorizeOwner($request, $transaction);

        return $this->respond($this->transactions->cancel($transaction), 'Permintaan ditolak. Pakaian kembali tersedia.');
    }

    /** POST /transactions/{transaction}/complete — setelah pembayaran/serah terima di luar sistem */
    public function complete(Request $request, Transaction $transaction)
    {
        $this->authorizeOwner($request, $transaction);

        return $this->respond($this->transactions->complete($transaction), 'Transaksi selesai dan tercatat di dashboard.');
    }

    /** POST /transactions/{transaction}/cancel — dibatalkan oleh pengaju */
    public function cancel(Request $request, Transaction $transaction)
    {
        abort_unless((int) $transaction->requester_id === (int) $request->user()->id, 403, 'Hanya pengaju yang dapat membatalkan.');

        return $this->respond($this->transactions->cancel($transaction), 'Pengajuan dibatalkan.');
    }

    private function authorizeOwner(Request $request, Transaction $transaction): void
    {
        $user = $request->user()->loadMissing('role');
        $ownerId = $transaction->garment()->value('user_id');

        abort_unless((int) $ownerId === (int) $user->id || $user->hasRole('admin'), 403, 'Hanya pemilik pakaian yang dapat memproses transaksi ini.');
    }

    private function respond(Transaction $transaction, string $message)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => new TransactionResource($transaction->load(self::RELATIONS)),
        ]);
    }
}
