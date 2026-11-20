<?php

namespace Database\Seeders;

use App\Models\CareGuide;
use App\Models\FabricType;
use Illuminate\Database\Seeder;

class CareGuideSeeder extends Seeder
{
    public function run(): void
    {
        $fabrics = FabricType::pluck('id', 'name');

        // Konten diambil dari FIBER_PROTOCOLS di src/pages/CareGuide/CareGuidePage.jsx
        $guides = [
            [
                'fabric' => 'Katun (Cotton)',
                'slug' => 'cotton',
                'title' => 'Katun (Cotton)',
                'subtitle' => 'Serat Selulosa Alami • Bernapas & Kokoh',
                'icon' => 'eco',
                'steps' => [
                    'cuci' => 'Cuci dengan air bersuhu ruang (maks 30°C). Gunakan siklus putaran sedang (gentle cycle) dan detergen cair ramah lingkungan.',
                    'kering' => 'Keringkan dengan cara dibentangkan mendatar (flat dry) di tempat teduh. Hindari paparan sinar matahari terik langsung agar serat tidak rapuh.',
                    'simpan' => 'Lipat rapi di lemari yang sejuk dan berventilasi baik. Sisipkan balok kayu cedar alami untuk mencegah ngengat tekstil.',
                    'rawat' => 'Balikkan pakaian katun berwarna gelap sebelum dicuci agar warna kain tidak cepat pudar (faded).',
                ],
            ],
            [
                'fabric' => 'Denim',
                'slug' => 'denim',
                'title' => 'Denim & Indigo',
                'subtitle' => 'Tenun Twill Kokoh • Raw & Selvedge Heritage',
                'icon' => 'strikethrough_s',
                'steps' => [
                    'cuci' => 'Cuci sejarang mungkin (cukup tiap 5-8 kali pakai). Saat mencuci, balik bagian dalam ke luar (inside-out) dan gunakan air dingin tanpa pemutih.',
                    'kering' => 'Gantung secara vertikal di tempat teduh berangin. Jangan pernah memeras celana jeans dengan memelintirnya secara kasar.',
                    'simpan' => 'Gantung menggunakan hanger kait pada loop celana untuk menjaga siluet potongan dan garis lipatan alami.',
                    'rawat' => 'Untuk menyegarkan aroma denim tanpa mencuci, angin-anginkan semalaman di area terbuka atau semprotkan mist air distilasi & minyak esensial lavender.',
                ],
            ],
            [
                'fabric' => 'Wol (Wool)',
                'slug' => 'wool',
                'title' => 'Wol & Rajut (Wool)',
                'subtitle' => 'Serat Protein Hewani Alami • Elastis & Termal',
                'icon' => 'cloud',
                'steps' => [
                    'cuci' => 'Hanya cuci tangan (handwash) dengan air dingin menggunakan sampo wol ber-pH netral. Jangan digosok atau dikucek keras.',
                    'kering' => 'Gulung perlahan di dalam handuk kering untuk menyerap air berlebih, lalu bentangkan mendatar. Jangan pernah digantung karena akan merenggangkan bentuk rajutan.',
                    'simpan' => 'Selalu simpan dalam keadaan terlipat bersama kantong lavender kering. Jangan pernah menggantung sweater rajut berat.',
                    'rawat' => 'Serat wol memiliki lapisan pelindung alami anti-bakteri, sehingga jarang memerlukan pencucian air penuh.',
                ],
            ],
            [
                'fabric' => 'Linen',
                'slug' => 'linen',
                'title' => 'Linen (Flax Rami)',
                'subtitle' => 'Serat Tertua di Dunia • Sejuk & Semakin Lembut Seiring Usia',
                'icon' => 'spa',
                'steps' => [
                    'cuci' => 'Cuci dengan banyak air dan detergen lembut. Jangan campur dengan pakaian beritsleting tajam yang dapat tersangkut di pori serat linen.',
                    'kering' => 'Keringkan dengan cara diangin-anginkan saat masih agak lembap. Jangan gunakan mesin pengering panas tinggi karena memicu pengerutan permanen.',
                    'simpan' => 'Gantung dengan gantungan baju berbantalan busa atau kayu lebar agar garis bahu tetap elegan.',
                    'rawat' => 'Setrika linen dalam kondisi sedikit basah (damp) dengan temperatur sedang untuk kilau serat alami tanpa merusak jalinan benang.',
                ],
            ],
            [
                'fabric' => 'Sutra & Wastra',
                'slug' => 'silk',
                'title' => 'Sutra & Wastra Tradisional',
                'subtitle' => 'Serat Mewah Alami • Batik Tulis & Tenun Ikat',
                'icon' => 'diamond',
                'steps' => [
                    'cuci' => 'Gunakan cairan pembersih lerak tradisional alami atau sampo bayi. Celup-celupkan secara lembut tanpa meremas kain.',
                    'kering' => 'Keringkan di tempat yang benar-benar teduh. Sinar UV matahari dapat merusak pigmen pewarna alami tumbuhan dan memecah protein sutra.',
                    'simpan' => 'Lapisi dengan kertas minyak putih bebas asam (acid-free tissue) dan simpan dalam posisi tergulung (roll) atau terlipat rapi.',
                    'rawat' => 'Simpan rempah cengkeh dan lada hitam di sudut lemari kain tradisional untuk penangkal kutu alami tanpa kapur barus kimia.',
                ],
            ],
            [
                'fabric' => 'Poliester & Sintetis',
                'slug' => 'synthetic',
                'title' => 'Poliester & Serat Sintetis',
                'subtitle' => 'Serat Olahan Polimer • Cepat Kering & Tahan Kusut',
                'icon' => 'layers',
                'steps' => [
                    'cuci' => 'Gunakan kantong cuci penangkap mikroplastik (Guppyfriend washing bag) pada suhu dingin (30°C) untuk mencegah pelepasan serat mikro ke saluran air laut.',
                    'kering' => 'Cepat kering dengan sendirinya di tali jemuran. Hindari siklus putaran sentrifugal berkecepatan tinggi.',
                    'simpan' => 'Dapat dilipat atau digantung standar tanpa perlakuan kelembapan khusus.',
                    'rawat' => 'Gunakan suhu setrika paling rendah (synthetic/silk mode) agar serat sintetis tidak meleleh atau meninggalkan bekas mengilap terbakar.',
                ],
            ],
        ];

        foreach ($guides as $data) {
            $guide = CareGuide::create([
                'fabric_type_id' => $fabrics[$data['fabric']],
                'slug' => $data['slug'],
                'title' => $data['title'],
                'subtitle' => $data['subtitle'],
                'icon' => $data['icon'],
            ]);

            $order = 0;
            foreach ($data['steps'] as $type => $content) {
                $guide->steps()->create(['step_type' => $type, 'sort_order' => $order++, 'content' => $content]);
            }
        }
    }
}
