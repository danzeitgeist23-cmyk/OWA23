const configuredApiBase = process.env.REACT_APP_API_BASE_URL || '';
const API_BASE = configuredApiBase.replace(/\/+$/, '');

// True only when a real backend base URL is configured. When false (e.g. the
// static SiteGround build with no backend yet) the data hooks fall back to the
// bundled static content, so the site keeps working without an API.
export const apiEnabled = Boolean(API_BASE);
const AUTH_STORAGE_KEY = 'owa-auth-session';
const SESSION_EVENT = 'owa-auth-session-changed';

function buildUrl(path, query) {
  const requestUrl = new URL(API_BASE ? `${API_BASE}${path}` : path, window.location.origin);

  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        requestUrl.searchParams.set(key, String(value));
      }
    });
  }

  if (/^https?:\/\//i.test(requestUrl.href) && requestUrl.origin !== window.location.origin) {
    return requestUrl.toString();
  }

  return `${requestUrl.pathname}${requestUrl.search}`;
}

function readStoredSession() {
  if (typeof window === 'undefined') {
    return { token: '', user: null };
  }

  try {
    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawSession) {
      return { token: '', user: null };
    }

    const parsedSession = JSON.parse(rawSession);
    return {
      token: parsedSession?.token || '',
      user: parsedSession?.user || null,
    };
  } catch {
    return { token: '', user: null };
  }
}

function writeStoredSession(nextSession) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
  window.dispatchEvent(new Event(SESSION_EVENT));
}

function removeStoredSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

function getAuthToken() {
  return readStoredSession().token;
}

export function getAuthSession() {
  return readStoredSession();
}

export function hasAuthSession() {
  return Boolean(getAuthToken());
}

export function saveAuthSession(session) {
  const nextSession = {
    token: session?.token || '',
    user: session?.user || null,
  };

  writeStoredSession(nextSession);
  return nextSession;
}

export function clearAuthSession() {
  removeStoredSession();
}

export function getSessionEventName() {
  return SESSION_EVENT;
}

export async function apiRequest(path, options = {}) {
  const { auth = false, headers, query, ...requestOptions } = options;
  const requestHeaders = { ...(headers || {}) };
  const isFormData = typeof FormData !== 'undefined' && requestOptions.body instanceof FormData;

  if (!isFormData && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(buildUrl(path, query), {
    ...requestOptions,
    headers: requestHeaders,
  });

  const responseType = response.headers.get('content-type') || '';
  let body = null;

  if (response.status !== 204) {
    try {
      body = responseType.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const message = body?.detail || body?.message || body || 'No se pudo completar la solicitud.';
    const error = new Error(message);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}
