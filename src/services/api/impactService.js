/**
 * impactService.js
 * Service untuk data dampak emisi PakaiLagi.
 *
 * ─── ENDPOINT API YANG DIBUTUHKAN (untuk backend developer) ───────────────────
 *
 *  GET    /impact/scenarios           Ambil semua skenario kalkulasi emisi
 *  GET    /impact/scenarios/:key      Ambil satu skenario berdasarkan key (standar/optimis/konservatif)
 *  GET    /impact/categories          Ambil breakdown emisi per kategori tekstil
 *  GET    /impact/emission-factors    Ambil tabel faktor emisi per jenis bahan
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { mockImpactScenarios, mockImpactCategories, mockTextileEmissionFactors } from '../mockData/impact.js';
// import { fetchAPI } from './apiConfig.js'; // Aktifkan saat backend siap

export const impactService = {
  /**
   * Ambil data satu skenario kalkulasi.
   * @param {string} key - 'standar' | 'optimis' | 'konservatif'
   * @returns {Promise<object>}
   */
  async getScenarioData(key = 'standar') {
    // TODO (backend): return fetchAPI(`/impact/scenarios/${key}`);
    return Promise.resolve(mockImpactScenarios[key] || mockImpactScenarios.standar);
  },

  /**
   * Ambil semua skenario sekaligus (untuk render tab).
   * @returns {Promise<object>} Key-value: { standar: {...}, optimis: {...}, ... }
   */
  async getAllScenarios() {
    // TODO (backend): return fetchAPI('/impact/scenarios');
    return Promise.resolve(mockImpactScenarios);
  },

  /**
   * Ambil breakdown emisi per kategori tekstil.
   * @returns {Promise<Array>}
   */
  async getCategoryBreakdown() {
    // TODO (backend): return fetchAPI('/impact/categories');
    return Promise.resolve([...mockImpactCategories]);
  },

  /**
   * Ambil tabel faktor emisi CO₂ per jenis bahan.
   * @returns {Promise<Array>}
   */
  async getEmissionFactors() {
    // TODO (backend): return fetchAPI('/impact/emission-factors');
    return Promise.resolve([...mockTextileEmissionFactors]);
  },
};
