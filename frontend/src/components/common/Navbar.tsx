import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { useCart } from '../../context/CartContext.js';
import { useNotifications } from '../../context/NotificationContext.js';
import {
  ShoppingBag,
  Bell,
  UtensilsCrossed,
  LayoutDashboard,
  Clock,
  BarChart3,
  Users,
  FileText,
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
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent tracking-tight">
                CampusBite
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Smart Food & Insights
              </span>
            </div>
          </Link>

          {/* Role Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {user?.role === 'STUDENT' && (
              <>
                <Link
                  to="/student/dashboard"
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/student/dashboard')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/student/menu"
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/student/menu')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Menu
                </Link>
                <Link
                  to="/student/orders"
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/student/orders')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/kitchen/dashboard')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Live Queue
                </Link>
                <Link
                  to="/kitchen/prep-advice"
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/kitchen/prep-advice')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/admin/dashboard')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to="/admin/foods"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/admin/foods')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Foods
                </Link>
                <Link
                  to="/admin/users"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/admin/users')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Users
                </Link>
                <Link
                  to="/admin/orders"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/admin/orders')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Orders
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/admin/analytics')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Analytics
                </Link>
                <Link
                  to="/admin/forecast"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1 ${
                    isActive('/admin/forecast')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Demand Forecast
                </Link>
                <Link
                  to="/admin/reports"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/admin/reports')
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                    className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 transition-colors"
                    title="Shopping Cart"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Drawer */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-100 text-brand-700">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllAsRead()}
                            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center text-slate-400 text-sm">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`p-3 rounded-xl cursor-pointer transition-colors ${
                                notif.read ? 'bg-white hover:bg-slate-50' : 'bg-brand-50/50 hover:bg-brand-50'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span className="text-base mt-0.5">🔔</span>
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-slate-800">{notif.title}</p>
                                  <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                                  <span className="text-[10px] text-slate-400 mt-1 block">
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
                <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">{user.name}</p>
                    <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-xs sm:text-sm py-2 px-3">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-xs sm:text-sm py-2 px-3">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {user?.role === 'STUDENT' && (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                Dashboard
              </Link>
              <Link
                to="/student/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                Browse Menu
              </Link>
              <Link
                to="/student/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                My Orders
              </Link>
              <Link
                to="/student/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
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
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                Kitchen Live Queue
              </Link>
              <Link
                to="/kitchen/prep-advice"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
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
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                Overview
              </Link>
              <Link
                to="/admin/foods"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                Menu Management
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                User Management
              </Link>
              <Link
                to="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                Order Monitoring
              </Link>
              <Link
                to="/admin/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                Sales Analytics
              </Link>
              <Link
                to="/admin/forecast"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                Demand Forecast
              </Link>
              <Link
                to="/admin/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
              >
                Reports & Export
              </Link>
            </>
          )}

          {user && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Signed in as {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-600 font-semibold flex items-center gap-1"
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
