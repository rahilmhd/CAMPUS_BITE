import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { UtensilsCrossed, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';

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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient Orange Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/[0.08] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 card-3d p-8 sm:p-10 relative z-10">
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
            className="w-full btn-primary py-3 text-sm font-bold mt-2"
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
  );
};
