import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GarmentCard from '../../components/common/GarmentCard.jsx';
import { productService } from '../../services/api/productService.js';
import './HomePage.css';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    productService.getFeaturedProducts().then((data) => {
      setFeaturedProducts(data);
    });
  }, []);

  return (
    <div className="home-root">
      {/* SECTION 1: HERO */}
      <section className="hero-section">
        <div className="hero-orb-top"></div>
        <div className="hero-orb-bottom"></div>

        <div className="hero-inner">
          <div className="hero-tag">
            <span className="hero-tag-text">Kurasi 2025</span>
          </div>

          {/* Giant Editorial Headline */}
          <div className="hero-title-box">
            <h1 className="hero-display-title">
              PAKAI LAGI.<br />
              <span className="hero-display-subtitle">LEBIH BERARTI.</span>
            </h1>

            {/* Floating Organic Aesthetic Garment Cards */}
            <div className="hero-float-card-1">
              <div className="float-card-inner-1">
                <div className="float-img-wrap-1">
                  <img
                    className="float-img"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK3it8DjIuF-J8KmCfWLLEmw4N0KTYL13fEJZkYvnppijMj0XGSQ0OJI5XK_G2bTIauW2qPPQ-O-F6AJM51nGmMYsCKvfy7Xl7ftgbsniOa_lu19pW4XYmrptL7Y7wA6KxLktvle3nmXXN1HHliP_RkwxYdSYHQysi8O15SRqSpoJ6jN70ZlSYkySQRQ9eADkxuUiM_mJ8NOv6jnmezQAM-FKOOxKLVo4D9HBEGi1z"
                    alt="Kurasi Linen Organik"
                  />
                </div>
              </div>
            </div>

            <div className="hero-float-card-2">
              <div className="float-card-inner-2">
                <div className="float-img-wrap-2">
                  <img
                    className="float-img"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYq1baPrGnWbkYc93Ku_538rseqDWU6m330rwFn3L2GIV30fRNOTL0DHE171qSN5zrQHyBtfZCEpr1msqCv70SQVwSYgrpeGjFkYH3qlDk2GLvJtRJZfWUp_E66TOHjwyVAfKWITfsKxPD4KytbTXpKEM-APUzK8ABmYa2VMtueyeVNPvC1g0MCJmpulLTSg7bTJtjBAZ0QALR1ecj58fPIVlBXjGtGoy0KeMXjCfX"
                    alt="Detail Raw Denim Jacket"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Sub-copy & Action Pill CTAs */}
          <div className="hero-sub-copy">
            <p className="hero-sub-text">
              Setiap pakaian punya cerita. Perpanjang masa pakainya dengan menjual,
              mendonasikan, atau merawatnya bersama ekosistem kuratorial PakaiLagi.
            </p>
            <div className="hero-actions">
              <Link to="/jelajahi-preloved" className="btn-pill-primary">
                <span>Jelajahi Pakaian</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  arrow_forward
                </span>
              </Link>
              <Link to="/donasi-pakaian" className="btn-pill-secondary">
                <span>Mulai Berdonasi</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MISSION & 3 CIRCULAR PILLARS */}
      <section className="mission-section">
        <div className="mission-box">
          <div className="mission-header">
            <div>
              <p className="font-label-editorial" style={{ color: 'var(--color-secondary)', letterSpacing: '0.25em' }}>
                Manifesto Keberlanjutan
              </p>
              <h2 className="mission-headline">FASHION DOESN'T END HERE.</h2>
            </div>
            <p className="mission-desc">
              Limbah tekstil bukan takdir akhir lemari Anda. Kami merekayasa kembali alur
              siklus hidup serat melalui tiga fondasi sirkular yang terukur, manusiawi, dan estetis.
            </p>
          </div>

          <div className="pillars-grid">
            {/* Pillar 1: REUSE */}
            <div className="pillar-card">
              <div>
                <div className="pillar-top-row">
                  <span className="pillar-num">01</span>
                  <span className="pillar-icon-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                      swap_horiz
                    </span>
                  </span>
                </div>
                <h3 className="pillar-title">REUSE</h3>
                <p className="pillar-text">
                  Gunakan kembali pakaian layak lewat preloved marketplace terkurasi tanpa
                  fast fashion waste. Setiap helai pakaian dibersihkan, diinspeksi, dan dinilai grade autentiknya.
                </p>
              </div>
              <div>
                <Link to="/jelajahi-preloved" className="pillar-link">
                  Koleksi Preloved{' '}
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            {/* Pillar 2: DONATE */}
            <div className="pillar-card">
              <div>
                <div className="pillar-top-row">
                  <span className="pillar-num">02</span>
                  <span className="pillar-icon-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                      handshake
                    </span>
                  </span>
                </div>
                <h3 className="pillar-title">DONATE</h3>
                <p className="pillar-text">
                  Berikan pakaian layak pakai kepada yang membutuhkan secara transparan tanpa
                  perantara berbayar. Dukung panti asuhan, komunitas marjinal, dan bank pakaian terverifikasi.
                </p>
              </div>
              <div>
                <Link to="/donasi-pakaian" className="pillar-link">
                  Alur Donasi Transparan{' '}
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>

            {/* Pillar 3: REPAIR */}
            <div className="pillar-card">
              <div>
                <div className="pillar-top-row">
                  <span className="pillar-num">03</span>
                  <span className="pillar-icon-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                      build
                    </span>
                  </span>
                </div>
                <h3 className="pillar-title">REPAIR</h3>
                <p className="pillar-text">
                  Perpanjang usia pakaian kesayangan melalui direktori penjahit dan reparasi lokal terpercaya.
                  Menambal jahitan lepas, mendinging sashiko, hingga alterasi ukuran profesional.
                </p>
              </div>
              <div>
                <Link to="/layanan-reparasi" className="pillar-link">
                  Temukan Artisan{' '}
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED PRELOVED (Koleksi Pilihan Minggu Ini) */}
      <section className="featured-section">
        <div className="featured-header">
          <div>
            <span className="font-label-editorial" style={{ color: 'var(--color-secondary)', letterSpacing: '0.2em' }}>
              Koleksi Pilihan Minggu Ini
            </span>
            <h2 className="featured-title">CURATED SECOND LIFE</h2>
          </div>
          <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)', maxWidth: '24rem' }}>
            Kuratorial helai berkualitas tinggi yang telah lolos uji kebersihan, keaslian bahan,
            dan standar pakai 7 tahap.
          </p>
        </div>

        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <GarmentCard key={product.id} product={product} />
          ))}
        </div>

        <div className="featured-bottom-action">
          <Link to="/jelajahi-preloved" className="btn-see-all">
            <span>Lihat Semua 420+ Pakaian</span>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              east
            </span>
          </Link>
        </div>
      </section>

      {/* SECTION 4: DONATION (Berdonasi Nyata) */}
      <section className="donation-section">
        <div className="donation-box">
          <div style={{ maxWidth: '48rem', marginBottom: '2rem' }}>
            <div className="donation-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span>
              100% Donasi Pakaian Nyata (Tanpa Uang)
            </div>
            <h2 className="donation-title">PAKAIANMU, CERITA BARU MEREKA.</h2>
            <p className="font-body-md" style={{ color: 'rgba(0, 46, 29, 0.85)', marginTop: '1rem', maxWidth: '38rem' }}>
              Setiap potong busana yang tidak lagi Anda kenakan memiliki potensi untuk menghadirkan
              martabat dan kehangatan bagi sesama. Seluruh proses distribusi terdokumentasi tanpa pungutan dana.
            </p>
          </div>

          <div className="donation-options-grid">
            {/* Option 1: Individu */}
            <div className="donation-card">
              <div>
                <div className="donation-icon-wrap">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    all_inbox
                  </span>
                </div>
                <span className="font-label-editorial" style={{ color: 'var(--color-secondary)' }}>
                  Jalur Donatur Individu
                </span>
                <h3 className="font-headline-sm" style={{ fontSize: '22px', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                  Bagi Pakaian Layak Pakai
                </h3>
                <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Kemas minimal 3 helai pakaian bersih Anda. Pilih lokasi drop-point terdekat di kota Anda
                  atau gunakan kurir logistik sirkular kami untuk penjemputan langsung di pintu rumah.
                </p>
                <div className="donation-checklist">
                  <div className="checklist-item">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
                      check
                    </span>
                    <span>Pembersihan higienis ozon sebelum penyaluran</span>
                  </div>
                  <div className="checklist-item">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
                      check
                    </span>
                    <span>Laporan tanda terima foto langsung dari penerima</span>
                  </div>
                </div>
              </div>
              <div>
                <Link to="/donasi-pakaian" className="donation-card-link">
                  Kirim Pakaian Sekarang →
                </Link>
              </div>
            </div>

            {/* Option 2: Komunitas / Lembaga */}
            <div className="donation-card">
              <div>
                <div className="donation-icon-wrap">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    apartment
                  </span>
                </div>
                <span className="font-label-editorial" style={{ color: 'var(--color-secondary)' }}>
                  Jalur Mitra Komunitas
                </span>
                <h3 className="font-headline-sm" style={{ fontSize: '22px', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                  Kebutuhan Lembaga &amp; Komunitas Terverifikasi
                </h3>
                <p className="font-body-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Lihat daftar kebutuhan nyata dari panti asuhan, posko bencana, dan yayasan lansia. Cocokkan
                  jenis pakaian lemari Anda (baju hangat, seragam sekolah, pakaian bayi) dengan kebutuhan riil.
                </p>
                <div className="donation-checklist">
                  <div className="checklist-item">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
                      check
                    </span>
                    <span>18 mitra yayasan aktif terverifikasi legalitas</span>
                  </div>
                  <div className="checklist-item">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
                      check
                    </span>
                    <span>Alokasi spesifik berdasarkan usia dan ukuran fisik</span>
                  </div>
                </div>
              </div>
              <div>
                <Link to="/donasi-pakaian" className="donation-card-link">
                  Lihat Wishlist Komunitas →
                </Link>
              </div>
            </div>
          </div>

          <div className="donation-bottom-bar">
            <p className="font-body-sm" style={{ color: 'rgba(0, 46, 29, 0.7)' }}>
              Proses donasi bebas biaya pendaftaran. Pakaian cacat berat akan dialihkan ke mitra pencacah serat isolasi.
            </p>
            <Link
              to="/donasi-pakaian"
              className="btn-pill-primary"
              style={{ padding: '0.75rem 2rem', fontSize: '11px' }}
            >
              Jelajahi Donasi
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: SUSTAINABILITY IMPACT PREVIEW */}
      <section className="impact-preview-section">
        <div className="impact-preview-box">
          <div className="impact-header-row">
            <div>
              <span className="font-label-editorial" style={{ color: 'var(--color-secondary)', letterSpacing: '0.22em' }}>
                Metrik Jejak Ekologis Kolektif
              </span>
              <h2 className="impact-headline">DAMPAK SIRKULAR NYATA</h2>
            </div>
            <Link to="/dampak-dan-emisi" className="impact-dashboard-link">
              Buka Dashboard Dampak Lengkap →
            </Link>
          </div>

          <div className="impact-numbers-grid">
            <div className="impact-stat-card">
              <div>
                <span className="stat-number-giant">14.820 KG</span>
                <div className="stat-divider-line"></div>
                <p className="stat-label-title">Potensi CO₂e Dihindari</p>
              </div>
              <p className="stat-sub-note">Setara dengan emisi berkendara roda empat sejauh ~62.000 KM.</p>
            </div>

            <div className="impact-stat-card">
              <div>
                <span className="stat-number-giant">3.420 PCS</span>
                <div className="stat-divider-line accent"></div>
                <p className="stat-label-title">Pakaian Dipakai Lagi</p>
              </div>
              <p className="stat-sub-note">Siklus kedua yang menghindarkan pembakaran tekstil di TPA.</p>
            </div>

            <div className="impact-stat-card">
              <div>
                <span className="stat-number-giant">1.180 PCS</span>
                <div className="stat-divider-line"></div>
                <p className="stat-label-title">Donasi Tersalurkan</p>
              </div>
              <p className="stat-sub-note">Terdistribusi ke 18 panti dan komunitas marjinal terdata.</p>
            </div>

            <div className="impact-stat-card">
              <div>
                <span className="stat-number-giant">620 PCS</span>
                <div className="stat-divider-line accent"></div>
                <p className="stat-label-title">Reparasi Sukses</p>
              </div>
              <p className="stat-sub-note">Direhabilitasi oleh 40+ mitra penjahit lokal binaan.</p>
            </div>
          </div>

          <div className="methodology-box">
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '20px', marginTop: '2px' }}>
              info
            </span>
            <p className="font-body-sm" style={{ lineHeight: '22px' }}>
              <strong style={{ color: 'var(--color-primary)' }}>Catatan Metodologi Transparansi:</strong> Simulasi
              estimasi potensi emisi CO₂e dihindari berdasarkan metodologi faktor emisi tekstil &amp; laju substitusi
              (substitutability factor) standar riset circular economy. Bukan klaim pengukuran emisi aktual langsung di lapangan.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: CLOSING CTA (DEEP FOREST GREEN) */}
      <section className="closing-cta-section">
        <div className="closing-cta-box">
          <div className="closing-glow-1"></div>
          <div className="closing-glow-2"></div>

          <div className="closing-inner">
            <span className="font-label-editorial" style={{ color: 'var(--color-secondary-fixed)', letterSpacing: '0.25em' }}>
              Mulailah Dari Lemarimu Sendiri
            </span>
            <h2 className="closing-headline">GIVE YOUR CLOTHES A SECOND LIFE.</h2>
            <p className="closing-desc">
              Bergabung bersama ribuan individu yang memilih gaya berbusana bertanggung jawab tanpa mengorbankan estetika.
            </p>
            <div style={{ paddingTop: '1.5rem' }}>
              <Link to="/jelajahi-preloved" className="btn-cta-giant">
                <span>Mulai Sekarang — Gratis</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  east
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
