// Dipindahkan dari CareGuidePage.jsx. Dipakai saat mode mock (VITE_USE_MOCK bukan false).
export const mockCareGuides = [
  {
    id: 'cotton',
    name: 'Katun (Cotton)',
    category: 'Katun (Cotton)',
    subtitle: 'Serat Selulosa Alami • Bernapas & Kokoh',
    icon: 'eco',
    wash: 'Cuci dengan air bersuhu ruang (maks 30°C). Gunakan siklus putaran sedang (gentle cycle) dan detergen cair ramah lingkungan.',
    dry: 'Keringkan dengan cara dibentangkan mendatar (flat dry) di tempat teduh. Hindari paparan sinar matahari terik langsung agar serat tidak rapuh.',
    store: 'Lipat rapi di lemari yang sejuk dan berventilasi baik. Sisipkan balok kayu cedar alami untuk mencegah ngengat tekstil.',
    tip: '💡 Tip Kurator: Balikkan pakaian katun berwarna gelap sebelum dicuci agar warna kain tidak cepat pudar (faded).'
  },
  {
    id: 'denim',
    name: 'Denim & Indigo',
    category: 'Denim',
    subtitle: 'Tenun Twill Kokoh • Raw & Selvedge Heritage',
    icon: 'strikethrough_s',
    wash: 'Cuci sejarang mungkin (cukup tiap 5-8 kali pakai). Saat mencuci, balik bagian dalam ke luar (inside-out) dan gunakan air dingin tanpa pemutih.',
    dry: 'Gantung secara vertikal di tempat teduh berangin. Jangan pernah memeras celana jeans dengan memelintirnya secara kasar.',
    store: 'Gantung menggunakan hanger kait pada loop celana untuk menjaga siluet potongan dan garis lipatan alami.',
    tip: '💡 Tip Kurator: Untuk menyegarkan aroma denim tanpa mencuci, angin-anginkan semalaman di area terbuka atau semprotkan mist air distilasi & minyak esensial lavender.'
  },
  {
    id: 'wool',
    name: 'Wol & Rajut (Wool)',
    category: 'Wol (Wool)',
    subtitle: 'Serat Protein Hewani Alami • Elastis & Termal',
    icon: 'cloud',
    wash: 'Hanya cuci tangan (handwash) dengan air dingin menggunakan sampo wol ber-pH netral. Jangan digosok atau dikucek keras.',
    dry: 'Gulung perlahan di dalam handuk kering untuk menyerap air berlebih, lalu bentangkan mendatar. Jangan pernah digantung karena akan merenggangkan bentuk rajutan.',
    store: 'Selalu simpan dalam keadaan terlipat bersama kantong lavender kering. Jangan pernah menggantung sweater rajut berat.',
    tip: '💡 Tip Kurator: Serat wol memiliki lapisan pelindung alami anti-bakteri, sehingga jarang memerlukan pencucian air penuh.'
  },
  {
    id: 'linen',
    name: 'Linen (Flax Rami)',
    category: 'Linen',
    subtitle: 'Serat Tertua di Dunia • Sejuk & Semakin Lembut Seiring Usia',
    icon: 'spa',
    wash: 'Cuci dengan banyak air dan detergen lembut. Jangan campur dengan pakaian beritsleting tajam yang dapat tersangkut di pori serat linen.',
    dry: 'Keringkan dengan cara diangin-anginkan saat masih agak lembap. Jangan gunakan mesin pengering panas tinggi karena memicu pengerutan permanen.',
    store: 'Gantung dengan gantungan baju berbantalan busa atau kayu lebar agar garis bahu tetap elegan.',
    tip: '💡 Tip Kurator: Setrika linen dalam kondisi sedikit basah (damp) dengan temperatur sedang untuk kilau serat alami tanpa merusak jalinan benang.'
  },
  {
    id: 'silk',
    name: 'Sutra & Wastra Tradisional',
    category: 'Sutra & Wastra',
    subtitle: 'Serat Mewah Alami • Batik Tulis & Tenun Ikat',
    icon: 'diamond',
    wash: 'Gunakan cairan pembersih lerak tradisional alami atau sampo bayi. Celup-celupkan secara lembut tanpa meremas kain.',
    dry: 'Keringkan di tempat yang benar-benar teduh. Sinar UV matahari dapat merusak pigmen pewarna alami tumbuhan dan memecah protein sutra.',
    store: 'Lapisi dengan kertas minyak putih bebas asam (acid-free tissue) dan simpan dalam posisi tergulung (roll) atau terlipat rapi.',
    tip: '💡 Tip Kurator: Simpan rempah cengkeh dan lada hitam di sudut lemari kain tradisional untuk penangkal kutu alami tanpa kapur barus kimia.'
  },
  {
    id: 'synthetic',
    name: 'Poliester & Serat Sintetis',
    category: 'Poliester & Sintetis',
    subtitle: 'Serat Olahan Polimer • Cepat Kering & Tahan Kusut',
    icon: 'layers',
    wash: 'Gunakan kantong cuci penangkap mikroplastik (Guppyfriend washing bag) pada suhu dingin (30°C) untuk mencegah pelepasan serat mikro ke saluran air laut.',
    dry: 'Cepat kering dengan sendirinya di tali jemuran. Hindari siklus putaran sentrifugal berkecepatan tinggi.',
    store: 'Dapat dilipat atau digantung standar tanpa perlakuan kelembapan khusus.',
    tip: '💡 Tip Kurator: Gunakan suhu setrika paling rendah (synthetic/silk mode) agar serat sintetis tidak meleleh atau meninggalkan bekas mengilap terbakar.'
  }
];
