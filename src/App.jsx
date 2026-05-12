import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import WelcomePage from './features/auth/pages/WelcomePage';
import { fetchProfile } from './shared/services/authService';
import { getToken } from './shared/services/authToken';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
          <div className="text-sm text-slate-600">Loading…</div>
        </div>
      </div>
    </div>
  );
}

function RequireAuth({ user, loading, children }) {
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    let cancelled = false;
    async function load() {
      setLoading(true);
      const token = getToken();
      if (!token) {
        if (!cancelled) setUser(null);
        if (!cancelled) setLoading(false);
        return;
      }

      const res = await fetchProfile();
      if (!cancelled) setUser(res.ok ? res.data : null);
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage onLoggedIn={(u) => setUser(u)} />} />
      <Route path="/register" element={<RegisterPage onLoggedIn={(u) => setUser(u)} />} />
      <Route path="/forgot" element={<ForgotPasswordPage />} />

      <Route
        path="/welcome"
        element={
          <RequireAuth user={user} loading={loading}>
            <WelcomePage user={user} onLoggedOut={() => setUser(null)} />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
