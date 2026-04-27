import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Full name is required';
  else if (form.name.trim().length < 3) errors.name = 'Name must be at least 3 characters';

  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address';

  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  else if (!/^[6-9]\d{9}$/.test(form.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';

  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
  else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
    errors.password = 'Must include uppercase, lowercase and a number';

  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';

  if (!form.dob) errors.dob = 'Date of birth is required';
  if (!form.gender) errors.gender = 'Please select your gender';
  if (!form.terms) errors.terms = 'You must accept the terms and conditions';

  return errors;
};

const passwordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*]/.test(password)) score++;

  const map = [
    { label: 'Very Weak', color: 'bg-red-500' },
    { label: 'Weak', color: 'bg-orange-400' },
    { label: 'Fair', color: 'bg-yellow-400' },
    { label: 'Good', color: 'bg-lime-500' },
    { label: 'Strong', color: 'bg-green-500' },
  ];
  return { score, ...map[Math.min(score - 1, 4)] };
};

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    dob: '', gender: '', terms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated]);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const strength = passwordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('medicare_users') || '[]');
    if (existingUsers.find(u => u.email === form.email)) {
      setErrors({ email: 'This email is already registered' });
      setLoading(false);
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone,
      password: form.password,
      dob: form.dob,
      gender: form.gender,
      joined: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    localStorage.setItem('medicare_users', JSON.stringify(existingUsers));

    dispatch(loginSuccess(newUser));
    toast.success(`Welcome to MediCare+, ${newUser.name.split(' ')[0]}! 🎉`);
    setLoading(false);
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-xl text-sm transition-all ${
      errors[field]
        ? 'border-red-400 bg-red-50 focus:ring-red-100'
        : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center p-4 py-10 page-enter">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center shadow">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="font-bold text-slate-800 text-xl" style={{ fontFamily: 'Playfair Display, serif' }}>
              Medi<span className="text-sky-600">Care+</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            Create your account
          </h1>
          <p className="text-slate-500 text-sm mt-1">Join thousands of patients managing their health</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-sky-400 to-teal-400" />
          <div className="p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Dr. / Mr. / Ms. Your Full Name"
                  className={inputClass('name')}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass('email')}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Number *</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value.replace(/\D/, ''))}
                    placeholder="10-digit number"
                    maxLength={10}
                    className={`flex-1 px-4 py-3 border rounded-xl text-sm transition-all ${errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'}`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* DOB + Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date of Birth *</label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={e => update('dob', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={inputClass('dob')}
                  />
                  {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender *</label>
                  <select
                    value={form.gender}
                    onChange={e => update('gender', e.target.value)}
                    className={`${inputClass('gender')} bg-white`}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder="Min. 8 characters"
                    className={`${inputClass('password')} pr-10`}
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : 'bg-slate-100'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">{strength.label}</p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => update('confirmPassword', e.target.value)}
                    placeholder="Re-enter your password"
                    className={`${inputClass('confirmPassword')} pr-10`}
                  />
                  <button type="button" onClick={() => setShowConfirm(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">
                    {showConfirm ? '🙈' : '👁'}
                  </button>
                </div>
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <p className="text-green-600 text-xs mt-1">✓ Passwords match</p>
                )}
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={e => update('terms', e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-sky-600 shrink-0"
                  />
                  <span className="text-sm text-slate-600">
                    I agree to the{' '}
                    <a href="#" className="text-sky-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-sky-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>
                {errors.terms && <p className="text-red-500 text-xs mt-1 ml-7">{errors.terms}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating Account...
                  </>
                ) : 'Create Account 🎉'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-sky-600 font-semibold hover:text-sky-700">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          🔒 256-bit SSL encrypted · Your data stays private
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
