import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { FoodService } from '../../services/food.service.js';
import { FoodItem } from '../../types/index.js';
import { FoodCard } from '../../components/student/FoodCard.js';
import { UtensilsCrossed, ArrowRight, Clock, Bell, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [featuredFoods, setFeaturedFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const foods = await FoodService.getAll({ sortBy: 'popularity' });
        setFeaturedFoods(foods.slice(0, 4));
      } catch (e) {
        // Non-critical
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/student/menu';
    if (user.role === 'STUDENT') return '/student/menu';
    if (user.role === 'KITCHEN_STAFF') return '/kitchen/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/student/menu';
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-brand-50/40 via-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Fresh Campus Food,{' '}
                <span className="bg-gradient-to-r from-brand-500 to-amber-500 bg-clip-text text-transparent">
                  Zero Waiting.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Pre-order meals from the campus canteen, skip the lines, and pick up your food fresh and ready.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={getDashboardLink()}
                  className="btn-primary py-3.5 px-8 text-base shadow-lg shadow-brand-500/25 flex items-center gap-2"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  {user ? 'Go to Menu' : 'Browse Menu'}
                </Link>

                {!user && (
                  <Link
                    to="/login"
                    className="btn-secondary py-3.5 px-6 text-sm flex items-center gap-2"
                  >
                    Sign In <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right Clean Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-700">Canteen Open</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700">
                    Order Online
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
                    🍲
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900">Today's Specials</h3>
                    <p className="text-xs text-slate-500">Prepared fresh throughout the day</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50/60 to-amber-50/60 border border-brand-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Avg. Preparation</span>
                    <span className="text-sm font-bold text-slate-800">10 – 15 mins</span>
                  </div>
                  <Link
                    to="/student/menu"
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    View Dishes <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal 3-Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Browse & Pre-Order</h3>
              <p className="text-xs text-slate-500 mt-1">Select meals from the daily menu at your own pace.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Save Time</h3>
              <p className="text-xs text-slate-500 mt-1">Order before your break and pick up without lines.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Live Notifications</h3>
              <p className="text-xs text-slate-500 mt-1">Get an alert the moment your food is ready at the counter.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Preview */}
      {featuredFoods.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Popular Dishes</h2>
              <p className="text-xs text-slate-500 mt-0.5">Top campus favorites today</p>
            </div>
            <Link
              to="/student/menu"
              className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
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
