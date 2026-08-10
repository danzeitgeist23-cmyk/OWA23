const configuredApiBase = process.env.REACT_APP_API_BASE_URL || '';
const API_BASE = configuredApiBase.replace(/\/+$/, '');

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message = body?.detail || body?.message || 'No se pudo completar la solicitud.';
    throw new Error(message);
  }

  return body;
}
