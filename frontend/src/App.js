import React, { useEffect } from 'react';
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
import { Toaster } from './components/ui/toaster';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Header />
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
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
