import { useQuery } from '@tanstack/react-query';
import { apiRequest, apiEnabled } from '../lib/api';
import { useLanguage } from '../i18n/LanguageContext';
import {
  activities as staticActivities,
  destinations as staticDestinations,
} from '../siteData';

// --- Static fallbacks that mirror the API response shapes ---------------------
// Used whenever no backend is configured (apiEnabled === false) so the site
// keeps working from the bundled content exactly like before Checkpoint F.

function filterStatic(filters = {}) {
  let list = [...staticActivities];
  if (filters.island) list = list.filter((a) => a.destination === filters.island);
  if (filters.category) list = list.filter((a) => a.category === filters.category);
  if (filters.featured != null) {
    list = list.filter((a) => Boolean(a.featured) === Boolean(filters.featured));
  }
  if (filters.q) {
    const q = String(filters.q).toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) || (a.location || '').toLowerCase().includes(q)
    );
  }
  const total = list.length;
  const skip = filters.skip || 0;
  if (filters.limit) list = list.slice(skip, skip + filters.limit);
  return { items: list, total };
}

function staticDestinationList() {
  return staticDestinations.map((d) => ({
    ...d,
    slug: d.id,
    activity_count: staticActivities.filter((a) => a.destination === d.id).length,
  }));
}

const STATIC_RESULT = { isLoading: false, isError: false, error: null, isFetching: false };

// --- Hooks -------------------------------------------------------------------
// useQuery is always called (Rules of Hooks) but stays disabled when there is no
// backend; in that case we return the static shape instead of the query result.

export function useActivities(filters = {}) {
  const { lang } = useLanguage();
  const params = { ...filters, ...(apiEnabled ? { lang } : {}) };
  const query = useQuery({
    queryKey: ['activities', params],
    queryFn: () => apiRequest('/api/activities', { query: params }),
    enabled: apiEnabled,
    staleTime: 5 * 60 * 1000,
  });
  if (!apiEnabled) return { ...STATIC_RESULT, data: filterStatic(filters) };
  return query;
}

export function useActivity(slug) {
  const { lang } = useLanguage();
  const query = useQuery({
    queryKey: ['activity', slug, lang],
    queryFn: () => apiRequest(`/api/activities/${slug}`, { query: { lang } }),
    enabled: apiEnabled && Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
  if (!apiEnabled) {
    const found = staticActivities.find((a) => a.id === slug) || null;
    return { ...STATIC_RESULT, data: found };
  }
  return query;
}

export function useDestinations() {
  const { lang } = useLanguage();
  const query = useQuery({
    queryKey: ['destinations', lang],
    queryFn: () => apiRequest('/api/destinations', { query: { lang } }),
    enabled: apiEnabled,
    staleTime: 10 * 60 * 1000,
  });
  if (!apiEnabled) return { ...STATIC_RESULT, data: staticDestinationList() };
  return query;
}
