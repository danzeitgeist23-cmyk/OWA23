import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import Destinations from './pages/Destinations';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import PaymentResult from './pages/PaymentResult';
import { Toaster } from './components/ui/toaster';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider } from './i18n/LanguageContext';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

const THEME_STORAGE_KEY = 'owa-theme';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark';

    root.classList.toggle('dark', isDark);
    root.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className="App">
      <CurrencyProvider>
      <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Header theme={theme} onToggleTheme={() => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')} />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/actividades" element={<Activities />} />
                <Route path="/actividad/:id" element={<ActivityDetail />} />
                <Route path="/destinos" element={<Destinations />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/nosotros" element={<About />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/pago/resultado" element={<PaymentResult />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </BrowserRouter>
      </LanguageProvider>
    </CurrencyProvider>
    </div>
  );
}

export default App;
