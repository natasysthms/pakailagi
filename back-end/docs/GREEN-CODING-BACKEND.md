# Penerapan Green Software Engineering — Sisi Back End

Bahan untuk laporan bagian 4.1 (bukti Green Coding) dan dokumentasi teknis. Nomor poin mengikuti konteks sistem 3.2.3.

| No | Praktik | Lokasi kode | Dampak |
|---|---|---|---|
| a | Kompresi gzip/brotli respons JSON, HTML, CSS, JS | konfigurasi web server (`public/.htaccess` atau Nginx) | Data yang dikirim lebih kecil, energi jaringan dan page weight turun |
| b1 | Cache browser + ETag untuk endpoint publik (`cache.headers`) | `routes/api.php` | Kunjungan ulang mendapat `304 Not Modified` tanpa mengunduh ulang isi |
| b2 | Cache aplikasi untuk panduan, kategori, dan dashboard CO₂e | `CareGuideController`, `MasterDataController`, `ImpactCalculator` | Query hanya dijalankan saat cache kosong. Cache dihapus hanya saat datanya berubah |
| c | JSON ringkas: katalog hanya mengirim 1 thumbnail dan field kartu; foto penuh hanya di detail | `ProductCardResource`, `ProductResource` | Ukuran respons katalog jauh lebih kecil |
| c | Paginasi tanpa query COUNT (`simplePaginate`) | `ProductController@index`, `DonationController@donorItems` | Satu query lebih sedikit per halaman katalog |
| d | Foto diubah ke WebP (maks. lebar 1200 px) dan dibuatkan thumbnail 400×400 sekali saat unggah | `ImageService` | Ukuran gambar turun, penyimpanan dan transfer data lebih hemat |
| e | Validasi unggahan (tipe & maks. 4 MB, maks. 5 foto) | `HandlesGarmentInput::photoRules` | Mencegah file besar membebani server |
| f | Indeks pada kolom filter katalog dan foreign key | migration `garments`, `garment_images`, `transactions`, dll. | Query katalog tidak memindai seluruh tabel |
| f | Eager loading + pemilihan kolom (`with('owner:id,name')`, `select([...])`) | semua controller | Menghindari N+1 query |
| f | `Model::preventLazyLoading()` saat development | `AppServiceProvider` | Pelanggaran N+1 langsung terdeteksi saat pengembangan |
| f | Dashboard membaca tabel ringkasan `dashboard_daily_counts` | `ImpactCalculator`, `TransactionService@complete` | Tidak memindai seluruh tabel transaksi; penghitung diperbarui hanya saat transaksi selesai |
| f | Nilai CO₂e tidak disimpan, dihitung dari parameter | `ImpactCalculator` | Tidak ada data turunan yang dobel |
| g | Bundle React dilayani langsung oleh web server; hanya `/api/*` yang menjalankan PHP | konfigurasi deploy | Aset statis tidak memakai CPU aplikasi |
| h | Token dan peran diperiksa di middleware sebelum controller | `auth:sanctum`, `EnsureRole` | Request tidak sah ditolak sebelum menyentuh database |
| h | Rate limiting (`throttle`) | `routes/api.php`, `AppServiceProvider` | Mencegah request berlebihan yang membuang sumber daya |
| – | Konfigurasi produksi: `config:cache`, `route:cache`, `composer --no-dev --optimize-autoloader`, OPcache, `APP_DEBUG=false` | saat deploy | CPU per request lebih rendah |

Cara mengukur untuk laporan:
1. Network tab: bandingkan ukuran respons `/api/v1/products` (thumbnail saja) dengan `/api/v1/products/{id}` (semua foto).
2. Network tab: muat ulang halaman panduan → status `304` pada `/api/v1/care-guides`.
3. Laravel Debugbar atau log query: hitung jumlah query katalog sebelum/sesudah eager loading.
4. Ukuran file foto sebelum unggah vs file WebP yang tersimpan di `storage/app/public/garments`.
