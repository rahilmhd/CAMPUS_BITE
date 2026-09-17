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
              <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#ff6b00" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.07)" />
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
              backgroundColor: '#131722',
              borderRadius: '14px',
              border: '1px solid rgba(255, 107, 0, 0.3)',
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.9)',
              color: '#fff',
              fontSize: '12px',
              padding: '8px 12px',
            }}
            formatter={(value: any) => [`₹${value}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#ff6b00"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#salesGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
