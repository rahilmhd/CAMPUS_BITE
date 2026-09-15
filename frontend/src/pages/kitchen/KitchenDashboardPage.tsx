import React, { useEffect, useState } from 'react';
import { OrderService } from '../../services/order.service.js';
import { Order, OrderStatus } from '../../types/index.js';
import { useSocket } from '../../context/SocketContext.js';
import { KitchenOrderCard } from '../../components/kitchen/KitchenOrderCard.js';
import { ChefHat, RefreshCw, BellRing, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export const KitchenDashboardPage: React.FC = () => {
  const { socket } = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchKitchenOrders = async () => {
    try {
      const res = await OrderService.getOrders({ limit: 100 });
      setOrders(res.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
  }, []);

  // Real-time WebSocket Listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data: any) => {
      console.log('⚡ New order arrived in kitchen live queue:', data);
      fetchKitchenOrders();
    };

    const handleStatusUpdated = () => {
      fetchKitchenOrders();
    };

    socket.on('order:created', handleNewOrder);
    socket.on('order:status_updated', handleStatusUpdated);

    return () => {
      socket.off('order:created', handleNewOrder);
      socket.off('order:status_updated', handleStatusUpdated);
    };
  }, [socket]);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setProcessingId(orderId);
    try {
      await OrderService.updateStatus(orderId, nextStatus);
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
    } catch (e: any) {
      alert(e.message || 'Failed to update order status');
    } finally {
      setProcessingId(null);
    }
  };

  // Group active orders into Kanban columns
  const placedOrders = orders.filter((o) => o.status === 'PLACED');
  const confirmedOrders = orders.filter((o) => o.status === 'CONFIRMED');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kitchen Live Queue Display</h1>
            <p className="text-xs text-slate-500">Real-time canteen order dispatching & status lifecycle</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Real-Time Socket Connected
          </span>

          <button
            onClick={fetchKitchenOrders}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
            title="Refresh Orders"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Kanban Board Grid: 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Column 1: New / Placed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-brand-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-500"></span>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                New Placed Orders
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-800">
              {placedOrders.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {placedOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No new orders waiting
              </div>
            ) : (
              placedOrders.map((order) => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  isProcessing={processingId === order.id}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 2: Confirmed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-amber-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                Confirmed Queue
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {confirmedOrders.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {confirmedOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No confirmed orders in queue
              </div>
            ) : (
              confirmedOrders.map((order) => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  isProcessing={processingId === order.id}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 3: Cooking / Preparing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-blue-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                Currently Cooking
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {preparingOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
                Nothing currently cooking
              </div>
            ) : (
              preparingOrders.map((order) => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  isProcessing={processingId === order.id}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 4: Ready for Pickup */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                Ready at Counter 🔔
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {readyOrders.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
                No orders ready for collection
              </div>
            ) : (
              readyOrders.map((order) => (
                <KitchenOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  isProcessing={processingId === order.id}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
