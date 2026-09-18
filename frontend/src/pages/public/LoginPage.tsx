import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { CinematicBurgerHero } from '../../components/common/CinematicBurgerHero.js';
import { UtensilsCrossed, Lock, Mail, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readOnly, setReadOnly] = useState(true);

  React.useEffect(() => {
    // Force clear inputs on mount to ensure clean blank fields
    setEmail('');
    setPassword('');
    // Lift readOnly shortly after mount to allow user interaction while bypassing browser autofill
    const timer = setTimeout(() => {
      setReadOnly(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      redirectUser(user.role);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const redirectUser = (role: string) => {
    const from = (location.state as any)?.from?.pathname;
    if (from && from !== '/login') {
      navigate(from);
      return;
    }

    if (role === 'STUDENT') navigate('/student/menu');
    else if (role === 'KITCHEN_STAFF') navigate('/kitchen/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 sm:py-14 relative overflow-hidden">
      {/* Ambient Orange Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-brand-500/[0.10] rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
        {/* Left: Cinematic Burger Video Showcase */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
          <CinematicBurgerHero variant="split" />

          <div className="hidden sm:grid grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-dark-card/80 border border-white/[0.08] text-center backdrop-blur-sm">
              <span className="text-xs font-black text-brand-400 block">Flame-Grilled</span>
              <span className="text-[10px] text-slate-400">Charcoal sizzled</span>
            </div>
            <div className="p-3 rounded-2xl bg-dark-card/80 border border-white/[0.08] text-center backdrop-blur-sm">
              <span className="text-xs font-black text-amber-400 block">Zero Waiting</span>
              <span className="text-[10px] text-slate-400">Fast counter pickup</span>
            </div>
            <div className="p-3 rounded-2xl bg-dark-card/80 border border-white/[0.08] text-center backdrop-blur-sm">
              <span className="text-xs font-black text-emerald-400 block">Chef Crafted</span>
              <span className="text-[10px] text-slate-400">100% Quality taste</span>
            </div>
          </div>
        </div>

        {/* Right: 3D Login Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md space-y-6 card-3d p-8 sm:p-10">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
              <p className="text-xs text-slate-400">Sign in to your CampusBite account</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              {/* Hidden inputs to capture aggressive browser autofill */}
              <input
                type="text"
                name="prevent_autofill_email"
                id="prevent_autofill_email"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />
              <input
                type="password"
                name="prevent_autofill_password"
                id="prevent_autofill_password"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    id="login-email"
                    name="campus_login_email"
                    required
                    autoComplete="new-password"
                    readOnly={readOnly}
                    onFocus={() => setReadOnly(false)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-elevated border border-white/10 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    id="login-password"
                    name="campus_login_password"
                    required
                    autoComplete="new-password"
                    readOnly={readOnly}
                    onFocus={() => setReadOnly(false)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-elevated border border-white/10 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 text-sm font-bold shadow-glow-orange-sm"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Footer Link */}
            <p className="text-center text-xs text-slate-400 pt-3 border-t border-white/[0.07]">
              New to CampusBite?{' '}
              <Link to="/register" className="text-brand-400 font-bold hover:text-brand-300 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
