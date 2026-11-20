# PakaiLagi

Platform circular fashion berbasis web untuk memfasilitasi penggunaan kembali pakaian (preloved, donasi, perawatan, dan reparasi) serta mengestimasi emisi CO₂e yang dihindari.

Proyek Akhir Sistem Informasi Berkelanjutan, Program Studi Sistem Informasi, FILKOM, Universitas Brawijaya.

## Struktur repo

```
pakailagi/
├── back-end/        # REST API Laravel + MySQL
├── src/             # Front end React + Vite
├── package.json
└── README.md
```

Front end berjalan di `http://localhost:5173` dan mengambil data dari back end di `http://localhost:8000/api/v1`.

---

## 1. Persiapan

Pasang terlebih dahulu:

| Kebutuhan | Versi | Keterangan |
|---|---|---|
| PHP | 8.3 atau lebih baru | Ekstensi `gd`, `pdo_mysql`, `fileinfo` harus aktif |
| Composer | terbaru | |
| MySQL / MariaDB | | Disarankan memakai **Laragon** (sudah berisi PHP, MySQL, dan Composer) |
| Node.js | 20.19+, 22.13+, atau 24+ (LTS) | |
| Git | | |

Cek di terminal:
```bash
php -v
composer -V
node -v
```

## 2. Ambil repo dan siapkan database

```bash
git clone https://github.com/natasysthms/pakailagi.git
cd pakailagi
```

Nyalakan MySQL (misalnya lewat Laragon), lalu buat database kosong bernama **`pakailagi`** melalui HeidiSQL atau phpMyAdmin.

## 3. Jalankan back end (terminal 1)

```bash
cd back-end
composer install
cp .env.example .env              # CMD Windows: copy .env.example .env
php artisan key:generate
```

Pastikan isi `back-end/.env` seperti ini (sesuaikan password MySQL jika ada):
```env
APP_LOCALE=id
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pakailagi
DB_USERNAME=root
DB_PASSWORD=
CACHE_STORE=file
```

Lalu lanjutkan:
```bash
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

Biarkan terminal ini tetap terbuka. Cek di browser: `http://localhost:8000/api/v1/products` harus menampilkan data JSON.

| Perintah | Fungsi |
|---|---|
| `composer install` | Mengunduh library Laravel (folder `vendor/` tidak ada di GitHub) |
| `cp .env.example .env` | Membuat file konfigurasi lokal |
| `php artisan key:generate` | Membuat kunci enkripsi aplikasi |
| `php artisan migrate:fresh --seed` | Membuat semua tabel dan mengisi data dummy |
| `php artisan storage:link` | Agar foto yang diunggah bisa diakses dari browser |
| `php artisan serve` | Menjalankan server di port 8000 |

## 4. Jalankan front end (terminal 2)

Buka terminal baru di **root repo** (folder yang berisi `package.json`):
```bash
npm install
cp .env.example .env.local        # CMD Windows: copy .env.example .env.local
npm run dev
```
(ini dibuat di folder pakailagi langsung, setara code fe nya)
Isi `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_USE_MOCK=false
```

Buka `http://localhost:5173`.

> `VITE_USE_MOCK=false` membuat front end mengambil data dari back end. Jika variabel ini tidak diisi, front end memakai mock data (berguna untuk mengerjakan tampilan tanpa menjalankan back end). Setiap kali `.env.local` diubah, jalankan ulang `npm run dev`.

## 5. Akun demo

Password semua akun: **`password`**

| Email | Peran |
|---|---|
| `admin@pakailagi.test` | Administrator |
| `konsumen@pakailagi.test` | Konsumen |
| `reka-karsa-archive@pakailagi.test` | Penjual / thrift shop |

Daftar akun lain ada di `back-end/database/seeders/UserSeeder.php`.

## 6. Data dummy dan parameter CO₂e

| Data | Lokasi |
|---|---|
| Jumlah pakaian yang berhasil digunakan kembali (preloved, donasi, diperbaiki) per kategori — Tabel 4.1 | `back-end/database/seeders/SimulationData.php` |
| Katalog pakaian preloved dan donasi | `back-end/database/seeders/GarmentSeeder.php` |
| Faktor emisi (P) per kategori dan displacement rate (D) | `back-end/database/seeders/CalculationParameterSeeder.php` |
| Panduan perawatan | `back-end/database/seeders/CareGuideSeeder.php` |
| Direktori layanan reparasi | `back-end/database/seeders/RepairServiceSeeder.php` |

Setelah mengubah seeder:
```bash
php artisan migrate:fresh --seed
php artisan cache:clear
```

> Faktor emisi (P) dan displacement rate donasi wajib diisi dari literatur oleh tim. Selama masih 0, estimasi CO₂e di dashboard juga bernilai 0.

## 7. Setelah `git pull`

```bash
# back end
cd back-end
composer install
php artisan migrate:fresh --seed     # menghapus data lama dan mengisi ulang data dummy
php artisan optimize:clear

# front end (dari root repo)
npm install
```

Jika ingin mempertahankan data yang sudah diinput lewat web, pakai `php artisan migrate` sebagai pengganti `migrate:fresh --seed`.

## 8. Masalah yang sering muncul

| Pesan / gejala | Solusi |
|---|---|
| `No application encryption key has been specified` | Jalankan `php artisan key:generate` |
| `SQLSTATE[HY000] [2002]` / `Connection refused` | MySQL belum dinyalakan |
| `Unknown database 'pakailagi'` | Buat database `pakailagi` terlebih dahulu |
| `Table 'pakailagi.cache' doesn't exist` | Isi `CACHE_STORE=file` di `.env`, lalu `php artisan config:clear` |
| `Class "..." not found` / `Target class [...] does not exist` | Jalankan `composer dump-autoload`, pastikan file ada di `back-end/app/...` |
| Front end tidak memanggil `localhost:8000` | Cek `.env.local` di root repo, lalu jalankan ulang `npm run dev` |
| `npm warn EBADENGINE` | Versi Node.js terlalu lama, pasang versi LTS terbaru |
| Error 500 dari API | Lihat pesan di DevTools → Network → klik request → Response, atau `back-end/storage/logs/laravel.log` |

## 9. Dokumentasi teknis

- Daftar endpoint API: `back-end/docs/API.md`
- Penerapan Green Software Engineering di back end: `back-end/docs/GREEN-CODING-BACKEND.md`

## Teknologi

- **Front end:** React, Vite, React Router
- **Back end:** Laravel, Laravel Sanctum (token), Intervention Image (konversi WebP)
- **Database:** MySQL
