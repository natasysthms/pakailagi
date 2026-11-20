/**
 * artisanService.js
 * Service untuk direktori layanan reparasi (artisan) PakaiLagi.
 *
 * ─── ENDPOINT BACK END ──────────────────────────────────────────────────────
 *  GET    /artisans                  Semua artisan terverifikasi (query: city, specialty, q)
 *  GET    /artisans/:id              Detail artisan
 *  POST   /artisans/register         Daftarkan artisan baru (menunggu verifikasi admin)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { mockArtisans } from '../mockData/artisans.js';
import { fetchAPI, submitAPI, USE_MOCK } from './apiConfig.js';

/** Label pilihan keahlian di form → kode keahlian yang dipakai filter */
const SPECIALTY_CODES = {
  'Sashiko & Darning': ['sashiko'],
  'Denim & Chainstitch': ['denim'],
  'Permak & Alterasi': ['alterasi'],
  'Pewarnaan Alami': ['pewarnaan'],
};

export const artisanService = {
  /**
   * @param {{ city?: string, specialty?: string, q?: string }} filters
   * @returns {Promise<Array>}
   */
  async getAllArtisans(filters = {}) {
    if (USE_MOCK) return [...mockArtisans];

    const query = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    return fetchAPI(`/artisans${query.toString() ? `?${query}` : ''}`);
  },

  /**
   * @param {{ businessName: string, ownerName?: string, phone: string, city: string, specialties: string, priceEstimate?: string }} form
   */
  async registerArtisan(form) {
    if (USE_MOCK) {
      return { success: true, message: 'Pendaftaran artisan berhasil dikirim.' };
    }

    const bio = [
      form.ownerName ? `Pemilik: ${form.ownerName}` : null,
      form.priceEstimate ? `Estimasi biaya: ${form.priceEstimate}` : null,
    ]
      .filter(Boolean)
      .join('. ');

    return submitAPI(() =>
      fetchAPI('/artisans/register', {
        method: 'POST',
        body: JSON.stringify({
          name: form.businessName,
          city: form.city,
          phone: form.phone,
          specialties: SPECIALTY_CODES[form.specialties] || [],
          specialtyLabel: form.specialties,
          bio: bio || null,
        }),
      })
    );
  },
};
