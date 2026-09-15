import React from 'react';
import { UtensilsCrossed, Heart, ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">CampusBite</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Smart Campus Food Ordering & Insight Platform. Designed to digitize the college canteen experience, reduce waiting times, and minimize food wastage through Moving Average demand forecasting.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure Digital Ordering</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Real-time Live Queue</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Roles & Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/student/menu" className="hover:text-brand-400 transition-colors">Student Pre-Ordering</a></li>
              <li><a href="/kitchen/dashboard" className="hover:text-brand-400 transition-colors">Kitchen Queue Display</a></li>
              <li><a href="/kitchen/prep-advice" className="hover:text-brand-400 transition-colors">Preparation Recommendations</a></li>
              <li><a href="/admin/dashboard" className="hover:text-brand-400 transition-colors">Admin Sales Analytics</a></li>
              <li><a href="/admin/forecast" className="hover:text-brand-400 transition-colors">Demand Forecasting (SMA)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Project Metadata</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p><strong className="text-slate-200">System:</strong> MCA Major Academic Project</p>
              <p><strong className="text-slate-200">Algorithm:</strong> Statistical Simple Moving Average (SMA)</p>
              <p><strong className="text-slate-200">Real-time:</strong> WebSockets (Socket.IO)</p>
              <p><strong className="text-slate-200">Database:</strong> Relational Schema + Prisma ORM</p>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CampusBite Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Academic Excellence
          </p>
        </div>
      </div>
    </footer>
  );
};
