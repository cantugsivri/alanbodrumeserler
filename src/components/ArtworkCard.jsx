import React, { useState, useRef } from 'react';

export default function ArtworkCard({ artwork, onClick }) {
  const {
    id,
    artwork_name,
    cafe_location,
    material,
    price_tl,
    price_eur,
    image_url,
    image_url_2,
    image_url_3,
    status
  } = artwork;

  const statusNorm = (status || '').toLowerCase().replace(/ı/g,'i').replace(/İ/g,'i').trim();
  const isSold = ['sold', 'satildi', 'satıldı', 'satti', 'satıldı'].includes(statusNorm) || statusNorm.startsWith('satil') || statusNorm.startsWith('satıl');
  const images = [image_url, image_url_2, image_url_3].filter(url => url && url.trim() !== '');

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

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

  const scrollToImage = (index, e) => {
    if (e) e.stopPropagation();
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  return (
    <div className="gallery-card animate-fade-in-up" onClick={onClick}>
      <div className="gallery-card-frame">
        {images.length > 0 ? (
          <div 
            className="card-carousel-container" 
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {images.map((url, idx) => (
              <div className="card-carousel-slide" key={idx}>
                <img
                  src={url}
                  alt={`${artwork_name} - Görsel ${idx + 1}`}
                  className="gallery-card-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="minimal-fallback-canvas" style={{ display: 'none' }}>
                  <span className="fallback-number-serif">{id}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="minimal-fallback-canvas" style={{ display: 'flex' }}>
            <span className="fallback-number-serif">{id}</span>
          </div>
        )}

        {images.length > 1 && (
          <div className="card-multi-image-indicator" onClick={(e) => e.stopPropagation()}>
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`indicator-dot ${idx === activeIndex ? 'active' : ''}`}
                onClick={(e) => scrollToImage(idx, e)}
                aria-label={`Görsel ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="gallery-card-meta">
        <span className="card-num-label">{id}</span>
        <h3 className="card-title-label">{artwork_name}</h3>
        <p className="card-desc-label">{material} • {cafe_location}</p>

        <div className="card-price-label">
          {isSold ? (
            <span className="sold-price-label">✦ Satıldı</span>
          ) : (
            <>
              {price_eur > 0 ? (
                <span>{price_eur.toLocaleString('de-DE')} €</span>
              ) : null}
              {price_tl > 0 ? (
                <span className="tl-price">{price_tl.toLocaleString('tr-TR')} TL</span>
              ) : (
                price_eur === 0 && <span className="exhibition-only">Sergileniyor</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
