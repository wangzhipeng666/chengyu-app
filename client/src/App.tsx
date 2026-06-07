import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Heart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import DayPage from './pages/DayPage';
import DictionaryPage from './pages/DictionaryPage';
import WrongPage from './pages/WrongPage';
import FavoritesPage from './pages/FavoritesPage';
import './App.css';
/* eslint-disable @typescript-eslint/no-unused-vars */

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isDesktop;
}

function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: '首页' },
    { to: '/dictionary', icon: BookOpen, label: '词典' },
    { to: '/favorites', icon: Heart, label: '收藏' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="max-w-lg mx-auto flex justify-around items-center h-14">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={20} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function SideNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const navItems = [
    { to: '/', icon: Home, label: '首页' },
    { to: '/dictionary', icon: BookOpen, label: '词典' },
    { to: '/favorites', icon: Heart, label: '收藏' },
    { to: '/wrong', icon: Menu, label: '错题本' },
  ];

  return (
    <>
      <button className="side-nav-toggle" onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <div className="side-nav-overlay" onClick={() => setOpen(false)} />
      )}
      <nav className={`side-nav ${open ? 'open' : ''}`}>
        <div className="side-nav-brand">
          <span className="side-nav-logo">成</span>
          <span>成语学习助手</span>
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `side-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout() {
  const location = useLocation();
  const isDesktop = useIsDesktop();
  const hideNav = location.pathname.startsWith('/day/') && !isDesktop;

  if (isDesktop) {
    return (
      <div className="desktop-layout">
        <ScrollToTop />
        <SideNav />
        <div className="desktop-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/day/:dayId" element={<DayPage />} />
            <Route path="/dictionary" element={<DictionaryPage />} />
            <Route path="/dictionary/:dayId" element={<DictionaryPage />} />
            <Route path="/wrong" element={<WrongPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen pb-16" style={{ background: 'var(--color-canvas)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/day/:dayId" element={<DayPage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/dictionary/:dayId" element={<DictionaryPage />} />
          <Route path="/wrong" element={<WrongPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
        {!hideNav && <BottomNav />}
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
