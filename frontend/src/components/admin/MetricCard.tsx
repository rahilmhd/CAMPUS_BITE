import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
}) => {
  return (
    <div className="card-3d p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center shadow-glow-orange-sm">
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-black text-white tracking-tight">{value}</span>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              trendPositive
                ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/70 border-rose-500/30 text-rose-300'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
    </div>
  );
};
