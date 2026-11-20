# Dokumentasi API PakaiLagi (Back End)

Base URL lokal: `http://localhost:8000/api/v1`

Semua respons berupa JSON. Error validasi memakai status `422` dengan format bawaan Laravel:
```json
{ "message": "Kategori pakaian wajib diisi.", "errors": { "category": ["Kategori pakaian wajib diisi."] } }
```

## Autentikasi

Login dan register mengembalikan `token`. Front end menyimpannya (sudah disiapkan di `apiConfig.js`) lalu mengirimnya di setiap request yang butuh login:
```
Authorization: Bearer <token>
```

| Kode | Arti |
|---|---|
| 401 | Belum login / token tidak valid |
| 403 | Login, tetapi peran tidak punya akses |
| 404 | Data tidak ditemukan |
| 422 | Input tidak valid / aksi tidak sesuai status |
| 429 | Terlalu banyak request (rate limit) |

Peran: `konsumen`, `penjual` (thrift shop / organisasi donasi), `admin`.

---

## 1. Auth & Profil

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| POST | `/auth/register` | publik | FR-A1 |
| POST | `/auth/login` | publik | FR-A2 |
| POST | `/auth/logout` | login | menghapus token aktif, respons 204 |
| GET | `/auth/me` | login | profil lengkap (format `mockData/profile.js`) |
| PUT | `/users/me` | login | ubah profil (FR-A4) |
| GET | `/users/me/activity` | login | riwayat beli/minta donasi + reparasi |
| GET | `/users/me/inventory` | login | pakaian yang ditawarkan |
| GET | `/users/me/seller-queue` | login | permintaan masuk untuk pakaian milik pengguna |

**POST /auth/register**
```json
{ "name": "Kirana", "email": "kirana@mail.com", "password": "rahasia123", "role": "consumer",
  "phone": "0812...", "storeName": "(opsional, untuk seller)", "partnerType": "thrift_shop | organisasi_donasi", "city": "Malang" }
```
`role`: `consumer` atau `seller`. Respons `201`:
```json
{ "success": true, "message": "Akun berhasil didaftarkan.", "token": "1|abc...",
  "user": { "id": 9, "name": "Kirana", "email": "...", "role": "konsumen", "roleLabel": "Konsumen", "partner": null } }
```

**POST /auth/login** — body `{ "email", "password" }`, respons sama seperti register.

**GET /auth/me** — `{ id, name, email, role, badge, location, memberSince, bio, stats{circulatedPieces, avoidedCarbon, repairsCount, conservedWater}, consumerActivities[], sellerStore{storeName, completedTransactions, incomingRequests[], inventory[]} | null }`

---

## 2. Marketplace Preloved

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| GET | `/products` | publik | katalog (FR-B2) |
| GET | `/products/featured` | publik | maks. 4 untuk beranda |
| GET | `/products/{id atau slug}` | publik | detail (FR-B3) |
| POST | `/products` | konsumen, penjual | buat penawaran (FR-B1), multipart |
| POST/PUT | `/products/{id}/update` | pemilik/admin | ubah penawaran (FR-B8). Pakai POST jika mengirim foto |
| DELETE | `/products/{id}` | pemilik/admin | arsipkan penawaran (FR-B8) |
| POST | `/products/{id}/purchase` | konsumen, penjual | ajukan pembelian (FR-B4) |

**GET /products** — query opsional: `category` (nama/kode), `size`, `condition`, `min_price`, `max_price`, `q` (cari judul), `page`.
Body respons berupa **array** (24 per halaman). Header `X-Has-More-Pages: 1` berarti masih ada halaman berikutnya (`?page=2`).

Contoh item katalog (hanya 1 thumbnail):
```json
{ "id": 1, "slug": "vintage-noragi-...", "title": "Vintage Noragi Sashiko Chore Jacket", "category": "Outerwear",
  "price": 260000, "originalPrice": null, "size": "Size L", "sizeShort": "Size L", "condition": "Sangat Baik (9.5/10)",
  "grade": "Sangat Baik (9.5/10)", "material": "Katun (Cotton)", "status": "Tersedia", "featured": true,
  "location": "Yogyakarta Kota", "avoidedCo2": 0, "conservedWater": null, "images": ["https://.../thumb.webp"],
  "curator": { "name": "Reka Karsa Archive", "initials": "RK", "location": "Yogyakarta Kota", "verified": true } }
```
Detail menambahkan: `categoryLabel`, `description`, `listingType`, `images` (semua foto ukuran penuh), `curator.whatsapp`.

`avoidedCo2` = P kategori × D preloved skenario dasar (estimasi per potong, dari tabel parameter).

**POST /products** (multipart/form-data)
| Field | Wajib | Keterangan |
|---|---|---|
| title | ya | maks. 150 karakter |
| category | ya | id, kode (`ATASAN`), atau nama (`Atasan`) |
| size, condition | ya | teks |
| price | ya | angka (rupiah) |
| material | tidak | id atau nama jenis kain |
| description | tidak | |
| photos[] | tidak | maks. 5 file, jpg/png/webp, maks. 4 MB. Otomatis dikonversi ke WebP + thumbnail |

**POST /products/{id}/purchase** — body `{ "notes": "Bisa COD di ...?" }`. Pembeli diambil dari token login. Status pakaian menjadi `dipesan`.

---

## 3. Donasi

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| GET | `/donations/org-needs` | publik | direktori organisasi penerima (FR-C5) |
| GET | `/donations/donor-items` | publik | pakaian donasi siap salur (FR-C2), query `category`, `q`, `page` |
| POST | `/donations/upload` | konsumen, penjual | tawarkan pakaian sebagai donasi (FR-C1), multipart |
| POST | `/donations/request` | konsumen, penjual | minta pakaian donasi (FR-C3), body berisi `itemId` |
| POST | `/donations/{id}/request` | konsumen, penjual | sama, id di URL |
| POST | `/donations/commit` | konsumen, penjual | salurkan pakaian langsung ke organisasi |

**POST /donations/upload** — `title`*, `category`*, `condition`*, `size`, `quantity`, `notes`, `material`, `photos[]`.

**POST /donations/request** — `{ "itemId": 9, "orgName": "...", "phone": "...", "address": "...", "reason": "..." }`

**POST /donations/commit** — `{ "targetId": 12, "category": "ATASAN", "items": "Kemeja kerja 5 pcs", "quantity": 5, "method": "Antar langsung", "phone": "...", "notes": "..." }`
`targetId` = `id` dari `/donations/org-needs`. Sistem membuat pakaian donasi + transaksi berstatus `disepakati`. Donatur menandai selesai lewat `/transactions/{id}/complete` setelah serah terima.

---

## 4. Transaksi (preloved & donasi)

Alur: `diajukan` → `disepakati` → `selesai`, atau `dibatalkan`.

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| GET | `/transactions?as=requester|owner&status=` | login | riwayat (FR-B7) |
| POST | `/transactions/{id}/approve` | pemilik pakaian | body opsional `{ "agreedPrice": 240000 }` (FR-B5, C4) |
| POST | `/transactions/{id}/reject` | pemilik pakaian | pakaian kembali tersedia (FR-B5) |
| POST | `/transactions/{id}/complete` | pemilik pakaian | setelah bayar/serah terima di luar sistem (FR-B6, C4). Menambah penghitung dashboard dan menghapus cache |
| POST | `/transactions/{id}/cancel` | pengaju | membatalkan pengajuan |

Respons: `{ success, message, data: { id, status, statusLabel, statusType, pathway, agreedPrice, message, garment{...}, owner{...}, requester{...}, createdAt, agreedAt, completedAt, cancelledAt } }`

---

## 5. Panduan Perawatan & Reparasi

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| GET | `/care-guides` | publik | format sama dengan `FIBER_PROTOCOLS` (FR-D1) |
| GET | `/care-guides/{slug}` | publik | |
| GET | `/artisans?city=&specialty=&q=` | publik | direktori reparasi terverifikasi (FR-D3) |
| GET | `/artisans/{id}` | publik | |
| POST | `/artisans/register` | publik | pendaftaran, menunggu verifikasi admin |
| GET | `/repair-records` | konsumen, penjual | catatan reparasi milik sendiri |
| POST | `/repair-records` | konsumen, penjual | `{ "category": "DENIM", "repairedAt": "2026-11-20", "repairServiceId": 1, "notes": "..." }` (FR-D4) |
| GET | `/categories` | publik | pilihan kategori untuk form |
| GET | `/fabric-types` | publik | pilihan jenis kain untuk form |

**POST /artisans/register** — `{ "name", "city", "phone", "specialties": ["denim","alterasi"], "specialtyLabel", "bio", "address", "hours" }`

---

## 6. Dashboard Dampak & CO₂e

Rumus: emisi dihindari = Σ (jumlah pakaian selesai × P kategori × D jalur & skenario), E = 0 (WRAP, 2025).

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/impact/summary` | jumlah preloved & donasi selesai, jumlah reparasi, total per skenario (FR-E1, E2, E4) |
| GET | `/impact/scenarios` | objek dengan kunci `konservatif`, `standar`, `optimis` (FR-E3) |
| GET | `/impact/scenarios/{key}` | satu skenario |
| GET | `/impact/categories` | rincian per kategori (skenario dasar) |
| GET | `/impact/emission-factors` | parameter P + batas sistem + sumber (transparansi) |

Contoh skenario:
```json
{ "key": "standar", "label": "Skenario Dasar (Default)", "rateNumber": 64.6, "rateText": "64,6%",
  "rates": { "preloved": 0.646, "donasi": 0 }, "emission": "0,0", "emissionKg": 0, "metricTotal": "0,0 KG",
  "byPathway": { "preloved": 0, "donasi": 0 },
  "desc": "Mengasumsikan 64,6% transaksi preloved dan 0% donasi benar-benar menggantikan pembelian pakaian baru (displacement rate).",
  "equiv": null, "trees": null, "disclaimer": "Angka merupakan estimasi potensi ..." }
```
Angka 0 muncul selama faktor emisi (P) dan D donasi belum diisi tim.

---

## 7. Admin (peran `admin`)

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/admin/stats` | statistik pengguna, penawaran, transaksi + ringkasan CO₂e (FR-E5) |
| GET | `/admin/users?role=&q=&page=` | daftar pengguna (berpaginasi) |
| PATCH | `/admin/users/{id}/status` | `{ "isActive": false }` menonaktifkan + menghapus semua token (FR-A5) |
| PATCH | `/admin/users/{id}/verify-partner` | `{ "verified": true }` (FR-A5) |
| GET | `/admin/garments?status=&listing_type=` | daftar penawaran untuk moderasi |
| PATCH | `/admin/garments/{id}/archive` | menurunkan penawaran tidak sesuai (FR-F3) |
| GET / PUT | `/admin/emission-factors[/{id}]` | `{ kg_co2e_per_item, system_boundary, source_ref, is_proxy }` (FR-F1) |
| GET / PUT | `/admin/displacement-scenarios[/{id}]` | `{ rate: 0.646, source_ref }` (FR-F2) |
| POST / PUT / DELETE | `/admin/care-guides[/{id}]` | `{ fabric_type_id, slug, title, subtitle, icon, steps: [{ step_type: cuci|kering|simpan|rawat, content }] }` (FR-D2) |
| GET / PUT / DELETE | `/admin/repair-services[/{id}]` | verifikasi (`is_verified`) dan kelola direktori reparasi |

Setiap perubahan parameter otomatis menghapus cache dashboard, sehingga angka CO₂e langsung mengikuti parameter baru.
