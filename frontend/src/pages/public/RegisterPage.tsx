import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { HeroBurgerShowcase } from '../../components/home/HeroBurgerShowcase.js';
import { UtensilsCrossed, Lock, Mail, User, Phone, AlertCircle, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name, email, phone, password });
      navigate('/student/menu');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Ambient Orange Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-brand-500/[0.10] rounded-full blur-[140px] pointer-events-none"></div>

      {/* 5-Star Luxury Division Bar */}
      <div className="max-w-6xl w-full hotel-division-bar p-6 sm:p-10 lg:p-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Luxury Blended Burger Showcase */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-400 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>5-Star Reserve Dining • Student Access</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Join CampusBite Reserve
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                Order sizzling artisanal burgers, skip the lunch rush, and track meal prep in real-time from your phone.
              </p>
            </div>

            {/* Dynamic Blended Burger (Animation ONLY on the burger picture) */}
            <div className="py-2">
              <HeroBurgerShowcase size="compact" />
            </div>

            <div className="hidden sm:grid grid-cols-3 gap-3 pt-2 border-t border-white/[0.08]">
              <div className="p-2.5 rounded-xl bg-dark-card/60 border border-white/[0.06] text-center">
                <span className="text-xs font-black text-brand-400 block">Flame-Grilled</span>
                <span className="text-[10px] text-slate-400">Charcoal sizzled</span>
              </div>
              <div className="p-2.5 rounded-xl bg-dark-card/60 border border-white/[0.06] text-center">
                <span className="text-xs font-black text-amber-400 block">Fast Track</span>
                <span className="text-[10px] text-slate-400">Order from phone</span>
              </div>
              <div className="p-2.5 rounded-xl bg-dark-card/60 border border-white/[0.06] text-center">
                <span className="text-xs font-black text-emerald-400 block">Student Perks</span>
                <span className="text-[10px] text-slate-400">Daily campus deals</span>
              </div>
            </div>
          </div>

          {/* Right: 3D Registration Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md space-y-5 card-3d p-8 sm:p-10 border border-white/10">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
              <p className="text-xs text-slate-400">Join CampusBite to order and track food from your phone</p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-elevated border border-white/10 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  College Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-elevated border border-white/10 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-elevated border border-white/10 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-elevated border border-white/10 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Confirm
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-elevated border border-white/10 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 text-sm font-bold mt-2 shadow-glow-orange-sm"
              >
                {isSubmitting ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 pt-2 border-t border-white/[0.07]">
              Already registered?{' '}
              <Link to="/login" className="text-brand-400 font-bold hover:text-brand-300 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
