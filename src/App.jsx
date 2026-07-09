import React, { useState, useEffect } from 'react';
import Portal from './components/Portal';
import Home from './components/Home';
import Menu from './components/Menu';
import Events from './components/Events';

export default function App() {
  const [view, setView] = useState('portal');

  // Handle hash-based routing for back button support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['gallery', 'menu', 'events'].includes(hash)) {
        setView(hash);
      } else {
        setView('portal');
      }
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (newView) => {
    if (newView === 'portal') {
      window.location.hash = '';
    } else {
      window.location.hash = newView;
    }
  };

  switch (view) {
    case 'gallery':
      return <Home onBack={() => handleNavigate('portal')} />;
    case 'menu':
      return <Menu onBack={() => handleNavigate('portal')} />;
    case 'events':
      return <Events onBack={() => handleNavigate('portal')} />;
    case 'portal':
    default:
      return <Portal onViewChange={handleNavigate} />;
  }
}
