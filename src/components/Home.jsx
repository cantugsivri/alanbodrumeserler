import React, { useState, useEffect } from 'react';
import { fetchArtworks } from '../services/sheets';
import ArtworkCard from './ArtworkCard';
import ArtworkDetail from './ArtworkDetail';
import AdminPanel from './AdminPanel';
import logoImg from '../assets/logo.jpeg';

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load artworks
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchArtworks();
      
      // Clean data: ensure basic fields exist
      const cleanData = data.filter(item => item.artwork_name);
      setArtworks(cleanData);
      setLoading(false);
    }
    loadData();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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
        {/* Subtle, tiny settings gears icon placed elegantly in top-right */}
        <button 
          className="minimal-settings-btn" 
          onClick={() => setIsAdminOpen(true)}
          aria-label="Veri Bağlantısı"
          title="Google Sheets Ayarları"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

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

      {/* Minimal Admin Panel Configuration Modal */}
      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
