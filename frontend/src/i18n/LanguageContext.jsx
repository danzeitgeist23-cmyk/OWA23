import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { translations, LANGUAGES, DEFAULT_LANGUAGE } from './translations';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'owa-lang';

const SUPPORTED = LANGUAGES.map((l) => l.code);

function detectInitialLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  // 1 — ?lang= en la URL gana sobre todo (útil para campañas y QA)
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl && SUPPORTED.includes(fromUrl)) return fromUrl;
  } catch (e) { /* noop */ }

  // 2 — elección previa del usuario
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;
  } catch (e) { /* noop */ }

  // 3 — idioma del navegador
  try {
    const navLangs = navigator.languages || [navigator.language];
    for (const raw of navLangs) {
      const base = String(raw).toLowerCase().split('-')[0];
      // nb / nn / no → noruego
      const code = base === 'nb' || base === 'nn' ? 'no' : base;
      if (SUPPORTED.includes(code)) return code;
    }
  } catch (e) { /* noop */ }

  return DEFAULT_LANGUAGE;
}

/**
 * Devuelve el valor anidado de un objeto a partir de "a.b.c".
 * Si no existe, cae al idioma por defecto. Si tampoco existe,
 * devuelve la propia clave (así los strings faltantes se ven en QA).
 */
function resolve(dict, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), dict);
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLanguage);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* noop */ }
    if (typeof document !== 'undefined') {
      const meta = LANGUAGES.find((l) => l.code === lang);
      document.documentElement.lang = meta ? meta.locale : lang;
    }
  }, [lang]);

  const setLang = useCallback((code) => {
    if (SUPPORTED.includes(code)) setLangState(code);
  }, []);

  /**
   * t('hero.title')
   * t('destinations.activityCount', { count: 5 })  → interpolación {count}
   */
  const t = useCallback(
    (path, vars) => {
      let value = resolve(translations[lang], path);
      if (value === undefined) value = resolve(translations[DEFAULT_LANGUAGE], path);
      if (value === undefined) return path;
      if (typeof value !== 'string' || !vars) return value;
      return Object.keys(vars).reduce(
        (str, key) => str.replace(new RegExp(`\\{${key}\\}`, 'g'), vars[key]),
        value
      );
    },
    [lang]
  );

  const currentLanguage = useMemo(
    () => LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0],
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, languages: LANGUAGES, currentLanguage }),
    [lang, setLang, t, currentLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}

/** Atajo cuando solo necesitas traducir: const t = useT(); */
export function useT() {
  return useLanguage().t;
}

export { LANGUAGES, DEFAULT_LANGUAGE };
