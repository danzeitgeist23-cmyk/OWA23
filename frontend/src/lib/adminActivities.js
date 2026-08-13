import { apiRequest, apiEnabled } from './api';
import { activities as staticActivities, destinations as staticDestinations } from '../siteData';

// Admin data layer for activities. Reads fall back to the bundled static
// content when there is no backend configured (so the panel still renders a
// read-only preview); writes require the backend + an admin session.

export { apiEnabled };

export async function fetchAdminActivities() {
  if (!apiEnabled) {
    return { items: staticActivities, total: staticActivities.length, source: 'static' };
  }
  const res = await apiRequest('/api/activities', { query: { limit: 200 } });
  return { items: res.items || [], total: res.total || 0, source: 'api' };
}

export function fetchAdminDestinations() {
  return staticDestinations.map((d) => ({ slug: d.id, name: d.name }));
}

// Build the ActivityUpsert body the backend expects (i18n {es,en}).
export function toActivityPayload(form) {
  const i18n = (es, en) => ({ es: es || '', en: en || es || '' });
  return {
    slug: form.slug.trim(),
    title: i18n(form.title_es, form.title_en),
    excerpt: i18n(form.excerpt_es, form.excerpt_en),
    description: i18n(form.description_es, form.description_en),
    island: form.island,
    location: form.location || '',
    category: form.category,
    duration: form.duration || '',
    price: Number(form.price) || 0,
    original_price: form.original_price ? Number(form.original_price) : null,
    price_unit: form.price_unit || 'persona',
    currency: 'EUR',
    image: form.image || '',
    gallery: form.image ? [form.image] : [],
    featured: Boolean(form.featured),
    booking_enabled: Boolean(form.booking_enabled),
    active: true,
  };
}

export function createActivity(payload) {
  return apiRequest('/api/admin/activities', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function updateActivity(slug, payload) {
  return apiRequest(`/api/admin/activities/${slug}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function deleteActivity(slug) {
  return apiRequest(`/api/admin/activities/${slug}`, {
    method: 'DELETE',
    auth: true,
  });
}
