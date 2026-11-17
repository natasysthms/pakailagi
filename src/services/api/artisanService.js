/**
 * artisanService.js
 * Service untuk data artisan reparasi PakaiLagi.
 *
 * ─── ENDPOINT API YANG DIBUTUHKAN (untuk backend developer) ───────────────────
 *
 *  GET    /artisans                  Ambil semua artisan (support query: ?city=&specialty=)
 *  GET    /artisans/:id              Ambil detail satu artisan berdasarkan ID
 *  POST   /artisans/register         Daftarkan artisan baru (body: { name, city, specialty, ... })
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { mockArtisans } from '../mockData/artisans.js';
// import { fetchAPI } from './apiConfig.js'; // Aktifkan saat backend siap

export const artisanService = {
  /**
   * Ambil semua artisan. Mendukung filter opsional.
   * @param {{ city?: string, specialty?: string }} filters
   * @returns {Promise<Array>}
   */
  async getAllArtisans() {
    // TODO (backend): return fetchAPI(`/artisans?${new URLSearchParams(filters)}`);
    // filters parameter: { city?: string, specialty?: string }
    return Promise.resolve([...mockArtisans]);
  },

  /**
   * Daftarkan artisan baru ke direktori reparasi.
   * @param {{ name: string, city: string, specialties: string[], phone: string, bio: string }} artisanData
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async registerArtisan(artisanData) {
    // TODO (backend): return fetchAPI('/artisans/register', { method: 'POST', body: JSON.stringify(artisanData) });
    console.log('[ArtisanService] Register new artisan:', artisanData);
    return Promise.resolve({
      success: true,
      message: 'Pendaftaran artisan berhasil dikirim. Tim kurator PakaiLagi akan menghubungi dalam 24 jam.',
      data: artisanData,
    });
  },
};
