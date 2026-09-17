import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { useCart } from '../../context/CartContext.js';
import { useNotifications } from '../../context/NotificationContext.js';
import {
  ShoppingBag,
  Bell,
  UtensilsCrossed,
  LogOut,
  Menu as MenuIcon,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-dark-surface/90 backdrop-blur-xl border-b border-white/[0.07] shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 group-hover:shadow-brand-500/50 transition-all duration-300">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-brand-400 bg-clip-text text-transparent tracking-tight">
                Campus<span className="text-brand-500">Bite</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Smart Food & Insights
              </span>
            </div>
          </Link>

          {/* Role Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5">
            {user?.role === 'STUDENT' && (
              <>
                <Link
                  to="/student/dashboard"
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/student/dashboard')
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/student/menu"
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/student/menu')
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Menu
                </Link>
                <Link
                  to="/student/orders"
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/student/orders')
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  My Orders
                </Link>
              </>
            )}

            {user?.role === 'KITCHEN_STAFF' && (
              <>
                <Link
                  to="/kitchen/dashboard"
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/kitchen/dashboard')
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Live Queue
                </Link>
                <Link
                  to="/kitchen/prep-advice"
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/kitchen/prep-advice')
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Prep Recommendations
                </Link>
              </>
            )}

            {user?.role === 'ADMIN' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/admin/dashboard')
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to="/admin/foods"
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/admin/foods')
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Foods
                </Link>
                <Link
                  to="/admin/users"
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/admin/users')
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Users
                </Link>
                <Link
                  to="/admin/orders"
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/admin/orders')
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Orders
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/admin/analytics')
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Analytics
                </Link>
                <Link
                  to="/admin/forecast"
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1 ${
                    isActive('/admin/forecast')
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Forecast
                </Link>
                <Link
                  to="/admin/reports"
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive('/admin/reports')
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm shadow-brand-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Reports
                </Link>
              </>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Cart Button (for Students) */}
                {user.role === 'STUDENT' && (
                  <Link
                    to="/student/cart"
                    className="relative p-2.5 rounded-xl bg-dark-card hover:bg-dark-elevated text-slate-300 hover:text-brand-400 border border-white/[0.08] transition-all"
                    title="Shopping Cart"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-glow-orange-sm">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 rounded-xl bg-dark-card hover:bg-dark-elevated text-slate-300 hover:text-brand-400 border border-white/[0.08] transition-all"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-500/50">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Drawer */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-dark-card rounded-2xl shadow-2xl border border-white/10 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllAsRead()}
                            className="text-xs text-brand-400 hover:text-brand-300 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="divide-y divide-white/5 max-h-72 overflow-y-auto mt-2">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center text-slate-500 text-sm">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`p-3 rounded-xl cursor-pointer transition-colors ${
                                notif.read ? 'bg-transparent hover:bg-white/5' : 'bg-brand-500/10 hover:bg-brand-500/15'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span className="text-base mt-0.5">🔔</span>
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                                  <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>
                                  <span className="text-[10px] text-slate-500 mt-1 block">
                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Role Tag & Logout */}
                <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-white/10">
                  <div className="text-right">
                    <p className="text-xs font-bold text-white truncate max-w-[120px]">{user.name}</p>
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-dark-elevated text-brand-400 border border-brand-500/20">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login" className="btn-secondary text-xs sm:text-sm py-2 px-4">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-xs sm:text-sm py-2 px-4">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-dark-surface px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          {user?.role === 'STUDENT' && (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                Dashboard
              </Link>
              <Link
                to="/student/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                Browse Menu
              </Link>
              <Link
                to="/student/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                My Orders
              </Link>
              <Link
                to="/student/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                Shopping Cart ({itemCount})
              </Link>
            </>
          )}

          {user?.role === 'KITCHEN_STAFF' && (
            <>
              <Link
                to="/kitchen/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                Kitchen Live Queue
              </Link>
              <Link
                to="/kitchen/prep-advice"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                Preparation Recommendations
              </Link>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                Overview
              </Link>
              <Link
                to="/admin/foods"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                Menu Management
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                User Management
              </Link>
              <Link
                to="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                Order Monitoring
              </Link>
              <Link
                to="/admin/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                Sales Analytics
              </Link>
              <Link
                to="/admin/forecast"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                Demand Forecast
              </Link>
              <Link
                to="/admin/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-slate-300 font-medium hover:bg-white/5"
              >
                Reports & Export
              </Link>
            </>
          )}

          {user && (
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Signed in as {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
