import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Globe, ChevronDown, MoonStar, SunMedium, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useCurrency } from '../context/CurrencyContext';
import { useT } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Header({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { currencies, currency, setCurrency } = useCurrency();
  const t = useT();

  const navLinks = [
    { name: t('nav.home'), to: '/' },
    { name: t('nav.activities'), to: '/activities' },
    { name: t('nav.destinations'), to: '/destinations' },
    { name: t('nav.blog'), to: '/blog' },
    { name: t('nav.about'), to: '/about' },
    { name: t('nav.contact'), to: '/contact' },
  ];

  const currencyMeta = {
    EUR: { label: 'Euro', symbol: '€' },
    USD: { label: 'US Dollar', symbol: '$' },
    GBP: { label: 'British Pound', symbol: '£' },
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = isHome && !scrolled;
  const solidHeader = transparent ? 'bg-transparent' : 'bg-background/90 backdrop-blur border-b border-border/70 shadow-sm';
  const iconButton = transparent
    ? 'border-white/30 text-white hover:bg-white/10'
    : 'border-border text-foreground hover:bg-muted';
  const navBase = transparent ? 'text-white/90 hover:text-white' : 'text-foreground/80 hover:text-primary';
  const activeNav = transparent ? 'text-white' : 'text-primary';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${solidHeader}`}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/owa-logo-horizontal.webp"
            alt="OWA Wild Adventure"
            className="h-12 md:h-14 w-auto"
          />
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
                    ? activeNav
                    : navBase
                }`}
              >
                {l.name}
                {active && (
                  <span className={`block h-[2px] mt-1 rounded-full ${transparent ? 'bg-white' : 'bg-accent'}`} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors outline-none ${
                  transparent ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-muted'
                }`}
                aria-label="Cambiar moneda"
              >
                <Globe className="w-4 h-4" />
                {currency}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">{t('nav.currency')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {currencies.map((code) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`flex items-center justify-between cursor-pointer ${
                    currency === code ? 'text-primary font-semibold' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {currencyMeta[code].symbol}
                    </span>
                    <span>{code}</span>
                    <span className="text-muted-foreground text-xs">{currencyMeta[code].label}</span>
                  </span>
                  {currency === code && <Check className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t('nav.dayMode') : t('nav.nightMode')}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${iconButton}`}
          >
            {theme === 'dark' ? <SunMedium className="w-4 h-4" /> : <MoonStar className="w-4 h-4" />}
          </button>
          <Link to="/account" className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${iconButton}`} aria-label="Ir a mis reservas">
            <ShoppingBag className="w-4 h-4" />
          </Link>
          <Link to="/login" className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${iconButton}`} aria-label="Acceso de usuario">
            <User className="w-4 h-4" />
          </Link>
          <button
            className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-md transition-colors ${transparent ? 'text-white' : 'text-foreground'}`}
            onClick={() => setOpen(!open)}
            aria-label="menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-background border-t border-border shadow-md">
          <div className="px-5 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-foreground hover:bg-muted font-medium"
              >
                {l.name}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-border">
              <div className="grid grid-cols-2 gap-2 px-3 pb-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-primary text-primary-foreground px-3 py-2.5 text-center text-sm font-semibold"
                >
                  Acceso
                </Link>
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-border px-3 py-2.5 text-center text-sm font-semibold text-foreground"
                >
                  Mi cuenta
                </Link>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <LanguageSelector variant="mobile" />
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="px-3 pb-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('nav.currency')}</div>
              <div className="flex gap-2 px-3">
                {currencies.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
                      currency === code
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-foreground border-border hover:bg-muted'
                    }`}
                  >
                    {currencyMeta[code].symbol} {code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
