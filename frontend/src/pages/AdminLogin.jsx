import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');

    const cleanUser = username.trim();
    if (!cleanUser || !password) {
      setFormError('Please enter both username and password.');
      return;
    }

    try {
      setLoading(true);
      await login(cleanUser, password);
      success("Welcome back, Harish! Logged in successfully.");
      navigate('/admin/dashboard');
    } catch (err) {
      setFormError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="bg-glow-purple -top-20 -left-20"></div>
      <div className="bg-glow-cyan -bottom-20 -right-20"></div>

      {/* Back to Public Site link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-xs font-medium text-slate-300 hover:text-white transition-all hover:border-cyan-400/40"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Card Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center text-white shadow-xl shadow-brand-purple/20">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tech Innovator <span className="gradient-text">Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Secure authentication for Harish Kumar
          </p>
        </div>

        {/* Login Box */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          {formError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-xl glass-input text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-xl glass-input text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Tech Innovator Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
