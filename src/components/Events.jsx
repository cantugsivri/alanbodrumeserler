import React from 'react';
import eventsData from '../assets/events.json';

export default function Events({ onBack }) {
  return (
    <div className="events-view-container animate-fade-in">
      {/* Header Bar */}
      <header className="menu-header">
        <div className="container menu-header-container">
          <button onClick={onBack} className="menu-back-btn" aria-label="Geri Dön">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Ana Sayfa</span>
          </button>
          <h2 className="menu-title-main">ETKİNLİKLER</h2>
          <div style={{ width: '80px' }}></div>
        </div>
      </header>

      <main className="container events-main">
        <div className="events-intro animate-fade-in-up">
          <h2>Yaklaşan Etkinliklerimiz</h2>
          <p>ALAN Art & Coffee'de gerçekleşecek atölye çalışmaları, sergiler, dinletiler ve özel oturumları kaçırmamak için yerinizi ayırtın.</p>
        </div>

        <div className="events-list">
          {eventsData.map((event, idx) => (
            <a
              key={event.id}
              href={event.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`event-card animate-fade-in-up delay-${idx + 1}`}
            >
              <div className="event-card-header">
                <span className="event-date">{event.date}</span>
                <span className="event-instagram-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </span>
              </div>
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              
              <div className="event-action-link">
                <span>Detaylar için tıklayın</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="arrow-icon">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </main>

      <footer className="events-footer">
        <p>Tüm duyurular ve rezervasyon işlemleri için Instagram üzerinden bizimle iletişime geçebilirsiniz.</p>
        <p>© 2026 ALAN Art & Coffee • Bodrum</p>
      </footer>
    </div>
  );
}
