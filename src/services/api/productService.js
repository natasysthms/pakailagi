/**
 * productService.js
 * Service untuk data produk preloved PakaiLagi.
 *
 * ─── ENDPOINT BACK END ──────────────────────────────────────────────────────
 *  GET    /products                  Katalog (query: category, size, condition, min_price, max_price, q, page)
 *  GET    /products/featured         Produk unggulan beranda (maks 4)
 *  GET    /products/:id              Detail (id atau slug)
 *  POST   /products/:id/purchase     Ajukan pembelian (WAJIB LOGIN), body: { notes }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { mockProducts } from '../mockData/products.js';
import { fetchAPI, submitAPI, USE_MOCK } from './apiConfig.js';

export const productService = {
  /**
   * Ambil semua produk. Mendukung filter opsional.
   * @param {{ category?: string, size?: string, q?: string, page?: number }} filters
   * @returns {Promise<Array>}
   */
  async getAllProducts(filters = {}) {
    if (USE_MOCK) {
      let results = [...mockProducts];
      if (filters.category) results = results.filter((p) => p.category === filters.category);
      if (filters.size) results = results.filter((p) => p.size === filters.size);
      return results;
    }

    const query = new URLSearchParams(Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''));
    return fetchAPI(`/products${query.toString() ? `?${query}` : ''}`);
  },

  /** @returns {Promise<Array>} */
  async getFeaturedProducts() {
    if (USE_MOCK) return mockProducts.filter((p) => p.featured).slice(0, 4);
    return fetchAPI('/products/featured');
  },

  /**
   * Ambil detail satu produk berdasarkan ID atau slug. Mengembalikan null jika tidak ditemukan.
   * @param {string|number} id
   * @returns {Promise<object|null>}
   */
  async getProductById(id) {
    if (USE_MOCK) return mockProducts.find((p) => p.id === id || p.slug === id) || null;

    try {
      return await fetchAPI(`/products/${encodeURIComponent(id)}`);
    } catch {
      return null;
    }
  },

  /**
   * Kirim pengajuan pembelian. Pembeli diambil dari token login.
   * @param {string|number} productId
   * @param {{ name?: string, phone?: string, notes?: string }} requestData
   * @returns {Promise<{ success: boolean, message: string, needLogin?: boolean }>}
   */
  async submitPurchaseRequest(productId, requestData) {
    if (USE_MOCK) {
      return { success: true, message: 'Pengajuan pembelian berhasil dikirim ke kurator.' };
    }

    const notes = [requestData.notes, requestData.phone ? `Kontak: ${requestData.phone}` : null]
      .filter(Boolean)
      .join('\n');

    return submitAPI(() =>
      fetchAPI(`/products/${productId}/purchase`, { method: 'POST', body: JSON.stringify({ notes }) })
    );
  },
};
