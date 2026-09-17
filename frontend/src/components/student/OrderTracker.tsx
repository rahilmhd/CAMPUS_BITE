import React from 'react';
import { OrderStatus } from '../../types/index.js';
import { CheckCircle2, Clock, ChefHat, Bell, Sparkles, XCircle } from 'lucide-react';

interface OrderTrackerProps {
  status: OrderStatus;
  orderNumber: string;
  pickupTime?: string | null;
  createdAt: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  status,
  orderNumber,
  pickupTime,
  createdAt,
}) => {
  const steps: Array<{
    key: OrderStatus;
    title: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      key: 'PLACED',
      title: 'Order Placed',
      description: 'Order sent to canteen',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      key: 'CONFIRMED',
      title: 'Confirmed',
      description: 'Kitchen accepted',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      key: 'PREPARING',
      title: 'Preparing Food',
      description: 'Chef is cooking',
      icon: <ChefHat className="w-4 h-4" />,
    },
    {
      key: 'READY',
      title: 'Ready for Pickup',
      description: 'Counter 1 Pickup',
      icon: <Bell className="w-4 h-4" />,
    },
    {
      key: 'COMPLETED',
      title: 'Completed',
      description: 'Enjoy your meal!',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  if (status === 'CANCELLED') {
    return (
      <div className="bg-rose-950/70 border border-rose-500/40 rounded-3xl p-6 text-center text-rose-300">
        <XCircle className="w-10 h-10 mx-auto mb-2 text-rose-400" />
        <h3 className="text-base font-bold">Order #{orderNumber} Cancelled</h3>
        <p className="text-xs text-rose-400/80 mt-1">This order was cancelled. Any debited amount will be refunded.</p>
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="card-3d p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.07]">
        <div>
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Live Status Tracker</span>
          <h2 className="text-lg font-bold text-white mt-0.5">Order #{orderNumber}</h2>
        </div>

        {pickupTime && (
          <div className="bg-amber-950/60 border border-amber-500/30 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-xs font-bold text-amber-300">
              Pickup Estimated: {new Date(pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      {/* Stepper Progress Bar */}
      <div className="relative">
        {/* Connection Line */}
        <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-dark-elevated -z-0 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-amber-400 to-emerald-400 transition-all duration-700 ease-out shadow-glow-orange-sm"
            style={{
              width: `${Math.min(100, Math.max(0, (currentIdx / (steps.length - 1)) * 100))}%`,
            }}
          ></div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isUpcoming = idx > currentIdx;

            return (
              <div
                key={step.key}
                className={`flex sm:flex-col items-center sm:text-center gap-3 p-3 sm:p-2 rounded-2xl transition-all ${
                  isCurrent
                    ? 'bg-brand-500/15 border border-brand-500/40 shadow-glow-orange-sm'
                    : isCompleted
                    ? 'opacity-90'
                    : 'opacity-40'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-glow-orange scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-dark-elevated text-slate-500 border border-white/5'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                </div>

                <div className="text-left sm:text-center">
                  <h4 className={`text-xs font-bold ${isCurrent ? 'text-brand-300' : 'text-slate-200'}`}>{step.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {status === 'READY' && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 flex items-center gap-3 text-emerald-200 shadow-lg shadow-emerald-950/50 animate-pulse">
          <div className="p-2 rounded-xl bg-emerald-500 text-white font-bold">🔔</div>
          <div>
            <h4 className="text-sm font-bold">Your food is ready for pickup!</h4>
            <p className="text-xs text-emerald-300/80">Please proceed to Counter 1 and present your Order Number #{orderNumber}.</p>
          </div>
        </div>
      )}
    </div>
  );
};
