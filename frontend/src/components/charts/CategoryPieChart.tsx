import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CategorySales } from '../../types/index.js';

export const CategoryPieChart: React.FC<{ data: CategorySales[] }> = ({ data }) => {
  const COLORS = ['#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="revenue"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(value: any, name: any, item: any) => [
              `₹${value} (${item.payload.percentage}%)`,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(val) => <span className="text-xs text-slate-600 font-medium">{val}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
