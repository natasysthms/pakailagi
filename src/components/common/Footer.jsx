import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Col 1: Brand & Newsletter */}
          <div className="footer-brand-col">
            <div>
              <p className="footer-subtitle">Inisiatif Mode Sirkular</p>
              <h2 className="footer-brand-title">PAKAI LAGI.</h2>
              <p className="footer-desc">
                Manifesto estetika berkelanjutan melalui kurasi kuratorial preloved,
                regenerasi serat alami, mindful donation, dan jaringan reparasi artisan untuk
                memperpanjang usia pakaian.
              </p>
            </div>

            <div>
              <p className="footer-newsletter-label">Tetap Terhubung dengan Warta Kuratorial</p>
              <form onSubmit={handleSubscribe} className="footer-newsletter-box">
                <input
                  type="email"
                  className="footer-newsletter-input"
                  placeholder={subscribed ? 'Terima kasih telah bergabung!' : 'Ketik alamat surel kurasi...'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribed}
                  required
                />
                <button type="submit" className="footer-newsletter-btn">
                  {subscribed ? 'Terkirim' : 'Daftar'}
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Eksplorasi */}
          <div>
            <h3 className="footer-col-title">Eksplorasi</h3>
            <ul className="footer-links-list">
              <li>
                <Link to="/jelajahi-preloved">Arsip Preloved Grade-A</Link>
              </li>
              <li>
                <Link to="/donasi-pakaian">Program Drop Box Donasi</Link>
              </li>
              <li>
                <Link to="/layanan-reparasi">Direktori Reparasi Lokal</Link>
              </li>
              <li>
                <Link to="/panduan-perawatan">Panduan Perawatan Tekstil</Link>
              </li>
              <li>
                <Link to="/dampak-dan-emisi">Kalkulator Jejak Karbon</Link>
              </li>
              <li>
                <Link to="/profil-saya">Dashboard Profil Pengguna</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ekosistem */}
          <div>
            <h3 className="footer-col-title">Ekosistem</h3>
            <ul className="footer-links-list">
              <li>Standar Kurasi Verifikasi</li>
              <li>Jaringan Penjahit Tradisional</li>
              <li>Transparansi Audit Siklus Hidup</li>
              <li>Mitra Daur Ulang Serat</li>
              <li>Panduan Pengukuran Tubuh</li>
              <li>
                <Link to="/masuk">Masuk Akun Anggota</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>
            Simulasi Prototip Akademik Tanpa Transaksi Finansial Langsung. Didesain untuk riset keberlanjutan tekstil.
          </p>
          <div className="footer-copyright">
            <span>© 2025 PAKAI LAGI</span>
            <span className="footer-dot"></span>
            <span>Hak Cipta Dilindungi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
