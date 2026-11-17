import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GarmentCard.css';

export default function GarmentCard({ product, onSelectForChat }) {
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const handleActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelectForChat) {
      onSelectForChat(product);
    } else {
      navigate(`/produk/${product.id}`);
    }
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(product.price);

  const formattedRetail = product.originalPrice
    ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }).format(product.originalPrice)
    : null;

  return (
    <article className="garment-card">
      <div>
        {/* Image Frame */}
        <div className="garment-media-wrap">
          <img
            src={product.images[0]}
            alt={product.title}
            className="garment-img"
            loading="lazy"
          />

          {/* Top Left Badges */}
          <div className="garment-badges-top-left">
            <span className="badge-pill-size">{product.sizeShort || product.size}</span>
            <span className="badge-pill-grade">{product.grade}</span>
          </div>

          {/* Top Right Status */}
          <div className="garment-badges-top-right">
            <span className="badge-pill-status">
              <span className="status-dot"></span>
              {product.status || 'Tersedia'}
            </span>
          </div>

          {/* Bottom Eco Strip */}
          <div className="garment-eco-strip">
            <span className="garment-eco-metric">
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-primary-container)' }}>
                eco
              </span>
              ~{product.avoidedCo2} kg CO₂e dihindari
            </span>
            <span className="garment-eco-water">
              Air: {product.conservedWater ? product.conservedWater.toLocaleString('id-ID') + 'L' : 'Pewarna Alam'}
            </span>
          </div>

          {/* Quick Action Hover Scrim */}
          <div className="garment-hover-scrim">
            <p className="scrim-title">Ambil Alih Kepemilikan</p>
            <p className="scrim-desc">Hubungi pemilik langsung tanpa perantara komisi.</p>
            <div className="scrim-actions">
              <button
                type="button"
                className="scrim-btn-primary"
                onClick={handleActionClick}
              >
                Ajukan Beli
              </button>
              <Link
                to={`/produk/${product.id}`}
                className="scrim-btn-outline"
              >
                Lihat Spesifikasi Serat
              </Link>
            </div>
          </div>
        </div>

        {/* Title, Details, & Price */}
        <div className="garment-info">
          <div className="garment-header-row">
            <h3 className="garment-title" title={product.title}>
              {product.title}
            </h3>
          </div>

          <div className="garment-meta-row">
            <span className="garment-location">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
              {product.location}
            </span>
            <span className="garment-material">{product.material}</span>
          </div>

          <div className="garment-price-row">
            <span className="garment-price">{formattedPrice}</span>
            {formattedRetail && (
              <span className="garment-price-retail">Retail {formattedRetail}</span>
            )}
          </div>
        </div>
      </div>

      {/* Curator Footer */}
      <div className="garment-curator-footer">
        <div className="curator-profile">
          <div className="curator-avatar-initials">
            {product.curator?.initials || 'PK'}
          </div>
          <div className="curator-details">
            <span className="curator-name">{product.curator?.name || 'Kurator PakaiLagi'}</span>
            <span className="curator-location">
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>pin_drop</span>
              {product.curator?.location || product.location}
            </span>
          </div>
        </div>

        <button
          type="button"
          className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
          aria-label={bookmarked ? 'Hapus bookmark' : 'Favoritkan item'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            {bookmarked ? 'bookmark' : 'bookmark_border'}
          </span>
        </button>
      </div>
    </article>
  );
}
