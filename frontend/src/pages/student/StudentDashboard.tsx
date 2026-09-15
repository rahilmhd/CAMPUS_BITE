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
        // Check for active order (placed, confirmed, preparing, or ready)
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-500 via-brand-600 to-orange-600 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Student Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name.split(' ')[0]}! 🍛
            </h1>
            <p className="text-orange-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Order fresh canteen favorites in advance, pay in seconds, and skip the queues with real-time pickup alerts.
            </p>
          </div>

          <Link
            to="/student/menu"
            className="px-6 py-3.5 rounded-2xl bg-white text-brand-600 font-bold text-sm shadow-md hover:bg-orange-50 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <UtensilsCrossed className="w-4 h-4" /> Browse Menu Now
          </Link>
        </div>
      </div>

      {/* Active Order Live Tracker (if active order exists) */}
      {activeOrder && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-base font-bold text-slate-900">Current Active Order</h2>
            </div>
            <Link
              to={`/student/track/${activeOrder.id}`}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
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
            <h2 className="text-lg font-bold text-slate-900">Campus Favorites Today</h2>
            <p className="text-xs text-slate-400">Quick-order trending dishes loved by students</p>
          </div>
          <Link
            to="/student/menu"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
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
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Your Recent Orders</h2>
          <Link
            to="/student/orders"
            className="text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            View All Orders
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">
            You haven't placed any orders yet.{' '}
            <Link to="/student/menu" className="text-brand-600 font-bold hover:underline">
              Explore the menu!
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 font-bold text-slate-900">#{ord.orderNumber}</td>
                    <td className="py-3 text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-slate-600 truncate max-w-xs">
                      {ord.items.map((i) => `${i.foodItem.name} (${i.quantity})`).join(', ')}
                    </td>
                    <td className="py-3 font-bold text-brand-600">₹{ord.totalAmount}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : ord.status === 'READY'
                            ? 'bg-purple-50 text-purple-700'
                            : ord.status === 'PREPARING'
                            ? 'bg-amber-50 text-amber-700'
                            : ord.status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-brand-50 text-brand-700'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/student/track/${ord.id}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
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
