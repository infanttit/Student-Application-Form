import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../../../shared/components/PageShell';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import { requestPasswordReset, resetPassword } from '../../../shared/services/mockApi';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('request'); // request | reset
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canRequest = useMemo(() => login.trim().length > 0, [login]);
  const canReset = useMemo(() => token.trim() && newPassword.length >= 6, [token, newPassword]);

  async function onRequest(e) {
    e.preventDefault();
    if (!canRequest || submitting) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await requestPasswordReset({ login });
      if (!res.ok) {
        setError(res.error || 'Request failed.');
        return;
      }
      setToken(res.token);
      setStep('reset');
      setSuccess('Reset token generated (mock). Set a new password below.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onReset(e) {
    e.preventDefault();
    if (!canReset || submitting) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await resetPassword({ token, newPassword });
      if (!res.ok) {
        setError(res.error || 'Reset failed.');
        return;
      }
      setSuccess('Password updated. You can login now.');
      setTimeout(() => navigate('/login'), 600);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      title="Forgot password"
      subtitle="Get a reset token (mock) and set a new password"
      footer={
        <Link className="underline underline-offset-4 hover:text-slate-900" to="/login">
          Back to login
        </Link>
      }
    >
      <div className="space-y-4">
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div>
        ) : null}
        {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div> : null}

        {step === 'request' ? (
          <form onSubmit={onRequest} className="space-y-4">
            <Input label="Email or Phone" value={login} onChange={setLogin} required placeholder="Enter your registered email/phone" />
            <Button type="submit" disabled={!canRequest || submitting}>
              {submitting ? 'Requesting…' : 'Get reset token'}
            </Button>
          </form>
        ) : (
          <form onSubmit={onReset} className="space-y-4">
            <Input label="Reset token" value={token} onChange={setToken} required />
            <Input label="New password" value={newPassword} onChange={setNewPassword} type="password" required placeholder="Min 6 characters" />
            <Button type="submit" disabled={!canReset || submitting}>
              {submitting ? 'Saving…' : 'Set new password'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setStep('request')}>
              Start over
            </Button>
          </form>
        )}
      </div>
    </PageShell>
  );
}
