import { useState, useEffect, useMemo } from 'react';
import { donationService } from '../../services/api/donationService';
import './DonationPage.css';

const ORG_CATEGORIES = ['Semua Kategori', 'Seragam Sekolah', 'Pakaian Hangat / Selimut', 'Pakaian Pria Dewasa', 'Pakaian Anak'];

export default function DonationPage() {
  const [activeMode, setActiveMode] = useState('give'); // 'give' | 'receive'
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [orgNeeds, setOrgNeeds] = useState([]);
  const [donorItems, setDonorItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [modalType, setModalType] = useState(null); // 'donate' | 'request' | 'upload'
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [modalSuccessMessage, setModalSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [donateFormData, setDonateFormData] = useState({
    name: '',
    phone: '',
    quantity: '5',
    method: 'dropbox' // 'dropbox' | 'courier'
  });

  const [requestFormData, setRequestFormData] = useState({
    orgName: '',
    personInCharge: '',
    phone: '',
    address: '',
    reason: ''
  });

  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    category: 'Pakaian Dewasa',
    quantity: '3',
    size: 'All Size',
    condition: 'Bersih & Sangat Layak Pakai',
    notes: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchData() {
      const [needs, items] = await Promise.all([
        donationService.getOrgNeeds(),
        donationService.getDonorItems()
      ]);
      setOrgNeeds(needs);
      setDonorItems(items);
      setLoading(false);
    }

    fetchData();
  }, []);

  const filteredNeeds = useMemo(() => {
    if (selectedCategory === 'Semua Kategori') return orgNeeds;
    return orgNeeds.filter((n) => n.category.toLowerCase().includes(selectedCategory.toLowerCase()));
  }, [orgNeeds, selectedCategory]);

  const openDonateModal = (org) => {
    setSelectedTarget(org);
    setModalType('donate');
    setModalSuccessMessage(null);
  };

  const openRequestModal = (item) => {
    setSelectedTarget(item);
    setModalType('request');
    setModalSuccessMessage(null);
  };

  const openUploadModal = () => {
    setModalType('upload');
    setModalSuccessMessage(null);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedTarget(null);
    setModalSuccessMessage(null);
  };

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await donationService.submitDonationCommitment({
      targetId: selectedTarget?.id,
      targetName: selectedTarget?.orgName,
      ...donateFormData
    });
    setSubmitting(false);
    setModalSuccessMessage(res.message);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await donationService.submitDonationRequest({
      itemId: selectedTarget?.id,
      itemTitle: selectedTarget?.title,
      ...requestFormData
    });
    setSubmitting(false);
    setModalSuccessMessage(res.message);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await donationService.submitDonationUpload(uploadFormData);
    setSubmitting(false);
    setModalSuccessMessage(res.message);
  };

  return (
    <div className="donation-root">
      {/* 1. Hero Section */}
      <section className="donation-hero-section">
        <div className="container-custom">
          <span className="badge badge-primary">Hub Donasi Pakaian Sirkular</span>
          <h1 className="donation-headline">
            CLOTHES CAN <br />
            CHANGE LIVES.
          </h1>
          <p className="donation-lead-text">
            Bukan sekadar membuang baju lama, melainkan membagikan martabat dan kehangatan. Hubungkan pakaian
            layak pakai Anda langsung kepada panti asuhan, komunitas lansia, dan penerima manfaat yang terverifikasi.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="donation-mode-tabs">
            <button
              type="button"
              className={`donation-mode-btn ${activeMode === 'give' ? 'active' : ''}`}
              onClick={() => setActiveMode('give')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>volunteer_activism</span>
              <span>Beri Donasi Pakaian</span>
            </button>
            <button
              type="button"
              className={`donation-mode-btn ${activeMode === 'receive' ? 'active' : ''}`}
              onClick={() => setActiveMode('receive')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>handshake</span>
              <span>Cari Donasi (Penerima Manfaat)</span>
            </button>
          </div>

          {/* 100% Non-Monetary Banner */}
          <div className="non-monetary-banner">
            <span className="material-symbols-outlined" style={{ fontSize: '28px', flexShrink: 0 }}>
              volunteer_activism
            </span>
            <div style={{ fontSize: '13px', lineHeight: '20px' }}>
              <strong>100% Donasi Pakaian Nyata (Tanpa Uang):</strong> Seluruh alur donasi di PakaiLagi adalah penyaluran garmen fisik secara langsung demi memutus rantai limbah tekstil dan mencegah penyalahgunaan dana. Kami tidak menerima transfer uang dalam bentuk apa pun.
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section: Organization Needs */}
      <section className="donation-section-wrap">
        <div className="container-custom">
          <div className="section-head-row">
            <div className="section-label-group">
              <span className="badge badge-secondary">Lembaga Terverifikasi</span>
              <h2 className="section-title">Kebutuhan Mendesak Lembaga</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="org-category-pills">
              {ORG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`org-category-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-primary)' }}>
              <span className="material-symbols-outlined spinning" style={{ fontSize: '32px' }}>progress_activity</span>
              <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>Memuat daftar kebutuhan...</p>
            </div>
          ) : (
            <div className="org-needs-grid">
              {filteredNeeds.map((org) => {
                const percent = Math.min(100, Math.round((org.collected / org.target) * 100));
                return (
                  <div key={org.id} className="org-card">
                    <div className="org-card-img-wrap">
                      <img src={org.image} alt={org.orgName} className="org-card-img" loading="lazy" />
                      <span className={`org-badge-urgency ${org.urgency.toLowerCase()}`}>
                        {org.urgency}
                      </span>
                    </div>
                    <div className="org-card-body">
                      <div>
                        <h3 className="org-card-title">{org.orgName}</h3>
                        <div className="org-card-location">
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                          <span>{org.location}</span>
                        </div>
                        <p className="org-card-req">{org.requirement}</p>
                      </div>

                      <div className="org-progress-wrap">
                        <div className="org-progress-labels">
                          <span>Terkumpul {org.collected} Pcs</span>
                          <span>Target {org.target} Pcs ({percent}%)</span>
                        </div>
                        <div className="org-progress-track">
                          <div className="org-progress-bar" style={{ width: `${percent}%` }} />
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => openDonateModal(org)}
                      >
                        <span>Salurkan Donasi Fisik</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. Section: Ready-to-Distribute Donated Clothes (Individual Donors) */}
      <section className="donation-section-wrap">
        <div className="container-custom">
          <div className="section-head-row">
            <div className="section-label-group">
              <span className="badge badge-primary">Donatur Perorangan</span>
              <h2 className="section-title">Pakaian Donasi Siap Salur</h2>
              <p className="section-desc">
                Paket garmen bersih yang siap didistribusikan langsung kepada yayasan, komunitas, atau penerima manfaat.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={openUploadModal}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
              <span>Unggah Pakaian Donasi</span>
            </button>
          </div>

          <div className="donor-items-grid">
            {donorItems.map((item) => (
              <div key={item.id} className="donor-item-card">
                <div className="donor-item-img-wrap">
                  <img src={item.image} alt={item.title} className="donor-item-img" loading="lazy" />
                  <div className="donor-card-badges-bar">
                    <span className={`donor-badge-status ${item.status?.toLowerCase().includes('tersedia') ? 'tersedia' : 'menunggu'}`}>
                      {item.status || 'Tersedia'}
                    </span>
                    <span className="donor-badge-free">
                      <span className="material-symbols-outlined">volunteer_activism</span>
                      <span>Gratis Donasi</span>
                    </span>
                  </div>
                </div>
                <div className="donor-item-body">
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: '18px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                      {item.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '0.25rem' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person</span>
                      <span>Donatur: {item.donorName} ({item.donorLocation})</span>
                    </div>

                    <div className="donor-tags-row" style={{ marginTop: '0.75rem' }}>
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="donor-tag-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}
                    onClick={() => openRequestModal(item)}
                  >
                    <span>Ajukan Permintaan Donasi</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Section: 4-Step Circular Flow */}
      <section className="container-custom">
        <div className="flow-section-card">
          <div className="section-label-group centered" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <span className="badge badge-primary">Transparansi Penyaluran</span>
            <h2 className="section-title">Alur Donasi Sirkular</h2>
            <p className="section-desc">
              Memastikan setiap helai pakaian sampai ke tangan yang tepat tanpa risiko terbuang ke TPA.
            </p>
          </div>

          <div className="flow-steps-grid">
            <div className="flow-step-item">
              <div className="flow-step-num">1</div>
              <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                Unggah Foto &amp; Info Pakaian
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                Donatur mendokumentasikan garmen, kondisi kebersihan, dan ukuran spesifik melalui formulir donasi.
              </p>
            </div>

            <div className="flow-step-item">
              <div className="flow-step-num">2</div>
              <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                Verifikasi &amp; Pencocokan
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                Kurator meninjau kesesuaian pakaian dengan daftar kebutuhan mendesak lembaga mitra.
              </p>
            </div>

            <div className="flow-step-item">
              <div className="flow-step-num">3</div>
              <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                Kirim Langsung
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                Pakaian diserahkan ke Drop Box kurasi terdekat atau dikirim via ekspedisi langsung ke alamat penerima.
              </p>
            </div>

            <div className="flow-step-item">
              <div className="flow-step-num">4</div>
              <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '16px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                Catat Dampak Lingkungan
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '20px', margin: 0 }}>
                Estimasi emisi karbon yang terhindar otomatis tercatat di dashboard keberlanjutan donatur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL 1: Salurkan Donasi Fisik (To Org) */}
      {modalType === 'donate' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-secondary">Komitmen Donasi Fisik</span>
                <h3 className="modal-title">Salurkan Pakaian Layak</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {modalSuccessMessage ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '52px', color: 'var(--color-primary)' }}>
                  check_circle
                </span>
                <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', textTransform: 'uppercase', color: 'var(--color-primary)', marginTop: '0.75rem' }}>
                  Komitmen Donasi Diterima!
                </h4>
                <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', lineHeight: '22px', margin: '0.5rem auto 1.5rem', maxWidth: '380px' }}>
                  {modalSuccessMessage} Anda dapat mengantarkan paket ke Drop Box mitra atau menggunakan ekspedisi.
                </p>
                <button type="button" className="btn btn-primary" onClick={closeModal} style={{ width: '100%', justifyContent: 'center' }}>
                  Tutup Jendela
                </button>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="modal-form-wrap">
                <div className="modal-summary-box">
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--color-primary)', flexShrink: 0 }}>
                    apartment
                  </span>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-secondary)', fontWeight: 700 }}>
                      Target Penyaluran:
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.2rem' }}>
                      {selectedTarget?.orgName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '0.2rem' }}>
                      Kebutuhan: {selectedTarget?.requirement}
                    </div>
                  </div>
                </div>

                <div className="modal-input-group">
                  <label htmlFor="don-name" className="modal-label">
                    Nama Lengkap Donatur
                  </label>
                  <input
                    id="don-name"
                    type="text"
                    required
                    className="modal-input"
                    placeholder="Ketik nama donatur..."
                    value={donateFormData.name}
                    onChange={(e) => setDonateFormData({ ...donateFormData, name: e.target.value })}
                  />
                </div>

                <div className="modal-input-group">
                  <label htmlFor="don-phone" className="modal-label">
                    Nomor WhatsApp
                  </label>
                  <input
                    id="don-phone"
                    type="tel"
                    required
                    className="modal-input"
                    placeholder="0812-xxxx-xxxx"
                    value={donateFormData.phone}
                    onChange={(e) => setDonateFormData({ ...donateFormData, phone: e.target.value })}
                  />
                </div>

                <div className="modal-input-group">
                  <label htmlFor="don-qty" className="modal-label">
                    Estimasi Jumlah Potong Pakaian
                  </label>
                  <input
                    id="don-qty"
                    type="number"
                    min="1"
                    required
                    className="modal-input"
                    value={donateFormData.quantity}
                    onChange={(e) => setDonateFormData({ ...donateFormData, quantity: e.target.value })}
                  />
                </div>

                <div className="modal-input-group">
                  <label htmlFor="don-method" className="modal-label">
                    Metode Penyerahan
                  </label>
                  <select
                    id="don-method"
                    className="modal-input"
                    value={donateFormData.method}
                    onChange={(e) => setDonateFormData({ ...donateFormData, method: e.target.value })}
                  >
                    <option value="dropbox">Antar ke Drop Box Kurasi PakaiLagi</option>
                    <option value="courier">Kirim via JNE/J&amp;T/Paxel langsung ke Lembaga</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.9rem 1.5rem' }}
                  disabled={submitting}
                >
                  {submitting ? 'Memproses Komitmen...' : 'Konfirmasi Komitmen Donasi'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Ajukan Permintaan Donasi (Beneficiary) */}
      {modalType === 'request' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-primary">Penerima Manfaat</span>
                <h3 className="modal-title">Ajukan Permintaan Pakaian</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {modalSuccessMessage ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '52px', color: 'var(--color-primary)' }}>
                  check_circle
                </span>
                <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', textTransform: 'uppercase', color: 'var(--color-primary)', marginTop: '0.75rem' }}>
                  Pengajuan Telah Dicatat!
                </h4>
                <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', lineHeight: '22px', margin: '0.5rem auto 1.5rem', maxWidth: '380px' }}>
                  {modalSuccessMessage}
                </p>
                <button type="button" className="btn btn-primary" onClick={closeModal} style={{ width: '100%', justifyContent: 'center' }}>
                  Tutup Jendela
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="modal-form-wrap">
                <div className="modal-summary-box">
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--color-primary)', flexShrink: 0 }}>
                    inventory_2
                  </span>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-secondary)', fontWeight: 700 }}>
                      Item Donasi Terpilih:
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.2rem' }}>
                      {selectedTarget?.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '0.2rem' }}>
                      Donatur: {selectedTarget?.donorName} ({selectedTarget?.donorLocation})
                    </div>
                  </div>
                </div>

                <div className="modal-input-group">
                  <label htmlFor="req-inst-name" className="modal-label">
                    Nama Lembaga / Komunitas / Individu
                  </label>
                  <input
                    id="req-inst-name"
                    type="text"
                    required
                    className="modal-input"
                    placeholder="Contoh: Panti Asuhan Nurul Huda"
                    value={requestFormData.orgName}
                    onChange={(e) => setRequestFormData({ ...requestFormData, orgName: e.target.value })}
                  />
                </div>

                <div className="modal-input-group">
                  <label htmlFor="req-pic" className="modal-label">
                    Penanggung Jawab &amp; No. WhatsApp
                  </label>
                  <input
                    id="req-pic"
                    type="text"
                    required
                    className="modal-input"
                    placeholder="Nama PIC (0812-xxxx-xxxx)"
                    value={requestFormData.phone}
                    onChange={(e) => setRequestFormData({ ...requestFormData, phone: e.target.value })}
                  />
                </div>

                <div className="modal-input-group">
                  <label htmlFor="req-address" className="modal-label">
                    Alamat Lengkap Pengiriman Paket
                  </label>
                  <textarea
                    id="req-address"
                    rows="2"
                    required
                    className="modal-textarea"
                    placeholder="Alamat lengkap beserta RT/RW, kelurahan, dan kota..."
                    value={requestFormData.address}
                    onChange={(e) => setRequestFormData({ ...requestFormData, address: e.target.value })}
                  />
                </div>

                <div className="modal-input-group">
                  <label htmlFor="req-reason" className="modal-label">
                    Alasan Kebutuhan Pakaian
                  </label>
                  <textarea
                    id="req-reason"
                    rows="2"
                    required
                    className="modal-textarea"
                    placeholder="Jelaskan secara ringkas siapa yang akan menerima pakaian ini..."
                    value={requestFormData.reason}
                    onChange={(e) => setRequestFormData({ ...requestFormData, reason: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.9rem 1.5rem' }}
                  disabled={submitting}
                >
                  {submitting ? 'Mengirim Pengajuan...' : 'Kirim Permintaan Donasi'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: Unggah Pakaian Donasi Perorangan */}
      {modalType === 'upload' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge badge-secondary">Donatur Perorangan</span>
                <h3 className="modal-title">Unggah Pakaian Donasi</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {modalSuccessMessage ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '52px', color: 'var(--color-primary)' }}>
                  check_circle
                </span>
                <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', textTransform: 'uppercase', color: 'var(--color-primary)', marginTop: '0.75rem' }}>
                  Garmen Berhasil Didaftarkan!
                </h4>
                <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', lineHeight: '22px', margin: '0.5rem auto 1.5rem', maxWidth: '380px' }}>
                  {modalSuccessMessage}
                </p>
                <button type="button" className="btn btn-primary" onClick={closeModal} style={{ width: '100%', justifyContent: 'center' }}>
                  Tutup Jendela
                </button>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="modal-form-wrap">
                <div className="modal-input-group">
                  <label htmlFor="up-title" className="modal-label">
                    Judul Paket Pakaian
                  </label>
                  <input
                    id="up-title"
                    type="text"
                    required
                    className="modal-input"
                    placeholder="Contoh: Paket 5 Pcs Kemeja & Celana Katun Pria"
                    value={uploadFormData.title}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="modal-input-group">
                    <label htmlFor="up-cat" className="modal-label">
                      Kategori Pakaian
                    </label>
                    <select
                      id="up-cat"
                      className="modal-input"
                      value={uploadFormData.category}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                    >
                      <option value="Pakaian Dewasa">Pakaian Dewasa</option>
                      <option value="Pakaian Anak">Pakaian Anak</option>
                      <option value="Seragam Sekolah">Seragam Sekolah</option>
                      <option value="Pakaian Hangat">Pakaian Hangat</option>
                    </select>
                  </div>

                  <div className="modal-input-group">
                    <label htmlFor="up-qty" className="modal-label">
                      Jumlah (Potong)
                    </label>
                    <input
                      id="up-qty"
                      type="number"
                      min="1"
                      required
                      className="modal-input"
                      value={uploadFormData.quantity}
                      onChange={(e) => setUploadFormData({ ...uploadFormData, quantity: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-input-group">
                  <label htmlFor="up-cond" className="modal-label">
                    Kondisi Kebersihan
                  </label>
                  <input
                    id="up-cond"
                    type="text"
                    required
                    className="modal-input"
                    placeholder="Contoh: Sudah dicuci wangi, tidak ada noda atau sobek"
                    value={uploadFormData.condition}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, condition: e.target.value })}
                  />
                </div>

                <div className="modal-input-group">
                  <label htmlFor="up-notes" className="modal-label">
                    Catatan Pengiriman / Domisili
                  </label>
                  <textarea
                    id="up-notes"
                    rows="2"
                    className="modal-textarea"
                    placeholder="Contoh: Lokasi donatur di Sleman, Yogyakarta. Siap diantar ke Drop Box terdekat..."
                    value={uploadFormData.notes}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, notes: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.9rem 1.5rem' }}
                  disabled={submitting}
                >
                  {submitting ? 'Mendaftarkan...' : 'Daftarkan ke Donasi Siap Salur'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
