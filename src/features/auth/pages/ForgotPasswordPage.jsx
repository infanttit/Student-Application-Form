import { Link } from 'react-router-dom';
import PageShell from '../../../shared/components/PageShell';

export default function ForgotPasswordPage() {
  return (
    <PageShell
      title="Forgot password"
      subtitle="This feature is not available yet"
      footer={
        <Link className="underline underline-offset-4 hover:text-slate-900" to="/login">
          Back to login
        </Link>
      }
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        Password reset API is not integrated. Please contact admin/support.
      </div>
    </PageShell>
  );
}

