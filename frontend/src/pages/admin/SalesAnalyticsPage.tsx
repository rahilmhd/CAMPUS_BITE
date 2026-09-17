import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '../../services/analytics.service.js';
import { SalesOverview, DailyTrend, PopularFood } from '../../types/index.js';
import { SalesTrendChart } from '../../components/charts/SalesTrendChart.js';
import { MetricCard } from '../../components/admin/MetricCard.js';
import { IndianRupee, TrendingUp, ShoppingCart, Award } from 'lucide-react';

export const SalesAnalyticsPage: React.FC = () => {
  const [overview, setOverview] = useState<SalesOverview | null>(null);
  const [trends, setTrends] = useState<DailyTrend[]>([]);
  const [popular, setPopular] = useState<PopularFood[]>([]);
  const [timeRange, setTimeRange] = useState<number>(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ov, tr, pop] = await Promise.all([
          AnalyticsService.getOverview(),
          AnalyticsService.getSalesTrends(timeRange),
          AnalyticsService.getPopularity(10),
        ]);
        setOverview(ov);
        setTrends(tr);
        setPopular(pop);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange]);

  if (loading || !overview) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full inline-block mb-2">
            Financial Performance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Canteen Sales Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historical demand evaluation, revenue streams, and average order value metrics.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-dark-card/80 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 text-xs font-bold shadow-inner">
          {[
            { days: 7, label: 'Last 7 Days' },
            { days: 14, label: 'Last 14 Days' },
            { days: 30, label: 'Last 30 Days' },
          ].map((t) => (
            <button
              key={t.days}
              onClick={() => setTimeRange(t.days)}
              className={`px-3.5 py-1.5 rounded-xl transition-all font-semibold ${
                timeRange === t.days
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="All-Time Total Sales"
          value={`₹${overview.totalSales.toLocaleString()}`}
          subtitle={`${overview.totalOrders} total completed orders`}
          icon={<IndianRupee className="w-5 h-5 text-brand-400" />}
        />
        <MetricCard
          title="Weekly Revenue"
          value={`₹${overview.weeklySales.toLocaleString()}`}
          subtitle="Past 7 calendar days"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
        />
        <MetricCard
          title="Average Order Value"
          value={`₹${overview.averageOrderValue}`}
          subtitle="Per student transaction"
          icon={<ShoppingCart className="w-5 h-5 text-cyan-400" />}
        />
        <MetricCard
          title="Most Popular Dish"
          value={popular[0]?.name || 'Chicken Biriyani'}
          subtitle={`${popular[0]?.quantitySold || 0} portions sold`}
          icon={<Award className="w-5 h-5 text-amber-400" />}
        />
      </div>

      {/* Sales Trend Chart */}
      <div className="card-3d p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Revenue Progression Trend</h3>
            <p className="text-xs text-slate-400">Daily sales aggregates across selected window ({timeRange} days)</p>
          </div>
        </div>
        <SalesTrendChart data={trends} />
      </div>

      {/* Food Popularity Table */}
      <div className="card-3d p-6 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white">Top Food Items Contribution</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="pb-3">Rank</th>
                <th className="pb-3">Food Item</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Portions Sold</th>
                <th className="pb-3">Gross Revenue</th>
                <th className="pb-3 text-right">Contribution %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium text-slate-300">
              {popular.map((item, idx) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-bold text-slate-500">#{idx + 1}</td>
                  <td className="py-3 font-bold text-white">{item.name}</td>
                  <td className="py-3 text-slate-400">{item.category}</td>
                  <td className="py-3 font-bold text-slate-200">{item.quantitySold}</td>
                  <td className="py-3 font-black text-brand-400">₹{item.revenue.toLocaleString()}</td>
                  <td className="py-3 text-right font-bold text-emerald-400">{item.percentageContribution}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
