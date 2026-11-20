/**
 * donationService.js
 * Service untuk data donasi pakaian PakaiLagi.
 *
 * ─── ENDPOINT API YANG DIBUTUHKAN (untuk backend developer) ───────────────────
 *
 *  GET    /donations/org-needs              Ambil daftar kebutuhan organisasi penerima donasi
 *  GET    /donations/donor-items            Ambil daftar pakaian siap salur dari donor
 *  POST   /donations/commit                 Submit komitmen donasi (body: { orgId, name, phone, items, notes })
 *  POST   /donations/request                Submit permintaan donasi dari penerima (body: { name, org, need, ... })
 *  POST   /donations/upload                 Upload pakaian untuk didonasikan (body: FormData dengan foto)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CATATAN: Semua fungsi saat ini menggunakan mock data.
 * Untuk connect backend: ganti implementasi dengan pemanggilan fetchAPI.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { mockOrgNeeds, mockDonorItems } from '../mockData/donations.js';
import { fetchAPI } from './apiConfig.js'; // Aktifkan saat backend siap

export const donationService = {
  /**
   * Ambil daftar kebutuhan organisasi (untuk tab "Saya Ingin Memberi").
   * @returns {Promise<Array>}
   */
  async getOrgNeeds() {
    return fetchAPI('/donations/org-needs');
    return Promise.resolve([...mockOrgNeeds]);
  },

  /**
   * Ambil daftar pakaian siap salur dari donor (untuk tab "Saya Butuh Pakaian").
   * @returns {Promise<Array>}
   */
  async getDonorItems() {
    // TODO (backend): return fetchAPI('/donations/donor-items');
    return Promise.resolve([...mockDonorItems]);
  },

  /**
   * Submit komitmen donasi — pengguna ingin mengirim pakaian ke organisasi.
   * @param {{ orgId: string, name: string, phone: string, items: string, notes: string }} data
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async submitDonationCommitment(data) {
    // TODO (backend): return fetchAPI('/donations/commit', { method: 'POST', body: JSON.stringify(data) });
    console.log('[DonationService] New donation commitment:', data);
    return Promise.resolve({
      success: true,
      message: 'Nomor resi instruksi pengiriman telah dibuat dan dikirimkan ke kontak Anda.',
      data,
    });
  },

  /**
   * Submit permintaan donasi dari penerima manfaat.
   * @param {{ name: string, org: string, need: string }} data
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async submitDonationRequest(data) {
    // TODO (backend): return fetchAPI('/donations/request', { method: 'POST', body: JSON.stringify(data) });
    console.log('[DonationService] New beneficiary request:', data);
    return Promise.resolve({
      success: true,
      message:
        'Permintaan donasi pakaian Anda telah dicatat dan masuk ke antrean verifikasi tim sosial PakaiLagi.',
      data,
    });
  },

  /**
   * Upload pakaian donasi dari pengguna (menjadi donor item baru).
   * @param {FormData|object} data - FormData dengan foto pakaian + metadata
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async submitDonationUpload(data) {
    // TODO (backend): return fetchAPI('/donations/upload', { method: 'POST', body: data, headers: {} });
    // Catatan: saat upload file, jangan set Content-Type (biarkan browser set multipart boundary otomatis)
    console.log('[DonationService] New donor clothing upload:', data);
    return Promise.resolve({
      success: true,
      message:
        'Pakaian berhasil didaftarkan ke etalase Donasi Siap Salur! Kurator kami akan memvalidasi foto sebelum tayang publik.',
      data,
    });
  },
};
