import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OrderService } from '../../services/order.service.js';
import { Order, OrderStatus } from '../../types/index.js';
import { useSocket } from '../../context/SocketContext.js';
import { OrderTracker } from '../../components/student/OrderTracker.js';
import { Clock, ArrowLeft, Receipt, CheckCircle2, ShieldCheck } from 'lucide-react';

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
        console.log('⚡ Received real-time status update for order:', data);
        setOrder((prev) => (prev ? { ...prev, status: data.status } : prev));
        // Refetch full audit details
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
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Order Not Found</h3>
        <Link to="/student/orders" className="btn-primary text-xs">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <Link
          to="/student/orders"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Receipt className="w-4 h-4 text-brand-500" /> Order Items ({order.items.length})
          </h3>

          <div className="divide-y divide-slate-50 space-y-2">
            {order.items.map((i) => (
              <div key={i.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">{i.foodItem.name}</p>
                  <span className="text-[11px] text-slate-400">Qty: {i.quantity} × ₹{i.unitPrice}</span>
                </div>
                <span className="font-bold text-slate-900">₹{i.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between text-sm">
            <span className="font-bold text-slate-900">Total Amount Paid</span>
            <span className="text-xl font-black text-brand-600">₹{order.totalAmount}</span>
          </div>

          {order.notes && (
            <div className="mt-3 p-3 rounded-2xl bg-slate-50 text-xs text-slate-600">
              <strong>Instructions:</strong> {order.notes}
            </div>
          )}
        </div>

        {/* Audit Status History Timeline */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="w-4 h-4 text-brand-500" /> Status History Log
          </h3>

          <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {order.statusHistory?.map((hist, index) => (
              <div key={hist.id} className="relative pl-6 text-xs">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </div>
                <p className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">{hist.status}</p>
                <p className="text-[11px] text-slate-400">
                  {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                {hist.notes && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{hist.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
