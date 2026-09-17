import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OrderService } from '../../services/order.service.js';
import { Order, OrderStatus } from '../../types/index.js';
import { useSocket } from '../../context/SocketContext.js';
import { OrderTracker } from '../../components/student/OrderTracker.js';
import { Clock, ArrowLeft, Receipt } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { socket } = useSocket();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const data = await OrderService.getById(id);
      setOrder(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Real-time WebSocket listener
  useEffect(() => {
    if (!socket || !id) return;

    const handleStatusUpdate = (data: { orderId: string; status: OrderStatus }) => {
      if (data.orderId === id) {
        setOrder((prev) => (prev ? { ...prev, status: data.status } : prev));
        fetchOrder();
      }
    };

    socket.on('order:status_updated', handleStatusUpdate);

    return () => {
      socket.off('order:status_updated', handleStatusUpdate);
    };
  }, [socket, id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/10 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Order Not Found</h3>
        <Link to="/student/orders" className="btn-primary text-xs">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
        <Link
          to="/student/orders"
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-brand-400" /> Back to My Orders
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Live WebSocket Connected
        </span>
      </div>

      {/* Visual Stepper Tracker */}
      <OrderTracker
        status={order.status}
        orderNumber={order.orderNumber}
        pickupTime={order.pickupTime}
        createdAt={order.createdAt}
      />

      {/* Order Details & Audit History */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Items Summary */}
        <div className="md:col-span-7 card-3d p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
            <Receipt className="w-4 h-4 text-brand-400" /> Order Items ({order.items.length})
          </h3>

          <div className="divide-y divide-white/[0.04] space-y-2">
            {order.items.map((i) => (
              <div key={i.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{i.foodItem.name}</p>
                  <span className="text-[11px] text-slate-400">Qty: {i.quantity} × ₹{i.unitPrice}</span>
                </div>
                <span className="font-black text-brand-400">₹{i.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex items-baseline justify-between text-sm">
            <span className="font-bold text-white">Total Amount Paid</span>
            <span className="text-xl font-black text-brand-400">₹{order.totalAmount}</span>
          </div>

          {order.notes && (
            <div className="mt-3 p-3 rounded-xl bg-dark-elevated border border-white/5 text-xs text-slate-300">
              <strong className="text-brand-400">Instructions:</strong> {order.notes}
            </div>
          )}
        </div>

        {/* Audit Status History Timeline */}
        <div className="md:col-span-5 card-3d p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
            <Clock className="w-4 h-4 text-brand-400" /> Status History Log
          </h3>

          <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.08]">
            {order.statusHistory?.map((hist) => (
              <div key={hist.id} className="relative pl-6 text-xs">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center text-[9px] font-bold shadow-glow-orange-sm">
                  ✓
                </div>
                <p className="font-bold text-brand-400 uppercase tracking-wide text-[11px]">{hist.status}</p>
                <p className="text-[11px] text-slate-400">
                  {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                {hist.notes && (
                  <p className="text-[11px] text-slate-300 mt-0.5">{hist.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
