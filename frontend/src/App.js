import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LegacyActivityRedirect from './components/LegacyActivityRedirect';
import LegacyDestinationRedirect from './components/LegacyDestinationRedirect';
import Footer from './components/Footer';
import Seo from './components/Seo';
import Home from './pages/Home';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import CategoryLanding from './pages/CategoryLanding';
import Destinations from './pages/Destinations';
import Destination from './pages/Destination';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import PaymentResult from './pages/PaymentResult';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { Toaster } from './components/ui/toaster';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider } from './i18n/LanguageContext';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAccount from './pages/MyAccount';
import AdminMedia from './pages/AdminMedia';
import AdminActivities from './pages/AdminActivities';
import AdminReservations from './pages/AdminReservations';
import { getRouteSeo } from './lib/seo';

const THEME_STORAGE_KEY = 'owa-theme';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function RouteMetadata() {
  const location = useLocation();
  const meta = getRouteSeo(location.pathname);

  return <Seo {...meta} />;
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
            <RouteMetadata />
            <Header theme={theme} onToggleTheme={() => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')} />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/activities/:category" element={<CategoryLanding />} />
                <Route path="/activity/:id" element={<ActivityDetail />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/destinations/:slug" element={<Destination />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/account" element={<MyAccount />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* SumUp payment return — /pago/resultado is the live redirect_url in the backend; keep it working */}
                <Route path="/pago/resultado" element={<PaymentResult />} />
                <Route path="/payment/result" element={<PaymentResult />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/admin/media" element={<AdminMedia />} />
                <Route path="/admin/activities" element={<AdminActivities />} />
                <Route path="/admin/reservations" element={<AdminReservations />} />

                {/* Legacy Spanish routes → permanent redirects so previously shared links keep working */}
                <Route path="/actividades" element={<Navigate to="/activities" replace />} />
                <Route path="/actividad/:id" element={<LegacyActivityRedirect />} />
                <Route path="/destinos/:slug" element={<LegacyDestinationRedirect />} />
                <Route path="/destinos" element={<Navigate to="/destinations" replace />} />
                <Route path="/nosotros" element={<Navigate to="/about" replace />} />
                <Route path="/contacto" element={<Navigate to="/contact" replace />} />
                <Route path="/mi-cuenta" element={<Navigate to="/account" replace />} />
                <Route path="/acceso" element={<Navigate to="/login" replace />} />
                <Route path="/registro" element={<Navigate to="/register" replace />} />
              </Routes>
            </main>
            <Footer />
            <FloatingWhatsApp />
            <Toaster />
          </BrowserRouter>
      </LanguageProvider>
    </CurrencyProvider>
    </div>
  );
}

export default App;
