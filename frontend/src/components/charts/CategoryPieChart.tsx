import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CategorySales } from '../../types/index.js';

export const CategoryPieChart: React.FC<{ data: CategorySales[] }> = ({ data }) => {
  const COLORS = ['#ff6b00', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

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
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
              `₹${value} (${item.payload.percentage}%)`,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(val) => <span className="text-xs text-slate-300 font-semibold">{val}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
