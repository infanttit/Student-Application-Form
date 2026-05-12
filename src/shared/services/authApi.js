import { clearToken, setToken } from './authToken';
import { request } from './httpClient';

export async function register(payload) {
  const res = await request('/api/auth/register', { method: 'POST', body: payload });
  return res;
}

export async function login({ email, password }) {
  const res = await request('/api/auth/login', { method: 'POST', body: { email: String(email || '').trim().toLowerCase(), password: String(password || '') } });
  if (!res.ok) return res;

  const token = res.data?.token;
  if (token) setToken(token);
  return res;
}

export async function fetchProfile() {
  const res = await request('/api/auth/profile', { method: 'GET', auth: true });
  if (!res.ok && res.status === 401) clearToken();
  return res;
}

export function logout() {
  clearToken();
}
