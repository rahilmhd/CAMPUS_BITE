import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OrderService } from '../../services/order.service.js';
import { Order } from '../../types/index.js';
import { CheckCircle2, Clock, ArrowRight, Utensils, Receipt } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const data = await OrderService.getById(id);
        setOrder(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <p className="text-sm text-slate-500">Order not found.</p>
        <Link to="/student/menu" className="btn-primary text-xs mt-3">Back to Menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Payment Confirmed
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Order Placed Successfully!</h1>
          <p className="text-xs text-slate-500 mt-1">
            Order #{order.orderNumber} is now sent to the canteen kitchen.
          </p>
        </div>

        {/* Details Box */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-3">
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
            <span className="text-slate-400">Order Number</span>
            <span className="font-bold text-slate-900">#{order.orderNumber}</span>
          </div>

          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
            <span className="text-slate-400">Total Paid</span>
            <span className="font-black text-brand-600 text-sm">₹{order.totalAmount}</span>
          </div>

          {order.pickupTime && (
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
              <span className="text-slate-400">Estimated Ready Time</span>
              <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                {new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Items Ordered</span>
            {order.items.map((i) => (
              <div key={i.id} className="flex justify-between text-xs text-slate-700">
                <span>{i.foodItem.name} × {i.quantity}</span>
                <span className="font-semibold">₹{i.subtotal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="pt-2 space-y-2.5">
          <Link
            to={`/student/track/${order.id}`}
            className="w-full btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-brand-500/20"
          >
            <Clock className="w-4 h-4" /> Track Order in Real-Time <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/student/menu"
            className="w-full btn-secondary py-3 text-xs font-semibold block text-center"
          >
            Return to Menu
          </Link>
        </div>
      </div>
    </div>
  );
};
