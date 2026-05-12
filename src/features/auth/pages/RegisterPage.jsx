import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineAcademicCap,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlineLocationMarker,
  HiOutlineMap,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiArrowRight,
  HiArrowLeft,
  HiOutlineBadgeCheck,
  HiOutlineOfficeBuilding,
  HiOutlineIdentification,
} from 'react-icons/hi';
import { MdHowToReg } from 'react-icons/md';
import Bgimage from '../../../Assets/Images/Bgimage.png';
import { isValidEmail, isValidPhone, required } from '../../../shared/lib/validators';
import { registerStudentApplication } from '../../../shared/services/mockApi';

/* -- Strength helpers -- */
function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 6)  s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  return s;
}
const S_COLORS = ['bg-red-400', 'bg-amber-400', 'bg-indigo-400', 'bg-emerald-400'];
const S_TEXT   = ['text-red-300', 'text-amber-300', 'text-indigo-300', 'text-emerald-300'];
const S_LABELS = ['Weak', 'Fair', 'Good', 'Strong'];

const STEPS = [
  { label: 'Personal', icon: HiOutlineUser,            desc: 'Basic info' },
  { label: 'Address',  icon: HiOutlineHome,            desc: 'Location' },
  { label: 'Account',  icon: HiOutlineLockClosed,      desc: 'Password' },
];

/* -- Sub-components -- */
function GlassInput({ icon: Icon, value, onChange, placeholder, type = 'text', autoComplete, required: req, className = '' }) {
  return (
    <div className="relative">
      {Icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 text-lg pointer-events-none">
          <Icon />
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={req}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-white/95 border border-white/30 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/50 transition ${className}`}
      />
    </div>
  );
}

function GlassPasswordInput({ value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 text-lg pointer-events-none">
        <HiOutlineLockClosed />
      </span>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full pl-10 pr-11 py-2.5 bg-white/95 border border-white/30 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/50 transition"
      />
      <button
        type="button"
        onClick={() => setShow(p => !p)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-700 hover:text-slate-900 text-lg transition-colors"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <HiOutlineEyeOff /> : <HiOutlineEye />}
      </button>
    </div>
  );
}

function FieldWrap({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 mt-1 text-xs text-red-300">
          <HiOutlineExclamationCircle className="text-sm flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* -- Main component -- */
export default function RegisterPage({ onLoggedIn }) {
  const navigate = useNavigate();

  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState({
    firstName: '', lastName: '', dob: '', gender: 'MALE',
    email: '', phone: '',
    address1: '', address2: '', city: '', region: '',
    pincode: '', panchayat: '', state: '',
    password: '', confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');

  function update(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
    setFieldErrors(prev => ({ ...prev, [key]: '' }));
  }

  function validateStep(n) {
    const e = {};
    if (n === 0) {
      if (!required(form.firstName))    e.firstName = 'Required';
      if (!required(form.lastName))     e.lastName  = 'Required';
      if (!required(form.dob))          e.dob       = 'Required';
      if (!isValidEmail(form.email))    e.email     = 'Enter a valid email';
      if (!isValidPhone(form.phone))    e.phone     = 'Enter a valid phone number';
    }
    if (n === 1) {
      if (!required(form.address1))  e.address1  = 'Required';
      if (!required(form.address2))  e.address2  = 'Required';
      if (!required(form.city))      e.city      = 'Required';
      if (!required(form.region))    e.region    = 'Required';
      if (!required(form.pincode))   e.pincode   = 'Required';
      if (!required(form.panchayat)) e.panchayat = 'Required';
      if (!required(form.state))     e.state     = 'Required';
    }
    if (n === 2) {
      if (!required(form.password))                e.password        = 'Required';
      if (form.password.length < 6)                e.password        = 'Minimum 6 characters';
      if (form.confirmPassword !== form.password)  e.confirmPassword = 'Passwords do not match';
    }
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (validateStep(step)) setStep(s => s + 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep(2) || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await registerStudentApplication({ ...form });
      if (!res.ok) { setError(res.error || 'Registration failed.'); return; }
      onLoggedIn?.(res.user);
      setSuccess('Registration complete! Redirecting…');
      setTimeout(() => navigate('/welcome'), 800);
    } finally {
      setSubmitting(false);
    }
  }

  const pwStrength = useMemo(() => getStrength(form.password), [form.password]);
  const progress   = ((step + 1) / STEPS.length) * 100;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative py-10"
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
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-4">

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

          {/* top strip */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 text-center">
                <h1 className="text-white text-xl font-bold tracking-tight">Student Registration</h1>
                <p className="text-indigo-200 text-sm mt-0.5">Create your account and submit your application</p>
              </div>
              <div className="hidden sm:flex items-center gap-1 bg-white/15 rounded-xl px-3 py-1.5">
                <HiOutlineIdentification className="text-white text-base" />
                <span className="text-white text-xs font-medium">Step {step + 1}/{STEPS.length}</span>
              </div>
            </div>

            {/* step indicators */}
            <div className="flex items-center gap-2 mt-5">
              {STEPS.map((s, i) => {
                const done    = i < step;
                const current = i === step;
                return (
                  <div key={s.label} className="flex items-center gap-2 flex-1 last:flex-none">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                      done    ? 'bg-white/25 text-white' :
                      current ? 'bg-white text-indigo-700 shadow-md' :
                                'bg-white/10 text-white/50'
                    }`}>
                      {done
                        ? <HiOutlineBadgeCheck className="text-sm" />
                        : <s.icon className="text-sm" />
                      }
                      <span className="hidden sm:block">{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-px transition-all duration-500 ${done ? 'bg-white/50' : 'bg-white/15'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* progress bar */}
            <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* form body */}
          <div className="px-8 py-7">

            {/* section heading */}
            <div className="mb-6">
              <h2 className="text-white text-lg font-bold tracking-tight">
                {step === 0 && 'Personal Details'}
                {step === 1 && 'Address Details'}
                {step === 2 && 'Account Setup'}
              </h2>
              <p className="text-white/50 text-sm mt-0.5">
                {step === 0 && 'Tell us about yourself'}
                {step === 1 && 'Where are you currently located?'}
                {step === 2 && 'Secure your student account with a strong password'}
              </p>
            </div>

            {/* alerts */}
            {success && (
              <div className="flex items-center gap-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-xl px-4 py-3 text-sm text-emerald-200 mb-5">
                <HiOutlineCheckCircle className="text-emerald-400 flex-shrink-0" />
                {success}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-sm text-red-200 mb-5">
                <HiOutlineExclamationCircle className="text-red-400 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* -- STEP 0: Personal -- */}
              {step === 0 && (
                <div className="space-y-4">
                  {/* student name */}
                  <div>
                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="flex-1 h-px bg-white/10" />
                      Student Name
                      <span className="flex-1 h-px bg-white/10" />
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FieldWrap label="First name" error={fieldErrors.firstName}>
                        <GlassInput icon={HiOutlineUser} value={form.firstName} onChange={v => update('firstName', v)} placeholder="First name" req />
                      </FieldWrap>
                      <FieldWrap label="Last name" error={fieldErrors.lastName}>
                        <GlassInput icon={HiOutlineUser} value={form.lastName} onChange={v => update('lastName', v)} placeholder="Last name" req />
                      </FieldWrap>
                    </div>
                  </div>

                  {/* dob + gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FieldWrap label="Date of birth" error={fieldErrors.dob}>
                      <GlassInput icon={HiOutlineCalendar} type="date" value={form.dob} onChange={v => update('dob', v)} req />
                    </FieldWrap>
                    <FieldWrap label="Gender">
                      <div className="flex gap-2">
                        {['MALE', 'FEMALE', 'OTHER'].map(g => (
                          <label
                            key={g}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                              form.gender === g
                                ? 'border-indigo-400/80 bg-indigo-500/30 text-indigo-200'
                                : 'border-white/15 bg-white/8 text-white/50 hover:border-white/30 hover:text-white/70'
                            }`}
                          >
                            <input type="radio" name="gender" value={g} checked={form.gender === g}
                              onChange={() => update('gender', g)} className="sr-only" />
                            {g === 'MALE' ? 'Male' : g === 'FEMALE' ? 'Female' : 'Other'}
                          </label>
                        ))}
                      </div>
                    </FieldWrap>
                  </div>

                  {/* contact */}
                  <div>
                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="flex-1 h-px bg-white/10" />
                      Contact Information
                      <span className="flex-1 h-px bg-white/10" />
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FieldWrap label="Email address" error={fieldErrors.email}>
                        <GlassInput icon={HiOutlineMail} type="email" value={form.email} onChange={v => update('email', v)} placeholder="student@email.com" autoComplete="email" req />
                      </FieldWrap>
                      <FieldWrap label="Phone number" error={fieldErrors.phone}>
                        <GlassInput icon={HiOutlinePhone} type="tel" value={form.phone} onChange={v => update('phone', v)} placeholder="10-digit number" autoComplete="tel" req />
                      </FieldWrap>
                    </div>
                  </div>
                </div>
              )}

              {/* -- STEP 1: Address -- */}
              {step === 1 && (
                <div className="space-y-4">
                  <FieldWrap label="Street address line 1" error={fieldErrors.address1}>
                    <GlassInput icon={HiOutlineHome} value={form.address1} onChange={v => update('address1', v)} placeholder="House no., street name" req />
                  </FieldWrap>
                  <FieldWrap label="Street address line 2" error={fieldErrors.address2}>
                    <GlassInput icon={HiOutlineHome} value={form.address2} onChange={v => update('address2', v)} placeholder="Landmark, area" req />
                  </FieldWrap>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FieldWrap label="City" error={fieldErrors.city}>
                      <GlassInput icon={HiOutlineOfficeBuilding} value={form.city} onChange={v => update('city', v)} placeholder="City" req />
                    </FieldWrap>
                    <FieldWrap label="Region / District" error={fieldErrors.region}>
                      <GlassInput icon={HiOutlineMap} value={form.region} onChange={v => update('region', v)} placeholder="Region" req />
                    </FieldWrap>
                    <FieldWrap label="Postal / Zip code" error={fieldErrors.pincode}>
                      <GlassInput icon={HiOutlineLocationMarker} value={form.pincode} onChange={v => update('pincode', v)} placeholder="Pincode" req />
                    </FieldWrap>
                    <FieldWrap label="Panchayat" error={fieldErrors.panchayat}>
                      <GlassInput value={form.panchayat} onChange={v => update('panchayat', v)} placeholder="Panchayat name" req />
                    </FieldWrap>
                  </div>
                  <FieldWrap label="State" error={fieldErrors.state}>
                    <GlassInput icon={HiOutlineMap} value={form.state} onChange={v => update('state', v)} placeholder="State" req />
                  </FieldWrap>
                </div>
              )}

              {/* -- STEP 2: Account -- */}
              {step === 2 && (
                <div className="space-y-4">
                  <FieldWrap label="Password" error={fieldErrors.password}>
                    <GlassPasswordInput
                      value={form.password}
                      onChange={v => update('password', v)}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                    />
                    {form.password && (
                      <div className="mt-2">
                        <div className="flex gap-1.5 mb-1">
                          {[0, 1, 2, 3].map(i => (
                            <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < pwStrength ? S_COLORS[pwStrength - 1] : 'bg-white/15'}`} />
                          ))}
                        </div>
                        <span className={`text-xs font-medium ${S_TEXT[pwStrength - 1] || 'text-white/40'}`}>
                          Password strength: {S_LABELS[pwStrength - 1] || ''}
                        </span>
                      </div>
                    )}
                  </FieldWrap>

                  <FieldWrap label="Confirm password" error={fieldErrors.confirmPassword}>
                    <GlassPasswordInput
                      value={form.confirmPassword}
                      onChange={v => update('confirmPassword', v)}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                    />
                  </FieldWrap>

                  <div className="flex items-start gap-3 bg-indigo-500/15 border border-indigo-400/25 rounded-xl px-4 py-3.5 mt-2">
                    <HiOutlineShieldCheck className="text-indigo-300 text-lg flex-shrink-0 mt-0.5" />
                    <p className="text-white/60 text-xs leading-relaxed">
                      Your information is encrypted and stored securely. By registering you agree to our terms of service and privacy policy.
                    </p>
                  </div>
                </div>
              )}

              {/* nav buttons */}
              <div className="flex gap-3 mt-7">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-1.5 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm rounded-xl transition-all active:scale-[0.98]"
                  >
                    <HiArrowLeft className="text-base" />
                    Back
                  </button>
                )}

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 active:scale-[0.98]"
                  >
                    Continue
                    <HiArrowRight className="text-base" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-200 active:scale-[0.98]"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <MdHowToReg className="text-lg" />
                        Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* login link */}
              <p className="text-center text-white/40 text-xs mt-5">
                Already registered?{' '}
                <Link to="/login" className="text-indigo-300 hover:text-indigo-200 font-semibold transition-colors">
                  Sign in instead →
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* footer */}
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



