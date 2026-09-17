import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CampusBite</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Smart campus canteen ordering. Fresh food, pre-orders, and contactless pickup.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-2.5">Explore</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link to="/student/menu" className="hover:text-white transition-colors">Daily Menu</Link></li>
              <li><Link to="/student/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-2.5">Portals</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link to="/student/dashboard" className="hover:text-white transition-colors">Student Portal</Link></li>
              <li><Link to="/kitchen/dashboard" className="hover:text-white transition-colors">Kitchen Display</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} CampusBite. All rights reserved.</p>
          <p>Campus Canteen Platform</p>
        </div>
      </div>
    </footer>
  );
};
