// SEO/marketing landing categories (marketplace theme pages). Each maps a URL
// slug to a title, intro and a matcher over the activity list (keyword-based so
// it works with the existing data without new fields). Also resolves our
// internal category ids (nauticas, buceo, ...) as a fallback.
import { categories as internalCategories } from '../mock';

export const SEO_CATEGORIES = {
  'jet-ski': {
    title: 'Motos de agua y jet ski en Canarias',
    intro: 'Adrenalina sobre el agua: rutas guiadas en moto de agua por la costa canaria.',
    match: (a) => /jet\s?ski|moto de agua/i.test(a.title || ''),
  },
  buceo: {
    title: 'Buceo y snorkel en Canarias',
    intro: 'Descubre los fondos volcánicos: bautizos de buceo, cursos y snorkel guiado.',
    match: (a) => a.category === 'buceo' || /buceo|snorkel|dive|scuba/i.test(a.title || ''),
  },
  buggy: {
    title: 'Excursiones en buggy en Canarias',
    intro: 'Aventura off-road por barrancos, cañones y paisajes volcánicos.',
    match: (a) => /buggy/i.test(a.title || ''),
  },
  delfines: {
    title: 'Avistamiento de delfines y ballenas en Canarias',
    intro: 'Sal a mar abierto a ver cetáceos en su hábitat natural con guía experto.',
    match: (a) => /delf|ballena|cet[aá]ceo|whale|dolphin|ocean giants|wildlife/i.test(a.title || ''),
  },
  barco: {
    title: 'Excursiones en barco y catamarán en Canarias',
    intro: 'Cruceros, catamaranes y yates para vivir el Atlántico desde el agua.',
    match: (a) => /barco|catamar|yate|crucero|boat|sail|vela|cruise/i.test(a.title || ''),
  },
  familias: {
    title: 'Actividades para familias en Canarias',
    intro: 'Experiencias seguras y para todos los públicos, pensadas para disfrutar en familia.',
    match: (a) => /familia|delf|ballena|barco|catamar|snorkel|kayak|paddle|water taxi|lobos/i.test(a.title || ''),
  },
};

// Quick-links shown on the home. slug -> label.
export const CATEGORY_QUICK_LINKS = [
  { slug: 'barco', label: 'Barco' },
  { slug: 'delfines', label: 'Delfines' },
  { slug: 'jet-ski', label: 'Jet ski' },
  { slug: 'buggy', label: 'Buggy' },
  { slug: 'buceo', label: 'Buceo' },
  { slug: 'familias', label: 'Familias' },
];

// Resolve a URL slug (accepts an optional "-canarias" suffix and our internal
// category ids) to { title, intro, match }.
export function resolveCategory(rawSlug) {
  if (!rawSlug) return null;
  const slug = rawSlug.replace(/-canarias$/, '');
  if (SEO_CATEGORIES[slug]) return SEO_CATEGORIES[slug];
  const internal = internalCategories.find((c) => c.id === slug);
  if (internal) {
    return {
      title: `${internal.name} en Canarias`,
      intro: `Todas nuestras experiencias de ${internal.name.toLowerCase()} en las Islas Canarias.`,
      match: (a) => a.category === slug,
    };
  }
  return null;
}
