import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, PenLine, Mail, Lock, Eye, EyeOff, User, ArrowRight, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('reader');
  const [bio, setBio] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (name.trim().length > 100) {
      setError('Name cannot exceed 100 characters.');
      return;
    }

    if (!email.trim()) {
      setError('Please provide your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(name.trim(), email.trim(), password, role, bio.trim());
      if (res.success) {
        // Navigate back to login page with prefilled credentials & success banner
        navigate('/login', {
          state: {
            successMessage: `Account created successfully for ${name.trim()}! Please sign in with your password.`,
            registeredEmail: email.trim(),
            registeredRole: role,
          },
          replace: true,
        });
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network or server error during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create ArticleFlow Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join as a research author to publish peer-reviewed pieces or a reader to take knowledge checkpoints
          </p>
        </div>

        {/* Register Form Card */}
        <div className="enterprise-card p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 rounded-xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 font-mono uppercase tracking-wider">
                Select Platform Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('reader')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition ${
                    role === 'reader'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'enterprise-card text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs font-bold">Reader Account</span>
                  </div>
                  <span className={`text-[11px] ${role === 'reader' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                    Read essays & take knowledge quizzes
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('author')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition ${
                    role === 'author'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'enterprise-card text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PenLine className="w-4 h-4" />
                    <span className="text-xs font-bold">Author Studio</span>
                  </div>
                  <span className={`text-[11px] ${role === 'author' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                    Write articles & create assessments
                  </span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Thomas Okeke"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="enterprise-input w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

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

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
                  Password (min. 6)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="enterprise-input w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 absolute right-2.5 top-2.5"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="enterprise-input w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>
            </div>

            {/* Bio (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-mono uppercase tracking-wider">
                Bio / Tagline <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Short summary of research domains, credentials, or background..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="enterprise-input w-full px-3.5 py-2 text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
            Already have an ArticleFlow account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
