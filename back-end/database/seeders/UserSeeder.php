<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = Role::pluck('id', 'name');

        // Semua akun dummy memakai password: password
        $make = fn (string $role, string $name, string $email, ?string $phone = null) => User::create([
            'role_id' => $roles[$role],
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'password' => 'password', // otomatis di-hash oleh cast 'hashed' di model User
        ]);

        // Administrator dan akun konsumen untuk demo
        $make(Role::ADMIN, 'Admin PakaiLagi', 'admin@pakailagi.test');
        $make(Role::KONSUMEN, 'Konsumen Demo', 'konsumen@pakailagi.test');

        // Penjual / thrift shop (dari kurator di mockData/products.js)
        $make(Role::PENJUAL, 'Reka Karsa Archive', 'reka-karsa-archive@pakailagi.test', '6281234567890')
            ->partnerProfile()->create([
                'partner_type' => 'thrift_shop',
                'name' => 'Reka Karsa Archive',
                'city' => 'Yogyakarta Kota',
                'phone' => '6281234567890',
                'is_verified' => true,
            ]);
        $make(Role::PENJUAL, 'Aruna Thrift', 'aruna-thrift@pakailagi.test', '6281298761234')
            ->partnerProfile()->create([
                'partner_type' => 'thrift_shop',
                'name' => 'Aruna Thrift',
                'city' => 'Bandung Wetan',
                'phone' => '6281298761234',
                'is_verified' => true,
            ]);
        $make(Role::PENJUAL, 'Sekar Larasati', 'sekar-larasati@pakailagi.test', '6281899001122')
            ->partnerProfile()->create([
                'partner_type' => 'thrift_shop',
                'name' => 'Sekar Larasati',
                'city' => 'Solo / Surakarta',
                'phone' => '6281899001122',
                'is_verified' => true,
            ]);
        $make(Role::PENJUAL, 'Mila Wardrobe', 'mila-wardrobe@pakailagi.test', '6281288776655')
            ->partnerProfile()->create([
                'partner_type' => 'thrift_shop',
                'name' => 'Mila Wardrobe',
                'city' => 'Jakarta Selatan',
                'phone' => '6281288776655',
                'is_verified' => true,
            ]);
        $make(Role::PENJUAL, 'Bumi Habit', 'bumi-habit@pakailagi.test', '6281355443322')
            ->partnerProfile()->create([
                'partner_type' => 'thrift_shop',
                'name' => 'Bumi Habit',
                'city' => 'Malang Raya',
                'phone' => '6281355443322',
                'is_verified' => true,
            ]);
        $make(Role::PENJUAL, 'Cipta Thrift Studio', 'cipta-thrift-studio@pakailagi.test', '6281766554433')
            ->partnerProfile()->create([
                'partner_type' => 'thrift_shop',
                'name' => 'Cipta Thrift Studio',
                'city' => 'Tangerang Selatan',
                'phone' => '6281766554433',
                'is_verified' => true,
            ]);

        // Organisasi penerima donasi (dari mockData/donations.js - mockOrgNeeds)
        $make(Role::PENJUAL, 'Panti Asuhan Kasih Mandiri', 'panti-asuhan-kasih-mandiri@pakailagi.test')
            ->partnerProfile()->create([
                'partner_type' => 'organisasi_donasi',
                'name' => 'Panti Asuhan Kasih Mandiri',
                'city' => 'Bandung, Jawa Barat',
                'address' => 'Coblong, Bandung, Jawa Barat',
                'description' => 'Seragam SD & SMP layak pakai untuk anak-anak asuh memasuki semester ajaran baru.',
                'is_verified' => true,
            ]);
        $make(Role::PENJUAL, 'Komunitas Lansia Sejahtera', 'komunitas-lansia-sejahtera@pakailagi.test')
            ->partnerProfile()->create([
                'partner_type' => 'organisasi_donasi',
                'name' => 'Komunitas Lansia Sejahtera',
                'city' => 'Malang, Jawa Timur',
                'address' => 'Batu, Malang, Jawa Timur',
                'description' => 'Pakaian hangat, jaket rajut, & selimut tebal untuk penghuni lansia di area dataran tinggi.',
                'is_verified' => true,
            ]);
        $make(Role::PENJUAL, 'Balai Latihan Kerja Mandiri', 'balai-latihan-kerja-mandiri@pakailagi.test')
            ->partnerProfile()->create([
                'partner_type' => 'organisasi_donasi',
                'name' => 'Balai Latihan Kerja Mandiri',
                'city' => 'Cilincing, Jakarta Utara',
                'address' => 'Cilincing, Jakarta Utara',
                'description' => 'Kemeja kerja & celana bahan pria/wanita untuk bekal wawancara kerja peserta binaan.',
                'is_verified' => true,
            ]);

        // Donatur perorangan (dari mockData/donations.js - mockDonorItems)
        $make(Role::KONSUMEN, 'Sari M.', 'sari-m@pakailagi.test');
        $make(Role::KONSUMEN, 'Budi H.', 'budi-h@pakailagi.test');
        $make(Role::KONSUMEN, 'Rian P.', 'rian-p@pakailagi.test');
    }
}
