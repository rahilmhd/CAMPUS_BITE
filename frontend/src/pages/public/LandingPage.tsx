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
      {/* Hero Section: 5-Star Luxury Division Bar */}
      <section className="relative pt-6 pb-12 lg:pt-10 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* The 5-Star Hotel Division Bar with 3D Gradient Shadows */}
          <div className="hotel-division-bar p-8 sm:p-12 lg:p-14">
            {/* Subtle Luxury Ambient Radial Glow */}
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[480px] h-[480px] bg-brand-500/[0.12] rounded-full blur-[130px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Left Content: The Writings Portrayed with the Burger */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-400 text-xs font-bold tracking-wider uppercase shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  <span>Artisanal Campus Dining • Reserve Cut</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                  Fresh Gourmet Food,{' '}
                  <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-amber-400 bg-clip-text text-transparent">
                    Zero Waiting.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Experience handcrafted double smash patties, Wisconsin cheddar melt, and fresh culinary specials prepared to order. Skip counter queues with instant student mobile checkout.
                </p>

                {/* 3D Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    to={getDashboardLink()}
                    className="btn-primary py-3.5 px-8 text-sm sm:text-base flex items-center gap-2.5 shadow-glow-orange"
                  >
                    <UtensilsCrossed className="w-5 h-5" />
                    {user ? 'View Dining Menu' : 'Explore Menu'}
                  </Link>

                  {!user && (
                    <Link
                      to="/login"
                      className="btn-secondary py-3.5 px-7 text-sm flex items-center gap-2"
                    >
                      Sign In <ArrowRight className="w-4 h-4 text-brand-400" />
                    </Link>
                  )}
                </div>

                {/* 5-Star Status Tags */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-5 border-t border-white/[0.08] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-glow-sm animate-pulse" />
                    <span className="font-bold text-slate-200">Live Kitchen Open</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span>Average Preparation:</span>
                    <strong className="text-brand-400">8–10 Mins</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span>Counter Service:</span>
                    <strong className="text-amber-400">Priority Pass</strong>
                  </div>
                </div>
              </div>

              {/* Right: The Blended Burger Picture (Animation works ONLY on the burger picture) */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <HeroBurgerShowcase size="hero" />
              </div>
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
