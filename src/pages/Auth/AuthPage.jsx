import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { userService } from '../../services/api/userService';
import './AuthPage.css';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab state derived from route or user selection
  const isRegisterRoute = location.pathname.includes('daftar');
  const [userTab, setUserTab] = useState(null);
  const activeTab = userTab ?? (isRegisterRoute ? 'register' : 'login');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [registerData, setRegisterData] = useState({
    role: 'consumer', // 'consumer' | 'seller'
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setUserTab(tab);
    setStatusMessage(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await userService.login(loginData);
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        navigate('/profil-saya');
      }, 1200);
    } catch {
      setStatusMessage({ type: 'error', text: 'Gagal masuk akun. Silakan periksa kembali email atau kata sandi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    // Validations
    if (registerData.password.length < 8) {
      setStatusMessage({ type: 'error', text: 'Kata sandi minimal harus 8 karakter demi keamanan akun.' });
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok. Silakan ketik ulang.' });
      setLoading(false);
      return;
    }

    if (!registerData.agreeTerms) {
      setStatusMessage({ type: 'error', text: 'Anda harus menyetujui Prinsip Sirkular & Kebijakan Privasi PakaiLagi.' });
      setLoading(false);
      return;
    }

    try {
      const res = await userService.register(registerData);
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        navigate('/profil-saya');
      }, 1500);
    } catch {
      setStatusMessage({ type: 'error', text: 'Gagal melakukan pendaftaran. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-split-wrapper">
        {/* Left Side: Lookbook Editorial Banner */}
        <section className="auth-lookbook-panel">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK3it8DjIuF-J8KmCfWLLEmw4N0KTYL13fEJZkYvnppijMj0XGSQ0OJI5XK_G2bTIauW2qPPQ-O-F6AJM51nGmMYsCKvfy7Xl7ftgbsniOa_lu19pW4XYmrptL7Y7wA6KxLktvle3nmXXN1HHliP_RkwxYdSYHQysi8O15SRqSpoJ6jN70ZlSYkySQRQ9eADkxuUiM_mJ8NOv6jnmezQAM-FKOOxKLVo4D9HBEGi1z"
            alt=""
            className="auth-lookbook-bg"
          />
          <div className="auth-lookbook-glow" />

          <div className="auth-lookbook-content">
            <div>
              <span className="badge badge-secondary">Ekosistem Sirkular Fesyen</span>
              <h1 className="auth-lookbook-headline">
                MEMULAI BABAK <br />
                BARU LEMARIMU.
              </h1>
            </div>

            <div className="auth-manifest-quote">
              <p>
                &ldquo;Pakaian paling berkelanjutan adalah pakaian yang sudah ada di lemarimu. Bergabunglah bersama jejaring pecinta arsip vintage, donatur peduli, dan penjahit restorasi lokal.&rdquo;
              </p>
            </div>

            <div className="auth-stats-grid">
              <div className="auth-stat-item">
                <span className="auth-stat-val">+2.4 Thn</span>
                <span className="auth-stat-label">Perpanjangan Usia</span>
              </div>
              <div className="auth-stat-item">
                <span className="auth-stat-val">0%</span>
                <span className="auth-stat-label">Emisi Kimia Toksik</span>
              </div>
              <div className="auth-stat-item">
                <span className="auth-stat-val">100%</span>
                <span className="auth-stat-label">Sirkularitas Terbuka</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Auth Form Container */}
        <section className="auth-form-panel">
          <div className="auth-form-card">
            {/* Tab Switcher */}
            <div className="auth-tabs-toggle">
              <button
                type="button"
                className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => handleTabChange('login')}
              >
                Masuk Akun
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => handleTabChange('register')}
              >
                Daftar Baru
              </button>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '28px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                {activeTab === 'login' ? 'Selamat Datang Kembali' : 'Mulai Langkah Sirkular'}
              </h2>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', marginTop: '0.25rem' }}>
                {activeTab === 'login'
                  ? 'Akses koleksi tersimpan, riwayat transaksi, dan status donasimu.'
                  : 'Pilih peran dan bergabunglah melestarikan daur hidup tekstil.'}
              </p>
            </div>

            {/* Notification Banner */}
            {statusMessage && (
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  lineHeight: '20px',
                  backgroundColor: statusMessage.type === 'success' ? 'var(--color-secondary-fixed)' : 'var(--color-error-container)',
                  color: statusMessage.type === 'success' ? 'var(--color-primary)' : 'var(--color-on-error-container)',
                  border: `1px solid ${statusMessage.type === 'success' ? 'rgba(0,46,29,0.2)' : 'rgba(186,26,26,0.3)'}`
                }}
              >
                {statusMessage.text}
              </div>
            )}

            {/* LOGIN FORM */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="auth-input-group">
                  <label htmlFor="login-email" className="auth-label">Alamat Surel (Email)</label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    className="auth-input-field"
                    placeholder="nama@domain.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </div>

                <div className="auth-input-group">
                  <label htmlFor="login-password" className="auth-label">Kata Sandi</label>
                  <div className="password-input-wrap">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="auth-input-field"
                      placeholder="Masukkan kata sandi..."
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Tampilkan atau sembunyikan kata sandi"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="auth-row-options">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                    />
                    <span>Ingat saya di peramban ini</span>
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Fitur pemulihan kata sandi via email akan segera hadir dalam rilis REST API tim backend.');
                    }}
                    style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 600 }}
                  >
                    Lupa sandi?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn-auth-submit"
                  disabled={loading}
                >
                  <span>{loading ? 'Memverifikasi...' : 'MASUK KE PAKAILAGI'}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </button>

                <div className="auth-divider-row">
                  <div className="auth-divider-line" />
                  <span>Atau</span>
                  <div className="auth-divider-line" />
                </div>

                <button
                  type="button"
                  className="btn-google-oauth"
                  onClick={() => alert('Integrasi Google OAuth sedang disiapkan bersama endpoint backend.')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Lanjutkan dengan Akun Google</span>
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="auth-form">
                {/* Role Switcher */}
                <div className="role-selector-wrap">
                  <span className="role-selector-label">Pilih Peran Anggota:</span>
                  <div className="role-pill-group">
                    <button
                      type="button"
                      className={`role-pill-btn ${registerData.role === 'consumer' ? 'active' : ''}`}
                      onClick={() => setRegisterData({ ...registerData, role: 'consumer' })}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
                      <span className="role-title">Konsumen & Donatur</span>
                      <span className="role-sub">Adopsi arsip & donasi</span>
                    </button>
                    <button
                      type="button"
                      className={`role-pill-btn ${registerData.role === 'seller' ? 'active' : ''}`}
                      onClick={() => setRegisterData({ ...registerData, role: 'seller' })}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>storefront</span>
                      <span className="role-title">Penjual / Thrift</span>
                      <span className="role-sub">Katalog & kurasi</span>
                    </button>
                  </div>
                </div>

                <div className="auth-input-group">
                  <label htmlFor="reg-name" className="auth-label">Nama Lengkap</label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    className="auth-input-field"
                    placeholder="Contoh: Kirana Saraswati"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                  />
                </div>

                <div className="auth-input-group">
                  <label htmlFor="reg-email" className="auth-label">Alamat Surel (Email)</label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    className="auth-input-field"
                    placeholder="nama@domain.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  />
                </div>

                <div className="auth-input-group">
                  <label htmlFor="reg-pass" className="auth-label">Kata Sandi (Min. 8 Karakter)</label>
                  <div className="password-input-wrap">
                    <input
                      id="reg-pass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      className="auth-input-field"
                      placeholder="Minimal 8 karakter..."
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Tampilkan atau sembunyikan kata sandi"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="auth-input-group">
                  <label htmlFor="reg-confirm-pass" className="auth-label">Konfirmasi Kata Sandi</label>
                  <div className="password-input-wrap">
                    <input
                      id="reg-confirm-pass"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className="auth-input-field"
                      placeholder="Ketik ulang kata sandi..."
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Tampilkan atau sembunyikan kata sandi"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="auth-row-options">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      required
                      checked={registerData.agreeTerms}
                      onChange={(e) => setRegisterData({ ...registerData, agreeTerms: e.target.checked })}
                    />
                    <span style={{ fontSize: '11px', lineHeight: '16px' }}>
                      Saya menyetujui Prinsip Sirkular &amp; Kebijakan Privasi PakaiLagi.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-auth-submit"
                  disabled={loading}
                >
                  <span>{loading ? 'Mendaftarkan Akun...' : 'DAFTAR SEKARANG'}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </button>
              </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
              {activeTab === 'login' ? (
                <span>
                  Belum memiliki akun sirkular?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('register')}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Daftar di sini
                  </button>
                </span>
              ) : (
                <span>
                  Sudah memiliki akun?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('login')}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Masuk di sini
                  </button>
                </span>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
