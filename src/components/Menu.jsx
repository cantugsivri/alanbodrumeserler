import React, { useState } from 'react';
import menuData from '../assets/menuData.json';

export default function Menu({ onBack }) {
  const [activeCategory, setActiveCategory] = useState(menuData.categories[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  // Find active category object
  const activeCategoryObj = menuData.categories.find(cat => cat.id === activeCategory);

  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `${price} ₺`;
    }
    return price; // For "Detaylar için danışınız" or text price
  };

  // Search logic across all categories
  const getSearchResults = () => {
    if (!searchQuery.trim()) return null;

    const query = searchQuery.toLowerCase().trim();
    const results = [];

    menuData.categories.forEach(category => {
      const matchedSubcategories = [];

      category.subcategories.forEach(sub => {
        const matchedItems = sub.items.filter(item => 
          item.name.toLowerCase().includes(query) || 
          (item.description && item.description.toLowerCase().includes(query))
        );

        if (matchedItems.length > 0) {
          matchedSubcategories.push({
            ...sub,
            items: matchedItems
          });
        }
      });

      if (matchedSubcategories.length > 0) {
        results.push({
          ...category,
          subcategories: matchedSubcategories
        });
      }
    });

    return results;
  };

  const searchResults = getSearchResults();

  return (
    <div className="menu-view-container animate-fade-in">
      {/* Header Bar */}
      <header className="menu-header">
        <div className="container menu-header-container">
          <button onClick={onBack} className="menu-back-btn" aria-label="Geri Dön">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Ana Sayfa</span>
          </button>
          <h2 className="menu-title-main">ALAN MENÜ</h2>
          <div style={{ width: '80px' }}></div> {/* Spacer to keep title centered */}
        </div>
      </header>

      <main className="container menu-main">
        {/* Search Bar */}
        <section className="menu-search-section">
          <div className="menu-search-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="menu-search-icon">
              <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Menüde ara... (latte, börek, vb.)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="menu-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="menu-search-clear" aria-label="Aramayı temizle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </section>

        {/* Category Selector Tabs (only shown when not searching) */}
        {!searchQuery && (
          <section className="menu-tabs-section">
            <div className="menu-tabs-scroll">
              {menuData.categories.map(cat => (
                <button
                  key={cat.id}
                  className={`menu-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Menu Content */}
        <section className="menu-items-section">
          {searchQuery ? (
            /* Search Results View */
            searchResults && searchResults.length > 0 ? (
              searchResults.map(category => (
                <div key={category.id} className="menu-search-category-group">
                  <h3 className="menu-category-title search-result-title">{category.name}</h3>
                  
                  {category.subcategories.map((sub, sIdx) => (
                    <div key={sIdx} className="menu-subcategory-block">
                      <h4 className="menu-subcategory-title">{sub.name}</h4>
                      <div className="menu-items-list">
                        {sub.items.map((item, idx) => (
                          <div className="menu-item-row" key={idx}>
                            <div className="menu-item-info">
                              <div className="menu-item-title-row">
                                <span className="menu-item-name">{item.name}</span>
                                <span className="menu-item-dots"></span>
                                <span className="menu-item-price">{formatPrice(item.price)}</span>
                              </div>
                              {item.description && (
                                <p className="menu-item-description">{item.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="menu-no-results">
                <p>"{searchQuery}" aramanıza uygun ürün bulunamadı.</p>
              </div>
            )
          ) : (
            /* Normal Category View */
            activeCategoryObj && (
              <div className="menu-category-view animate-fade-in">
                {activeCategoryObj.subcategories.map((sub, sIdx) => (
                  <div key={sIdx} className="menu-subcategory-block">
                    <h3 className="menu-subcategory-title">{sub.name}</h3>
                    <div className="menu-items-list">
                      {sub.items.map((item, idx) => (
                        <div className="menu-item-row animate-fade-in-up" key={idx}>
                          <div className="menu-item-info">
                            <div className="menu-item-title-row">
                              <span className="menu-item-name">{item.name}</span>
                              <span className="menu-item-dots"></span>
                              <span className="menu-item-price">{formatPrice(item.price)}</span>
                            </div>
                            {item.description && (
                              <p className="menu-item-description">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </section>
      </main>

      <footer className="menu-footer">
        <p className="footer-note">* Fiyatlarımıza KDV dahildir.</p>
        <p>© 2026 ALAN Art & Coffee • Bodrum</p>
      </footer>
    </div>
  );
}
