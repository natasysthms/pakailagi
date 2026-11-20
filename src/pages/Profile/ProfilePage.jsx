import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/api/userService';
import './ProfilePage.css';

const ACTIVITY_FILTERS = [
  { key: 'all', label: 'Semua Pengajuan' },
  { key: 'preloved', label: 'Beli Preloved' },
  { key: 'donasi', label: 'Donasi Terdistribusi' },
  { key: 'reparasi', label: 'Catatan Reparasi' }
];

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState('consumer'); // 'consumer' | 'seller'
  const [activityFilter, setActivityFilter] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);

    async function loadProfile() {
      const data = await userService.getCurrentProfile();
      if (!data) {
        navigate('/masuk'); // belum login atau token kedaluwarsa
        return;
      }
      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, [navigate]);

  if (loading || !profile) {
    return (
      <div className="container-custom" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <span className="material-symbols-outlined spinning" style={{ fontSize: '36px', color: 'var(--color-primary)' }}>
          progress_activity
        </span>
        <p style={{ marginTop: '1rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-primary)' }}>
          Memuat profil sirkular Anda...
        </p>
      </div>
    );
  }

  const { stats, consumerActivities, sellerStore } = profile;

  const filteredActivities = activityFilter === 'all'
    ? consumerActivities
    : consumerActivities.filter((a) => a.category === activityFilter);

  const statusClass = {
    agreed: 'agreed',
    completed: 'completed',
    pending: 'pending'
  };

  return (
    <div className="profile-root">
      <div className="container-custom">

        {/* 1. Profile Header Banner */}
        <div className="profile-header-card">
          <div className="profile-identity-row">
            {/* Avatar */}
            <img
              src={profile.avatar}
              alt={profile.name}
              className="profile-avatar-img"
              loading="lazy"
            />

            {/* Identity Info */}
            <div style={{ flex: 1 }}>
              <span className="badge badge-primary">{profile.badge}</span>
              <h1 className="profile-name">{profile.name}</h1>

              <div className="profile-meta-text">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>location_on</span>
                  {profile.location}
                </span>
                <span style={{ color: 'rgba(0,46,29,0.3)' }}>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>calendar_month</span>
                  Anggota Sejak {profile.memberSince}
                </span>
                <span style={{ color: 'rgba(0,46,29,0.3)' }}>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>hub</span>
                  {profile.node}
                </span>
              </div>

              <p className="profile-bio">{profile.bio}</p>
            </div>
          </div>

          {/* 4 Milestone Metrics */}
          <div className="profile-milestones-grid">
            <div className="profile-milestone-item">
              <span className="milestone-num">{stats.circulatedPieces}</span>
              <span className="milestone-label">Pakaian Diedarkan Ulang</span>
            </div>
            <div className="profile-milestone-item">
              <span className="milestone-num">{stats.avoidedCarbon} CO₂e</span>
              <span className="milestone-label">Emisi Tercegah (Estimasi)</span>
            </div>
            <div className="profile-milestone-item">
              <span className="milestone-num">{stats.repairsCount}</span>
              <span className="milestone-label">Reparasi Tercatat</span>
            </div>
            <div className="profile-milestone-item">
              <span className="milestone-num">{stats.conservedWater}</span>
              <span className="milestone-label">Air Terjaga</span>
            </div>
          </div>
        </div>

        {/* 2. Mode Switcher Bar */}
        <div className="profile-mode-bar">
          <div className="profile-segmented-toggle">
            <button
              type="button"
              className={`mode-tab-btn ${activeMode === 'consumer' ? 'active' : ''}`}
              onClick={() => setActiveMode('consumer')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
              <span>Mode Konsumen &amp; Donatur</span>
            </button>
            <button
              type="button"
              className={`mode-tab-btn ${activeMode === 'seller' ? 'active' : ''}`}
              onClick={() => setActiveMode('seller')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>storefront</span>
              <span>Mode Penjual / Thrift</span>
            </button>
          </div>
        </div>

        {/* ==============================
            CONSUMER MODE
           ============================== */}
        {activeMode === 'consumer' && (
          <section>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-secondary" style={{ marginBottom: '0.25rem' }}>Riwayat Aktivitas</span>
                <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Riwayat Pembelian, Donasi &amp; Reparasi
                </h2>
              </div>

              <Link to="/jelajahi-preloved" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
                <span>+ Jelajahi Preloved</span>
              </Link>
            </div>

            {/* Activity Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,46,29,0.1)', marginBottom: '1.5rem' }}>
              {ACTIVITY_FILTERS.map((f) => {
                const count = f.key === 'all'
                  ? consumerActivities.length
                  : consumerActivities.filter((a) => a.category === f.key).length;
                return (
                  <button
                    key={f.key}
                    type="button"
                    className={`filter-chip-btn ${activityFilter === f.key ? 'active' : ''}`}
                    style={{ padding: '0.5rem 1rem' }}
                    onClick={() => setActivityFilter(f.key)}
                  >
                    {f.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Activity Cards */}
            <div className="consumer-activity-list">
              {filteredActivities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-on-surface-variant)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', opacity: 0.4 }}>inbox</span>
                  <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>Belum ada aktivitas di kategori ini.</p>
                </div>
              ) : (
                filteredActivities.map((activity) => (
                  <div key={activity.id} className="activity-card">
                    <div className="activity-left-col">
                      <img src={activity.image} alt={activity.title} className="activity-thumb" loading="lazy" />

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span className={`activity-badge-status ${statusClass[activity.statusType] || 'pending'}`}>
                            {activity.status}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                            {activity.typeLabel}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '17px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                          {activity.title}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '0.25rem' }}>
                          {activity.subtitle}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--color-secondary)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                          💬 {activity.note}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      {activity.statusType === 'agreed' && activity.whatsapp && (
                        <a
                          href={`https://wa.me/${activity.whatsapp}?text=Halo%2C%20saya%20ingin%20mengkonfirmasi%20pengajuan%20pembelian%20${activity.title}%20(ID%3A%20${activity.id}).`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ fontSize: '11px', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat</span>
                          <span>WhatsApp</span>
                        </a>
                      )}
                      {activity.statusType === 'completed' && (
                        <button type="button" className="btn btn-outline" style={{ fontSize: '11px', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>rate_review</span>
                          <span>Beri Ulasan</span>
                        </button>
                      )}
                      {activity.statusType === 'pending' && (
                        <button type="button" className="btn btn-outline" style={{ fontSize: '11px', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }} disabled>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                          <span>Menunggu</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* ==============================
            SELLER MODE
           ============================== */}
        {activeMode === 'seller' && (
          <section>
            {/* Store Overview Card */}
            <div className="seller-store-card">
              <div>
                <span className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>Toko Terverifikasi PakaiLagi</span>
                <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', textTransform: 'uppercase', color: 'var(--color-surface)' }}>
                  {sellerStore.storeName}
                </h2>
                <div style={{ fontSize: '12px', color: 'rgba(254,250,224,0.75)', marginTop: '0.35rem' }}>
                  Node Kurasi: {sellerStore.node} • 0% Komisi Platform
                </div>
              </div>

              <div className="seller-stats-cluster">
                <div className="seller-stat-box">
                  <span className="seller-stat-num">{sellerStore.rating}</span>
                  <span className="seller-stat-lbl">Rating Kurator</span>
                </div>
                <div className="seller-stat-box">
                  <span className="seller-stat-num">{sellerStore.completedTransactions}</span>
                  <span className="seller-stat-lbl">Transaksi Selesai</span>
                </div>
                <div className="seller-stat-box">
                  <span className="seller-stat-num">{sellerStore.accuracyRate}%</span>
                  <span className="seller-stat-lbl">Akurasi Deskripsi</span>
                </div>
              </div>
            </div>

            {/* Incoming Purchase Requests Queue */}
            <div style={{ marginTop: '2.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.25rem, 3vw, 2rem)', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                Permintaan Pembelian Masuk ({sellerStore.incomingRequests.length} Permintaan)
              </h3>

              <div className="requests-queue-list">
                {sellerStore.incomingRequests.map((req) => (
                  <div key={req.id} className="request-item-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <img src={req.image} alt={req.title} style={{ width: '4rem', height: '5rem', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} loading="lazy" />

                      <div>
                        <span className={`activity-badge-status ${req.status.includes('MENUNGGU') ? 'pending' : 'agreed'}`}>
                          {req.status}
                        </span>
                        <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '17px', textTransform: 'uppercase', color: 'var(--color-primary)', marginTop: '0.35rem' }}>
                          {req.title}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '0.25rem' }}>
                          Rp {req.price.toLocaleString('id-ID')} • {req.size}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--color-on-surface)', marginTop: '0.25rem' }}>
                          👤 <strong>{req.buyerName}</strong> — &ldquo;{req.buyerMessage}&rdquo;
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '0.15rem' }}>
                          {req.time}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
                      <button type="button" className="btn btn-primary" style={{ fontSize: '11px', padding: '0.5rem 1rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                        <span>Setujui</span>
                      </button>
                      <a
                        href={`https://wa.me/${req.whatsapp}?text=Halo%20${encodeURIComponent(req.buyerName)}%2C%20terkait%20permintaan%20pembelian%20${encodeURIComponent(req.title)}...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ fontSize: '11px', padding: '0.5rem 1rem' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat</span>
                        <span>WhatsApp</span>
                      </a>
                      <button type="button" className="btn btn-outline" style={{ fontSize: '11px', padding: '0.5rem 1rem', borderColor: 'rgba(186,26,26,0.3)', color: 'var(--color-error)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>cancel</span>
                        <span>Tolak</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Inventory Management */}
            <div style={{ marginTop: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.25rem, 3vw, 2rem)', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Inventori Garmen Aktif
                </h3>
                <Link to="/jelajahi-preloved" className="btn btn-secondary">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
                  <span>+ Tambah Garmen</span>
                </Link>
              </div>

              <div className="inventory-grid">
                {sellerStore.inventory.map((item) => (
                  <div key={item.id} className="inventory-card">
                    <img src={item.image} alt={item.title} className="inventory-card-img" loading="lazy" />

                    <div className="inventory-card-body">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <span className={`activity-badge-status ${
                            item.statusBadge === 'Tersedia' ? 'agreed' :
                            item.statusBadge === 'Ada Permintaan' ? 'pending' : 'completed'
                          }`}>
                            {item.statusBadge}
                          </span>
                        </div>
                        <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '17px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                          {item.title}
                        </h4>
                        <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '0.25rem' }}>
                          {item.size} • {item.grade}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.35rem' }}>
                          Rp {item.price.toLocaleString('id-ID')}
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', lineHeight: '18px', marginTop: '0.5rem' }}>
                          {item.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: '11px', padding: '0.5rem' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>edit</span>
                          <span>Edit</span>
                        </button>
                        <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: '11px', padding: '0.5rem', borderColor: 'rgba(0,46,29,0.2)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>archive</span>
                          <span>Arsipkan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
