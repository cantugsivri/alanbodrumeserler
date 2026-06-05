import React, { useState, useEffect } from 'react';
import { fetchArtworks } from '../services/sheets';
import ArtworkCard from './ArtworkCard';
import ArtworkDetail from './ArtworkDetail';
import logoImg from '../assets/logo.jpeg';

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // Load artworks
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchArtworks();
      const cleanData = data.filter(item => item.artwork_name);
      setArtworks(cleanData);
      setLoading(false);
    }
    loadData();
  }, []);

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
    
    const matchesSearch = query ? (matchesNumericId || matchesText) : true;
    const matchesLocation = selectedLocation === 'All' || art.cafe_location === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="app-container">
      
      {/* Centered Large Logo & Minimal Header */}
      <header className="brand-header">

        <div className="brand-logo-container">
          <img src={logoImg} alt="ALAN Art & Coffee Logo" className="brand-logo-img" />
        </div>
        
        <div className="brand-text-wrapper">
          <h1 className="brand-main-title">ALAN</h1>
          <span className="brand-sub-title">ART & COFFEE</span>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="container">
        
        {/* Gallery Hero Title (Calm & Elegant) */}
        <section className="minimal-hero animate-fade-in">
          <h2>Dijital Sanat Arşivi</h2>
          <p>
            Kafemizde sergilenen el yapımı özel mozaik eserleri ve modern koleksiyonu envanter numaralarıyla inceleyebilirsiniz.
          </p>
        </section>

        {/* Minimal Bottom-line Search Bar */}
        <section className="search-container animate-fade-in-up">
          <div className="minimal-search-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="minimal-search-icon">
              <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input 
              type="text" 
              placeholder="Eser Numarası Giriniz"
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

        {/* Minimal Flat Text-based Link Filters */}
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

        {/* Simple Artwork Grid (No dashboard UI complexity) */}
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
                {filteredArtworks.map(art => (
                  <ArtworkCard 
                    key={art.id} 
                    artwork={art} 
                    onClick={() => setSelectedArtwork(art)}
                  />
                ))}
              </div>
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

      {/* Boutique Footer */}
      <footer className="gallery-footer">
        <h4 className="footer-logo-title">ALAN ART & COFFEE</h4>
        <p className="footer-copy">Dijital Kürasyon Kataloğu • Bodrum 2026</p>
      </footer>

      {/* Boutique Bottom Detail Overlay Sheet */}
      {selectedArtwork && (
        <ArtworkDetail 
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onSelectArtwork={(art) => setSelectedArtwork(art)}
          allArtworks={artworks}
        />
      )}


    </div>
  );
}
