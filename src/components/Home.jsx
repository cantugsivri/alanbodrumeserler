import React, { useState, useEffect, useRef } from 'react';
import { getCachedArtworks, refreshArtworksInBackground } from '../services/sheets';
import ArtworkCard from './ArtworkCard';
import ArtworkDetail from './ArtworkDetail';
import logoImg from '../assets/logo.jpeg';

export default function Home({ onBack }) {
  const [artworks, setArtworks] = useState(() => {
    // Anında yerel/cache verisini yükle — sıfır bekleme
    const cached = getCachedArtworks();
    return cached.filter(item => item.artwork_name);
  });
  const [loading] = useState(false); // Cache-first: her zaman anında hazır
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const hasPushedHash = useRef(false);

  // Infinite scroll
  const ITEMS_PER_PAGE = 12;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const sentinelRef = useRef(null);

  // Android geri tuşu desteği: hash değişimini dinle
  useEffect(() => {
    const handleHashChange = () => {
      // Hash #detail veya #lightbox değilse (geri tuşuyla temizlendi), detayı kapat
      if (window.location.hash !== '#detail' && window.location.hash !== '#lightbox') {
        hasPushedHash.current = false;
        setSelectedArtwork(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectArtwork = (art) => {
    if (hasPushedHash.current) {
      // Zaten #detail var, üstüne ekleme — sadece değiştir
      window.history.replaceState(null, '', '#detail');
    } else {
      window.location.hash = 'detail';
      hasPushedHash.current = true;
    }
    setSelectedArtwork(art);
  };

  const handleCloseDetail = () => {
    if (hasPushedHash.current) {
      hasPushedHash.current = false;
      window.history.back(); // hash temizlenir → hashchange tetiklenir → detay kapanır
    } else {
      setSelectedArtwork(null);
    }
  };

  // Arka planda Google Sheets'ten güncel veriyi çek
  useEffect(() => {
    refreshArtworksInBackground((freshData) => {
      const cleanData = freshData.filter(item => item.artwork_name);
      setArtworks(cleanData);
    });
  }, []);

  // Filtre/arama değiştiğinde görünen sayısını sıfırla
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedLocation]);

  // Infinite scroll: Intersection Observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => prev + ITEMS_PER_PAGE);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, artworks]);

  // Get unique locations for clean flat link separators
  const locations = ['All', ...new Set(artworks.map(art => art.cafe_location).filter(Boolean))];

  // Filter artworks dynamically (supports name, material, and numeric ID search!)
  const filteredArtworks = artworks.filter(art => {
    const query = searchQuery.trim().toLowerCase();

    // Check if query is exact numeric ID search
    const isNumericSearch = /^\d+$/.test(query);
    const matchesNumericId = isNumericSearch && art.id.toString() === query;

    const matchesText =
      art.artwork_name.toLowerCase().includes(query) ||
      (art.material && art.material.toLowerCase().includes(query)) ||
      (art.cafe_location && art.cafe_location.toLowerCase().includes(query));

    const matchesSearch = query ? (isNumericSearch ? matchesNumericId : matchesText) : true;
    const matchesLocation = selectedLocation === 'All' || art.cafe_location === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="app-container">

      {/* Centered Large Logo & Minimal Header */}
      <header className="brand-header">
        {onBack && (
          <button onClick={onBack} className="gallery-back-btn" aria-label="Geri Dön">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Ana Sayfa</span>
          </button>
        )}
        <div className="brand-logo-container">
          <img src={logoImg} alt="ALAN Art & Coffee Logo" className="brand-logo-img" />
        </div>
      </header>

      {/* Main Body Content */}
      <main className="container">

        {/* Gallery Hero Title */}
        <section className="minimal-hero animate-fade-in">
          <h2>Dijital Sanat Arşivi</h2>
          <p>
            Kafemizde sergilenen el yapımı özel mozaik eserleri ve modern koleksiyonu envanter numaralarıyla inceleyebilirsiniz.
          </p>
        </section>

        {/* Search Bar */}
        <section className="search-container animate-fade-in-up">
          <div className="minimal-search-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="minimal-search-icon">
              <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Eser Numarası Giriniz / Enter Artwork No"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="minimal-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} aria-label="Aramayı temizle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{color: 'var(--color-text-muted)'}}>
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </section>

        {/* Location Filters */}
        <section className="minimal-filters animate-fade-in">
          <div className="filter-links-wrapper">
            {locations.map((loc, idx) => (
              <React.Fragment key={loc}>
                {idx > 0 && <span className="filter-dot">•</span>}
                <button
                  className={`filter-link-btn ${selectedLocation === loc ? 'active' : ''}`}
                  onClick={() => setSelectedLocation(loc)}
                >
                  {loc === 'All' ? 'Tüm Eserler' : loc}
                </button>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Artwork Grid */}
        <section className="artworks-grid-section">
          {loading ? (
            <div className="skeleton-row-container">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="skeleton-flat-card">
                  <div className="skeleton-flat-img"></div>
                  <div className="skeleton-flat-text"></div>
                  <div className="skeleton-flat-text short"></div>
                </div>
              ))}
            </div>
          ) : filteredArtworks.length > 0 ? (
            <>
              <div className="results-label">
                Koleksiyondan <strong>{filteredArtworks.length}</strong> Değerli Eser Listeleniyor
              </div>
              <div className="gallery-grid">
                {filteredArtworks.slice(0, visibleCount).map(art => (
                  <ArtworkCard
                    key={art.id}
                    artwork={art}
                    onClick={() => handleSelectArtwork(art)}
                  />
                ))}
              </div>
              {/* Infinite scroll sentinel — görünür olduğunda daha fazla eser yükler */}
              {visibleCount < filteredArtworks.length && (
                <div ref={sentinelRef} style={{ height: '1px' }} />
              )}
            </>
          ) : (
            <div className="no-results-card animate-scale-up" style={{ border: '1px solid var(--color-border)' }}>
              <h3>Eser Bulunamadı</h3>
              <p>Arama veya duvar filtrenizi sıfırlayarak arşivi tekrar listeleyebilirsiniz.</p>
              <button
                className="reset-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation('All');
                }}
              >
                Kataloğu Sıfırla
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="gallery-footer">
        <h4 className="footer-logo-title">ALAN ART & COFFEE</h4>
        <p className="footer-copy">Dijital Kürasyon Kataloğu • Bodrum 2026</p>
      </footer>

      {/* Detail Sheet */}
      {selectedArtwork && (
        <ArtworkDetail
          artwork={selectedArtwork}
          onClose={handleCloseDetail}
          onSelectArtwork={(art) => handleSelectArtwork(art)}
          allArtworks={artworks}
        />
      )}

    </div>
  );
}
