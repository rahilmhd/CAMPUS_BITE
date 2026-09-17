import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();

  const getHomeLink = () => {
    if (!user) return '/login';
    if (user.role === 'STUDENT') return '/student/dashboard';
    if (user.role === 'KITCHEN_STAFF') return '/kitchen/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="max-w-md w-full text-center space-y-6 card-3d p-8 sm:p-10 relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-rose-950/70 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Access Denied (403)</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            You do not have permission to view this section. This portal is restricted to authorized roles.
          </p>
        </div>

        <Link
          to={getHomeLink()}
          className="btn-primary py-3 px-6 text-xs sm:text-sm inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to My Portal
        </Link>
      </div>
    </div>
  );
};
