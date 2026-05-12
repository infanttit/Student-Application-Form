import { loadDb, saveDb } from './mockDb';

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizePhone(value) {
  return String(value || '').replace(/[^\d+]/g, '').trim();
}

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function findUserByLogin(db, login) {
  const email = normalizeEmail(login);
  const phone = normalizePhone(login);
  return db.users.find((u) => u.email === email || (phone && u.phone === phone));
}

export async function registerUser({ firstName, lastName, email, phone, password }) {
  await delay();
  const db = loadDb();

  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedEmail && !normalizedPhone) {
    return { ok: false, error: 'Email or phone is required.' };
  }

  if (normalizedEmail && db.users.some((u) => u.email === normalizedEmail)) {
    return { ok: false, error: 'Email already registered.' };
  }
  if (normalizedPhone && db.users.some((u) => u.phone === normalizedPhone)) {
    return { ok: false, error: 'Phone already registered.' };
  }

  const user = {
    id: uid('user'),
    firstName: String(firstName || '').trim(),
    lastName: String(lastName || '').trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    passwordHash: String(password || ''),
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  saveDb(db);

  return { ok: true, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone } };
}

export async function registerStudentApplication(payload) {
  await delay();
  const db = loadDb();

  const firstName = String(payload?.firstName || '').trim();
  const lastName = String(payload?.lastName || '').trim();
  const dob = String(payload?.dob || '').trim();
  const gender = String(payload?.gender || '').trim();
  const email = normalizeEmail(payload?.email);
  const phone = normalizePhone(payload?.phone);
  const password = String(payload?.password || '');

  const address1 = String(payload?.address1 || '').trim();
  const address2 = String(payload?.address2 || '').trim();
  const city = String(payload?.city || '').trim();
  const region = String(payload?.region || '').trim();
  const pincode = String(payload?.pincode || '').trim();
  const panchayat = String(payload?.panchayat || '').trim();
  const state = String(payload?.state || '').trim();

  if (!firstName || !dob || !gender) return { ok: false, error: 'Missing required student details.' };
  if (!email || !phone) return { ok: false, error: 'Email and phone are required.' };
  if (!password) return { ok: false, error: 'Password is required.' };
  if (!address1 || !address2 || !city || !region || !pincode || !panchayat || !state) return { ok: false, error: 'Missing required address details.' };

  if (db.users.some((u) => u.email === email)) return { ok: false, error: 'Email already registered.' };
  if (db.users.some((u) => u.phone === phone)) return { ok: false, error: 'Phone already registered.' };

  const user = {
    id: uid('user'),
    firstName,
    lastName,
    email,
    phone,
    passwordHash: password,
    profile: {
      dob,
      gender,
      address1,
      address2,
      city,
      region,
      pincode,
      panchayat,
      state,
    },
    createdAt: new Date().toISOString(),
  };

  const application = {
    id: uid('app'),
    userId: user.id,
    firstName,
    lastName,
    dob,
    gender,
    email,
    phone,
    password,
    address1,
    address2,
    city,
    region,
    pincode,
    panchayat,
    state,
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  db.applications.push(application);

  const session = { id: uid('session'), userId: user.id, createdAt: new Date().toISOString() };
  db.sessions = [session];

  saveDb(db);

  return {
    ok: true,
    session,
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone },
    application,
  };
}

export async function loginUser({ login, password }) {
  await delay();
  const db = loadDb();
  const user = findUserByLogin(db, login);
  if (!user) return { ok: false, error: 'Invalid credentials.' };
  if (String(user.passwordHash) !== String(password || '')) return { ok: false, error: 'Invalid credentials.' };

  const session = {
    id: uid('session'),
    userId: user.id,
    createdAt: new Date().toISOString(),
  };
  db.sessions = [session];
  saveDb(db);

  return { ok: true, session, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone } };
}

export async function logout() {
  await delay(100);
  const db = loadDb();
  db.sessions = [];
  saveDb(db);
  return { ok: true };
}

export async function getCurrentUser() {
  await delay(120);
  const db = loadDb();
  const session = db.sessions[0];
  if (!session) return { ok: true, user: null };
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) return { ok: true, user: null };
  return { ok: true, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone } };
}

export async function requestPasswordReset({ login }) {
  await delay();
  const db = loadDb();
  const user = findUserByLogin(db, login);
  if (!user) return { ok: false, error: 'User not found.' };

  const token = uid('reset');
  db.passwordResets.push({ id: uid('pr'), userId: user.id, token, createdAt: new Date().toISOString() });
  saveDb(db);
  return { ok: true, token };
}

export async function resetPassword({ token, newPassword }) {
  await delay();
  const db = loadDb();
  const reset = db.passwordResets.find((r) => r.token === token);
  if (!reset) return { ok: false, error: 'Invalid or expired token.' };

  const user = db.users.find((u) => u.id === reset.userId);
  if (!user) return { ok: false, error: 'Invalid token.' };

  user.passwordHash = String(newPassword || '');
  db.passwordResets = db.passwordResets.filter((r) => r.token !== token);
  saveDb(db);
  return { ok: true };
}

// Application creation/listing is handled during registration via `registerStudentApplication` for now.
