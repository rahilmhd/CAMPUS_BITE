import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { FoodService } from '../../services/food.service.js';
import { FoodItem } from '../../types/index.js';
import { FoodCard } from '../../components/student/FoodCard.js';
import { HeroBurgerShowcase } from '../../components/home/HeroBurgerShowcase.js';
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
    <div className="space-y-16 pb-20">
      {/* Hero Section with Master 3D Dynamic Burger Visuals */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:pt-16 lg:pb-20">
        {/* Atmospheric Orange Ambient Light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-500/[0.14] rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold tracking-wide shadow-glow-orange-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Smart Campus Food Ordering</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Fresh Campus Food,{' '}
                <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-amber-400 bg-clip-text text-transparent">
                  Zero Waiting.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Pre-order hot sizzled meals from the campus canteen, skip the lines, and pick up your food fresh, hot, and ready.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={getDashboardLink()}
                  className="btn-primary py-3.5 px-8 text-base flex items-center gap-2"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  {user ? 'Go to Menu' : 'Browse Menu'}
                </Link>

                {!user && (
                  <Link
                    to="/login"
                    className="btn-secondary py-3.5 px-6 text-sm flex items-center gap-2"
                  >
                    Sign In <ArrowRight className="w-4 h-4 text-brand-400" />
                  </Link>
                )}
              </div>

              {/* Quick Status Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-sm animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-300">Canteen Grill Open</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Avg. Prep:</span>
                  <span className="text-xs font-bold text-brand-400">8–12 Mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Live Queue:</span>
                  <span className="text-xs font-bold text-amber-400">Fast Counter</span>
                </div>
              </div>
            </div>

            {/* Right Dynamic 3D Burger Showcase */}
            <div className="lg:col-span-6 flex justify-center items-center">
              <HeroBurgerShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* 3D Minimal Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-3d p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-brand-500/15 text-brand-400 border border-brand-500/30 flex items-center justify-center flex-shrink-0 shadow-glow-orange-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Browse & Pre-Order</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Select meals from the daily menu in advance at your own convenience.</p>
            </div>
          </div>

          <div className="card-3d p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Save Valuable Time</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Place orders between classes and pick up directly at the counter.</p>
            </div>
          </div>

          <div className="card-3d p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Live Order Tracking</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Receive instant notifications the moment your meal is prepared.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Preview */}
      {featuredFoods.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Popular Dishes</h2>
              <p className="text-xs text-slate-400 mt-0.5">Campus favorites freshly prepared today</p>
            </div>
            <Link
              to="/student/menu"
              className="text-xs sm:text-sm font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
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
