/**
 * impactService.js
 * Service untuk dashboard dampak & estimasi CO₂e PakaiLagi.
 *
 * ─── ENDPOINT BACK END ──────────────────────────────────────────────────────
 *  GET    /impact/summary             Jumlah preloved & donasi selesai, jumlah reparasi, total per skenario
 *  GET    /impact/scenarios           Semua skenario (kunci: konservatif | standar | optimis)
 *  GET    /impact/scenarios/:key      Satu skenario
 *  GET    /impact/categories          Rincian emisi dihindari per kategori (skenario dasar)
 *  GET    /impact/emission-factors    Faktor emisi per kategori + sumber
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { mockImpactScenarios, mockImpactCategories, mockTextileEmissionFactors } from '../mockData/impact.js';
import { fetchAPI, USE_MOCK } from './apiConfig.js';

// Warna kategori ditentukan di front end (back end hanya mengirim data)
const CATEGORY_COLORS = [
  { colorClass: 'bg-primary-container', dotColor: '#01472e' },
  { colorClass: 'bg-secondary', dotColor: '#566342' },
  { colorClass: 'bg-on-secondary-container', dotColor: '#5a6745' },
  { colorClass: 'bg-secondary-fixed-dim', dotColor: '#becca3' },
];

export const impactService = {
    /** @param {string} key - 'standar' | 'optimis' | 'konservatif' */
    async getScenarioData(key = 'standar') {
      if (USE_MOCK) return mockImpactScenarios[key] || mockImpactScenarios.standar;
      return fetchAPI(`/impact/scenarios/${key}`);
    },

    /** @returns {Promise<object>} { konservatif: {...}, standar: {...}, optimis: {...} } */
    async getAllScenarios() {
      if (USE_MOCK) return mockImpactScenarios;
      return fetchAPI('/impact/scenarios');
    },

    /** @returns {Promise<object>} ringkasan indikator dashboard */
    async getSummary() {
      if (USE_MOCK) return { prelovedCompleted: 3420, donationCompleted: 1180, repairsCount: 620, avoidedKg: { standar: 14820 } };
      return fetchAPI('/impact/summary');
    },

    /** @returns {Promise<Array>} */
    async getCategoryBreakdown() {
      if (USE_MOCK) return [...mockImpactCategories];

      const categories = await fetchAPI('/impact/categories');
      return categories.map((category, index) => ({ ...category, ...CATEGORY_COLORS[index % CATEGORY_COLORS.length] }));
    },

    /** @returns {Promise<Array>} */
    async getEmissionFactors() {
      if (USE_MOCK) return [...mockTextileEmissionFactors];

      const factors = await fetchAPI('/impact/emission-factors');
      return factors.map((factor) => ({
        ...factor,
        ef: `${factor.ef} ${factor.unit}${factor.isProxy ? ' (proksi)' : ''}`,
        water: factor.source, // kolom ketiga menampilkan sumber literatur
      }));
    },
};
