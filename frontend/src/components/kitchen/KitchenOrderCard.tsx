import React from 'react';
import { Order, OrderStatus } from '../../types/index.js';
import { Clock, User, Check, ChefHat, Bell, Sparkles, X } from 'lucide-react';

interface KitchenOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => Promise<void>;
  isProcessing?: boolean;
}

export const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({
  order,
  onUpdateStatus,
  isProcessing = false,
}) => {
  // Calculate elapsed time since placement
  const elapsedMinutes = Math.max(
    0,
    Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000)
  );

  const getUrgencyClass = () => {
    if (order.status === 'READY') return 'border-emerald-300 bg-emerald-50/20';
    if (elapsedMinutes > 20) return 'border-rose-300 bg-rose-50/30';
    if (elapsedMinutes > 10) return 'border-amber-300 bg-amber-50/20';
    return 'border-slate-200 bg-white';
  };

  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${getUrgencyClass()}`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-black text-slate-800 tracking-wider">
              #{order.orderNumber}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700">{order.user?.name || 'Student'}</span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                elapsedMinutes > 20
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Clock className="w-3 h-3" />
              {elapsedMinutes}m ago
            </span>
            {order.pickupTime && (
              <span className="block text-[10px] text-slate-400 mt-0.5">
                Pickup: {new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        {/* Order Items List */}
        <div className="py-3 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg bg-brand-100 text-brand-700 font-extrabold flex items-center justify-center text-[11px]">
                  {item.quantity}x
                </span>
                <span className="font-semibold text-slate-800">{item.foodItem.name}</span>
              </div>
              <span className="text-slate-400 font-medium">₹{item.subtotal}</span>
            </div>
          ))}

          {order.notes && (
            <div className="mt-2 p-2 rounded-xl bg-amber-50 text-[11px] text-amber-800 italic">
              Note: {order.notes}
            </div>
          )}
        </div>
      </div>

      {/* Action Progression Controls */}
      <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
        {order.status === 'PLACED' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'CONFIRMED')}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" /> Accept Order
          </button>
        )}

        {order.status === 'CONFIRMED' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'PREPARING')}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-brand-500/20 active:scale-95 transition-all"
          >
            <ChefHat className="w-4 h-4" /> Start Cooking
          </button>
        )}

        {order.status === 'PREPARING' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Bell className="w-4 h-4" /> Mark Ready for Pickup
          </button>
        )}

        {order.status === 'READY' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Complete & Handover
          </button>
        )}

        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
            disabled={isProcessing}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Cancel Order"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
