import { apiRequest, clearAuthSession, getAuthSession, saveAuthSession } from './api';

const endpointConfig = {
  login: process.env.REACT_APP_AUTH_LOGIN_PATH || '/api/auth/login',
  register: process.env.REACT_APP_AUTH_REGISTER_PATH || '/api/auth/register',
  me: process.env.REACT_APP_AUTH_ME_PATH || '/api/auth/me',
  bookings: process.env.REACT_APP_USER_BOOKINGS_PATH || '/api/me/bookings',
  media: process.env.REACT_APP_ADMIN_MEDIA_PATH || '/api/media-assets',
};

const demoMediaLibrary = [
  {
    id: 'infinity-hero',
    title: 'Infinity Boat hero',
    alt: 'Infinity boat excursion in Gran Canaria',
    category: 'hero',
    status: 'published',
    url: 'https://le-de.cdn-website.com/bd7c7dbfb3634a51960e66fc0b4e067e/dms3rep/multi/opt/1721429080978-bfc7cefb-1920w.jpg',
    thumb: 'https://le-de.cdn-website.com/bd7c7dbfb3634a51960e66fc0b4e067e/dms3rep/multi/opt/1721429080978-bfc7cefb-640w.jpg',
    width: 1920,
    height: 1080,
    updated_at: '2026-08-11T00:30:00Z',
    tags: ['gran-canaria', 'boat', 'hero'],
  },
  {
    id: 'buggy-pirates',
    title: 'Buggy Pirates',
    alt: 'Buggy tour image from Buggy Pirates',
    category: 'activities',
    status: 'published',
    url: 'https://buggypirates.com/wp-content/uploads/2025/10/cf1e1c50-387b-4a8a-9ae0-feacd14d3a9d.jpg',
    thumb: 'https://buggypirates.com/wp-content/uploads/2025/10/cf1e1c50-387b-4a8a-9ae0-feacd14d3a9d.jpg',
    width: 1600,
    height: 900,
    updated_at: '2026-08-11T00:31:00Z',
    tags: ['buggy', 'gran-canaria', 'adventure'],
  },
  {
    id: 'jet-ski-maspalomas',
    title: 'Maspalomas Jet Ski',
    alt: 'Jet ski activity image from Maspalomas Jet Ski Tour',
    category: 'activities',
    status: 'published',
    url: 'https://maspalomasjetskitour.es/wp-content/uploads/2026/05/2026_014-scaled.webp',
    thumb: 'https://maspalomasjetskitour.es/wp-content/uploads/2026/05/2026_014-scaled.webp',
    width: 1600,
    height: 900,
    updated_at: '2026-08-11T00:32:00Z',
    tags: ['jet-ski', 'maspalomas', 'water-sports'],
  },
  {
    id: 'zeus-dive',
    title: 'Zeus Dive Center',
    alt: 'Scuba diving experience image from Zeus Dive Center',
    category: 'activities',
    status: 'published',
    url: 'https://zeusdivecenter.com/wp-content/uploads/2026/02/grancanaria-snorkel-trydive-scubadive-duiken-schnuppertauchen-dive-tauchen-maspalomas4.png',
    thumb: 'https://zeusdivecenter.com/wp-content/uploads/2026/02/grancanaria-snorkel-trydive-scubadive-duiken-schnuppertauchen-dive-tauchen-maspalomas4.png',
    width: 1400,
    height: 900,
    updated_at: '2026-08-11T00:33:00Z',
    tags: ['diving', 'snorkel', 'gran-canaria'],
  },
  {
    id: 'obycat-sailing',
    title: 'OBYCAT sailing',
    alt: 'Catamaran sailing image from Obycat',
    category: 'activities',
    status: 'published',
    url: 'https://www.obycat.com/wp-content/uploads/2026/05/01-hero-2-scaled-1.jpg',
    thumb: 'https://www.obycat.com/wp-content/uploads/2026/05/01-hero-2-scaled-1.jpg',
    width: 1600,
    height: 900,
    updated_at: '2026-08-11T00:34:00Z',
    tags: ['catamaran', 'sunset', 'tenerife'],
  },
  {
    id: 'luis-molina',
    title: 'Water Sports Luis Molina',
    alt: 'Watersports image from Luis Molina',
    category: 'activities',
    status: 'published',
    url: 'https://www.watersportsluismolina.com/wp-content/uploads/2016/06/slider1_nuevo.jpg',
    thumb: 'https://www.watersportsluismolina.com/wp-content/uploads/2016/06/slider1_nuevo.jpg',
    width: 1400,
    height: 800,
    updated_at: '2026-08-11T00:35:00Z',
    tags: ['watersports', 'parasailing', 'banana-boat'],
  },
];

function pickFirstObject(...candidates) {
  return candidates.find((candidate) => candidate && typeof candidate === 'object' && !Array.isArray(candidate)) || null;
}

function normaliseUser(payload) {
  const source = pickFirstObject(payload?.user, payload?.data?.user, payload?.profile, payload?.data, payload);
  if (!source) {
    return null;
  }

  return {
    id: source.id || source.user_id || source.uuid || 'current-user',
    name: source.name || source.full_name || source.first_name || 'Usuario OWA',
    email: source.email || '',
    phone: source.phone || source.mobile || '',
    role: source.role || source.account_type || 'customer',
    company: source.company || source.organization || '',
  };
}

function extractToken(payload) {
  return (
    payload?.token ||
    payload?.access_token ||
    payload?.authToken ||
    payload?.data?.token ||
    payload?.data?.access_token ||
    ''
  );
}

function persistSession(payload) {
  const session = saveAuthSession({
    token: extractToken(payload),
    user: normaliseUser(payload),
  });

  return {
    token: session.token,
    user: session.user,
    raw: payload,
  };
}

function normaliseBookings(payload) {
  const rawItems = Array.isArray(payload)
    ? payload
    : payload?.items || payload?.results || payload?.bookings || payload?.data || [];

  return rawItems.map((item, index) => ({
    id: item.id || item.booking_id || item.reference || `booking-${index + 1}`,
    title: item.activity_title || item.title || item.activity?.title || 'Reserva OWA',
    status: item.status || 'pending',
    date: item.service_date || item.date || item.start_date || '',
    time: item.time_slot || item.time || '',
    guests: item.guests || item.seats || item.quantity || item.participants || 0,
    amount: Number(item.amount || item.total || item.price || 0),
    image: item.image || item.cover || item.activity?.image || '',
    location: item.location || item.activity?.location || '',
  }));
}

function normaliseMedia(payload) {
  const rawItems = Array.isArray(payload)
    ? payload
    : payload?.items || payload?.results || payload?.assets || payload?.data || [];

  return rawItems.map((item, index) => ({
    id: item.id || item.asset_id || item.slug || `asset-${index + 1}`,
    title: item.title || item.name || item.filename || `Asset ${index + 1}`,
    alt: item.alt || item.alt_text || '',
    category: item.category || item.collection || 'library',
    status: item.status || 'published',
    url: item.url || item.src || item.original_url || '',
    thumb: item.thumb || item.thumbnail_url || item.preview_url || item.url || item.src || '',
    width: Number(item.width || 0),
    height: Number(item.height || 0),
    updated_at: item.updated_at || item.updatedAt || item.created_at || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
  }));
}

function isPendingEndpoint(error) {
  return error?.status === 404 || error?.status === 405 || error?.status === 501;
}

export function getPortalEndpoints() {
  return endpointConfig;
}

export function getCurrentSession() {
  return getAuthSession();
}

export async function loginUser(credentials) {
  const payload = await apiRequest(endpointConfig.login, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  return persistSession(payload);
}

export async function registerUser(accountData) {
  const registrationPayload = {
    email: accountData.email,
    password: accountData.password,
    phone: accountData.phone,
    full_name: accountData.name,
  };

  const payload = await apiRequest(endpointConfig.register, {
    method: 'POST',
    body: JSON.stringify(registrationPayload),
  });

  return persistSession(payload);
}

export async function fetchCurrentUser() {
  const payload = await apiRequest(endpointConfig.me, { auth: true });
  const user = normaliseUser(payload);

  if (user) {
    saveAuthSession({
      token: getAuthSession().token,
      user,
    });
  }

  return user;
}

export async function fetchMyBookings() {
  const payload = await apiRequest(endpointConfig.bookings, { auth: true });
  return normaliseBookings(payload);
}

export async function fetchMediaLibrary() {
  try {
    const payload = await apiRequest(endpointConfig.media, { auth: true });
    return {
      items: normaliseMedia(payload),
      source: 'api',
    };
  } catch (error) {
    if (isPendingEndpoint(error)) {
      return {
        items: demoMediaLibrary,
        source: 'demo',
      };
    }

    throw error;
  }
}

export async function createMediaAsset(input) {
  const { file, ...fields } = input;
  const payload = {
    title: fields.title,
    url: fields.source_url,
    kind: fields.category || 'library',
    alt_text: fields.alt || '',
    tags: fields.category ? [fields.category] : [],
    metadata: {
      source: 'remote',
      submitted_via: 'admin-media',
    },
  };

  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    });

    return apiRequest(endpointConfig.media, {
      method: 'POST',
      body: formData,
      auth: true,
    });
  }

  return apiRequest(endpointConfig.media, {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: true,
  });
}

export async function updateMediaAsset(assetId, fields) {
  const payload = {
    ...(fields.title ? { title: fields.title } : {}),
    ...(fields.source_url ? { url: fields.source_url } : {}),
    ...(fields.category ? { kind: fields.category } : {}),
    ...(fields.alt ? { alt_text: fields.alt } : {}),
    ...(fields.featured !== undefined ? { metadata: { featured: Boolean(fields.featured) } } : {}),
  };

  return apiRequest(`${endpointConfig.media}/${encodeURIComponent(assetId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    auth: true,
  });
}

export function logoutUser() {
  clearAuthSession();
}
