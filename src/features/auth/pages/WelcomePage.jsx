import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../../../shared/components/PageShell';
import Button from '../../../shared/components/Button';
import { logout } from '../../../shared/services/authApi';

export default function WelcomePage({ user, onLoggedOut }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function doLogout() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await logout();
      onLoggedOut?.();
      navigate('/login', { replace: true });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      title={`Welcome, ${user?.firstName || ''}`.trim()}
      subtitle="Your account is ready."
      footer={<span className="text-slate-500">You are securely logged in.</span>}
    >
      <div className="space-y-3">
        <Button type="button" variant="secondary" onClick={doLogout} disabled={submitting}>
          Logout
        </Button>
      </div>
    </PageShell>
  );
}
