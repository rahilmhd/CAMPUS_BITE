import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { FoodService } from '../../services/food.service.js';
import { FoodItem } from '../../types/index.js';
import { FoodCard } from '../../components/student/FoodCard.js';
import { PictureHeroBlock } from '../../components/home/PictureHeroBlock.js';
import { UtensilsCrossed, ArrowRight, Clock, Bell } from 'lucide-react';

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
      {/* Hero Section: Unified Picture Hero Block (Writings inside extended black background on left, burger on right) */}
      <section className="relative pt-6 pb-12 lg:pt-10 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PictureHeroBlock />
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
