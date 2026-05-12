import { getToken } from './authToken';

const DEFAULT_BASE_URL = 'https://login-info-wphv.onrender.com';

export function getApiBaseUrl() {
  const envUrl = process.env.REACT_APP_API_BASE_URL;
  const raw = String(envUrl || DEFAULT_BASE_URL).trim().replace(/\/+$/, '');
  if (!raw) return DEFAULT_BASE_URL;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

async function safeReadJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function request(path, { method = 'GET', body, headers = {}, auth = false } = {}) {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;

  const finalHeaders = { ...headers };
  if (!finalHeaders['Content-Type'] && body !== undefined) finalHeaders['Content-Type'] = 'application/json';

  if (auth) {
    const token = getToken();
    if (!token) return { ok: false, status: 401, error: 'Not authenticated.', data: null };
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await safeReadJson(res);

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    return { ok: false, status: res.status, error: message, data };
  }

  return { ok: true, status: res.status, data };
}
