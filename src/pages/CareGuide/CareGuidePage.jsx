import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { careGuideService } from '../../services/api/careGuideService';
import './CareGuidePage.css';

const CARE_CATEGORIES = ['Semua Material', 'Katun (Cotton)', 'Denim', 'Wol (Wool)', 'Linen', 'Sutra & Wastra', 'Poliester & Sintetis'];

export default function CareGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua Material');
  const [searchQuery, setSearchQuery] = useState('');
  const [protocols, setProtocols] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    careGuideService.getAllGuides().then(setProtocols).catch(() => setProtocols([]));
  }, []);

  const filteredProtocols = useMemo(() => {
    let result = [...protocols];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.wash.toLowerCase().includes(q) ||
          p.dry.toLowerCase().includes(q) ||
          p.store.toLowerCase().includes(q) ||
          (p.tip || '').toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'Semua Material') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    return result;
  }, [protocols, searchQuery, selectedCategory]);

  return (
    <div className="care-root">
      {/* 1. Hero Section */}
      <section className="care-hero-section">
        <div className="container-custom">
          <span className="badge badge-primary">Edukasi Keberlanjutan Tekstil</span>
          <h1 className="care-headline">
            CARE FOR <br />
            WHAT YOU WEAR.
          </h1>
          <p className="care-lead-text">
            Perawatan yang tepat bukan hanya menjaga pakaian favorit tetap indah, melainkan juga menghemat ribuan
            liter air dan mencegah pelepasan mikroplastik ke perairan kita. Pelajari protokol pemeliharaan berdasarkan serat kain.
          </p>

          {/* Quick Metrics */}
          <div className="care-metrics-bar">
            <div className="care-metric-card">
              <span className="care-metric-num">+2.4 Thn</span>
              <span className="care-metric-label">Rata-rata Usia Pakai Tambahan</span>
            </div>
            <div className="care-metric-card">
              <span className="care-metric-num">-3.200 L</span>
              <span className="care-metric-label">Air Bersih Dihemat Per Garmen</span>
            </div>
            <div className="care-metric-card">
              <span className="care-metric-num">98%</span>
              <span className="care-metric-label">Retensi Warna &amp; Serat Alami</span>
            </div>
            <div className="care-metric-card">
              <span className="care-metric-num">100%</span>
              <span className="care-metric-label">Bebas Bahan Kimia Berbahaya</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Fiber Protocols Section */}
      <section className="care-protocols-section">
        <div className="container-custom">
          <div className="section-label-group">
            <span className="badge badge-secondary">Protokol Kuratorial</span>
            <h2 className="section-title">Protokol Pemeliharaan Tekstil</h2>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', marginTop: '1.25rem' }}>
            <span className="material-symbols-outlined search-input-icon">search</span>
            <input
              type="text"
              className="search-input-field"
              placeholder="Cari panduan serat (contoh: Katun, Sutra, Denim, Linen)..."
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

          {/* Filter Pills */}
          <div className="care-filter-row">
            {CARE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-chip-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Protocols Grid */}
          <div className="protocols-grid">
            {filteredProtocols.map((protocol) => (
              <div key={protocol.id} className="protocol-card">
                <div>
                  <div className="protocol-card-head">
                    <div className="protocol-icon-wrap">
                      <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                        {protocol.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="protocol-title">{protocol.name}</h3>
                      <div className="protocol-sub">{protocol.subtitle}</div>
                    </div>
                  </div>

                  <div className="protocol-steps-list" style={{ marginTop: '1.5rem' }}>
                    <div className="protocol-step-item">
                      <span className="protocol-step-label">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>water_drop</span>
                        <span>Cara Mencuci</span>
                      </span>
                      <p className="protocol-step-desc">{protocol.wash}</p>
                    </div>

                    <div className="protocol-step-item">
                      <span className="protocol-step-label">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>wb_twilight</span>
                        <span>Cara Mengeringkan</span>
                      </span>
                      <p className="protocol-step-desc">{protocol.dry}</p>
                    </div>

                    <div className="protocol-step-item">
                      <span className="protocol-step-label">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>shelves</span>
                        <span>Cara Menyimpan</span>
                      </span>
                      <p className="protocol-step-desc">{protocol.store}</p>
                    </div>
                  </div>
                </div>

                <div className="protocol-curator-tip">
                  <span>{protocol.tip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. International Care Symbols Dictionary Bento */}
      <section className="care-symbols-section-wrap container-custom">
        <div className="symbols-bento-section">
          <div className="section-label-group centered" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <span className="badge badge-primary">Panduan Universal</span>
            <h2 className="section-title">Kamus Simbol Label Cuci Pakaian</h2>
            <p className="section-desc">
              Memahami arti 5 simbol dasar standar internasional (ISO 3758) yang tertera di label leher dan samping pakaian Anda.
            </p>
          </div>

          <div className="bento-symbols-grid">
            <div className="bento-symbol-item">
              <div className="bento-symbol-header">
                <div className="bento-symbol-icon-box">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>wash</span>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                    Bak Air (Pencucian)
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Suhu &amp; Tipe Cuci</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                Menandakan proses pencucian basah. Angka di dalam bak menunjukkan suhu maksimum (°C). Tangan di dalam bak berarti cuci tangan khusus. Bak disilang berarti tidak boleh dicuci basah.
              </p>
            </div>

            <div className="bento-symbol-item">
              <div className="bento-symbol-header">
                <div className="bento-symbol-icon-box">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>change_history</span>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                    Segitiga (Pemutih)
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Klorin &amp; Oksigen</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                Segitiga polos menandakan boleh menggunakan segala jenis pemutih. Segitiga bergaris diagonal hanya memperbolehkan pemutih berbasis oksigen (tanpa klorin). Segitiga disilang dilarang memakai pemutih.
              </p>
            </div>

            <div className="bento-symbol-item">
              <div className="bento-symbol-header">
                <div className="bento-symbol-icon-box">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>crop_square</span>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                    Persegi (Pengeringan)
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Tumble Dryer &amp; Alami</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                Persegi dengan lingkaran di dalamnya adalah mesin pengering (titik menunjukkan tingkat panas). Persegi bergaris horisontal berarti harus dikeringkan mendatar (flat dry) untuk rajutan wol.
              </p>
            </div>

            <div className="bento-symbol-item">
              <div className="bento-symbol-header">
                <div className="bento-symbol-icon-box">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>iron</span>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                    Setrika (Suhu Panas)
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Pengaturan Temperatur</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                1 titik: Maksimal 110°C (Sintetis/Sutra). 2 titik: Maksimal 150°C (Wol). 3 titik: Maksimal 200°C (Katun/Linen tebal). Setrika disilang berarti tidak boleh disetrika panas.
              </p>
            </div>

            <div className="bento-symbol-item">
              <div className="bento-symbol-header">
                <div className="bento-symbol-icon-box">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>motion_photos_on</span>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                    Lingkaran (Dry Clean)
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>Pembersihan Profesional</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                Lingkaran menandakan pakaian memerlukan perawatan cuci kering profesional dengan larutan khusus. Huruf P atau F menunjukkan jenis pelarut kimia yang diizinkan untuk penatu profesional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Callout: Need Repair? */}
      {/* 4. Banner: Solusi Kerusakan Garmen */}
      <section className="care-repair-banner-wrap container-custom">
        <div className="care-repair-banner">
          <div className="section-label-group">
            <span className="badge badge-secondary">Solusi Kerusakan Garmen</span>
            <h3 className="section-title">
              Punya Pakaian dengan Robek atau Kancing Lepas?
            </h3>
            <p className="section-desc">
              Jangan biarkan menumpuk di dasar lemari. Hubungi mitra penjahit dan seniman restorasi terverifikasi kami untuk memperbaikinya dengan teknik darning, sulam sashiko, atau alterasi.
            </p>
          </div>

          <Link to="/layanan-reparasi" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>handyman</span>
            <span>Jelajahi Direktori Reparasi</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
