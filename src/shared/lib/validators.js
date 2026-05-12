export function isValidEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(value) {
  const phone = String(value || '').replace(/[^\d]/g, '');
  if (!phone) return false;
  return phone.length >= 10 && phone.length <= 15;
}

export function isValidPincode(value) {
  const pincode = String(value || '').trim();
  if (!/^\d{6}$/.test(pincode)) return false;
  return true;
}

export function isValidDob(value) {
  const raw = String(value || '').trim();
  if (!raw) return false;
  // Expected from <input type="date"> as YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return false;
  const d = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  // Disallow future dates (allow today)
  if (d.getTime() > now.getTime()) return false;
  // Basic sanity lower bound
  const min = new Date('1900-01-01T00:00:00Z');
  if (d.getTime() < min.getTime()) return false;
  return true;
}

export function required(value) {
  return String(value || '').trim().length > 0;
}
