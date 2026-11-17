import { useState, useEffect, useMemo } from 'react';
import { artisanService } from '../../services/api/artisanService';
import './RepairPage.css';

const CITIES = ['Semua Kota', 'Bandung', 'Jakarta Selatan', 'Yogyakarta', 'Solo', 'Surabaya', 'Malang'];
const SPECIALTIES = [
  { id: 'all', label: 'Semua Keahlian' },
  { id: 'sashiko', label: 'Sashiko & Darning' },
  { id: 'denim', label: 'Denim & Chainstitch' },
  { id: 'alterasi', label: 'Permak & Alterasi' },
  { id: 'pewarnaan', label: 'Pewarnaan Alami' }
];

export default function RepairPage() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua Kota');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [bookmarks, setBookmarks] = useState({});

  // Modal registration state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSuccessMessage, setModalSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [regForm, setRegForm] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    city: 'Bandung',
    specialties: 'Sashiko & Darning',
    priceEstimate: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    async function loadArtisans() {
      const data = await artisanService.getAllArtisans();
      setArtisans(data);
      setLoading(false);
    }

    loadArtisans();
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredArtisans = useMemo(() => {
    let result = [...artisans];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.specialtyLabel.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.address.toLowerCase().includes(q)
      );
    }

    if (selectedCity !== 'Semua Kota') {
      result = result.filter((a) => a.city.toLowerCase() === selectedCity.toLowerCase());
    }

    if (selectedSpecialty !== 'all') {
      result = result.filter((a) => a.specialties.includes(selectedSpecialty));
    }

    return result;
  }, [artisans, searchQuery, selectedCity, selectedSpecialty]);

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await artisanService.registerArtisan(regForm);
    setSubmitting(false);
    setModalSuccessMessage(res.message);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('Semua Kota');
    setSelectedSpecialty('all');
  };

  const isFiltered = searchQuery !== '' || selectedCity !== 'Semua Kota' || selectedSpecialty !== 'all';

  return (
    <div className="repair-root">
      {/* 1. Hero Section */}
      <section className="repair-hero-section">
        <div className="container-custom">
          <div className="repair-hero-grid">
            <div>
              <span className="badge badge-primary">Direktori Penjahit &amp; Restorasi Lokal</span>
              <h1 className="repair-headline">
                REPAIR OVER <br />
                REPLACE.
              </h1>
              <h2 className="repair-subhead">
                Perpanjang 9 Bulan, Pangkas 20–30% Jejak Karbon.
              </h2>
              <p className="repair-lead-text">
                Jangan buang pakaian kesayangan hanya karena robekan kecil atau ritsleting rusak. Hubungkan
                garmen Anda dengan para maestro reparasi, perajin sashiko, dan penjahit alterasi terverifikasi.
              </p>
            </div>

            {/* Impact Metric Card */}
            <div className="repair-stats-card">
              <div className="repair-stat-row">
                <div className="repair-stat-icon-wrap">
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>handyman</span>
                </div>
                <div>
                  <div className="repair-stat-num">620+ Pcs</div>
                  <div className="repair-stat-desc">Pakaian Sukses Diperbaiki Melalui Mitra</div>
                </div>
              </div>

              <div className="repair-stat-row" style={{ paddingTop: '1rem', borderTop: '1px solid rgba(254, 250, 224, 0.15)' }}>
                <div className="repair-stat-icon-wrap">
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>compost</span>
                </div>
                <div>
                  <div className="repair-stat-num">~24.8 Ton</div>
                  <div className="repair-stat-desc">Limbah Tekstil Terhindar dari TPA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filter Toolbar */}
      <section className="repair-toolbar-section">
        <div className="container-custom">
          {/* Search bar */}
          <div className="repair-search-wrap">
            <span className="material-symbols-outlined search-input-icon">search</span>
            <input
              type="text"
              className="search-input-field"
              placeholder="Cari nama pengrajin, spesialisasi (Sashiko, Denim, Alterasi), atau alamat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-primary)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            )}
          </div>

          {/* City Pills */}
          <div className="repair-pills-row">
            <span className="filter-pill-label">Kota:</span>
            {CITIES.map((city) => (
              <button
                key={city}
                type="button"
                className={`filter-chip-btn ${selectedCity === city ? 'active' : ''}`}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Specialty Pills */}
          <div className="repair-pills-row">
            <span className="filter-pill-label">Keahlian:</span>
            {SPECIALTIES.map((spec) => (
              <button
                key={spec.id}
                type="button"
                className={`filter-chip-btn ${selectedSpecialty === spec.id ? 'active' : ''}`}
                onClick={() => setSelectedSpecialty(spec.id)}
              >
                {spec.label}
              </button>
            ))}
          </div>

          {/* Subbar Counter & Reset */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-primary)' }}>
              Menemukan {filteredArtisans.length} Artisan Terverifikasi
            </span>
            {isFiltered && (
              <button
                type="button"
                className="btn-reset-filters"
                onClick={handleResetFilters}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>restart_alt</span>
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Artisan Grid */}
      <section className="artisan-grid-section">
        <div className="container-custom">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-primary)' }}>
              <span className="material-symbols-outlined spinning" style={{ fontSize: '32px' }}>progress_activity</span>
              <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>Memuat direktori penjahit...</p>
            </div>
          ) : filteredArtisans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed rgba(0,46,29,0.2)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-on-surface-variant)', opacity: 0.5 }}>
                engineering
              </span>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', marginTop: '1rem', color: 'var(--color-primary)' }}>
                Belum Ada Artisan Sesuai Kriteria
              </h3>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
                Silakan coba ubah pilihan kota atau spesialisasi untuk menemukan bengkel reparasi terdekat lainnya.
              </p>
              <button type="button" className="btn btn-primary" onClick={handleResetFilters}>
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="artisan-grid">
              {filteredArtisans.map((artisan) => (
                <div key={artisan.id} className="artisan-card">
                  <div className="artisan-card-img-wrap">
                    <img src={artisan.image} alt={artisan.name} className="artisan-card-img" loading="lazy" />
                    <span className="artisan-rating-pill">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#e6a100' }}>star</span>
                      <span>{artisan.rating}</span>
                    </span>
                    <button
                      type="button"
                      className={`artisan-bookmark-btn ${bookmarks[artisan.id] ? 'saved' : ''}`}
                      onClick={() => toggleBookmark(artisan.id)}
                      aria-label="Simpan artisan"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {bookmarks[artisan.id] ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>

                  <div className="artisan-card-body">
                    <div>
                      <h3 className="artisan-name">{artisan.name}</h3>
                      <div className="artisan-address">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                        <span>{artisan.address}</span>
                      </div>

                      <div className="artisan-specialties">
                        <span className="artisan-specialty-tag">{artisan.specialtyLabel}</span>
                      </div>

                      <p className="artisan-desc">{artisan.description}</p>
                    </div>

                    <div>
                      <div className="artisan-footer-meta">
                        <span>🕒 {artisan.hours}</span>
                        {artisan.estimate && <span>⏳ {artisan.estimate}</span>}
                      </div>

                      <a
                        href={`https://wa.me/${artisan.whatsapp}?text=Halo%20${encodeURIComponent(artisan.name)},%20saya%20menemukan%20profil%20Anda%20di%20PakaiLagi%20dan%20ingin%20berkonsultasi%20reparasi%20pakaian.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.85rem' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
                        <span>Tanya via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Education: How It Works */}
      <section className="repair-guide-section">
        <div className="container-custom">
          <div className="repair-guide-card">
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <span className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>Edukasi Reparasi</span>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                Cara Mudah Melakukan Reparasi
              </h2>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', marginTop: '0.5rem' }}>
                Alur sederhana untuk merawat kembali garmen berharga Anda.
              </p>
            </div>

            <div className="repair-guide-grid">
              <div className="repair-guide-step">
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--color-primary)' }}>explore</span>
                <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  1. Temukan Penjahit Terdekat
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                  Gunakan filter kota dan keahlian untuk menemukan mitra artisan yang sesuai jenis kerusakan busana Anda.
                </p>
              </div>

              <div className="repair-guide-step">
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--color-primary)' }}>chat</span>
                <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  2. Konsultasi via WhatsApp
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                  Kirimkan foto detail bagian yang robek atau rusak untuk mendapatkan estimasi ongkos dan waktu pengerjaan.
                </p>
              </div>

              <div className="repair-guide-step">
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--color-primary)' }}>check_circle</span>
                <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  3. Siap Dipakai Kembali
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                  Kunjungi workshop mitra atau kirim pakaian melalui ojek online/ekspedisi. Pakaian siap melanjutkan ceritanya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Callout: Are You an Artisan? */}
      <section className="container-custom">
        <div className="artisan-cta-banner">
          <div>
            <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
              Apakah Anda Penjahit atau Pengrajin Reparasi?
            </h3>
            <p style={{ color: 'var(--color-on-secondary-container)', fontSize: '14px', maxWidth: '640px', marginTop: '0.5rem', lineHeight: '22px' }}>
              Bergabunglah bersama jejaring terverifikasi PakaiLagi secara gratis. Dapatkan pelanggan baru yang sadar pentingnya merawat busana berkelanjutan tanpa potongan komisi sepeser pun.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => {
              setIsModalOpen(true);
              setModalSuccessMessage(null);
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_business</span>
            <span>Daftarkan Layanan Anda</span>
          </button>
        </div>
      </section>

      {/* Artisan Registration Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-secondary" style={{ marginBottom: '0.25rem' }}>Kemitraan Gratis</span>
                <h3 className="modal-title">Daftar Sebagai Mitra Artisan</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {modalSuccessMessage ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '52px', color: 'var(--color-primary)' }}>
                  check_circle
                </span>
                <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', textTransform: 'uppercase', color: 'var(--color-primary)', marginTop: '0.75rem' }}>
                  Pendaftaran Terkirim!
                </h4>
                <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', lineHeight: '22px', margin: '0.5rem auto 1.5rem', maxWidth: '380px' }}>
                  {modalSuccessMessage}
                </p>
                <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>
                  Tutup Jendela
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label htmlFor="art-bus-name" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)' }}>
                    Nama Bengkel / Usaha Jahit
                  </label>
                  <input
                    id="art-bus-name"
                    type="text"
                    required
                    className="modal-input"
                    placeholder="Contoh: Sanggar Jahit Lestari"
                    value={regForm.businessName}
                    onChange={(e) => setRegForm({ ...regForm, businessName: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label htmlFor="art-own-name" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)' }}>
                      Nama Pemilik
                    </label>
                    <input
                      id="art-own-name"
                      type="text"
                      required
                      className="modal-input"
                      placeholder="Nama pemilik..."
                      value={regForm.ownerName}
                      onChange={(e) => setRegForm({ ...regForm, ownerName: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label htmlFor="art-phone" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)' }}>
                      No. WhatsApp Aktif
                    </label>
                    <input
                      id="art-phone"
                      type="tel"
                      required
                      className="modal-input"
                      placeholder="0812-xxxx-xxxx"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label htmlFor="art-city" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)' }}>
                      Kota Domisili
                    </label>
                    <select
                      id="art-city"
                      className="modal-input"
                      value={regForm.city}
                      onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                    >
                      {CITIES.filter((c) => c !== 'Semua Kota').map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label htmlFor="art-spec" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)' }}>
                      Keahlian Utama
                    </label>
                    <select
                      id="art-spec"
                      className="modal-input"
                      value={regForm.specialties}
                      onChange={(e) => setRegForm({ ...regForm, specialties: e.target.value })}
                    >
                      <option value="Sashiko & Darning">Sashiko &amp; Darning</option>
                      <option value="Denim & Chainstitch">Denim &amp; Chainstitch</option>
                      <option value="Permak & Alterasi">Permak &amp; Alterasi</option>
                      <option value="Pewarnaan Alami">Pewarnaan Alami</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label htmlFor="art-price" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)' }}>
                    Kisaran Estimasi Biaya
                  </label>
                  <input
                    id="art-price"
                    type="text"
                    className="modal-input"
                    placeholder="Contoh: Mulai Rp 25.000 - Rp 150.000 tergantung kerusakan"
                    value={regForm.priceEstimate}
                    onChange={(e) => setRegForm({ ...regForm, priceEstimate: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                  {submitting ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran Mitra'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
