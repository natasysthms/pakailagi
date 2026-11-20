<?php

namespace Database\Seeders;

use App\Models\FabricType;
use App\Models\Garment;
use App\Models\GarmentCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class GarmentSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::pluck('id', 'email');
        $categories = GarmentCategory::pluck('id', 'code');
        $fabrics = FabricType::pluck('id', 'name');

        $garments = [
            // ── Preloved (dari mockData/products.js) ──
            [
                'owner' => 'reka-karsa-archive@pakailagi.test',
                'category' => 'OUTERWEAR',
                'fabric' => 'Katun (Cotton)',
                'listing_type' => 'preloved',
                'title' => 'Vintage Noragi Sashiko Chore Jacket',
                'slug' => 'vintage-noragi-sashiko-chore-jacket',
                'size' => 'Size L',
                'condition' => 'Sangat Baik (9.5/10)',
                'price' => 260000,
                'description' => 'Sepotong garmen kerja tradisional noragi dari era 90-an dengan sulaman sashiko tangan pada bagian kerah dan bahu. Menggunakan katun tenun bertekstur rapat yang kokoh namun lembut setelah melalui proses pencucian sirkular ramah lingkungan (ecoclean ozon). Garansi bebas bau apek dan higienis 100% siap pakai.',
                'status' => 'tersedia',
                'is_featured' => true,
                'images' => [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuB0Qvo3emhFyiwoR-RKF7p7BDYGEUxBfdF1hitKF6Q6BQWCTmA0c5f2eQDF9FnTeyB0mFxIDsZvWeyhB9uhSXOHDaUPKZeQFh6xAArd4VJm52fARnnhGlQQ2cCzuYphzLO9NCZAMFERmGPEQlVNHsjVHOPLzqYIcjxh9t_3XWec1pepw16-jyEQZYvkbLPxUj2eWJRjXmR47PHHWzJztUlS-QRbh-tZBnbnm9p9AJwR',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBmkIwCu1c5zQi8JSOjZNvC81fcWMqxWg6VFjIXGnJRGTY9mDXiUUmQjc1MW1ANSdoXS2Po8woFwhOOX__4Tws27B-kPESdKrCBGwKgsCKNnlpvTWdPON9N6U_LkkQ9ng5kQIVnv9-rgRGWmSfIE1I3kllCls85vluJkgHkoZ9nniq7ZeWst9V3dNsrYYY-EbsuFP4J1fVoK6CDBGF5Nu3tNTuf-rC44hp_xpv1Jg3F',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBn1akQ7EXdxPw0auAhZl2wLGwO_-o3-3Wu9GAn2__KqpwbyDflV63qW6abw7eGjqegTtgYYk_zwmE-8ikFsER1ZoZmTHDum6vE6FKajW9o5Hn2zBDnNBTecxUFMa3-5PkIfnm_7I4fueCBWD6Bak2QI61j1p6FNqPz7Hm7ahqOFOYaglhkv9KJK-8iAew69cFt6DAjw8AO8kv6-kgVWJcPB5R8bgKbrnK0Zl6xRM2O',
                ],
            ],
            [
                'owner' => 'aruna-thrift@pakailagi.test',
                'category' => 'ATASAN',
                'fabric' => 'Linen',
                'listing_type' => 'preloved',
                'title' => 'Kemeja Linen Vintage Raw',
                'slug' => 'kemeja-linen-vintage-raw',
                'size' => 'Size M',
                'condition' => 'Seperti Baru (9.5/10)',
                'price' => 145000,
                'description' => '100% serat rami alami, potongan rileks, kancing kerang asli. Kemeja berpotongan klasik dengan serat linen belum terkelantang.',
                'status' => 'tersedia',
                'is_featured' => true,
                'images' => [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCrz5eW7wtJlnIVdXFcQIptioayv2dROmOpxjLv1zlWqWqVdo-409oE2LhqzCeaoJcV8RcKdvDwvYGeCmcW2hFqpkdX3wy_hGOlbbV7eCSArTE-5zlVcGPZGt-Y9GXDxBX0mziHMFL4ys4fQWU9U95l5dmEx25Hb7nOrW60cDXB2els8h5R4sxOGnOKeBgDkDEVNfhbD4_lVkUzWqOJ9fu3VdF6DRKRbgXWZItwKl5v',
                ],
            ],
            [
                'owner' => 'reka-karsa-archive@pakailagi.test',
                'category' => 'DENIM',
                'fabric' => 'Denim',
                'listing_type' => 'preloved',
                'title' => 'Jaket Denim Oversized 90s',
                'slug' => 'jaket-denim-oversized-90s',
                'size' => 'Size L',
                'condition' => 'Sangat Baik (9.0/10)',
                'price' => 230000,
                'description' => 'Bobot 14oz katun tebal, warna indigo memudar artistik, jahitan ganda kokoh dengan kancing kuningan vintage.',
                'status' => 'tersedia',
                'is_featured' => true,
                'images' => [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCfzO8o-SUagfDRN57O7pF30M5toU78MaqN1Eyf7pMCeN1s3r8zBTit9pDj_P5_ec8SwaAWcPXh0IaffD_d1dD0i4-OkJK_NMAIHBffX0Cn5zT9N2R-8V_Auz9kICrVNHrRy7LXJYAB8zb0jkXcGUl3OrGWlYnFeXEMn5XWWLALzpNNeUTRVCxImnTsmDMAVbESEq8xiXAKQ1goGFLGY6S8wXYzqhnAcroJdhN-cbSr',
                ],
            ],
            [
                'owner' => 'sekar-larasati@pakailagi.test',
                'category' => 'ATASAN',
                'fabric' => 'Linen',
                'listing_type' => 'preloved',
                'title' => 'Tenun Lurik Blouse Modern',
                'slug' => 'tenun-lurik-blouse-modern',
                'size' => 'Size S-M',
                'condition' => 'Mint Condition (9.8/10)',
                'price' => 175000,
                'description' => 'Tenun alat bukan mesin (ATBM), benang katun ramie pewarna alam, kancing kayu jati. Potongan kerah kontemporer.',
                'status' => 'tersedia',
                'is_featured' => true,
                'images' => [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCrSmRDJi2wN_KYB5gaI5MgS6pMAnQEev8z4WY6luJc0_BY1uQNjzVRpPtkpCEGveTGa4K7ZOLtlYXD2seFFbPjBtdEOWuCg8nD8ofaMd4rg4A2GVl-V-bPTMjmnQz5MvDr8xnQgWb4scyhglWu1RtyMoKWzB3oUxkvJ_gTLBjV2pbB3ZXOAMHGPr4cqwBkr5Xul2lqB0Qt50mJDOlSrLpUyWXf_bSsmpphlHewUtSc',
                ],
            ],
            [
                'owner' => 'mila-wardrobe@pakailagi.test',
                'category' => 'CELANA_ROK',
                'fabric' => 'Linen',
                'listing_type' => 'preloved',
                'title' => 'Kulot Katun Rami Sage',
                'slug' => 'kulot-katun-rami-sage',
                'size' => 'Size M',
                'condition' => 'Sangat Baik (9.2/10)',
                'price' => 120000,
                'description' => 'Pinggang semi-elastis, saku dalam fungsional, jatuhan kain jatuh sempurna dan sejuk saat dikenakan.',
                'status' => 'tersedia',
                'is_featured' => true,
                'images' => [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBrns3zQswgFS3dK4-NVVzHsSKVcOTjOJJ3PBvm9TXd0D6sF-itYR2qaW-1Gg2axawVkSXRwAe_CSzvWuyUowZqbnWQe8bAanh8sHkAwRYCwIGCDmlTjkCGsfhDZr9GrqUO9SDEelOHFfuu-pUONyajysi8A0Wk-gwrWyWmB9hwytqbJV6tjkxWiwSCNXHSNtuXCgfYtLEVOQFFjOKHVyE_oNNBeMBd0uBqXEYXOBkY',
                ],
            ],
            [
                'owner' => 'bumi-habit@pakailagi.test',
                'category' => 'OUTERWEAR',
                'fabric' => 'Wol (Wool)',
                'listing_type' => 'preloved',
                'title' => 'Cardigan Chunky Wool Earthy',
                'slug' => 'cardigan-chunky-wool-earthy',
                'size' => 'All Size',
                'condition' => 'Seperti Baru (9.5/10)',
                'price' => 195000,
                'description' => 'Benang wol tebal natural tanpa pilling, rajutan tangan rapi dan padat dengan kancing tanduk amber.',
                'status' => 'tersedia',
                'is_featured' => true,
                'images' => [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ11GPcMvfjRkowHalcamE9A2EZZs_lO3ijjjS-7KFQsM5YDkOyeP3lb6BUS3cpvZuSAju7eUwRA7WyBt7x4-v9PNpQcDk-2Qdtr-yKgZbg9L6REXvdCcVppV5hqOKtvXsNw45a9HPsIR3f1Xk9rlSJqFJIUi7LbiGuW0ptxEXLBskcSdM6vtCXO00KAHbLxqcK-bjKi4t8PUcvPSzMkf3He-rLFKtM6hiLhFVxGnc',
                ],
            ],
            [
                'owner' => 'cipta-thrift-studio@pakailagi.test',
                'category' => 'OUTERWEAR',
                'fabric' => 'Katun (Cotton)',
                'listing_type' => 'preloved',
                'title' => 'Trench Coat Gabardine Katun',
                'slug' => 'trench-coat-gabardine-katun',
                'size' => 'Size L',
                'condition' => 'Sangat Baik (9.0/10)',
                'price' => 280000,
                'description' => 'Lapisan furing sutra cupro, tahan angin, kondisi kancing utuh lengkap sabuk pinggang. Mantel berstruktur tinggi.',
                'status' => 'tersedia',
                'is_featured' => true,
                'images' => [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCXzPG3CqqeD-DG0nV8TKXfdMX4bQFT4DlvRO2rPCfv3xOar0__fXKT5QAuUZf9GyGFpUlX5CMjPGApTI12Dwp7sy9MrdpKk4Q-yRnm_ivfLDFujKjiNmFr2tO7E2-MfPfABndYbxj5F9b2xEvxqGKlD5xlEMfQ8QbVT1eO1whZWYuPjZBYp2_E5-bIJ4FnpWtwIGOmLJrNoWWa3kvaDIqc7gtgXBmFrHqloORLWX4J',
                ],
            ],

            // ── Donasi (dari mockData/donations.js - mockDonorItems) ──
            [
                'owner' => 'sari-m@pakailagi.test',
                'category' => 'ANAK',
                'fabric' => 'Katun (Cotton)',
                'listing_type' => 'donasi',
                'title' => 'Set Baju Bayi & Balita Katun (10 Pcs)',
                'slug' => 'set-baju-bayi-balita-katun-10-pcs',
                'size' => '0-24 Bulan',
                'condition' => 'Bersih & Dicuci',
                'price' => null,
                'description' => 'Ukuran: 0-24 Bulan • Kondisi: Bersih & Dicuci • Katun 100%',
                'status' => 'tersedia',
                'is_featured' => false,
                'images' => [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCyuPuOChrjT39oSbPL7oaXQUZQg-VrgSJnUkb3E55SO3ICjU95ECtawRBq7iilzWE8hOEbnKerVzAxmvKeUvoD9UD9-hdw4GF3zD7nn6rMRmCvTviwiN1xaenL-n_IsceloppY55vHFbY-PVaVUro4SYkGg2Qh0-5p6cGDZ6Ao9Ong5jgurdvAryGYiAATU87u5PyIBorXGs5n1eSWSerxtmR5L1WbL3f2hTcMA3--',
                ],
            ],
            [
                'owner' => 'budi-h@pakailagi.test',
                'category' => 'OUTERWEAR',
                'fabric' => null,
                'listing_type' => 'donasi',
                'title' => 'Jaket Hangat Remaja (3 Pcs)',
                'slug' => 'jaket-hangat-remaja-3-pcs',
                'size' => 'M & L Remaja',
                'condition' => 'Sangat Baik',
                'price' => null,
                'description' => 'Ukuran: M & L Remaja • Kondisi: Sangat Baik • Tahan Angin',
                'status' => 'dipesan',
                'is_featured' => false,
                'images' => [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDDQw2YfER0Cwl-lj67fL6DlPEnUdo5wVECXydxFBvPHWinP97_hQnqDDy9gs_IooQfnUlrlkiLPghUywxRxP7XYf7DS3htHkxGFuCGEp6lQlBsCHJC9dwmI2ANK0UNLT4lRmCB9s9DtbjMojmLYRheE5KflDEoKkwwVKl-Y-ofn4D2gDM8jh3gJrPhprb3nBPX41zLwaxm6MAl5jDaR5TZVJ0l8lxO2u1XBBE03f0i',
                ],
            ],
            [
                'owner' => 'rian-p@pakailagi.test',
                'category' => 'ATASAN',
                'fabric' => 'Katun (Cotton)',
                'listing_type' => 'donasi',
                'title' => 'Kemeja Formal Pria Kerja (5 Pcs)',
                'slug' => 'kemeja-formal-pria-kerja-5-pcs',
                'size' => 'L & XL',
                'condition' => 'Bersih & Dicuci',
                'price' => null,
                'description' => 'Ukuran: L & XL • Kondisi: Bersih & Dicuci • Bahan Katun Poplin',
                'status' => 'tersedia',
                'is_featured' => false,
                'images' => [
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBShzhJlGqCYp7aSWULZMoqkYJPSPsGp0IVUJzRlqyjnfq59tN2dheEJCvBuuWtGzWXoDp54GlPud-SZgm9KdHetwefFwYCqkmr52Yeb0oeQ8MkCr0wm955iNIjJgaGf6n3QdQ53WUfwhHbIHTDgzJxG7gdUR0drzqIg7QASuv1QPVlqvRhQCdb-kyx-ObSEMwcKVrk-V1RIb_xTcOEneEqfMmDVS9xgWzX3ybYCdXU',
                ],
            ],
        ];

        foreach ($garments as $data) {
            $garment = Garment::create([
                'user_id' => $users[$data['owner']],
                'garment_category_id' => $categories[$data['category']],
                'fabric_type_id' => $data['fabric'] ? $fabrics[$data['fabric']] : null,
                'listing_type' => $data['listing_type'],
                'title' => $data['title'],
                'slug' => $data['slug'],
                'size' => $data['size'],
                'condition' => $data['condition'],
                'price' => $data['price'],
                'description' => $data['description'],
                'status' => $data['status'],
                'is_featured' => $data['is_featured'],
            ]);

            // Gambar dummy memakai URL eksternal dari mock data.
            // Gambar yang diunggah lewat aplikasi nanti disimpan sebagai WebP + thumbnail di storage.
            foreach ($data['images'] as $order => $url) {
                $garment->images()->create(['path' => $url, 'thumbnail_path' => $url, 'sort_order' => $order]);
            }
        }
    }
}
