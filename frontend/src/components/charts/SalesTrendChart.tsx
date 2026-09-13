import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DailyTrend } from '../../types/index.js';

export const SalesTrendChart: React.FC<{ data: DailyTrend[] }> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
              padding: '8px 12px',
            }}
            formatter={(value: any) => [`₹${value}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#ea580c"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#salesGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
