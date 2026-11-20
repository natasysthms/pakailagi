<?php

namespace Database\Seeders;

use App\Models\Garment;
use App\Models\GarmentCategory;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Membuat transaksi SELESAI sesuai Tabel 4.1 (SimulationData::COMPLETED).
 * Setiap potong = satu pakaian berstatus "selesai" + satu transaksi berstatus "selesai".
 * Pakaian ini tidak tampil di katalog, hanya dihitung di dashboard dan riwayat profil.
 * Hasilnya selalu sama setiap kali seeder dijalankan (tanpa angka acak).
 */
class TransactionSeeder extends Seeder
{
    private const CATEGORY_LABEL = [
        'ATASAN' => 'Atasan', 'CELANA_ROK' => 'Celana/Rok', 'DENIM' => 'Denim',
        'OUTERWEAR' => 'Outerwear', 'ANAK' => 'Pakaian Anak',
    ];

    public function run(): void
    {
        $categories = GarmentCategory::pluck('id', 'code');

        $sellers = User::whereHas('partnerProfile', fn ($q) => $q->where('partner_type', 'thrift_shop'))->orderBy('id')->pluck('id')->all();
        $organisations = User::whereHas('partnerProfile', fn ($q) => $q->where('partner_type', 'organisasi_donasi'))->orderBy('id')->pluck('id')->all();
        $consumers = User::whereHas('role', fn ($q) => $q->where('name', 'konsumen'))->orderBy('id')->pluck('id')->all();

        DB::transaction(function () use ($categories, $sellers, $organisations, $consumers) {
            // 1. Donasi yang sedang berjalan (disepakati, menunggu serah terima) — untuk contoh di profil
            $pending = Garment::where('listing_type', 'donasi')->where('status', Garment::STATUS_DIPESAN)->first();
            if ($pending && $organisations) {
                Transaction::create([
                    'garment_id' => $pending->id,
                    'requester_id' => $organisations[0],
                    'status' => Transaction::STATUS_DISEPAKATI,
                    'agreed_at' => now()->subDay(),
                ]);
            }

            // 2. Transaksi selesai sesuai Tabel 4.1
            $sequence = 0;
            foreach (SimulationData::COMPLETED as $code => [$prelovedCount, $donationCount]) {
                foreach (['preloved' => $prelovedCount, 'donasi' => $donationCount] as $pathway => $count) {
                    for ($i = 1; $i <= $count; $i++, $sequence++) {
                        $isDonation = $pathway === 'donasi';

                        // Preloved: penjual (thrift shop) → konsumen. Donasi: konsumen → organisasi.
                        $owner = $isDonation ? $consumers[$sequence % count($consumers)] : $sellers[$sequence % count($sellers)];
                        $requester = $isDonation ? $organisations[$sequence % count($organisations)] : $consumers[$sequence % count($consumers)];

                        $price = $isDonation ? null : 50000 + ($sequence % 8) * 15000; // harga simulasi Rp50.000–Rp155.000
                        $completedAt = now()->subDays(($sequence * 7) % SimulationData::SPREAD_DAYS + 1)->setTime(10 + $sequence % 8, 0);
                        $title = sprintf('%s %s #%02d (simulasi)', self::CATEGORY_LABEL[$code], $isDonation ? 'donasi' : 'preloved', $i);

                        $garment = Garment::create([
                            'user_id' => $owner,
                            'garment_category_id' => $categories[$code],
                            'listing_type' => $pathway,
                            'title' => $title,
                            'slug' => sprintf('sim-%s-%s-%02d', strtolower($code), $pathway, $i),
                            'size' => 'Size M',
                            'condition' => 'Baik',
                            'price' => $price,
                            'status' => Garment::STATUS_SELESAI,
                            'created_at' => $completedAt->copy()->subDays(3),
                            'updated_at' => $completedAt,
                        ]);

                        Transaction::create([
                            'garment_id' => $garment->id,
                            'requester_id' => $requester,
                            'status' => Transaction::STATUS_SELESAI,
                            'agreed_price' => $price,
                            'agreed_at' => $completedAt->copy()->subDay(),
                            'completed_at' => $completedAt,
                            'created_at' => $completedAt->copy()->subDays(2),
                            'updated_at' => $completedAt,
                        ]);
                    }
                }
            }

            // 3. Bangun tabel ringkasan dashboard dari transaksi selesai.
            //    Di aplikasi, tabel ini bertambah satu per satu saat transaksi ditandai selesai.
            DB::table('dashboard_daily_counts')->delete();
            DB::table('dashboard_daily_counts')->insertUsing(
                ['date', 'garment_category_id', 'pathway', 'completed_count'],
                DB::table('transactions')
                    ->join('garments', 'garments.id', '=', 'transactions.garment_id')
                    ->where('transactions.status', Transaction::STATUS_SELESAI)
                    ->selectRaw('DATE(transactions.completed_at), garments.garment_category_id, garments.listing_type, COUNT(*)')
                    ->groupByRaw('DATE(transactions.completed_at), garments.garment_category_id, garments.listing_type')
            );
        });
    }
}
