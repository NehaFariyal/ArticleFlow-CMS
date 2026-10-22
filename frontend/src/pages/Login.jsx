import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Shield,
  Activity,
} from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState(location.state?.registeredRole || 'admin');
  const [email, setEmail] = useState(location.state?.registeredEmail || 'admin@lumen.com');
  const [password, setPassword] = useState(location.state?.registeredEmail ? '' : 'password123');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState(
    location.state?.successMessage || ''
  );
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/profile';

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessNotice(location.state.successMessage);

      if (location.state.registeredEmail) {
        setEmail(location.state.registeredEmail);
        setPassword('');
      }
    }
  }, [location.state]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
    setSuccessNotice('');

    if (role === 'admin') {
      setEmail('admin@lumen.com');
      setPassword('password123');
    } else if (role === 'author') {
      setEmail('priya.mehta@lumen.com');
      setPassword('password123');
    } else {
      setEmail('reader@lumen.com');
      setPassword('password123');
    }
  };

  const handleQuickDemoLogin = async (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setSelectedRole(demoRole);
    setError('');
    setLoading(true);

    try {
      const res = await login(demoEmail, 'password123');

      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/profile', { replace: true });
        }
      } else {
        setError(res.message || 'Failed to sign in with demo credentials.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(email.trim(), password);

      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (res.user.role === 'author') {
          navigate('/profile', { replace: true });
        } else {
          navigate(from === '/login' ? '/profile' : from, { replace: true });
        }
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Failed to connect to authentication service. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <Layers className="w-6 h-6" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Sign In to ArticleFlow
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access enterprise content studio, analytics dashboard, and peer review queues
          </p>
        </div>

        {/* Quick Demo Fill Buttons Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white p-4 shadow-md space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-400 font-mono uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Instant Persona Sign-In</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Test Access</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@lumen.com', 'admin')}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-left transition flex flex-col justify-between"
            >
              <div className="font-bold text-white">Amara Silva</div>
              <div className="text-[10px] font-mono text-purple-400 mt-0.5">Admin Cockpit</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('priya.mehta@lumen.com', 'author')}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-left transition flex flex-col justify-between"
            >
              <div className="font-bold text-white">Priya Mehta</div>
              <div className="text-[10px] font-mono text-emerald-400 mt-0.5">Author Account</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('author@lumen.com', 'author')}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-left transition flex flex-col justify-between"
            >
              <div className="font-bold text-white">Thomas Okeke</div>
              <div className="text-[10px] font-mono text-emerald-400 mt-0.5">Author Account</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('reader@lumen.com', 'reader')}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-left transition flex flex-col justify-between"
            >
              <div className="font-bold text-white">Lena Kaufmann</div>
              <div className="text-[10px] font-mono text-slate-300 mt-0.5">Reader Account</div>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="enterprise-card p-6 sm:p-8 space-y-5">
          {/* Success Banner */}
          {successNotice && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 rounded-xl text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="font-medium">{successNotice}</div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="enterprise-input w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="enterprise-input w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 absolute right-3 top-2.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            Don't have an enterprise account yet?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Register now
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;