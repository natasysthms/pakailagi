/**
 * donationService.js
 * Service untuk data donasi pakaian PakaiLagi.
 *
 * ─── ENDPOINT BACK END ──────────────────────────────────────────────────────
 *  GET    /donations/org-needs       Direktori organisasi penerima donasi
 *  GET    /donations/donor-items     Pakaian donasi siap salur
 *  POST   /donations/commit          Salurkan pakaian ke organisasi (WAJIB LOGIN)
 *  POST   /donations/request         Minta pakaian donasi, body: { itemId, ... } (WAJIB LOGIN)
 *  POST   /donations/upload          Tawarkan pakaian sebagai donasi (WAJIB LOGIN)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { mockOrgNeeds, mockDonorItems } from '../mockData/donations.js';
import { fetchAPI, submitAPI, USE_MOCK } from './apiConfig.js';

/**
 * Pilihan kategori di form donasi front end belum sama dengan kategori di database.
 * Pemetaan sementara ini dipakai sampai dropdown mengambil data dari GET /categories.
 * Kategori menentukan faktor emisi (P), jadi sebaiknya dropdown segera disamakan.
 */
const DONATION_CATEGORY_MAP = {
  'Pakaian Dewasa': 'ATASAN',
  'Pakaian Anak': 'ANAK',
  'Seragam Sekolah': 'ANAK',
  'Pakaian Hangat': 'OUTERWEAR',
};

const toCategory = (value) => DONATION_CATEGORY_MAP[value] || value;

const METHOD_LABEL = {
  dropbox: 'Antar ke Drop Box Kurasi PakaiLagi',
  courier: 'Kirim via ekspedisi langsung ke lembaga',
};

export const donationService = {
  /** @returns {Promise<Array>} */
  async getOrgNeeds() {
    if (USE_MOCK) return [...mockOrgNeeds];
    return fetchAPI('/donations/org-needs');
  },

  /** @returns {Promise<Array>} */
  async getDonorItems() {
    if (USE_MOCK) return [...mockDonorItems];
    return fetchAPI('/donations/donor-items');
  },

  /**
   * Komitmen donasi ke organisasi.
   * @param {{ targetId: number, targetName?: string, category: string, name?: string, phone?: string, quantity?: string, method?: string }} data
   */
  async submitDonationCommitment(data) {
    if (USE_MOCK) {
      return { success: true, message: 'Komitmen donasi tercatat.' };
    }

    return submitAPI(() =>
      fetchAPI('/donations/commit', {
        method: 'POST',
        body: JSON.stringify({
          targetId: data.targetId,
          category: toCategory(data.category),
          items: `Donasi ${data.quantity || ''} pcs untuk ${data.targetName || 'organisasi'}`.replace('  ', ' '),
          quantity: data.quantity ? Number(data.quantity) : null,
          method: METHOD_LABEL[data.method] || data.method,
          phone: data.phone,
          notes: data.name ? `Atas nama: ${data.name}` : null,
        }),
      })
    );
  },

  /**
   * Permintaan pakaian donasi dari penerima.
   * @param {{ itemId: number, orgName?: string, personInCharge?: string, phone?: string, address?: string, reason?: string }} data
   */
  async submitDonationRequest(data) {
    if (USE_MOCK) {
      return { success: true, message: 'Permintaan donasi pakaian Anda telah dicatat.' };
    }

    const reason = [data.personInCharge ? `Penanggung jawab: ${data.personInCharge}` : null, data.reason]
      .filter(Boolean)
      .join('\n');

    return submitAPI(() =>
      fetchAPI('/donations/request', {
        method: 'POST',
        body: JSON.stringify({
          itemId: data.itemId,
          orgName: data.orgName,
          phone: data.phone,
          address: data.address,
          reason,
        }),
      })
    );
  },

  /**
   * Tawarkan pakaian sebagai donasi. Jika mengirim foto, kirim FormData berisi field yang sama + photos[].
   * @param {FormData|{ title: string, category: string, quantity?: string, size?: string, condition: string, notes?: string }} data
   */
  async submitDonationUpload(data) {
    if (USE_MOCK) {
      return { success: true, message: 'Pakaian berhasil didaftarkan ke etalase Donasi Siap Salur!' };
    }

    let body;
    if (data instanceof FormData) {
      data.set('category', toCategory(data.get('category')));
      body = data;
    } else {
      body = JSON.stringify({ ...data, category: toCategory(data.category), quantity: data.quantity ? Number(data.quantity) : null });
    }

    return submitAPI(() => fetchAPI('/donations/upload', { method: 'POST', body }));
  },
};
