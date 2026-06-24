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
    image_url_2,
    image_url_3,
    status,
    category
  } = artwork;

  const images = [image_url, image_url_2, image_url_3].filter(url => url && url.trim() !== '');
  const statusNorm = (status || '').toLowerCase().replace(/ı/g,'i').replace(/İ/g,'i').trim();
  const isSold = ['sold', 'satildi', 'satıldı'].includes(statusNorm) || statusNorm.startsWith('satil') || statusNorm.startsWith('satıl');
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (detailRef.current) {
      detailRef.current.scrollTop = 0;
    }
  }, [artwork]);

  // Lock body scroll when detail sheet is open to prevent background scrolling
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Reset active index when artwork changes
  useEffect(() => {
    setActiveIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [artwork]);

  // Sync lightbox index when lightbox opens
  useEffect(() => {
    if (isLightboxOpen) {
      setLightboxIndex(activeIndex);
    }
  }, [isLightboxOpen, activeIndex]);

  const handleScroll = (e) => {
    const container = e.target;
    const width = container.offsetWidth;
    if (width > 0) {
      const newIndex = Math.round(container.scrollLeft / width);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  const scrollToImage = (index) => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    scrollToImage(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    scrollToImage(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  };

  const handleLightboxPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleLightboxNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Premium Visual Frame */}
          <div className="boutique-visual-frame">
            {images.length > 0 ? (
              <>
                <div 
                  className="boutique-carousel-container" 
                  ref={scrollRef}
                  onScroll={handleScroll}
                >
                  {images.map((url, idx) => (
                    <div className="boutique-carousel-slide" key={idx}>
                      <img
                        src={url}
                        alt={`${artwork_name} - Görsel ${idx + 1}`}
                        className="boutique-carousel-img"
                        onClick={() => setIsLightboxOpen(true)}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Arrow navigation (only if more than 1 image) */}
                {images.length > 1 && (
                  <>
                    <button className="boutique-carousel-arrow prev" onClick={handlePrev} aria-label="Önceki Görsel">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="boutique-carousel-arrow next" onClick={handleNext} aria-label="Sonraki Görsel">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 5l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Dots indicator */}
                    <div className="boutique-carousel-dots">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          className={`boutique-carousel-dot ${idx === activeIndex ? 'active' : ''}`}
                          onClick={() => scrollToImage(idx)}
                          aria-label={`Görsel ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="boutique-visual-canvas" onClick={() => setIsLightboxOpen(true)}>
                <span className="fallback-number-serif">{id}</span>
              </div>
            )}
          </div>

          <div className="boutique-body">
            {/* Metadata Header */}
            <div className="boutique-header-meta">
              <span>{id}</span>
            </div>

            <h1 className="boutique-title">{artwork_name}</h1>

            {/* Description */}
            {description && (
              <p className="boutique-desc-block">{description}</p>
            )}

            {/* Price block */}
            <div className="boutique-price-block">
              <div className="boutique-price-label">Eser Değeri</div>
              <div className="boutique-price-values">
                {isSold ? (
                  <span className="sold-price-label">✦ Satıldı</span>
                ) : (
                  <>
                    {price_eur > 0 ? (
                      <span>{price_eur.toLocaleString('de-DE')} €</span>
                    ) : null}
                    {price_tl > 0 ? (
                      <span className="tl-sub">/ {price_tl.toLocaleString('tr-TR')} TL</span>
                    ) : (
                      price_eur === 0 && <span className="exhibition-text">Sergileniyor (Satılık Değil)</span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Specs */}
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

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fine-lightbox" onClick={() => setIsLightboxOpen(false)}>
          <button className="fine-lightbox-close" onClick={() => setIsLightboxOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {images.length > 0 ? (
              <div className="lightbox-carousel-container">
                <img 
                  src={images[lightboxIndex]} 
                  alt={artwork_name} 
                  className="fine-lightbox-img animate-fade-in" 
                  key={lightboxIndex}
                  onClick={() => setIsLightboxOpen(false)}
                />
                
                {images.length > 1 && (
                  <>
                    <button className="lightbox-carousel-arrow prev" onClick={handleLightboxPrev} aria-label="Önceki">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="lightbox-carousel-arrow next" onClick={handleLightboxNext} aria-label="Sonraki">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 5l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="lightbox-fallback">
                <div className="minimal-fallback-canvas">
                  <span className="fallback-number-serif">{id}</span>
                </div>
              </div>
            )}
            <div className="fine-lightbox-info">
              <h3>{artwork_name}</h3>
              <p>
                {id} • {dimensions} • {material} 
                {images.length > 1 && ` • (${lightboxIndex + 1}/${images.length})`}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
