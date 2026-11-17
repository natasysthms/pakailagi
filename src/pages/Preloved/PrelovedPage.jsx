import { useState, useEffect, useMemo } from 'react';
import GarmentCard from '../../components/common/GarmentCard';
import { productService } from '../../services/api/productService';
import './PrelovedPage.css';

const CATEGORIES = ['Semua', 'Atasan', 'Celana & Rok', 'Outerwear', 'Gaun', 'Denim'];
const SIZES = ['Semua', 'XS', 'S', 'M', 'L', 'XL', 'All Size'];

export default function PrelovedPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedSize, setSelectedSize] = useState('Semua');
  const [sortBy, setSortBy] = useState('curated');
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    window.scrollTo(0, 0);
    productService.getAllProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'Semua') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Size filter
    if (selectedSize !== 'Semua') {
      result = result.filter((p) => {
        const pSize = (p.sizeShort || p.size || '').toLowerCase();
        return pSize.includes(selectedSize.toLowerCase());
      });
    }

    // Sorting
    if (sortBy === 'co2-high') {
      result.sort((a, b) => b.avoidedCo2 - a.avoidedCo2);
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.reverse();
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSize, sortBy]);

  const visibleProducts = filteredProducts.slice(0, displayCount);

  // Collective metrics for the spotlight section
  const totalAvoidedCo2 = useMemo(() => {
    return filteredProducts.reduce((sum, p) => sum + (p.avoidedCo2 || 0), 0).toFixed(1);
  }, [filteredProducts]);

  const totalConservedWater = useMemo(() => {
    return filteredProducts.reduce((sum, p) => sum + (p.conservedWater || 0), 0).toLocaleString('id-ID');
  }, [filteredProducts]);

  const isFiltered = searchQuery !== '' || selectedCategory !== 'Semua' || selectedSize !== 'Semua';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSelectedSize('Semua');
    setSortBy('curated');
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  return (
    <div className="preloved-root">
      {/* 1. Header Section */}
      <section className="preloved-header-section">
        <div className="container-custom">
          <div className="preloved-hero-grid">
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
                Katalog Kurasi Mandiri
              </span>
              <h1 className="preloved-headline">
                ARSIP & PRELOVED <br />
                PILIHAN.
              </h1>
            </div>
            <div>
              <p className="preloved-manifest-text">
                Setiap helai pakaian di sini bukan sekadar barang bekas, melainkan arsip fesyen yang diselamatkan.
                Lengkap dengan taksiran konservasi air, jejak emisi terhindar, dan standar kurasi higienis.
              </p>
            </div>
          </div>

          <div className="circular-rule-notice">
            <span className="material-symbols-outlined" style={{ fontSize: '24px', flexShrink: 0 }}>
              info
            </span>
            <div style={{ fontSize: '13px', lineHeight: '20px' }}>
              <strong>Prinsip Sirkular Langsung:</strong> PakaiLagi memberlakukan zero-cut komisi (0%). Transaksi
              dilakukan secara mandiri antar kurator dan penikmat fesyen via pesan langsung atau COD demi menekan
              jejak karbon kemasan berlebih.
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sticky Toolbar */}
      <section className="preloved-toolbar-section">
        <div className="container-custom">
          <div className="toolbar-search-row">
            {/* Search Input */}
            <div className="search-input-wrap">
              <span className="material-symbols-outlined search-input-icon">search</span>
              <input
                type="text"
                className="search-input-field"
                placeholder="Cari siluet, bahan (contoh: 100% Selvedge, Linen), atau kurator..."
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
                  title="Hapus pencarian"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                </button>
              )}
            </div>

            {/* Right Controls */}
            <div className="toolbar-controls-right">
              {/* Sort Dropdown */}
              <div className="sort-select-wrap">
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Urutkan garmen"
                >
                  <option value="curated">Kurasi Pilihan</option>
                  <option value="co2-high">Emisi Terhemat ↓</option>
                  <option value="price-low">Harga Terendah ↑</option>
                  <option value="price-high">Harga Tertinggi ↓</option>
                  <option value="newest">Koleksi Terbaru</option>
                </select>
                <span className="material-symbols-outlined sort-select-icon">expand_more</span>
              </div>
            </div>
          </div>

          {/* Filter Pills: Category */}
          <div className="filter-pills-row" style={{ marginTop: '0.75rem' }}>
            <span className="filter-pill-label">Kategori:</span>
            {CATEGORIES.map((cat) => (
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

          {/* Filter Pills: Size */}
          <div className="filter-pills-row" style={{ marginTop: '0.5rem' }}>
            <span className="filter-pill-label">Ukuran:</span>
            {SIZES.map((sz) => (
              <button
                key={sz}
                type="button"
                className={`filter-chip-btn ${selectedSize === sz ? 'active' : ''}`}
                onClick={() => setSelectedSize(sz)}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Status Sub-bar */}
          <div className="filter-sub-bar" style={{ marginTop: '0.5rem' }}>
            <span className="active-count-text">
              Menampilkan {filteredProducts.length} Helai Garmen Sirkular
            </span>
            {isFiltered && (
              <button
                type="button"
                className="btn-reset-filters"
                onClick={handleResetFilters}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>restart_alt</span>
                Reset Semua Filter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Product Grid */}
      <section className="preloved-grid-section">
        <div className="container-custom">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-primary)' }}>
              <span className="material-symbols-outlined spinning" style={{ fontSize: '32px' }}>
                progress_activity
              </span>
              <p style={{ marginTop: '1rem', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600 }}>
                Memuat katalog kurasi sirkular...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed rgba(0, 46, 29, 0.2)',
                margin: '2rem 0'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-on-surface-variant)', opacity: 0.5 }}>
                inventory_2
              </span>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', marginTop: '1rem', color: 'var(--color-primary)' }}>
                Tidak Ada Garmen Ditemukan
              </h3>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
                Coba sesuaikan kata kunci atau atur ulang filter kategori dan ukuran untuk menemukan pakaian lainnya.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleResetFilters}
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="catalog-grid">
              {visibleProducts.map((product) => (
                <GarmentCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Collection Impact Spotlight */}
      {filteredProducts.length > 0 && (
        <section className="spotlight-section">
          <div className="container-custom">
            <div className="spotlight-card">
              <div className="spotlight-glow" />
              <div style={{ position: 'relative', zIndex: 10, maxWidth: '560px' }}>
                <span className="badge badge-secondary" style={{ marginBottom: '0.75rem' }}>
                  Dampak Nyata Kurasi Aktif
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.1, color: 'var(--color-surface)' }}>
                  POTENSI PENGHEMATAN KOLEKSI INI
                </h2>
                <p style={{ color: 'rgba(254, 250, 224, 0.8)', fontSize: '14px', lineHeight: '22px', marginTop: '0.75rem' }}>
                  Jika seluruh {filteredProducts.length} helai garmen dalam filter saat ini diadopsi ulang dibanding
                  membeli pakaian baru dari industri fast fashion, bersama kita mencegah emisi masif dan
                  menjaga ketahanan cadangan air tanah.
                </p>
              </div>

              <div className="spotlight-metrics-grid">
                <div className="spotlight-metric-item">
                  <span className="spotlight-metric-giant">{totalAvoidedCo2}</span>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-secondary-fixed)', marginTop: '0.25rem', fontWeight: 700 }}>
                    kg CO₂e Tercegah
                  </span>
                </div>
                <div className="spotlight-metric-item">
                  <span className="spotlight-metric-giant">{totalConservedWater}</span>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-secondary-fixed)', marginTop: '0.25rem', fontWeight: 700 }}>
                    Liter Air Terjaga
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Pagination / Load More */}
      {visibleProducts.length < filteredProducts.length && (
        <section className="pagination-section">
          <div className="container-custom">
            <div className="pagination-inner">
              <button
                type="button"
                className="btn-load-more"
                onClick={handleLoadMore}
              >
                <span>Muat Lebih Banyak Garmen</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>expand_more</span>
              </button>
              <div className="pagination-nav">
                <span>
                  Menampilkan {visibleProducts.length} dari {filteredProducts.length} Garmen
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
