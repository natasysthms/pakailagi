/**
 * apiConfig.js
 * Konfigurasi pusat untuk komunikasi REST API PakaiLagi (back end Laravel).
 *
 * Cara memakai back end (bukan mock):
 *   Buat file .env.local di root project front end, isi:
 *     VITE_API_BASE_URL=http://localhost:8000/api/v1
 *     VITE_USE_MOCK=false
 *   Lalu jalankan ulang `npm run dev`.
 *
 * Jika VITE_USE_MOCK tidak diisi / bernilai selain 'false', semua service tetap memakai mock data,
 * sehingga front end masih bisa dikembangkan tanpa back end.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Mode mock aktif kecuali VITE_USE_MOCK=false
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const TOKEN_KEY = 'pakailagi_token';

/**
 * Error API yang membawa status HTTP (401, 403, 422, dst.) dan pesan dari back end.
 */
class ApiError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * fetchAPI — wrapper di atas fetch() dengan:
 * - Base URL otomatis
 * - Header JSON (kecuali body berupa FormData untuk upload foto)
 * - Authorization: Bearer <token> jika sudah login
 * - Error terpusat: melempar ApiError berisi pesan dari Laravel
 *
 * @param {string} endpoint  - Path relatif, contoh: '/products'
 * @param {object} options   - Opsi fetch (method, body, headers, dll.)
 * @returns {Promise<any>}   - Data JSON dari response (null untuk 204)
 */
async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      // Untuk FormData, browser mengisi Content-Type + boundary sendiri
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  let body = null;
  try {
    body = await response.json();
  } catch {
    // respons bukan JSON
  }

  if (!response.ok) {
    if (response.status === 401) clearToken(); // token kedaluwarsa / tidak valid

    // Laravel 422: { message, errors: { field: [pesan] } } → ambil pesan pertama yang paling jelas
    const firstFieldError = body?.errors ? Object.values(body.errors)[0]?.[0] : null;
    const message = firstFieldError || body?.message || `HTTP Error ${response.status}`;
    throw new ApiError(message, response.status, body?.errors ?? null);
  }

  return body;
}

/**
 * Untuk aksi kirim form: tidak melempar error, tetapi mengembalikan
 * { success: false, message } agar halaman tetap bisa menampilkan pesan.
 * @param {() => Promise<any>} request
 */
async function submitAPI(request) {
  try {
    const result = await request();
    return { success: true, ...result };
  } catch (error) {
    return {
      success: false,
      message:
        error.status === 401
          ? 'Silakan masuk (login) terlebih dahulu untuk melanjutkan.'
          : error.message || 'Terjadi kesalahan. Silakan coba lagi.',
      needLogin: error.status === 401,
      errors: error.errors ?? null,
    };
  }
}

function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function isLoggedIn() {
  return Boolean(getToken());
}

export { fetchAPI, submitAPI, ApiError, saveToken, clearToken, getToken, isLoggedIn, BASE_URL, USE_MOCK };
