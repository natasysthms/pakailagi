<?php

namespace Database\Seeders;

use App\Models\Garment;
use App\Models\GarmentCategory;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::pluck('id', 'email');
        $categories = GarmentCategory::pluck('id', 'code');

        // 1. Donasi yang sedang berjalan: "Jaket Hangat Remaja (3 Pcs)" sudah disepakati, menunggu serah terima
        Transaction::create([
            'garment_id' => Garment::where('slug', 'jaket-hangat-remaja-3-pcs')->value('id'),
            'requester_id' => $users['komunitas-lansia-sejahtera@pakailagi.test'],
            'status' => Transaction::STATUS_DISEPAKATI,
            'agreed_at' => now()->subDay(),
        ]);

        // 2. Riwayat transaksi SELESAI (data simulasi) agar dashboard CO2e punya data untuk diuji.
        //    Pakaian ini berstatus "selesai" sehingga tidak tampil di katalog.
        $history = [
            // [pemilik, kategori, jalur, judul, harga, pengaju, selesai berapa hari lalu]
            ['reka-karsa-archive@pakailagi.test', 'ATASAN', 'preloved', 'Kemeja Flanel Kotak (simulasi)', 120000, 'konsumen@pakailagi.test', 12],
            ['aruna-thrift@pakailagi.test', 'DENIM', 'preloved', 'Celana Jeans Straight (simulasi)', 150000, 'konsumen@pakailagi.test', 9],
            ['reka-karsa-archive@pakailagi.test', 'OUTERWEAR', 'preloved', 'Jaket Parka Hijau (simulasi)', 210000, 'konsumen@pakailagi.test', 5],
            ['sari-m@pakailagi.test', 'ANAK', 'donasi', 'Kaos Anak Katun 3 Pcs (simulasi)', null, 'panti-asuhan-kasih-mandiri@pakailagi.test', 7],
            ['sari-m@pakailagi.test', 'ATASAN', 'donasi', 'Kemeja Kerja Pria (simulasi)', null, 'balai-latihan-kerja-mandiri@pakailagi.test', 3],
        ];

        foreach ($history as [$owner, $category, $pathway, $title, $price, $requester, $daysAgo]) {
            $garment = Garment::create([
                'user_id' => $users[$owner],
                'garment_category_id' => $categories[$category],
                'listing_type' => $pathway,
                'title' => $title,
                'slug' => Str::slug($title),
                'size' => 'Size M',
                'condition' => 'Baik',
                'price' => $price,
                'status' => Garment::STATUS_SELESAI,
            ]);

            $completedAt = now()->subDays($daysAgo);

            Transaction::create([
                'garment_id' => $garment->id,
                'requester_id' => $users[$requester],
                'status' => Transaction::STATUS_SELESAI,
                'agreed_price' => $price,
                'agreed_at' => $completedAt->copy()->subDay(),
                'completed_at' => $completedAt,
            ]);
        }

        // 3. Isi tabel ringkasan dari transaksi selesai.
        //    Di aplikasi, tabel ini ditambah satu per satu saat transaksi ditandai selesai.
        DB::table('dashboard_daily_counts')->delete();
        DB::table('dashboard_daily_counts')->insertUsing(
            ['date', 'garment_category_id', 'pathway', 'completed_count'],
            DB::table('transactions')
                ->join('garments', 'garments.id', '=', 'transactions.garment_id')
                ->where('transactions.status', Transaction::STATUS_SELESAI)
                ->selectRaw('DATE(transactions.completed_at), garments.garment_category_id, garments.listing_type, COUNT(*)')
                ->groupByRaw('DATE(transactions.completed_at), garments.garment_category_id, garments.listing_type')
        );
    }
}
