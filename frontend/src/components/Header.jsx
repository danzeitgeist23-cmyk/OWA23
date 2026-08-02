import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Globe, ChevronDown, Waves } from 'lucide-react';

const navLinks = [
  { name: 'Inicio', to: '/' },
  { name: 'Actividades', to: '/actividades' },
  { name: 'Destinos', to: '/destinos' },
  { name: 'Blog', to: '/blog' },
  { name: 'Nosotros', to: '/nosotros' },
  { name: 'Contacto', to: '/contacto' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            transparent ? 'bg-white/20 backdrop-blur' : 'bg-[#0b7285]'
          }`}>
            <Waves className={`w-5 h-5 ${transparent ? 'text-white' : 'text-white'}`} strokeWidth={2.5} />
          </div>
          <span className={`font-extrabold text-2xl tracking-tight ${transparent ? 'text-white' : 'text-[#0b7285]'}`}
            style={{ fontFamily: 'Manrope' }}
          >
            OWA
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 text-[15px] font-medium rounded-md transition-all ${
                  active
                    ? transparent
                      ? 'text-white'
                      : 'text-[#0b7285]'
                    : transparent
                    ? 'text-white/90 hover:text-white'
                    : 'text-[#14213d] hover:text-[#0b7285]'
                }`}
              >
                {l.name}
                {active && (
                  <span className={`block h-[2px] mt-1 rounded-full ${transparent ? 'bg-white' : 'bg-[#f4623a]'}`} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button className={`hidden md:flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
            transparent ? 'text-white' : 'text-[#14213d]'
          }`}>
            <Globe className="w-4 h-4" /> EUR <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className={`w-10 h-10 rounded-full flex items-center justify-center border ${
            transparent ? 'border-white/40 text-white hover:bg-white/10' : 'border-[#e5e7eb] text-[#14213d] hover:bg-gray-50'
          } transition-all`}>
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button className={`w-10 h-10 rounded-full flex items-center justify-center border ${
            transparent ? 'border-white/40 text-white hover:bg-white/10' : 'border-[#e5e7eb] text-[#14213d] hover:bg-gray-50'
          } transition-all`}>
            <User className="w-4 h-4" />
          </button>
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md"
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            {open ? <X className={transparent ? 'text-white' : 'text-[#14213d]'} /> : <Menu className={transparent ? 'text-white' : 'text-[#14213d]'} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-md">
          <div className="px-5 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-[#14213d] hover:bg-gray-50 font-medium"
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
