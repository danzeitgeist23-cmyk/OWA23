import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Selector de idioma OWA.
 * Colócalo junto al selector de moneda en Header.jsx:
 *
 *   <LanguageSelector />
 *   <CurrencySelector />      // el que ya tienes (EUR)
 *
 * Props:
 *   variant="header"  → estilo por defecto, para la barra superior
 *   variant="mobile"  → ancho completo, para el menú desplegable móvil
 */
export default function LanguageSelector({ variant = 'header', className = '' }) {
  const { lang, setLang, languages, currentLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isMobile = variant === 'mobile';

  return (
    <div ref={ref} className={`relative ${isMobile ? 'w-full' : ''} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className={`inline-flex items-center gap-1.5 rounded-full border border-border
                    bg-background/60 px-3 py-1.5 text-sm font-medium text-foreground
                    transition-colors hover:bg-muted
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                    ${isMobile ? 'w-full justify-between' : ''}`}
      >
        <span className="flex items-center gap-1.5">
          <Globe className="h-4 w-4 opacity-70" aria-hidden="true" />
          <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Languages"
          className={`absolute z-50 mt-2 overflow-hidden rounded-xl border border-border
                      bg-popover text-popover-foreground shadow-lg
                      ${isMobile ? 'left-0 right-0 w-full' : 'right-0 w-48'}`}
        >
          {languages.map((l) => {
            const active = l.code === lang;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm
                              transition-colors hover:bg-muted
                              ${active ? 'font-semibold text-primary' : 'text-foreground'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span aria-hidden="true">{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                  {active && <Check className="h-4 w-4" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
