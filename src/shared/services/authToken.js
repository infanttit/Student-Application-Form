const TOKEN_KEY = 'newindia29_auth_token_v1';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (!token) localStorage.removeItem(TOKEN_KEY);
    else localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore storage failures (private mode etc.)
  }
}

export function clearToken() {
  setToken(null);
}

