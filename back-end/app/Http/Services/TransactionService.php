<?php

namespace App\Services;

use App\Models\Garment;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Alur status transaksi preloved dan donasi (activity diagram 3.2.2 a):
 * diajukan → disepakati → selesai, atau dibatalkan (ditolak pemilik / dibatalkan pengaju).
 */
class TransactionService
{
    /** Pengajuan pembelian (preloved) atau permintaan donasi. */
    public function request(Garment $garment, User $requester, ?string $message = null): Transaction
    {
        return DB::transaction(function () use ($garment, $requester, $message) {
            // Kunci baris agar dua pengguna tidak bisa memesan pakaian yang sama bersamaan
            $garment = Garment::query()->whereKey($garment->id)->lockForUpdate()->firstOrFail();

            if ((int) $garment->user_id === (int) $requester->id) {
                throw ValidationException::withMessages(['garment' => 'Tidak dapat mengajukan permintaan untuk pakaian milik sendiri.']);
            }

            if ($garment->status !== Garment::STATUS_TERSEDIA) {
                throw ValidationException::withMessages(['garment' => 'Pakaian ini sudah tidak tersedia.']);
            }

            $transaction = Transaction::create([
                'garment_id' => $garment->id,
                'requester_id' => $requester->id,
                'status' => Transaction::STATUS_DIAJUKAN,
                'message' => $message,
            ]);

            $garment->update(['status' => Garment::STATUS_DIPESAN]);

            return $transaction;
        });
    }

    /** Pemilik menyetujui. Untuk preloved, harga yang disepakati disimpan sebagai riwayat. */
    public function approve(Transaction $transaction, ?int $agreedPrice = null): Transaction
    {
        $this->assertStatus($transaction, [Transaction::STATUS_DIAJUKAN]);
        $garment = $transaction->garment;

        $transaction->update([
            'status' => Transaction::STATUS_DISEPAKATI,
            'agreed_at' => now(),
            'agreed_price' => $garment->listing_type === 'preloved' ? ($agreedPrice ?? $garment->price) : null,
        ]);

        return $transaction;
    }

    /** Ditolak pemilik atau dibatalkan pengaju: pakaian kembali tersedia. */
    public function cancel(Transaction $transaction): Transaction
    {
        $this->assertStatus($transaction, [Transaction::STATUS_DIAJUKAN, Transaction::STATUS_DISEPAKATI]);

        DB::transaction(function () use ($transaction) {
            $transaction->update(['status' => Transaction::STATUS_DIBATALKAN, 'cancelled_at' => now()]);
            $transaction->garment->update(['status' => Garment::STATUS_TERSEDIA]);
        });

        return $transaction;
    }

    /**
     * Pemilik menandai selesai setelah pembayaran/serah terima di luar sistem.
     * Penghitung ringkasan dashboard ditambah, lalu cache dashboard dihapus.
     */
    public function complete(Transaction $transaction): Transaction
    {
        $this->assertStatus($transaction, [Transaction::STATUS_DISEPAKATI]);

        DB::transaction(function () use ($transaction) {
            $garment = $transaction->garment;

            $transaction->update(['status' => Transaction::STATUS_SELESAI, 'completed_at' => now()]);
            $garment->update(['status' => Garment::STATUS_SELESAI]);

            // INSERT baris baru dengan nilai 1, atau tambah 1 jika baris (tanggal, kategori, jalur) sudah ada
            DB::table('dashboard_daily_counts')->upsert(
                [[
                    'date' => today()->toDateString(),
                    'garment_category_id' => $garment->garment_category_id,
                    'pathway' => $garment->listing_type,
                    'completed_count' => 1,
                ]],
                ['date', 'garment_category_id', 'pathway'],
                ['completed_count' => DB::raw('completed_count + 1')]
            );
        });

        ImpactCalculator::forget();

        return $transaction;
    }

    private function assertStatus(Transaction $transaction, array $allowed): void
    {
        if (! in_array($transaction->status, $allowed, true)) {
            throw ValidationException::withMessages([
                'status' => "Transaksi berstatus \"{$transaction->status}\" tidak dapat diproses dengan aksi ini.",
            ]);
        }
    }
}
