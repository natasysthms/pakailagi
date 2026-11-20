/**
 * userService.js
 * Service untuk autentikasi dan profil pengguna PakaiLagi.
 *
 * ─── ENDPOINT API YANG DIBUTUHKAN (untuk backend developer) ───────────────────
 *
 *  POST   /auth/login               Login dengan email + password → { token, user }
 *  POST   /auth/register            Daftar akun baru → { token, user }
 *  POST   /auth/logout              Logout (invalidate token di server)
 *  GET    /auth/me                  Ambil profil user yang sedang login (dari Bearer token)
 *
 *  GET    /users/:id                Ambil profil pengguna berdasarkan ID
 *  PUT    /users/:id                Update profil pengguna
 *  GET    /users/:id/activity       Ambil riwayat aktivitas (preloved, donasi, reparasi)
 *  GET    /users/:id/inventory      Ambil inventaris pakaian penjual
 *  GET    /users/:id/seller-queue   Ambil antrian permintaan menjadi penjual
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CATATAN INTEGRASI:
 * - Setelah login berhasil, simpan token dengan saveToken() dari apiConfig.js
 * - fetchAPI() otomatis menyertakan token di header Authorization: Bearer <token>
 * - Saat logout, panggil clearToken() dari apiConfig.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { mockUserProfile } from '../mockData/profile.js';
import { fetchAPI, saveToken, clearToken } from './apiConfig.js'; // Aktifkan saat backend siap

export const userService = {
  /**
   * Ambil profil user yang sedang login.
   * @returns {Promise<object>}
   */
  async getCurrentProfile() {
    return fetchAPI('/auth/me');
    return Promise.resolve({ ...mockUserProfile });
  },

  /**
   * Login pengguna.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ success: boolean, message: string, user: object }>}
   */
  async login(credentials) {
    const result = await fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    saveToken(result.token);
    return result;
    console.log('[UserService] Login attempt:', credentials);
    return Promise.resolve({
      success: true,
      message: `Selamat datang kembali, akun ${credentials.email} berhasil diautentikasi.`,
      user: { email: credentials.email, name: mockUserProfile.name },
    });
  },

  /**
   * Daftar akun baru.
   * @param {{ name: string, email: string, password: string, role: 'consumer'|'seller' }} registrationData
   * @returns {Promise<{ success: boolean, message: string, user: object }>}
   */
  async register(registrationData) {
    const result = await fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(registrationData) });
    saveToken(result.token);
    return result;
    console.log('[UserService] Register attempt:', registrationData);
    const roleLabel = registrationData.role === 'consumer' ? 'Konsumen & Donatur' : 'Penjual / Thrift Shop';
    return Promise.resolve({
      success: true,
      message: `Akun sirkular (${roleLabel}) berhasil didaftarkan! Menyiapkan profil...`,
      user: registrationData,
    });
  },

  /**
   * Logout pengguna.
   * @returns {Promise<void>}
   */
  async logout() {
    await fetchAPI('/auth/logout', { method: 'POST' });
    clearToken();
    console.log('[UserService] Logout');
    return Promise.resolve();
  },
};
