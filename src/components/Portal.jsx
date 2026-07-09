import React from 'react';
import logoImg from '../assets/logo.jpeg';

export default function Portal({ onViewChange }) {
  return (
    <div className="portal-container animate-fade-in">
      <header className="brand-header">
        <div className="brand-logo-container">
          <img src={logoImg} alt="ALAN Art & Coffee Logo" className="brand-logo-img" />
        </div>
        <div className="brand-text-wrapper">
          <h1 className="brand-main-title">ALAN</h1>
          <p className="brand-sub-title">Art & Coffee • Bodrum</p>
        </div>
      </header>

      <main className="container portal-main">
        <div className="portal-welcome animate-fade-in-up">
          <h2>Bodrum'un Sanat ve Lezzet Durağı</h2>
          <p>Kafemizin güncel menüsünü inceleyebilir, sergilenen sanat eserlerini keşfedebilir ve yaklaşan etkinliklerimizden haberdar olabilirsiniz.</p>
        </div>

        <div className="portal-grid">
          {/* Box 1: Menü */}
          <button 
            className="portal-card animate-fade-in-up delay-1"
            onClick={() => onViewChange('menu')}
          >
            <div className="portal-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="portal-card-info">
              <h3>Menü</h3>
              <p>Kahve, Kokteyl, Sıcak & Soğuk Lezzetler</p>
            </div>
            <div className="portal-card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Box 2: Dijital Sanat Galerisi */}
          <button 
            className="portal-card animate-fade-in-up delay-2"
            onClick={() => onViewChange('gallery')}
          >
            <div className="portal-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8.5" cy="8.5" r="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="portal-card-info">
              <h3>Dijital Sanat Galerisi</h3>
              <p>Sergilenen El Yapımı Özel Mozaik Eserler</p>
            </div>
            <div className="portal-card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Box 3: Yaklaşan Etkinliklerimiz */}
          <button 
            className="portal-card animate-fade-in-up delay-3"
            onClick={() => onViewChange('events')}
          >
            <div className="portal-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="portal-card-info">
              <h3>Yaklaşan Etkinliklerimiz</h3>
              <p>Atölye, Yoga, Caz Dinletileri ve Söyleşiler</p>
            </div>
            <div className="portal-card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Instagram Footer Card */}
        <a 
          href="https://www.instagram.com/alanbodrum/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="portal-instagram-card animate-fade-in-up delay-4"
        >
          <div className="instagram-card-content">
            <div className="instagram-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </div>
            <span>Bizi Instagram'da Takip Edin • @alanbodrum</span>
          </div>
        </a>
      </main>

      <footer className="portal-footer">
        <p>© 2026 ALAN Art & Coffee • Bodrum</p>
      </footer>
    </div>
  );
}
