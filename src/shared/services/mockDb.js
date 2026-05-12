const STORAGE_KEY = 'app_mock_db_v1';

function defaultDb() {
  return {
    users: [],
    sessions: [],
    applications: [],
    passwordResets: [],
  };
}

export function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultDb();
    const parsed = JSON.parse(raw);
    return { ...defaultDb(), ...parsed };
  } catch {
    return defaultDb();
  }
}

export function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function resetDb() {
  localStorage.removeItem(STORAGE_KEY);
}
