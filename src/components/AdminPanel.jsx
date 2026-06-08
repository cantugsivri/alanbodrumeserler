import React, { useState, useEffect } from 'react';
import { getSavedSheetURL, saveSheetURL } from '../services/sheets';

export default function AdminPanel({ isOpen, onClose, onRefresh }) {
  const [sheetURL, setSheetURL] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSheetURL(getSavedSheetURL());
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const trimmedURL = sheetURL.trim();
    if (trimmedURL && !trimmedURL.startsWith('http')) {
      setErrorMsg('Lütfen geçerli bir http:// veya https:// adresi girin.');
      return;
    }

    try {
      saveSheetURL(trimmedURL);
      setSuccessMsg('Google Sheets canlı bağlantısı başarıyla kuruldu!');
      onRefresh();
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setErrorMsg('Bağlantı kaydedilirken hata oluştu.');
    }
  };

  const handleClear = () => {
    saveSheetURL('');
    setSheetURL('');
    setSuccessMsg('Bağlantı sıfırlandı. 95 eserlik yerel veritabanı aktif!');
    onRefresh();
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="minimal-admin-overlay animate-fade-in">
      <div className="minimal-admin-modal animate-scale-up">
        <div className="minimal-admin-header">
          <h2>Veri Yönetim Merkezi</h2>
          <button onClick={onClose} aria-label="Kapat" style={{color: 'var(--color-text-muted)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="minimal-admin-content">
          <p className="admin-subtitle">
            Kataloğu doğrudan kendi Google Sheets tablonuzdan yönetmek için Web'de yayınlanmış CSV bağlantısını tanımlayın.
          </p>

          <form onSubmit={handleSave} className="admin-form">
            <div className="minimal-form-group">
              <label htmlFor="sheetUrlInput">Google Sheets CSV Bağlantısı</label>
              <input
                id="sheetUrlInput"
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                value={sheetURL}
                onChange={(e) => setSheetURL(e.target.value)}
              />
              <span className="input-tip">
                Boş bırakırsanız tüm gerçek verileri barındıran 95 eserlik yerel katalog kullanılır.
              </span>
            </div>

            {errorMsg && <div className="admin-alert error">{errorMsg}</div>}
            {successMsg && <div className="admin-alert success">{successMsg}</div>}

            <div className="form-actions" style={{marginTop: '10px'}}>
              <button type="submit" className="minimal-save-btn">
                Canlı Bağlantıyı Kaydet
              </button>
              {getSavedSheetURL() && (
                <button type="button" className="minimal-reset-btn" onClick={handleClear}>
                  Yerel Veriye Geri Dön
                </button>
              )}
            </div>
          </form>

          <hr className="admin-divider" style={{margin: '10px 0'}} />

          <div className="guide-section" style={{gap: '16px'}}>
            <h3 style={{fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 500}}>Google Sheets Yayınlama Rehberi</h3>
            
            <div className="guide-step">
              <div className="step-num">1</div>
              <div className="step-text">
                <strong>Kolon Başlıklarını Belirleyin:</strong>
                <p>Sheets tablonuzun ilk satırına şu 16 başlığı ekleyin:</p>
                <div className="code-badge-container">
                  <code>id</code><code>artwork_code</code><code>artwork_name</code><code>cafe_location</code><code>artist</code><code>artwork_type</code><code>dimensions</code><code>material</code><code>description</code><code>price_tl</code><code>price_eur</code><code>image_url_1</code><code>image_url_2</code><code>image_url_3</code><code>status</code><code>category</code>
                </div>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-num">2</div>
              <div className="step-text">
                <strong>CSV Olarak Yayınlayın:</strong>
                <p>Dosya &gt; Paylaş &gt; Web'de yayınla menüsünden ilgili sayfayı ve <strong>"Virgülle ayrılmış değerler (.csv)"</strong> formatını seçip Yayınla'ya tıklayın. Çıkan linki yukarıya yapıştırın.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
