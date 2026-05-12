import * as real from './authApi';
import * as mock from './mockApi';
import { clearToken, getToken, setToken } from './authToken';

function mode() {
  const m = String(process.env.REACT_APP_AUTH_MODE || 'mock').toLowerCase();
  return m === 'real' ? 'real' : 'mock';
}

export async function register(payload) {
  if (mode() === 'real') return real.register(payload);
  // mockApi expects the full payload too
  return mock.registerStudentApplication(payload);
}

export async function login({ email, password }) {
  if (mode() === 'real') return real.login({ email, password });
  // mockApi login expects { login, password }
  const res = await mock.loginUser({ login: email, password });
  // create a fake token so profile checks behave consistently
  if (res.ok) setToken('mock');
  return { ok: res.ok, status: res.ok ? 200 : 400, data: res.ok ? { token: 'mock', user: res.user } : null, error: res.ok ? null : res.error };
}

export async function fetchProfile() {
  if (mode() === 'real') return real.fetchProfile();
  const token = getToken();
  if (!token) return { ok: false, status: 401, error: 'Not authenticated.', data: null };
  const res = await mock.getCurrentUser();
  if (!res.ok) return { ok: false, status: 500, error: 'Failed to load profile.', data: null };
  return { ok: true, status: 200, data: res.user };
}

export function logout() {
  if (mode() === 'real') return real.logout();
  clearToken();
}

