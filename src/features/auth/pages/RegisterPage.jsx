import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlineLocationMarker,
  HiOutlineMap,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';
import { MdHowToReg } from 'react-icons/md';
import Bgimage from '../../../Assets/Images/Bgimage.png';
import Logo from '../../../Assets/Images/Logo/Logo-final.png';
import { isValidDob, isValidEmail, isValidPhone, isValidPincode, required } from '../../../shared/lib/validators';
import { login, register } from '../../../shared/services/authService';

const SHOW_TOWN = false;
const SHOW_STATE = false;
const SHOW_PASSWORD = false;

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
  return (
    <div className="relative">
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full px-4 py-2.5 bg-white/95 border border-white/30 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:border-green-400/50 transition"
      />
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

  const initialForm = {
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
  };

  const [form, setForm] = useState(initialForm);

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toast, setToast] = useState('');
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // 'terms' | 'privacy' | null

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
    if (!required(form.region)) e.region = 'Required';
    if (!isValidPincode(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    if (!required(form.panchayat)) e.panchayat = 'Required';
    if (!acceptedLegal) e.legal = 'Please accept Terms & Conditions and Privacy Policy.';
    // hidden fields (keep in payload with mock defaults)
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
        password: form.password || 'mockpassword123',
        address1: form.address1,
        address2: form.address2,
        city: form.city || 'NA',
        region: form.region,
        pincode: form.pincode,
        panchayat: form.panchayat,
        state: form.state || 'NA',
      };

      const res = await register(payload);
      if (!res.ok) {
        setError(res.error || 'Registration failed.');
        return;
      }

      const loginRes = await login({ email: form.email, password: form.password || 'mockpassword123' });
      if (!loginRes.ok) {
        setSuccess('Registered successfully. Please login.');
        setTimeout(() => navigate('/login'), 800);
        return;
      }

      onLoggedIn?.(loginRes.data?.user || null);
      setToast('Your form has been submitted.');
      setTimeout(() => setToast(''), 2500);
      setSuccess('Your application was submitted.');
      setFieldErrors({});
      setForm(initialForm);
      setAcceptedLegal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  }

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
        <div className="flex justify-center -mb-20">
          <img src={Logo} alt="newindia29" className="h-56 sm:h-64 md:h-72 w-auto object-contain drop-shadow-lg" />
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-green-600 px-8 py-5 text-center">
            <h1 className="text-white text-xl font-bold tracking-tight">Student Registration</h1>
            {/* <p className="text-white/90 text-sm mt-0.5">Create your account and submit your application</p> */}
          </div>

          <div className="px-8 py-7">
            {legalModal ? (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                role="dialog"
                aria-modal="true"
                onClick={() => setLegalModal(null)}
              >
                <div
                  className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-gradient-to-r from-orange-500 to-green-600 px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-lg font-bold tracking-tight">
                          {legalModal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
                        </div>
                        <div className="mt-0.5 text-xs text-white/85">Please read carefully before continuing</div>
                      </div>
                      <button
                        type="button"
                        className="rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/20 transition"
                        onClick={() => setLegalModal(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-5">
                    <div className="max-h-[60vh] overflow-auto rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/85 leading-relaxed">
                      {legalModal === 'terms' ? (
                        <div className="space-y-3">
                          <p>By using this website you agree to provide accurate information and follow all applicable rules.</p>
                          <p>Do not submit false details. Accounts may be suspended for misuse.</p>
                          <p>Service features and availability may change without notice.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p>We collect the information you submit to process your registration and application.</p>
                          <p>Authentication tokens may be stored locally in your browser to keep you signed in.</p>
                          <p>We do not share personal data unless required to provide the service or by law.</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                      <button
                        type="button"
                        className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                        onClick={() => setLegalModal(null)}
                      >
                        I Understand
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {toast ? (
              <div className="fixed right-4 top-4 z-50 rounded-xl bg-black/70 px-4 py-3 text-sm text-white shadow-lg backdrop-blur">
                {toast}
              </div>
            ) : null}
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
                  {/* <FieldWrap label="Street / Village (Line 2)" error={fieldErrors.address2}>
                    <GlassInput icon={HiOutlineHome} value={form.address2} onChange={(v) => update('address2', v)} placeholder="Landmark / area" />
                  </FieldWrap> */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SHOW_TOWN ? (
                      <FieldWrap label="Town" error={fieldErrors.city}>
                        <GlassInput icon={HiOutlineOfficeBuilding} value={form.city} onChange={(v) => update('city', v)} placeholder="Town" required />
                      </FieldWrap>
                    ) : null}
                    <FieldWrap label="Panchayat" error={fieldErrors.panchayat}>
                      <GlassInput value={form.panchayat} onChange={(v) => update('panchayat', v)} placeholder="Panchayat name" required />
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
                    <FieldWrap label="District" error={fieldErrors.region}>
                      <GlassInput icon={HiOutlineMap} value={form.region} onChange={(v) => update('region', v)} placeholder="District" required />
                    </FieldWrap>
                  </div>

                  {SHOW_STATE ? (
                    <FieldWrap label="State" error={fieldErrors.state}>
                      <GlassInput icon={HiOutlineMap} value={form.state} onChange={(v) => update('state', v)} placeholder="State" required />
                    </FieldWrap>
                  ) : null}
                </div>
              </div>

              <div>
                {/* <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="flex-1 h-px bg-white/10" />
                  Account Setup
                  <span className="flex-1 h-px bg-white/10" />
                </p> */}

                <div className="space-y-4">
                  {SHOW_PASSWORD ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FieldWrap label="Password" error={fieldErrors.password}>
                        <GlassPasswordInput value={form.password} onChange={(v) => update('password', v)} placeholder="Minimum 6 characters" autoComplete="new-password" />
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
                  ) : null}

                               <div className="mt-3">
                <label className="flex items-start gap-3 text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={acceptedLegal}
                    onChange={(e) => setAcceptedLegal(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-green-500"
                  />
                  <span>
                    I agree to the{' '}
                    <button type="button" className="font-semibold text-orange-200 hover:text-orange-100 underline underline-offset-4" onClick={() => setLegalModal('terms')}>
                      Terms & Conditions
                    </button>{' '}
                    and{' '}
                    <button type="button" className="font-semibold text-orange-200 hover:text-orange-100 underline underline-offset-4" onClick={() => setLegalModal('privacy')}>
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>
                {fieldErrors.legal ? <div className="mt-1 text-xs text-red-300">{fieldErrors.legal}</div> : null}
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


