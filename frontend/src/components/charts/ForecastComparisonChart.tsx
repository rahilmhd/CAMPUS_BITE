import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { MovingAverageForecast } from '../../types/index.js';

export const ForecastComparisonChart: React.FC<{ forecast: MovingAverageForecast }> = ({
  forecast,
}) => {
  const chartData = forecast.historicalDemand.map((d, index) => {
    // Show moving average for points in window
    const isInWindow = index >= forecast.historicalDemand.length - forecast.windowSize;
    return {
      date: d.date.split('-').slice(1).join('/'), // MM/DD
      actualDemand: d.quantity,
      forecastLine: isInWindow && forecast.movingAverageValue ? forecast.movingAverageValue : null,
    };
  });

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 10, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            height={36}
            formatter={(val) => <span className="text-xs text-slate-600 font-semibold">{val}</span>}
          />
          <Bar
            name="Daily Actual Demand (Portions)"
            dataKey="actualDemand"
            fill="#fdba74"
            radius={[6, 6, 0, 0]}
          />
          <Line
            name={`${forecast.windowSize}-Day Moving Average Trend`}
            type="monotone"
            dataKey="forecastLine"
            stroke="#ea580c"
            strokeWidth={3}
            dot={{ r: 4, fill: '#ea580c' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
