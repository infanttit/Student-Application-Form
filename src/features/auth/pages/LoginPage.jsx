import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineAcademicCap,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineUserAdd,
  HiArrowRight,
} from 'react-icons/hi';
import { MdLogin } from 'react-icons/md';
import Bgimage from '../../../Assets/Images/Bgimage.png';
import { loginUser } from '../../../shared/services/mockApi';

export default function LoginPage({ onLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [login,      setLogin]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  const isPhone   = /^\d+$/.test(login) && login.length > 0;
  const canSubmit = useMemo(() => login.trim() && password, [login, password]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await loginUser({ login, password });
      if (!res.ok) { setError(res.error || 'Invalid credentials.'); return; }
      onLoggedIn?.(res.user);
      navigate(location.state?.redirectTo || '/welcome');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${Bgimage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-indigo-950/60 to-slate-900/80 backdrop-blur-[2px]" />

      {/* floating blobs */}
      <div className="absolute top-16 left-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

      {/* card */}
      <div className="relative z-10 w-full max-w-md mx-4">

        {/* logo badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <HiOutlineAcademicCap className="text-white text-xl" />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-base tracking-tight leading-none">EduPortal</p>
              <p className="text-indigo-300 text-[10px] tracking-widest uppercase mt-0.5">Student Gateway</p>
            </div>
          </div>
        </div>

        {/* glass card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">

          {/* card top strip */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-5 text-center">
            <h1 className="text-white text-xl font-bold tracking-tight">Student Login</h1>
            <p className="text-indigo-200 text-sm mt-0.5">Sign in to continue</p>
          </div>

          <div className="px-8 py-7">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* email / phone */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest mb-1.5">
                  {isPhone ? 'Phone number' : 'Email address'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 text-lg pointer-events-none">
                    {isPhone ? <HiOutlinePhone /> : <HiOutlineMail />}
                  </span>
                  <input
                    type="text"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                    placeholder="student@example.com or 9876543210"
                    autoComplete="username"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/95 border border-white/30 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/60 transition"
                  />
                </div>
              </div>

              {/* password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-widest">
                    Password
                  </label>
                  <Link to="/forgot" className="text-xs text-indigo-300 hover:text-indigo-200 font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 text-lg pointer-events-none">
                    <HiOutlineLockClosed />
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-11 py-3 bg-white/95 border border-white/30 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/60 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-700 hover:text-slate-900 text-lg transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              {/* error */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-sm text-red-200">
                  <HiOutlineExclamationCircle className="text-red-400 flex-shrink-0 text-base" />
                  {error}
                </div>
              )}

              {/* submit */}
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 active:scale-[0.98] mt-1"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <MdLogin className="text-lg" />
                    Sign in to portal
                  </>
                )}
              </button>

              {/* register link (match register page style) */}
              <p className="text-center text-white/40 text-xs mt-2">
                New student?{' '}
                <Link to="/register" className="text-indigo-300 hover:text-indigo-200 font-semibold transition-colors">
                  Create a new account →
                </Link>
              </p>

            </form>

            {/* security note */}
            <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/10">
              <HiOutlineShieldCheck className="text-indigo-300 text-base flex-shrink-0" />
              <p className="text-white/40 text-[11px]">256-bit encrypted · Your data is always secure</p>
            </div>
          </div>
        </div>

        {/* footer links */}
        <div className="flex justify-center items-center gap-4 mt-5">
          {['Terms', 'Privacy', 'Help'].map((label, i) => (
            <span key={label} className="flex items-center gap-4">
              {i > 0 && <span className="text-white/20 text-xs">·</span>}
              <Link to={`/${label.toLowerCase()}`} className="text-xs text-white/40 hover:text-white/70 transition-colors">
                {label}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

