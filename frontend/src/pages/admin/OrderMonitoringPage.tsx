import React, { useEffect, useState } from 'react';
import { OrderService } from '../../services/order.service.js';
import { Order } from '../../types/index.js';
import {
  Eye,
  X,
  Filter,
} from 'lucide-react';

export const OrderMonitoringPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getOrders({
        status: statusFilter || undefined,
        limit: 100,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.07]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Audit & Lifecycle</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Campus Order Monitoring</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supervise canteen transactional flow, payment authorizations, and kitchen handovers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 rounded-xl bg-dark-elevated border border-white/10 text-xs font-semibold text-slate-200 focus:border-brand-500"
          >
            <option value="">All Orders ({orders.length})</option>
            <option value="PLACED">Placed</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card-3d overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-dark-elevated/80 border-b border-white/[0.08] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-medium">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-black text-white">#{o.orderNumber}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{o.user?.name}</span>
                    <span className="text-[10px] text-slate-500">{o.user?.email}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 truncate max-w-[220px]">
                    {o.items.map((i) => `${i.foodItem.name} (${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3 px-4 font-black text-brand-400">₹{o.totalAmount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        o.paymentStatus === 'SUCCESS'
                          ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300'
                          : 'bg-amber-950/70 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        o.status === 'COMPLETED'
                          ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300'
                          : o.status === 'READY'
                          ? 'bg-brand-950/70 border-brand-500/40 text-brand-300 shadow-glow-orange-sm'
                          : o.status === 'PREPARING'
                          ? 'bg-amber-950/70 border-amber-500/30 text-amber-300'
                          : 'bg-dark-elevated text-slate-300 border-white/5'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-1.5 text-brand-400 hover:text-brand-300 hover:bg-brand-500/10 rounded-lg font-bold text-xs inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Audit Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-bg/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d max-w-lg w-full p-6 space-y-4 border border-brand-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="font-bold text-white text-base">Order Audit #{selectedOrder.orderNumber}</h3>
                <span className="text-[11px] text-slate-400">Created {new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-dark-elevated space-y-1.5 border border-white/5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer</span>
                  <span className="font-bold text-white">{selectedOrder.user?.name} ({selectedOrder.user?.email})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Reference</span>
                  <span className="font-mono text-brand-400">{selectedOrder.payment?.transactionReference || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Amount</span>
                  <span className="font-black text-brand-400 text-sm">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>

              {/* Items */}
              <div>
                <span className="font-bold text-slate-300 block mb-1">Purchased Food Items</span>
                <div className="space-y-1 border rounded-xl p-3 border-white/10 bg-dark-elevated/40">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-slate-300">
                      <span>{it.foodItem.name} × {it.quantity}</span>
                      <span className="font-bold text-white">₹{it.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Audit Log */}
              <div>
                <span className="font-bold text-slate-300 block mb-1.5">Lifecycle Audit Trail</span>
                <div className="space-y-2 border rounded-xl p-3 border-white/10 bg-dark-elevated/40">
                  {selectedOrder.statusHistory?.map((h) => (
                    <div key={h.id} className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-brand-400">{h.status}</span>
                      <span className="text-slate-400">{new Date(h.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-secondary text-xs py-2 px-4 font-bold"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
