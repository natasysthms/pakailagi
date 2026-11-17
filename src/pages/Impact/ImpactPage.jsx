import { useState, useEffect } from 'react';
import { impactService } from '../../services/api/impactService';
import './ImpactPage.css';

export default function ImpactPage() {
  const [scenarios, setScenarios] = useState({});
  const [categories, setCategories] = useState([]);
  const [emissionFactors, setEmissionFactors] = useState([]);
  const [activeScenarioKey, setActiveScenarioKey] = useState('standar');
  useEffect(() => {
    window.scrollTo(0, 0);

    async function loadImpactData() {
      const [scenData, catData, efData] = await Promise.all([
        impactService.getAllScenarios(),
        impactService.getCategoryBreakdown(),
        impactService.getEmissionFactors()
      ]);
      setScenarios(scenData);
      setCategories(catData);
      setEmissionFactors(efData);
    }

    loadImpactData();
  }, []);

  const currentScenario = scenarios[activeScenarioKey] || {
    rateText: '45%',
    emission: '14.850',
    metricTotal: '14.850 KG',
    label: 'Skenario Dasar (Default)',
    desc: 'Mengasumsikan 45% sirkulasi pakaian bekas secara riil menunda produksi garmen baru.',
    equiv: 'Setara ~62.000 km perjalanan mobil bensin konvensional',
    trees: '~742 Bibit Dewasa / Tahun'
  };

  return (
    <div className="impact-root">
      {/* 1. Hero Section */}
      <section className="impact-hero-section">
        <div className="container-custom">
          <span className="badge badge-primary">Transparansi Metodologi Emisi</span>
          <h1 className="impact-headline">
            SMALL ACTIONS. <br />
            BIGGER IMPACT.
          </h1>
          <p className="impact-lead-text">
            Melacak jejak positif perpanjangan masa pakai busana secara jujur, berbasis data ilmiah, dan bebas dari greenwashing.
            Berikut adalah kalkulasi konservasi tekstil di platform PakaiLagi.
          </p>

          {/* 4 Metrics Grid */}
          <div className="impact-cards-grid">
            {/* Card 1: Preloved */}
            <div className="impact-metric-card">
              <div className="impact-card-head">
                <div className="impact-icon-circle">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>shopping_bag</span>
                </div>
                <span className="badge badge-primary">Circular</span>
              </div>
              <div>
                <div className="impact-big-num">3.420 PCS</div>
                <h3 className="impact-card-title">Transaksi Preloved Selesai</h3>
                <p className="impact-card-desc">
                  Helai busana arsip yang diadopsi kembali oleh penikmat fesyen baru, mencegah pembelian pakaian fast fashion sekali pakai.
                </p>
              </div>
            </div>

            {/* Card 2: Donation */}
            <div className="impact-metric-card">
              <div className="impact-card-head">
                <div className="impact-icon-circle">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>volunteer_activism</span>
                </div>
                <span className="badge badge-secondary">Mindful</span>
              </div>
              <div>
                <div className="impact-big-num">1.180 PCS</div>
                <h3 className="impact-card-title">Donasi Pakaian Tersalurkan</h3>
                <p className="impact-card-desc">
                  Didistribusikan langsung kepada yayasan yatim piatu, panti asuhan, dan komunitas binaan terverifikasi.
                </p>
              </div>
            </div>

            {/* Card 3: Repair (Explicitly noted separation) */}
            <div className="impact-metric-card">
              <div className="impact-card-head">
                <div className="impact-icon-circle">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>handyman</span>
                </div>
                <span className="badge badge-primary">Artisan</span>
              </div>
              <div>
                <div className="impact-big-num">620 PCS</div>
                <h3 className="impact-card-title">Pakaian Sukses Diperbaiki</h3>
                <p className="impact-card-desc">
                  Dipulihkan melalui penjahit lokal mitra. <em>Dihitung terpisah, tidak dimasukkan dalam total estimasi emisi dihindari demi mencegah double-counting.</em>
                </p>
              </div>
            </div>

            {/* Card 4: Forest Green Highlight (Dynamically responds to Scenario) */}
            <div className="impact-metric-card highlight">
              <div className="impact-card-head">
                <div className="impact-icon-circle">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>eco</span>
                </div>
                <span className="badge badge-secondary">Emisi Dicegah</span>
              </div>
              <div>
                <div className="impact-big-num">{currentScenario.metricTotal}</div>
                <h3 className="impact-card-title">Total Estimasi Emisi CO₂e Dihindari</h3>
                <div style={{ marginTop: '0.75rem', padding: '0.65rem', backgroundColor: 'rgba(0,46,29,0.5)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-secondary-fixed)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>directions_car</span>
                    <span>{currentScenario.equiv}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Scenario Selector Section */}
      <section className="container-custom">
        <div className="scenario-section">
          <div className="scenario-header-row">
            <div>
              <span className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>Model Simulasi Dinamis</span>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                Pilih Skenario Substitusi Pembelian
              </h2>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', maxWidth: '580px', marginTop: '0.25rem' }}>
                Tingkat substitusi merefleksikan seberapa besar probabilitas pakaian bekas ini benar-benar menggantikan pembelian produk tekstil baru dari pabrik retail.
              </p>
            </div>

            {/* Tabs */}
            <div className="scenario-tabs-group">
              <button
                type="button"
                className={`scenario-tab-btn ${activeScenarioKey === 'konservatif' ? 'active' : ''}`}
                onClick={() => setActiveScenarioKey('konservatif')}
              >
                Konservatif (25%)
              </button>
              <button
                type="button"
                className={`scenario-tab-btn ${activeScenarioKey === 'standar' ? 'active' : ''}`}
                onClick={() => setActiveScenarioKey('standar')}
              >
                Dasar / Standar (45%)
              </button>
              <button
                type="button"
                className={`scenario-tab-btn ${activeScenarioKey === 'optimis' ? 'active' : ''}`}
                onClick={() => setActiveScenarioKey('optimis')}
              >
                Optimis (70%)
              </button>
            </div>
          </div>

          {/* Result Card */}
          <div className="scenario-result-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-primary">{currentScenario.rateText} Tingkat Penggantian</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>{currentScenario.label}</span>
              </div>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', lineHeight: '22px', marginTop: '0.75rem' }}>
                {currentScenario.desc}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'var(--color-surface-container-low)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                  Estimasi Emisi Bersih Terhindar
                </span>
                <div style={{ fontFamily: 'var(--font-headline)', fontSize: '26px', color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                  {currentScenario.metricTotal} CO₂e
                </div>
              </div>
              <div style={{ borderTop: '1px solid rgba(0,46,29,0.1)', paddingTop: '0.5rem', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                🌳 Serapan Ekivalen: <strong>{currentScenario.trees}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mathematical Formula & Parameter Box */}
      <section className="math-section">
        <div className="container-custom">
          <div className="math-grid">
            {/* Box 1: Formula */}
            <div className="math-box">
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Rumus Ilmiah</span>
                <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Parameter &amp; Formulasi Matematis
                </h3>
              </div>

              <div className="formula-display">
                Avoided_CO2e = ∑ (N_item × EF_material × R_substitusi)
              </div>

              <div style={{ fontSize: '13px', lineHeight: '20px', color: 'var(--color-on-surface-variant)' }}>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li><strong>N_item:</strong> Jumlah garmen per kategori yang berhasil tersirkulasi.</li>
                  <li><strong>EF_material:</strong> Faktor emisi cradle-to-gate manufaktur tekstil baru (kg CO₂e/kg serat).</li>
                  <li><strong>R_substitusi:</strong> Koefisien penundaan konsumsi busana baru di tingkat ritel.</li>
                </ul>
              </div>
            </div>

            {/* Box 2: Emission Factors Table */}
            <div className="math-box">
              <div>
                <span className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>Data Serat Tekstil</span>
                <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Faktor Emisi Rata-Rata Serat
                </h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,46,29,0.1)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      <th style={{ padding: '0.5rem 0' }}>Jenis Bahan</th>
                      <th style={{ padding: '0.5rem 0' }}>Emisi Manufaktur</th>
                      <th style={{ padding: '0.5rem 0' }}>Konservasi Air</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emissionFactors.map((ef, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(0,46,29,0.06)' }}>
                        <td style={{ padding: '0.65rem 0', fontWeight: 600 }}>{ef.material}</td>
                        <td style={{ padding: '0.65rem 0', color: 'var(--color-primary)' }}>{ef.ef}</td>
                        <td style={{ padding: '0.65rem 0', color: 'var(--color-secondary)' }}>{ef.water}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Category Breakdown Progress Bars */}
      <section className="container-custom" style={{ marginTop: '3.5rem' }}>
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(0,46,29,0.08)', borderRadius: 'var(--radius-xl)', padding: '2.5rem 1.5rem' }}>
          <div>
            <span className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>Dekomposisi Kategori</span>
            <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
              Dekomposisi Berdasarkan Kategori Busana
            </h3>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', marginTop: '0.25rem' }}>
              Kontribusi reduksi jejak karbon terbesar disumbangkan oleh kategori pakaian berat yang membutuhkan energi pemrosesan tertinggi.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.75rem' }}>
            {categories.map((cat, idx) => (
              <div key={idx} className="breakdown-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  <span>{cat.name}</span>
                  <span>{cat.emission} ({cat.percentage}%)</span>
                </div>
                <div className="breakdown-track">
                  <div className="breakdown-fill" style={{ width: `${cat.percentage}%`, backgroundColor: cat.dotColor || 'var(--color-primary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Green Software Engineering Box */}
      <section className="container-custom" style={{ marginTop: '3.5rem' }}>
        <div style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--color-primary)', flexShrink: 0 }}>
            terminal
          </span>
          <div>
            <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
              Green Software Engineering: Jejak Digital Web PakaiLagi
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: '0.35rem 0 0' }}>
              Kami mempraktikkan apa yang kami suarakan. Website PakaiLagi dibangun tanpa framework CSS berlebih (100% Pure CSS), memanfaatkan caching aset statis, font swap non-blocking, serta lazy-loading gambar untuk menghasilkan emisi digital super rendah (~0.18 gram CO₂e per kunjungan halaman).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
