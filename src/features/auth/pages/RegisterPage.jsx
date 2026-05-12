import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
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
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';
import { MdHowToReg } from 'react-icons/md';
import Bgimage from '../../../Assets/Images/Bgimage.png';
import Logo from '../../../Assets/Images/Logo/Group 1.png';
import { isValidDob, isValidEmail, isValidPhone, isValidPincode, required } from '../../../shared/lib/validators';
import { login, register } from '../../../shared/services/authApi';

function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return score;
}

const S_COLORS = ['bg-red-400', 'bg-amber-400', 'bg-orange-400', 'bg-green-400'];
const S_TEXT = ['text-red-300', 'text-amber-300', 'text-orange-300', 'text-green-300'];
const S_LABELS = ['Weak', 'Fair', 'Good', 'Strong'];

function GlassInput({ icon: Icon, value, onChange, placeholder, type = 'text', autoComplete, required: req, className = '' }) {
  return (
    <div className="relative">
      {Icon ? (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-700 text-lg pointer-events-none">
          <Icon />
        </span>
      ) : null}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={req}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-white/95 border border-white/30 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:border-green-400/50 transition ${className}`}
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
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full pl-10 pr-11 py-2.5 bg-white/95 border border-white/30 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:border-green-400/50 transition"
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
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
      <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
      {error ? (
        <p className="flex items-center gap-1 mt-1 text-xs text-red-300">
          <HiOutlineExclamationCircle className="text-sm flex-shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function RegisterPage({ onLoggedIn }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    phone: '',
    firstName: '',
    dob: '',
    gender: 'MALE',
    address1: '',
    address2: '',
    city: '',
    region: '',
    pincode: '',
    panchayat: '',
    state: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function update(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  }

  function validateAll() {
    const e = {};
    if (!isValidEmail(form.email)) e.email = 'Enter a valid email';
    if (!isValidPhone(form.phone)) e.phone = 'Enter a valid phone number';
    if (!required(form.firstName)) e.firstName = 'Required';
    if (!isValidDob(form.dob)) e.dob = 'Enter a valid DOB';
    if (!required(form.gender)) e.gender = 'Required';
    if (!required(form.address1)) e.address1 = 'Required';
    if (!required(form.city)) e.city = 'Required';
    if (!required(form.region)) e.region = 'Required';
    if (!isValidPincode(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    if (!required(form.panchayat)) e.panchayat = 'Required';
    if (!required(form.state)) e.state = 'Required';
    if (!required(form.password)) e.password = 'Required';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError('');
    if (!validateAll()) return;
    setSubmitting(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.firstName || 'NA',
        dob: form.dob,
        gender: form.gender,
        email: form.email,
        phone: form.phone,
        password: form.password,
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        region: form.region,
        pincode: form.pincode,
        panchayat: form.panchayat,
        state: form.state,
      };

      const res = await register(payload);
      if (!res.ok) {
        setError(res.error || 'Registration failed.');
        return;
      }

      const loginRes = await login({ email: form.email, password: form.password });
      if (!loginRes.ok) {
        setSuccess('Registered successfully. Please login.');
        setTimeout(() => navigate('/login'), 800);
        return;
      }

      onLoggedIn?.(loginRes.data?.user || null);
      setSuccess('Registration complete! Redirecting…');
      setTimeout(() => navigate('/welcome'), 600);
    } finally {
      setSubmitting(false);
    }
  }

  const pwStrength = useMemo(() => getStrength(form.password), [form.password]);

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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-green-950/60 to-slate-900/80 backdrop-blur-[2px]" />
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-green-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-4">
        <div className="flex justify-center -mb-1">
          <img src={Logo} alt="newindia29" className="h-36 sm:h-40 md:h-44 w-auto object-contain drop-shadow-lg" />
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-green-600 px-8 py-5 text-center">
            <h1 className="text-white text-xl font-bold tracking-tight">Student Registration</h1>
            <p className="text-white/90 text-sm mt-0.5">Create your account and submit your application</p>
          </div>

          <div className="px-8 py-7">
            {success ? (
              <div className="flex items-center gap-2.5 bg-green-500/20 border border-green-400/40 rounded-xl px-4 py-3 text-sm text-green-100 mb-5">
                <HiOutlineCheckCircle className="text-green-200 flex-shrink-0" />
                {success}
              </div>
            ) : null}
            {error ? (
              <div className="flex items-center gap-2.5 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-sm text-red-200 mb-5">
                <HiOutlineExclamationCircle className="text-red-300 flex-shrink-0" />
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <FieldWrap label="First name" error={fieldErrors.firstName}>
                      <GlassInput icon={HiOutlineUser} value={form.firstName} onChange={(v) => update('firstName', v)} placeholder="First name" required />
                    </FieldWrap>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FieldWrap label="Date of birth" error={fieldErrors.dob}>
                      <GlassInput icon={HiOutlineCalendar} type="date" value={form.dob} onChange={(v) => update('dob', v)} required />
                    </FieldWrap>
                    <FieldWrap label="Gender" error={fieldErrors.gender}>
                      <div className="flex gap-2">
                        {['MALE', 'FEMALE', 'OTHER'].map((g) => (
                          <label
                            key={g}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                              form.gender === g
                                ? 'border-green-400/80 bg-green-500/30 text-green-100'
                                : 'border-white/15 bg-white/8 text-white/50 hover:border-white/30 hover:text-white/70'
                            }`}
                          >
                            <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={() => update('gender', g)} className="sr-only" />
                            {g === 'MALE' ? 'Male' : g === 'FEMALE' ? 'Female' : 'Other'}
                          </label>
                        ))}
                      </div>
                    </FieldWrap>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FieldWrap label="Email address" error={fieldErrors.email}>
                      <GlassInput
                        icon={HiOutlineMail}
                        type="email"
                        value={form.email}
                        onChange={(v) => update('email', v)}
                        placeholder="student@email.com"
                        autoComplete="email"
                        required
                      />
                    </FieldWrap>
                    <FieldWrap label="Phone number" error={fieldErrors.phone}>
                      <GlassInput
                        icon={HiOutlinePhone}
                        type="tel"
                        value={form.phone}
                        onChange={(v) => update('phone', v)}
                        placeholder="10-digit number"
                        autoComplete="tel"
                        required
                      />
                    </FieldWrap>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="flex-1 h-px bg-white/10" />
                  Address Details
                  <span className="flex-1 h-px bg-white/10" />
                </p>

                <div className="space-y-4">
                  <FieldWrap label="Street / Village" error={fieldErrors.address1}>
                    <GlassInput icon={HiOutlineHome} value={form.address1} onChange={(v) => update('address1', v)} placeholder="Street / Village" required />
                  </FieldWrap>
                  <FieldWrap label="Street / Village (Line 2)" error={fieldErrors.address2}>
                    <GlassInput icon={HiOutlineHome} value={form.address2} onChange={(v) => update('address2', v)} placeholder="Landmark / area" />
                  </FieldWrap>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FieldWrap label="Town" error={fieldErrors.city}>
                      <GlassInput icon={HiOutlineOfficeBuilding} value={form.city} onChange={(v) => update('city', v)} placeholder="Town" required />
                    </FieldWrap>
                    <FieldWrap label="District" error={fieldErrors.region}>
                      <GlassInput icon={HiOutlineMap} value={form.region} onChange={(v) => update('region', v)} placeholder="District" required />
                    </FieldWrap>
                    <FieldWrap label="Postal / Zip code" error={fieldErrors.pincode}>
                      <GlassInput
                        icon={HiOutlineLocationMarker}
                        value={form.pincode}
                        onChange={(v) => update('pincode', v.replace(/[^\d]/g, '').slice(0, 6))}
                        placeholder="6-digit pincode"
                        autoComplete="postal-code"
                        required
                      />
                    </FieldWrap>
                    <FieldWrap label="Pangayathu" error={fieldErrors.panchayat}>
                      <GlassInput value={form.panchayat} onChange={(v) => update('panchayat', v)} placeholder="Pangayathu name" required />
                    </FieldWrap>
                  </div>

                  <FieldWrap label="State" error={fieldErrors.state}>
                    <GlassInput icon={HiOutlineMap} value={form.state} onChange={(v) => update('state', v)} placeholder="State" required />
                  </FieldWrap>
                </div>
              </div>

              <div>
                {/* <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="flex-1 h-px bg-white/10" />
                  Account Setup
                  <span className="flex-1 h-px bg-white/10" />
                </p> */}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FieldWrap label="Password" error={fieldErrors.password}>
                      <GlassPasswordInput value={form.password} onChange={(v) => update('password', v)} placeholder="Minimum 6 characters" autoComplete="new-password" />
                      {form.password ? (
                        <div className="mt-2">
                          <div className="flex gap-1.5 mb-1">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < pwStrength ? S_COLORS[pwStrength - 1] : 'bg-white/15'}`}
                              />
                            ))}
                          </div>
                          <span className={`text-xs font-medium ${S_TEXT[pwStrength - 1] || 'text-white/40'}`}>
                            Password strength: {S_LABELS[pwStrength - 1] || ''}
                          </span>
                        </div>
                      ) : null}
                    </FieldWrap>

                    <FieldWrap label="Confirm password" error={fieldErrors.confirmPassword}>
                      <GlassPasswordInput
                        value={form.confirmPassword}
                        onChange={(v) => update('confirmPassword', v)}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                      />
                    </FieldWrap>
                  </div>

                  <div className="flex items-start gap-3 bg-green-500/15 border border-green-400/25 rounded-xl px-4 py-3.5 mt-2">
                    <HiOutlineShieldCheck className="text-green-200 text-lg flex-shrink-0 mt-0.5" />
                    <p className="text-white/60 text-xs leading-relaxed">
                      Your information is encrypted and stored securely. By registering you agree to our terms of service and privacy policy.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-400 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all duration-200 active:scale-[0.98]"
              >
                {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MdHowToReg className="text-lg" />}
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>

              <p className="text-center text-white/40 text-xs mt-5">
                Already registered?{' '}
                <Link to="/login" className="text-orange-200 hover:text-orange-100 font-semibold transition-colors">
                  Sign in instead →
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


