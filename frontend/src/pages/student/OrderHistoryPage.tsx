import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderService } from '../../services/order.service.js';
import { Order } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { Clock, Eye, RotateCcw, Receipt, Filter } from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getOrders({
        status: statusFilter || undefined,
        limit: 50,
      });
      setOrders(res.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleReorder = (order: Order) => {
    for (const item of order.items) {
      if (item.foodItem && item.foodItem.available) {
        addToCart(item.foodItem, item.quantity);
      }
    }
    alert(`Added available items from Order #${order.orderNumber} to your cart!`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.07]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Past Transactions</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">My Orders & Receipts</h1>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 rounded-xl bg-dark-elevated border border-white/10 text-xs font-semibold text-slate-200 focus:border-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready for Pickup</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-white/10 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="card-3d p-12 text-center space-y-3">
          <Receipt className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No orders found</h3>
          <p className="text-xs text-slate-400">You don't have any past orders matching this filter.</p>
          <Link to="/student/menu" className="btn-primary text-xs py-2 px-4 inline-flex">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="card-3d p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="font-black text-sm sm:text-base text-white">
                    #{order.orderNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      order.status === 'COMPLETED'
                        ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300'
                        : order.status === 'READY'
                        ? 'bg-brand-950/70 border-brand-500/40 text-brand-300 shadow-glow-orange-sm'
                        : order.status === 'PREPARING'
                        ? 'bg-amber-950/70 border-amber-500/30 text-amber-300'
                        : order.status === 'CANCELLED'
                        ? 'bg-rose-950/70 border-rose-500/30 text-rose-300'
                        : 'bg-dark-elevated border-white/10 text-slate-300'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                    {new Date(order.createdAt).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {order.items.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-dark-elevated/70 border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{item.foodItem.name}</span>
                      <span className="text-[11px] text-slate-400 block">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-brand-400">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-slate-400">Total Paid:</span>
                  <span className="text-lg font-black text-brand-400">₹{order.totalAmount}</span>
                  <span className="text-[10px] font-semibold text-slate-500">({order.payment?.method || 'MOCK'})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReorder(order)}
                    className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-brand-400" /> Reorder Items
                  </button>

                  <Link
                    to={`/student/track/${order.id}`}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-bold"
                  >
                    <Eye className="w-3.5 h-3.5" /> Live Tracking
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
