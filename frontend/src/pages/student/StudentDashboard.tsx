import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { OrderService } from '../../services/order.service.js';
import { FoodService } from '../../services/food.service.js';
import { Order, FoodItem } from '../../types/index.js';
import { OrderTracker } from '../../components/student/OrderTracker.js';
import { FoodCard } from '../../components/student/FoodCard.js';
import { ShoppingBag, Clock, ArrowRight, UtensilsCrossed, Sparkles } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [popularFoods, setPopularFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ordersRes, foodsRes] = await Promise.all([
          OrderService.getOrders({ limit: 10 }),
          FoodService.getAll({ sortBy: 'popularity' }),
        ]);

        const allOrders = ordersRes.orders;
        const current = allOrders.find((o) =>
          ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status)
        );

        setActiveOrder(current || null);
        setRecentOrders(allOrders.slice(0, 5));
        setPopularFoods(foodsRes.slice(0, 4));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-dark-surface via-brand-950/40 to-dark-surface border border-brand-500/30 p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Student Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {user?.name.split(' ')[0]}! 🍛
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Order fresh canteen favorites in advance, pay in seconds, and skip the queues with real-time pickup alerts.
            </p>
          </div>

          <Link
            to="/student/menu"
            className="btn-primary py-3 px-6 text-sm flex items-center gap-2 whitespace-nowrap shadow-3d-btn"
          >
            <UtensilsCrossed className="w-4 h-4" /> Browse Menu Now
          </Link>
        </div>
      </div>

      {/* Active Order Live Tracker */}
      {activeOrder && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h2 className="text-base font-bold text-white">Current Active Order</h2>
            </div>
            <Link
              to={`/student/track/${activeOrder.id}`}
              className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              Full Screen Tracking <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <OrderTracker
            status={activeOrder.status}
            orderNumber={activeOrder.orderNumber}
            pickupTime={activeOrder.pickupTime}
            createdAt={activeOrder.createdAt}
          />
        </section>
      )}

      {/* Popular Foods Recommendations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Campus Favorites Today</h2>
            <p className="text-xs text-slate-400">Quick-order trending dishes loved by students</p>
          </div>
          <Link
            to="/student/menu"
            className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            Full Menu <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* Recent Orders Table */}
      <section className="card-3d p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <h2 className="text-base font-bold text-white">Your Recent Orders</h2>
          <Link
            to="/student/orders"
            className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
          >
            View All Orders
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            You haven't placed any orders yet.{' '}
            <Link to="/student/menu" className="text-brand-400 font-bold hover:underline">
              Explore the menu!
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-300 font-medium">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 font-bold text-white">#{ord.orderNumber}</td>
                    <td className="py-3.5 text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 text-slate-300 truncate max-w-xs">
                      {ord.items.map((i) => `${i.foodItem.name} (${i.quantity})`).join(', ')}
                    </td>
                    <td className="py-3.5 font-black text-brand-400">₹{ord.totalAmount}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          ord.status === 'COMPLETED'
                            ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300'
                            : ord.status === 'READY'
                            ? 'bg-brand-950/70 border-brand-500/40 text-brand-300 shadow-glow-orange-sm'
                            : ord.status === 'PREPARING'
                            ? 'bg-amber-950/70 border-amber-500/30 text-amber-300'
                            : ord.status === 'CANCELLED'
                            ? 'bg-rose-950/70 border-rose-500/30 text-rose-300'
                            : 'bg-dark-elevated border-white/10 text-slate-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to={`/student/track/${ord.id}`}
                        className="btn-secondary py-1 px-3 text-[11px] font-bold"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
