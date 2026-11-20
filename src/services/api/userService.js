/**
 * userService.js
 * Service untuk autentikasi dan profil pengguna PakaiLagi.
 *
 * ─── ENDPOINT BACK END ──────────────────────────────────────────────────────
 *  POST   /auth/login               { email, password } → { token, user }
 *  POST   /auth/register            { name, email, password, role } → { token, user }
 *  POST   /auth/logout              Hapus token di server
 *  GET    /auth/me                  Profil lengkap pengguna yang login
 *  PUT    /users/me                 Ubah profil
 *  GET    /users/me/activity        Riwayat aktivitas
 *  GET    /users/me/inventory       Pakaian yang ditawarkan
 *  GET    /users/me/seller-queue    Permintaan masuk
 * ─────────────────────────────────────────────────────────────────────────────
 * Token disimpan di localStorage oleh saveToken() dan otomatis dikirim fetchAPI().
 */

import { mockUserProfile } from '../mockData/profile.js';
import { fetchAPI, saveToken, clearToken, isLoggedIn, USE_MOCK } from './apiConfig.js';

export const userService = {
  /**
   * Profil pengguna yang sedang login. Mengembalikan null jika belum login.
   * @returns {Promise<object|null>}
   */
  async getCurrentProfile() {
    if (USE_MOCK) return { ...mockUserProfile };
    if (!isLoggedIn()) return null;

    try {
      return await fetchAPI('/auth/me');
    } catch {
      return null;
    }
  },

  /**
   * Login. Melempar error jika gagal (halaman Auth sudah menangkapnya).
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    if (USE_MOCK) {
      return { success: true, message: `Selamat datang kembali, ${mockUserProfile.name}.`, user: { email: credentials.email } };
    }

    const result = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });
    saveToken(result.token);
    return result;
  },

  /**
   * Daftar akun baru. Melempar error jika gagal.
   * @param {{ fullName: string, email: string, password: string, role: 'consumer'|'seller' }} data
   */
  async register(data) {
    if (USE_MOCK) {
      return { success: true, message: 'Akun berhasil didaftarkan!', user: data };
    }

    const result = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: data.fullName ?? data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }),
    });
    saveToken(result.token);
    return result;
  },

  async logout() {
    if (!USE_MOCK && isLoggedIn()) {
      try {
        await fetchAPI('/auth/logout', { method: 'POST' });
      } catch {
        // tetap hapus token lokal walaupun request gagal
      }
    }
    clearToken();
  },

  isLoggedIn,
};
