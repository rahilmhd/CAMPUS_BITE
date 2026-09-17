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
  const colors = ['#ff6b00', '#ff8533', '#ffa161', '#10b981', '#14b8a6', '#06b6d4', '#8b5cf6'];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data.slice(0, 6)}
          margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255, 255, 255, 0.07)" />
          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            width={110}
            tick={{ fill: '#e2e8f0', fontSize: 11, fontWeight: 600 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#131722',
              borderRadius: '14px',
              border: '1px solid rgba(255, 107, 0, 0.3)',
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.9)',
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
