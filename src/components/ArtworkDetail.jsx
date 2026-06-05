import React, { useState, useEffect, useRef } from 'react';

export default function ArtworkDetail({ artwork, onClose, onSelectArtwork, allArtworks = [] }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const detailRef = useRef(null);

  const {
    id,
    artwork_name,
    cafe_location,
    artist,
    artwork_type,
    dimensions,
    material,
    description,
    price_tl,
    price_eur,
    image_url,
    status,
    category
  } = artwork;



  useEffect(() => {
    if (detailRef.current) {
      detailRef.current.scrollTop = 0;
    }
  }, [artwork]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('boutique-backdrop')) {
      onClose();
    }
  };



  return (
    <>
      <div className="boutique-backdrop" onClick={handleOverlayClick}>
        <div className="boutique-sheet" ref={detailRef}>
          <div className="boutique-handle" onClick={onClose}></div>

          <button className="boutique-close-btn" onClick={onClose} aria-label="Kapat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

            {/* Premium Visual Frame */}
          <div className="boutique-visual-frame">
            {image_url ? (
              <img
                src={image_url}
                alt={artwork_name}
                className="boutique-visual-img"
                onClick={() => setIsLightboxOpen(true)}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="boutique-visual-canvas" style={{ display: image_url ? 'none' : 'flex' }} onClick={() => setIsLightboxOpen(true)}>
              <span className="fallback-number-serif">{id}</span>
            </div>
          </div>


          <div className="boutique-body">
            {/* Metadata Header */}
            <div className="boutique-header-meta">
              <span>{id}</span>
            </div>

            <h1 className="boutique-title">{artwork_name}</h1>

            {/* Description / Artist Note */}
            {description && (
              <p className="boutique-desc-block">
                {description}
              </p>
            )}

            {/* Price block */}
            <div className="boutique-price-block">
              <div className="boutique-price-label">Eser Değeri</div>
              <div className="boutique-price-values">
                {price_eur > 0 ? (
                  <span>{price_eur.toLocaleString('de-DE')} €</span>
                ) : null}
                {price_tl > 0 ? (
                  <span className="tl-sub">/ {price_tl.toLocaleString('tr-TR')} TL</span>
                ) : (
                  price_eur === 0 && <span className="exhibition-text">Sergileniyor (Satılık Değil)</span>
                )}
              </div>
            </div>

            {/* Specs row list (no grids) */}
            <div className="boutique-specs-list">
              <div className="specs-list-row">
                <span className="specs-row-label">Kafedeki Konumu</span>
                <span className="specs-row-value">{cafe_location}</span>
              </div>
              <div className="specs-list-row">
                <span className="specs-row-label">Ölçüler</span>
                <span className="specs-row-value">{dimensions || 'Belirtilmemiş'}</span>
              </div>
              <div className="specs-list-row">
                <span className="specs-row-label">Materyal</span>
                <span className="specs-row-value">{material || 'Doğal Malzeme'}</span>
              </div>
              <div className="specs-list-row">
                <span className="specs-row-label">Sanatçı</span>
                <span className="specs-row-value">{artist || 'ALAN Art Studio'}</span>
              </div>
              <div className="specs-list-row">
                <span className="specs-row-label">Kategori</span>
                <span className="specs-row-value">{category || 'Mozaik'}</span>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Premium Flat Lightbox */}
      {isLightboxOpen && (
        <div className="fine-lightbox" onClick={() => setIsLightboxOpen(false)}>
          <button className="fine-lightbox-close" onClick={() => setIsLightboxOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="lightbox-content">
            {image_url ? (
              <img src={image_url} alt={artwork_name} className="fine-lightbox-img" />
            ) : (
              <div className="lightbox-fallback">
                <div className="minimal-fallback-canvas">
                  <span className="fallback-number-serif">{id}</span>
                </div>
              </div>
            )}
            <div className="fine-lightbox-info">
              <h3>{artwork_name}</h3>
              <p>{id} • {dimensions} • {material}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
