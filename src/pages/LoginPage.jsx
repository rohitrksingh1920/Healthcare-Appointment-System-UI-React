import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/authSlice';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errors = {};
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address';
  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, []);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    dispatch(loginStart());
    // Simulate API call
    await new Promise(r => setTimeout(r, 900));

    // Demo: accept any valid email/password
    const storedUsers = JSON.parse(localStorage.getItem('medicare_users') || '[]');
    const matchedUser = storedUsers.find(u => u.email === form.email && u.password === form.password);

    if (matchedUser || (form.email === 'demo@medicare.com' && form.password === 'demo123')) {
      const user = matchedUser || {
        id: 'demo-1',
        name: 'Demo User',
        email: form.email,
        phone: '',
        age: '',
        gender: '',
        joined: new Date().toISOString(),
      };
      dispatch(loginSuccess(user));
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
    } else {
      dispatch(loginFailure('Invalid email or password. Try demo@medicare.com / demo123'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center p-4 page-enter">
      <div className="w-full max-w-md">
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
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage your appointments</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-sky-400 to-teal-400" />
          <div className="p-8">
            {/* Demo hint */}
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-3.5 mb-6 text-sm">
              <p className="font-semibold text-sky-800 mb-1">🚀 Demo Credentials</p>
              <p className="text-sky-700 text-xs">Email: <code className="bg-sky-100 px-1 rounded">demo@medicare.com</code></p>
              <p className="text-sky-700 text-xs mt-0.5">Password: <code className="bg-sky-100 px-1 rounded">demo123</code></p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 mb-5 text-sm text-red-700 flex items-start gap-2">
                <span className="shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-all ${
                    errors.email ? 'border-red-400 bg-red-50 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <a href="#" className="text-xs text-sky-600 hover:text-sky-700">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full px-4 py-3 pr-10 border rounded-xl text-sm transition-all ${
                      errors.password ? 'border-red-400 bg-red-50 focus:ring-red-100' : 'border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-sky-600 font-semibold hover:text-sky-700">
                  Create one free
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          🔒 Your data is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
