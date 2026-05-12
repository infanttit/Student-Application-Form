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

export function required(value) {
  return String(value || '').trim().length > 0;
}
