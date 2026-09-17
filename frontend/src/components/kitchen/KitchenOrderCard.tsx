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
  const elapsedMinutes = Math.max(
    0,
    Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000)
  );

  const getUrgencyClass = () => {
    if (order.status === 'READY') return 'border-emerald-500/40 bg-emerald-950/20 shadow-lg shadow-emerald-950/30';
    if (elapsedMinutes > 20) return 'border-rose-500/50 bg-rose-950/25 shadow-lg shadow-rose-950/30';
    if (elapsedMinutes > 10) return 'border-amber-500/40 bg-amber-950/20 shadow-lg shadow-amber-950/20';
    return 'card-3d';
  };

  return (
    <div
      className={`rounded-3xl border p-5 transition-all flex flex-col justify-between ${getUrgencyClass()}`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <div>
            <span className="text-xs font-black text-brand-400 tracking-wider">
              #{order.orderNumber}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-200">{order.user?.name || 'Student'}</span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                elapsedMinutes > 20
                  ? 'bg-rose-950/70 border-rose-500/40 text-rose-300 animate-pulse'
                  : 'bg-dark-elevated border-white/5 text-slate-300'
              }`}
            >
              <Clock className="w-3 h-3" />
              {elapsedMinutes}m ago
            </span>
            {order.pickupTime && (
              <span className="block text-[10px] text-brand-400/80 mt-0.5 font-medium">
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
                <span className="w-5 h-5 rounded-lg bg-brand-500/20 border border-brand-500/30 text-brand-400 font-extrabold flex items-center justify-center text-[11px]">
                  {item.quantity}x
                </span>
                <span className="font-semibold text-white">{item.foodItem.name}</span>
              </div>
              <span className="text-slate-400 font-medium">₹{item.subtotal}</span>
            </div>
          ))}

          {order.notes && (
            <div className="mt-2 p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 italic">
              Note: {order.notes}
            </div>
          )}
        </div>
      </div>

      {/* Action Progression Controls */}
      <div className="pt-4 border-t border-white/[0.07] flex items-center gap-2">
        {order.status === 'PLACED' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'CONFIRMED')}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" /> Accept Order
          </button>
        )}

        {order.status === 'CONFIRMED' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'PREPARING')}
            disabled={isProcessing}
            className="flex-1 btn-primary py-2.5 px-3 text-xs flex items-center justify-center gap-1.5"
          >
            <ChefHat className="w-4 h-4" /> Start Cooking
          </button>
        )}

        {order.status === 'PREPARING' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'READY')}
            disabled={isProcessing}
            className="flex-1 btn-fresh py-2.5 px-3 text-xs flex items-center justify-center gap-1.5"
          >
            <Bell className="w-4 h-4" /> Mark Ready for Pickup
          </button>
        )}

        {order.status === 'READY' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
            disabled={isProcessing}
            className="flex-1 btn-secondary py-2.5 px-3 text-xs text-brand-400 hover:text-white flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-brand-400" /> Complete & Handover
          </button>
        )}

        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
            disabled={isProcessing}
            className="p-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Cancel Order"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
