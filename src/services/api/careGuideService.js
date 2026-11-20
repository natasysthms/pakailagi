/**
 * careGuideService.js
 * Service untuk panduan perawatan pakaian per jenis kain.
 *
 * ─── ENDPOINT BACK END ──────────────────────────────────────────────────────
 *  GET    /care-guides               Semua panduan (format sama dengan mockCareGuides)
 *  GET    /care-guides/:slug         Satu panduan
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { mockCareGuides } from '../mockData/careGuides.js';
import { fetchAPI, USE_MOCK } from './apiConfig.js';

export const careGuideService = {
  /** @returns {Promise<Array>} */
  async getAllGuides() {
    if (USE_MOCK) return [...mockCareGuides];
    return fetchAPI('/care-guides');
  },
};
