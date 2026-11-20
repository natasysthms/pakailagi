/**
 * apiConfig.js
 * Konfigurasi pusat untuk komunikasi REST API PakaiLagi.
 *
 * Ketika backend sudah siap, ganti BASE_URL dengan URL server yang sesungguhnya.
 * Semua service di src/services/api/ menggunakan fungsi fetchAPI dari sini.
 */

// ─────────────────────────────────────────────────────────────────────────────
// KONFIGURASI BASE URL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gunakan environment variable VITE_API_BASE_URL jika tersedia.
 * Untuk development lokal, buat file .env.local di root project dan isi:
 *   VITE_API_BASE_URL=http://localhost:8000/api/v1
 *
 * Untuk production, set environment variable ini di server hosting.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Apakah aplikasi sedang dalam mode mock (backend belum tersedia)?
// const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FETCH WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * fetchAPI — wrapper di atas browser fetch() dengan:
 * - Base URL otomatis
 * - JSON Content-Type default
 * - Authorization header dari localStorage
 * - Error handling terpusat
 *
 * @param {string} endpoint  - Path relatif, contoh: '/products'
 * @param {object} options   - Opsi fetch standar (method, body, headers, dll.)
 * @returns {Promise<any>}   - Data JSON dari response
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const token = localStorage.getItem('pakailagi_token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    // Coba baca pesan error dari body JSON (jika ada)
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorBody.detail || errorMessage;
    } catch {
      // Response bukan JSON, gunakan status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Jika response 204 No Content, kembalikan null
  if (response.status === 204) return null;

  return response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simpan token ke localStorage setelah login berhasil.
 * @param {string} token
 */
function saveToken(token) {
  localStorage.setItem('pakailagi_token', token);
}

/**
 * Hapus token dari localStorage saat logout.
 */
function clearToken() {
  localStorage.removeItem('pakailagi_token');
}

/**
 * Ambil token yang tersimpan (untuk pengecekan status login).
 * @returns {string|null}
 */
function getToken() {
  return localStorage.getItem('pakailagi_token');
}

// ─────────────────────────────────────────────────────────────────────────────
// EKSPOR
// ─────────────────────────────────────────────────────────────────────────────

export { fetchAPI, saveToken, clearToken, getToken, BASE_URL, USE_MOCK };
