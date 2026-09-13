import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { PopularFood } from '../../types/index.js';

export const PopularFoodChart: React.FC<{ data: PopularFood[] }> = ({ data }) => {
  const colors = ['#f97316', '#fb923c', '#fdba74', '#10b981', '#14b8a6', '#06b6d4', '#6366f1'];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data.slice(0, 6)}
          margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            width={110}
            tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(value: any, name: any, item: any) => [
              `${value} sold (₹${item.payload.revenue})`,
              'Portions Sold',
            ]}
          />
          <Bar dataKey="quantitySold" radius={[0, 10, 10, 0]}>
            {data.slice(0, 6).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
