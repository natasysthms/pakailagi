/**
 * productService.js
 * Service untuk data produk preloved PakaiLagi.
 *
 * ─── ENDPOINT API YANG DIBUTUHKAN (untuk backend developer) ───────────────────
 *
 *  GET    /products                  Ambil semua produk (support query: ?category=&size=&sort=)
 *  GET    /products/featured         Ambil produk yang ditampilkan di homepage (maks 4)
 *  GET    /products/:id              Ambil detail satu produk berdasarkan ID atau slug
 *  POST   /products/:id/purchase     Kirim pengajuan pembelian (body: { buyerName, buyerEmail, message })
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CATATAN: Saat ini semua fungsi menggunakan mock data lokal.
 * Untuk connect ke backend nyata:
 * 1. Set VITE_USE_MOCK=false di file .env.local
 * 2. Ganti implementasi di bawah dengan pemanggilan fetchAPI
 * 3. Contoh: return fetchAPI('/products');
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { mockProducts } from '../mockData/products.js';
// import { fetchAPI } from './apiConfig.js'; // Aktifkan saat backend siap

export const productService = {
  /**
   * Ambil semua produk. Mendukung filter opsional.
   * @param {{ category?: string, size?: string, sort?: string }} filters
   * @returns {Promise<Array>}
   */
  async getAllProducts(filters = {}) {
    // TODO (backend): return fetchAPI(`/products?${new URLSearchParams(filters)}`);
    let results = [...mockProducts];
    if (filters.category) results = results.filter((p) => p.category === filters.category);
    if (filters.size) results = results.filter((p) => p.size === filters.size);
    return Promise.resolve(results);
  },

  /**
   * Ambil produk unggulan untuk homepage.
   * @returns {Promise<Array>}
   */
  async getFeaturedProducts() {
    // TODO (backend): return fetchAPI('/products/featured');
    return Promise.resolve(mockProducts.filter((p) => p.featured).slice(0, 4));
  },

  /**
   * Ambil detail satu produk berdasarkan ID atau slug.
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async getProductById(id) {
    // TODO (backend): return fetchAPI(`/products/${id}`);
    const product = mockProducts.find((p) => p.id === id || p.slug === id);
    return Promise.resolve(product || null);
  },

  /**
   * Kirim pengajuan pembelian produk.
   * @param {string} productId
   * @param {{ buyerName: string, buyerEmail: string, message: string }} requestData
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async submitPurchaseRequest(productId, requestData) {
    // TODO (backend): return fetchAPI(`/products/${productId}/purchase`, { method: 'POST', body: JSON.stringify(requestData) });
    console.log(`[ProductService] Purchase request for ${productId}:`, requestData);
    return Promise.resolve({
      success: true,
      message: 'Pengajuan pembelian berhasil dikirim ke kurator.',
      data: { productId, ...requestData, timestamp: new Date().toISOString() },
    });
  },
};
