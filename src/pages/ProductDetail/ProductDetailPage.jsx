import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import GarmentCard from '../../components/common/GarmentCard';
import { productService } from '../../services/api/productService';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Modal form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function loadData() {
      const targetId = id || 'PKL-VRN-882';
      let foundProduct = await productService.getProductById(targetId);
      
      // Fallback to first product if direct id not found
      if (!foundProduct) {
        const all = await productService.getAllProducts();
        foundProduct = all[0];
      }

      setProduct(foundProduct);
      setActiveImageIndex(0);

      const all = await productService.getAllProducts();
      const others = all.filter((p) => p.id !== foundProduct.id).slice(0, 3);
      setRelatedProducts(others);
      setLoading(false);
    }

    loadData();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title || 'PakaiLagi Garment',
        text: `Lihat arsip preloved ${product?.title} di PakaiLagi.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await productService.submitPurchaseRequest(product.id, formData);
    setSubmitting(false);
    setFormSubmitted(true);
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setFormSubmitted(false);
    setFormData({ name: '', phone: '', notes: '' });
  };

  if (loading || !product) {
    return (
      <div className="container-custom" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <span className="material-symbols-outlined spinning" style={{ fontSize: '36px', color: 'var(--color-primary)' }}>
          progress_activity
        </span>
        <p style={{ marginTop: '1rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-primary)' }}>
          Memuat arsip kurasi garmen...
        </p>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB0Qvo3emhFyiwoR-RKF7p7BDYGEUxBfdF1hitKF6Q6BQWCTmA0c5f2eQDF9FnTeyB0mFxIDsZvWeyhB9uhSXOHDaUPKZeQFh6xAArd4VJm52fARnnhGlQQ2cCzuYphzLO9NCZAMFERmGPEQlVNHsjVHOPLzqYIcjxh9t_3XWec1pepw16-jyEQZYvkbLPxUj2eWJRjXmR47PHHWzJztUlS-QRbh-tZBnbnm9p9AJwR'
  ];

  const thumbLabels = ['Siluet', 'Tenun Serat', 'Label & Kancing'];

  return (
    <div className="product-detail-root">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs-bar" aria-label="Breadcrumb">
          <Link to="/">Beranda</Link>
          <span className="separator">/</span>
          <Link to="/jelajahi-preloved">Jelajahi Preloved</Link>
          <span className="separator">/</span>
          <span className="current">{product.id}</span>
        </nav>

        {/* Hero Detail Grid */}
        <div className="detail-hero-grid">
          {/* Left Column: Image Gallery */}
          <div className="gallery-sticky-wrap">
            <div className="main-image-frame">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.title}
                loading="lazy"
              />

              {/* Action Circle Buttons */}
              <div className="gallery-action-overlay">
                <button
                  type="button"
                  className="gallery-circle-btn"
                  onClick={handleShare}
                  aria-label="Bagikan pakaian"
                  title="Salin tautan garmen"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {copiedNotification ? 'check' : 'share'}
                  </span>
                </button>
                <button
                  type="button"
                  className={`gallery-circle-btn ${isWishlisted ? 'wishlisted' : ''}`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Simpan ke favorit"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {isWishlisted ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              </div>

              {/* Impact Badges */}
              <div className="gallery-impact-strips">
                <span className="gallery-impact-pill">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>eco</span>
                  -{product.avoidedCo2} kg CO₂e
                </span>
                <span className="gallery-impact-pill">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>water_drop</span>
                  -{product.conservedWater.toLocaleString('id-ID')} L Air
                </span>
              </div>
            </div>

            {/* Gallery Thumbnail Selectors */}
            {images.length > 1 && (
              <div className="gallery-thumbs-row">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`gallery-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={imgUrl} alt="" className="gallery-thumb-img" />
                    <span>{thumbLabels[idx] || `Foto ${idx + 1}`}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Spec & Curatorial Info */}
          <div className="detail-info-col">
            <div>
              <span className="detail-category-tag">{product.categoryLabel || product.category}</span>
              <h1 className="detail-title">{product.title}</h1>
            </div>

            {/* Price Box */}
            <div className="detail-price-box">
              <span className="detail-price-current">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
              {product.originalPrice && (
                <span className="detail-price-original">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </span>
              )}
              <span className="detail-price-saving">
                Hemat ~{Math.round((1 - product.price / (product.originalPrice || product.price * 1.5)) * 100)}%
              </span>
            </div>

            {/* Quick Specs Matrix */}
            <div className="specs-matrix">
              <div className="spec-tile">
                <span className="spec-tile-label">Kondisi Fisik</span>
                <span className="spec-tile-value">{product.condition}</span>
              </div>
              <div className="spec-tile">
                <span className="spec-tile-label">Ukuran Garmen</span>
                <span className="spec-tile-value">{product.sizeShort || product.size}</span>
              </div>
              <div className="spec-tile">
                <span className="spec-tile-label">Material Serat</span>
                <span className="spec-tile-value">{product.material}</span>
              </div>
              <div className="spec-tile">
                <span className="spec-tile-label">Lokasi Kurator</span>
                <span className="spec-tile-value">{product.location}</span>
              </div>
            </div>

            {/* Environmental Conservation Highlight Box */}
            <div className="detail-impact-box">
              <div className="detail-impact-header">
                <span className="badge badge-secondary">Taksiran Reduksi Jejak Karbon</span>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary-fixed)', fontSize: '20px' }}>
                  nature_people
                </span>
              </div>
              <div className="impact-values-row">
                <div>
                  <div className="impact-val-num">{product.avoidedCo2} KG</div>
                  <div className="impact-val-sub">Emisi CO₂e Tercegah</div>
                </div>
                <div>
                  <div className="impact-val-num">{product.conservedWater.toLocaleString('id-ID')} L</div>
                  <div className="impact-val-sub">Cadangan Air Tanah Terjaga</div>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(254, 250, 224, 0.75)', lineHeight: '16px', margin: 0 }}>
                *Dihitung berdasarkan koefisien substitusi garmen serat alami terkurasi pengganti manufaktur pakaian baru.
              </p>
            </div>

            {/* Curatorial Story */}
            <div className="curatorial-story-box">
              <h2>Catatan Kuratorial</h2>
              <p>{product.description}</p>
            </div>

            {/* Verification Checklist */}
            <div className="verification-card">
              <h2 style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                Standar Verifikasi PakaiLagi
              </h2>
              <ul className="verification-list">
                <li className="verification-item">
                  <span className="material-symbols-outlined verification-icon">verified</span>
                  <span>Telah melalui inspeksi keaslian serat & kebersihan 7 tahap terakreditasi kurator.</span>
                </li>
                <li className="verification-item">
                  <span className="material-symbols-outlined verification-icon">compost</span>
                  <span>Bukan garmen sintetis cepat rusak — 100% serat alami murni yang dapat terurai secara biologis.</span>
                </li>
                <li className="verification-item">
                  <span className="material-symbols-outlined verification-icon">package_2</span>
                  <span>Dikemas menggunakan bio-plastic kantong pati singkong (cassava bag) 0% limbah minyak bumi.</span>
                </li>
              </ul>
            </div>

            {/* Curator Profile Strip */}
            <div className="curator-strip">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div className="curator-avatar">
                  {product.curator?.initials || 'PK'}
                </div>
                <div className="curator-meta">
                  <span className="curator-name">
                    {product.curator?.name || 'Kurator PakaiLagi'}
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
                      verified
                    </span>
                  </span>
                  <span className="curator-stats">
                    {product.curator?.location} • Rating {product.curator?.rating || '4.9'} ({product.curator?.totalGarments || 80}+ Garmen Terkurasi)
                  </span>
                </div>
              </div>

              <a
                href={`https://wa.me/${product.curator?.whatsapp || '6281234567890'}?text=Halo%20${encodeURIComponent(product.curator?.name || 'Kurator')},%20saya%20tertarik%20dengan%20arsip%20${encodeURIComponent(product.title)}%20(${product.id})%20di%20PakaiLagi.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-chat-curator"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat</span>
                <span>Tanya Kurator</span>
              </a>
            </div>

            {/* Giant Action Button */}
            <button
              type="button"
              className="btn-request-buy"
              onClick={() => setIsModalOpen(true)}
            >
              <span>Ajukan Pembelian (Request to Buy)</span>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <section className="product-tabs-section">
          <div className="tabs-nav-bar">
            <button
              type="button"
              className={`tab-nav-btn ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              Panduan Ukuran & Fitting Detail
            </button>
            <button
              type="button"
              className={`tab-nav-btn ${activeTab === 2 ? 'active' : ''}`}
              onClick={() => setActiveTab(2)}
            >
              Logbook Riwayat & Asal-Usul
            </button>
            <button
              type="button"
              className={`tab-nav-btn ${activeTab === 3 ? 'active' : ''}`}
              onClick={() => setActiveTab(3)}
            >
              Cara Perawatan Rekomendasi
            </button>
          </div>

          <div className="tab-pane-body">
            {/* Tab 1: Measurements */}
            {activeTab === 1 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '22px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Matriks Pengukuran Presisi
                </h3>
                <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', margin: '0.5rem 0 1.5rem' }}>
                  Setiap garmen diukur secara mendatar (flat measurement) di atas meja inspeksi. Direkomendasikan untuk membandingkan dimensi ini dengan pakaian favorit yang biasa Anda kenakan.
                </p>
                <div className="matrix-measurements-grid">
                  <div className="measure-box">
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                      Lebar Bahu
                    </span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                      52 cm
                    </div>
                  </div>
                  <div className="measure-box">
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                      Lingkar Dada (Pit to Pit)
                    </span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                      60 cm (LD ~120 cm)
                    </div>
                  </div>
                  <div className="measure-box">
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                      Panjang Lengan
                    </span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                      56 cm (Dropped Shoulder)
                    </div>
                  </div>
                  <div className="measure-box">
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                      Panjang Garmen Total
                    </span>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                      74 cm (Tengkuk ke Bawah)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Passport Timeline */}
            {activeTab === 2 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '22px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Jejak Waktu & Kepemilikan (Digital Passport)
                </h3>
                <div className="timeline-list">
                  <div className="timeline-node">
                    <div className="timeline-dot" />
                    <span className="timeline-date">1994 • Osaka, Jepang</span>
                    <div className="timeline-heading">Produksi Tekstil & Pekerja Artisan</div>
                    <p className="timeline-desc">
                      Ditenun menggunakan benang katun selvedge lokal oleh konveksi artisan di pinggiran Prefektur Osaka. Digunakan sebagai luaran montir dan berkebun santai.
                    </p>
                  </div>
                  <div className="timeline-node">
                    <div className="timeline-dot" style={{ backgroundColor: 'var(--color-secondary)' }} />
                    <span className="timeline-date">Oktober 2023 • Yogyakarta, Indonesia</span>
                    <div className="timeline-heading">Akuisisi Kurasi oleh Reka Karsa Archive</div>
                    <p className="timeline-desc">
                      Dipilih secara langsung melalui program lelang bal arsip pakaian kerja vintage untuk melestarikan keaslian sulaman manual sashiko.
                    </p>
                  </div>
                  <div className="timeline-node">
                    <div className="timeline-dot" style={{ backgroundColor: 'var(--color-primary-fixed)' }} />
                    <span className="timeline-date">Januari 2025 • Laboratorium Sirkular PakaiLagi</span>
                    <div className="timeline-heading">Sanitasi Ozon Regeneratif & Siap Pakai</div>
                    <p className="timeline-desc">
                      Pembersihan mendalam tanpa detergen kimia berbahaya. Serat dikondisikan ulang dengan pelembut berbasis kedelai ramah lingkungan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Garment Care */}
            {activeTab === 3 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '22px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Protokol Perawatan Serat Alami
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
                  <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-primary)' }}>water_drop</span>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0.5rem 0 0.25rem', color: 'var(--color-primary)' }}>
                      Pencucian Air Dingin
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                      Gunakan air bersuhu ruang (maksimal 30°C) dengan detergen cair netral berformula bio-enzim agar serat katun tenun tidak menyusut.
                    </p>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-primary)' }}>wb_twilight</span>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0.5rem 0 0.25rem', color: 'var(--color-primary)' }}>
                      Keringkan Secara Alami
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                      Hindari penggunaan mesin pengering panas (tumble dryer). Cukup angin-anginkan di tempat teduh tanpa terpapar matahari langsung.
                    </p>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-primary)' }}>shelves</span>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0.5rem 0 0.25rem', color: 'var(--color-primary)' }}>
                      Penyimpanan Berventilasi
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                      Gantung dengan hanger kayu lebar atau lipat longgar bersama serbuk kayu cedar alami untuk melindungi dari serangga dan jamur.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Garments Section */}
        {relatedProducts.length > 0 && (
          <section className="related-section">
            <div className="related-header">
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Arsip Pilihan Lainnya</span>
                <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Garmen Serupa
                </h2>
              </div>
              <Link
                to="/jelajahi-preloved"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '6px'
                }}
              >
                Lihat Semua Koleksi Preloved →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {relatedProducts.map((p) => (
                <GarmentCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal: Request to Buy */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={resetModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-secondary" style={{ marginBottom: '0.25rem' }}>
                  Transaksi Sirkular Langsung
                </span>
                <h3 className="modal-title">Ajukan Pembelian Pakaian</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={resetModal}
                aria-label="Tutup"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '56px', color: 'var(--color-primary)' }}>
                  check_circle
                </span>
                <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', textTransform: 'uppercase', color: 'var(--color-primary)', marginTop: '0.75rem' }}>
                  Permintaan Berhasil Terkirim!
                </h4>
                <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', lineHeight: '22px', margin: '0.5rem auto 1.5rem', maxWidth: '380px' }}>
                  Kurator <strong>{product.curator?.name}</strong> telah menerima detail pemesanan Anda. Anda juga dapat langsung mengonfirmasi via WhatsApp untuk respon instan.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <a
                    href={`https://wa.me/${product.curator?.whatsapp || '6281234567890'}?text=Halo%20${encodeURIComponent(product.curator?.name || 'Kurator')},%20saya%20sudah%20mengirimkan%20pengajuan%20beli%20untuk%20${encodeURIComponent(product.title)}%20(${product.id})%20atas%20nama%20${encodeURIComponent(formData.name)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ justifyContent: 'center' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
                    <span>Lanjutkan Konfirmasi WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={resetModal}
                    style={{ justifyContent: 'center' }}
                  >
                    Tutup Jendela
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="modal-form-wrap">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-md)' }}>
                  <img
                    src={images[0]}
                    alt=""
                    style={{ width: '3rem', height: '3.75rem', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {product.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                      Rp {product.price.toLocaleString('id-ID')} • {product.sizeShort || product.size}
                    </div>
                  </div>
                </div>

                <div className="modal-input-group">
                  <label htmlFor="modal-name" className="modal-label">Nama Lengkap Pemohon</label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    className="modal-input"
                    placeholder="Ketik nama lengkap Anda..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="modal-input-group">
                  <label htmlFor="modal-phone" className="modal-label">Nomor WhatsApp Aktif</label>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    className="modal-input"
                    placeholder="Contoh: 081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="modal-input-group">
                  <label htmlFor="modal-notes" className="modal-label">Catatan Serah Terima / Alamat COD</label>
                  <textarea
                    id="modal-notes"
                    rows="3"
                    className="modal-textarea"
                    placeholder="Contoh: Prefer COD di area kampus atau kirim via Paxel ke Bandung..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', lineHeight: '16px' }}>
                  ℹ️ PakaiLagi tidak memotong biaya komisi. Pembayaran disepakati langsung antara Anda dan kurator saat penyerahan barang atau pengiriman.
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={submitting}
                >
                  {submitting ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan Pembelian'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
