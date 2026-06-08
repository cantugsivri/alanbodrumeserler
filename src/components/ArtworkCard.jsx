import React from 'react';

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

  const isSold = status && status.toLowerCase() === 'sold';
  const images = [image_url, image_url_2, image_url_3].filter(url => url && url.trim() !== '');

  return (
    <div className="gallery-card animate-fade-in-up" onClick={onClick}>
      <div className="gallery-card-frame">
        {image_url ? (
          <img
            src={image_url}
            alt={artwork_name}
            className="gallery-card-image"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Minimalist Fallback Canvas */}
        <div className="minimal-fallback-canvas" style={{ display: image_url ? 'none' : 'flex' }}>
          <span className="fallback-number-serif">{id}</span>
        </div>

        {images.length > 1 && (
          <div className="card-multi-image-indicator">
            {images.map((_, idx) => (
              <span key={idx} className={`indicator-dot ${idx === 0 ? 'active' : ''}`} />
            ))}
          </div>
        )}

        {isSold && (
          <div className="sold-label-text">
            Özel Koleksiyon
          </div>
        )}
      </div>

      <div className="gallery-card-meta">
        <span className="card-num-label">{id}</span>
        <h3 className="card-title-label">{artwork_name}</h3>
        <p className="card-desc-label">{material} • {cafe_location}</p>

        <div className="card-price-label">
          {price_eur > 0 ? (
            <span>{price_eur.toLocaleString('de-DE')} €</span>
          ) : null}
          {price_tl > 0 ? (
            <span className="tl-price">{price_tl.toLocaleString('tr-TR')} TL</span>
          ) : (
            price_eur === 0 && <span className="exhibition-only">Sergileniyor</span>
          )}
        </div>
      </div>
    </div>
  );
}
