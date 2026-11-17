import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { mockUserProfile } from '../../services/mockData/profile.js';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Jelajahi', path: '/jelajahi-preloved' },
    { label: 'Donasi', path: '/donasi-pakaian' },
    { label: 'Panduan', path: '/panduan-perawatan' },
    { label: 'Dampak', path: '/dampak-dan-emisi' },
    { label: 'Reparasi', path: '/layanan-reparasi' },
  ];

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-logo-wrapper">
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-text">PakaiLagi</span>
          </Link>
        </div>

        {/* Desktop Navigation Pills */}
        <nav className="navbar-menu" aria-label="Navigasi Utama">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              end={item.path === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label="Pencarian Katalog"
            onClick={() => navigate('/jelajahi-preloved')}
          >
            <span className="material-symbols-outlined">search</span>
          </button>

          <button
            type="button"
            className="icon-btn"
            aria-label="Wishlist dan Favorit"
            onClick={() => navigate('/jelajahi-preloved')}
          >
            <span className="material-symbols-outlined">favorite</span>
            <span className="badge-dot"></span>
          </button>

          <Link
            to="/profil-saya"
            className="profile-link"
            aria-label="Dashboard Profil Pengguna"
          >
            <img
              src={mockUserProfile.avatar}
              alt={mockUserProfile.name}
              className="profile-avatar"
            />
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              expand_more
            </span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-toggle-btn"
            aria-label="Toggle Menu Navigasi"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
              }
              end={item.path === '/'}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/profil-saya"
            className={({ isActive }) =>
              isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Profil Saya
          </NavLink>
          <NavLink
            to="/masuk"
            className={({ isActive }) =>
              isActive ? 'mobile-nav-link active' : 'mobile-nav-link'
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Masuk / Daftar
          </NavLink>
        </div>
      )}
    </header>
  );
}
