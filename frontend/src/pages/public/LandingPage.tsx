import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { FoodService } from '../../services/food.service.js';
import { FoodItem } from '../../types/index.js';
import { FoodCard } from '../../components/student/FoodCard.js';
import {
  UtensilsCrossed,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ChefHat,
  ArrowRight,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, quickLogin } = useAuth();
  const navigate = useNavigate();
  const [featuredFoods, setFeaturedFoods] = useState<FoodItem[]>([]);
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const foods = await FoodService.getAll({ sortBy: 'popularity' });
        setFeaturedFoods(foods.slice(0, 4));
      } catch (e) {
        // Non-critical
      }
    };
    fetchFeatured();
  }, []);

  const handleDemoLogin = async (role: 'student' | 'kitchen' | 'admin') => {
    setLoadingDemo(role);
    try {
      const loggedUser = await quickLogin(role);
      if (loggedUser.role === 'STUDENT') navigate('/student/menu');
      else if (loggedUser.role === 'KITCHEN_STAFF') navigate('/kitchen/dashboard');
      else if (loggedUser.role === 'ADMIN') navigate('/admin/dashboard');
    } catch (e) {
      alert('Demo login failed. Make sure backend is running.');
    } finally {
      setLoadingDemo(null);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-brand-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100/80 text-brand-800 text-xs font-bold tracking-wide shadow-sm">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>MCA Academic Major Project Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Smart Campus Food Ordering & <span className="bg-gradient-to-r from-brand-500 to-amber-500 bg-clip-text text-transparent">Demand Insights</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Skip long canteen queues. Pre-order your meals, pay securely online, track food preparation in real-time, and empower campus kitchens with statistical demand forecasting.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/student/menu"
                  className="btn-primary py-3.5 px-8 text-base shadow-lg shadow-brand-500/25 flex items-center gap-2"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  Order Food Now
                </Link>

                <a
                  href="#demo-credentials"
                  className="btn-secondary py-3.5 px-6 text-sm flex items-center gap-2"
                >
                  Explore Demo Portals <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Cash Hassle</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> WebSocket Live Tracking</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Moving Average Forecasting</span>
              </div>
            </div>

            {/* Right Hero Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-800">Canteen Counter 1 • Active</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600">
                    Live Status
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                        🍲
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Chicken Biriyani Special</h4>
                        <p className="text-[11px] text-slate-400">Order #CB-2026-1045</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-700">
                      Ready for Pickup 🔔
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                        🥞
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Masala Dosa + Filter Coffee</h4>
                        <p className="text-[11px] text-slate-400">Order #CB-2026-1046</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-100 text-amber-700">
                      Preparing 👨‍🍳
                    </span>
                  </div>
                </div>

                {/* Floating Insight Pill */}
                <div className="mt-2 p-3 rounded-2xl bg-gradient-to-r from-brand-50 to-orange-50 border border-brand-200/60 flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-brand-600" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800">
                      7-Day Demand Forecast
                    </span>
                    <p className="text-xs font-bold text-slate-800">
                      Suggested: 45–48 Biriyanis today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1-Click Interactive Demo Login Section */}
      <section id="demo-credentials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
              Instant Presentation Testing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Launch CampusBite with Demo Roles
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Experience the entire full-stack ecosystem with 1-click authentications. Explore student ordering, kitchen real-time queue management, and the administrator insights dashboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {/* Student Card */}
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-2xl">🎓</span>
                  <h3 className="font-bold text-white text-base mt-2">Student Portal</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    student@campusbite.local
                  </p>
                  <p className="text-[11px] text-slate-500">Browse live menu, advance orders & live tracker.</p>
                </div>
                <button
                  onClick={() => handleDemoLogin('student')}
                  disabled={loadingDemo !== null}
                  className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors"
                >
                  {loadingDemo === 'student' ? 'Signing in...' : 'Login as Student'}
                </button>
              </div>

              {/* Kitchen Card */}
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-2xl">👨‍🍳</span>
                  <h3 className="font-bold text-white text-base mt-2">Kitchen Staff</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    kitchen@campusbite.local
                  </p>
                  <p className="text-[11px] text-slate-500">Live Kanban queue & Moving Average prep recommendations.</p>
                </div>
                <button
                  onClick={() => handleDemoLogin('kitchen')}
                  disabled={loadingDemo !== null}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors"
                >
                  {loadingDemo === 'kitchen' ? 'Signing in...' : 'Login as Kitchen Staff'}
                </button>
              </div>

              {/* Admin Card */}
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-2xl">⚡</span>
                  <h3 className="font-bold text-white text-base mt-2">System Admin</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    admin@campusbite.local
                  </p>
                  <p className="text-[11px] text-slate-500">Sales overview, menu management, reports & analytics.</p>
                </div>
                <button
                  onClick={() => handleDemoLogin('admin')}
                  disabled={loadingDemo !== null}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                >
                  {loadingDemo === 'admin' ? 'Signing in...' : 'Login as Admin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Simple 4-Step Workflow</span>
          <h2 className="text-3xl font-extrabold text-slate-900">How CampusBite Works</h2>
          <p className="text-slate-500 text-sm">Digitizing the traditional manual canteen queue into an intuitive digital experience.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            {
              step: '01',
              title: 'Browse Live Menu',
              desc: 'Check dish availability, dietary labels, ingredients, and prep times in real time.',
              icon: <UtensilsCrossed className="w-5 h-5 text-brand-500" />,
            },
            {
              step: '02',
              title: 'Digital Order & Pay',
              desc: 'Select your preferred pickup time and pay securely with mock UPI or card.',
              icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
            },
            {
              step: '03',
              title: 'Live Preparation Tracker',
              desc: 'Watch the kitchen accept and prepare your meal through real-time WebSockets.',
              icon: <Clock className="w-5 h-5 text-amber-500" />,
            },
            {
              step: '04',
              title: 'Instant Pickup',
              desc: 'Receive notification when ready. Collect at the counter without waiting in lines.',
              icon: <Sparkles className="w-5 h-5 text-purple-500" />,
            },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative">
              <span className="text-3xl font-black text-slate-100 absolute top-4 right-4">{item.step}</span>
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Menu Items Preview */}
      {featuredFoods.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Student Favorites</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Popular Campus Dishes</h2>
            </div>
            <Link
              to="/student/menu"
              className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View Full Menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
