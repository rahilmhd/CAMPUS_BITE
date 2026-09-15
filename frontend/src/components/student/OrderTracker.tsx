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
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center text-rose-700">
        <XCircle className="w-10 h-10 mx-auto mb-2 text-rose-500" />
        <h3 className="text-base font-bold">Order #{orderNumber} Cancelled</h3>
        <p className="text-xs text-rose-600 mt-1">This order was cancelled. Any debited amount will be refunded.</p>
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Live Tracker</span>
          <h2 className="text-lg font-bold text-slate-900">Order #{orderNumber}</h2>
        </div>

        {pickupTime && (
          <div className="bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span className="text-xs font-bold text-amber-800">
              Pickup Estimated: {new Date(pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      {/* Stepper Progress Bar */}
      <div className="relative">
        {/* Connection Line */}
        <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-100 -z-0">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-700 ease-out"
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
                    ? 'bg-brand-50/80 ring-2 ring-brand-500/30 shadow-md'
                    : isCompleted
                    ? 'opacity-90'
                    : 'opacity-40'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-110 animate-bounce'
                      : isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                </div>

                <div className="text-left sm:text-center">
                  <h4 className="text-xs font-bold text-slate-800">{step.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {status === 'READY' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 animate-pulse">
          <div className="p-2 rounded-xl bg-emerald-500 text-white font-bold">🔔</div>
          <div>
            <h4 className="text-sm font-bold">Your food is ready!</h4>
            <p className="text-xs text-emerald-700">Please proceed to Counter 1 and present your Order Number #{orderNumber}.</p>
          </div>
        </div>
      )}
    </div>
  );
};
