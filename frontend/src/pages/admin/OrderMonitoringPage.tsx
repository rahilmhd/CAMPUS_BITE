import React, { useEffect, useState } from 'react';
import { OrderService } from '../../services/order.service.js';
import { Order, OrderStatus } from '../../types/index.js';
import {
  Clock,
  Search,
  Eye,
  X,
  Filter,
  Receipt,
  User,
  CheckCircle2,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Audit & Lifecycle</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Campus Order Monitoring</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supervise canteen transactional flow, payment authorizations, and kitchen handovers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs"
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
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Items Summary</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-black text-slate-900">#{o.orderNumber}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 block">{o.user?.name}</span>
                    <span className="text-[10px] text-slate-400">{o.user?.email}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[220px]">
                    {o.items.map((i) => `${i.foodItem.name} (${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3 px-4 font-bold text-brand-600">₹{o.totalAmount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        o.paymentStatus === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        o.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : o.status === 'READY'
                          ? 'bg-purple-50 text-purple-700'
                          : o.status === 'PREPARING'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-brand-50 text-brand-700'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg font-bold text-xs inline-flex items-center gap-1"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Order Audit #{selectedOrder.orderNumber}</h3>
                <span className="text-[11px] text-slate-400">Created {new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer</span>
                  <span className="font-bold text-slate-800">{selectedOrder.user?.name} ({selectedOrder.user?.email})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Reference</span>
                  <span className="font-mono text-slate-700">{selectedOrder.payment?.transactionReference || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Amount</span>
                  <span className="font-black text-brand-600 text-sm">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>

              {/* Items */}
              <div>
                <span className="font-bold text-slate-700 block mb-1">Purchased Food Items</span>
                <div className="space-y-1 border rounded-2xl p-3 border-slate-100">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-slate-600">
                      <span>{it.foodItem.name} × {it.quantity}</span>
                      <span className="font-bold text-slate-800">₹{it.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Audit Log */}
              <div>
                <span className="font-bold text-slate-700 block mb-1.5">Lifecycle Audit Trail</span>
                <div className="space-y-2 border rounded-2xl p-3 border-slate-100">
                  {selectedOrder.statusHistory?.map((h) => (
                    <div key={h.id} className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-brand-600">{h.status}</span>
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
