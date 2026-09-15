import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '../../services/analytics.service.js';
import {
  SalesOverview,
  DailyTrend,
  PopularFood,
  CategorySales,
} from '../../types/index.js';
import { MetricCard } from '../../components/admin/MetricCard.js';
import { SalesTrendChart } from '../../components/charts/SalesTrendChart.js';
import { PopularFoodChart } from '../../components/charts/PopularFoodChart.js';
import { CategoryPieChart } from '../../components/charts/CategoryPieChart.js';
import {
  IndianRupee,
  ShoppingBag,
  Clock,
  Users,
  Utensils,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<SalesOverview | null>(null);
  const [trends, setTrends] = useState<DailyTrend[]>([]);
  const [popular, setPopular] = useState<PopularFood[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ov, tr, pop, cats] = await Promise.all([
          AnalyticsService.getOverview(),
          AnalyticsService.getSalesTrends(14),
          AnalyticsService.getPopularity(6),
          AnalyticsService.getCategorySales(),
        ]);
        setOverview(ov);
        setTrends(tr);
        setPopular(pop);
        setCategorySales(cats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !overview) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Navigation Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Administrative Central Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            CampusBite Management & Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time canteen metrics calculated directly from database order transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/forecast" className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" /> Moving Average Explorer
          </Link>
          <Link to="/admin/reports" className="btn-primary text-xs py-2 px-3 font-bold">
            Export Reports
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Today's Canteen Sales"
          value={`₹${overview.todaySales.toLocaleString()}`}
          subtitle={`${overview.todayOrdersCount} orders placed today`}
          icon={<IndianRupee className="w-5 h-5" />}
          trend="+14% vs yesterday"
          trendPositive={true}
        />

        <MetricCard
          title="Monthly Total Revenue"
          value={`₹${overview.monthlySales.toLocaleString()}`}
          subtitle={`AOV: ₹${overview.averageOrderValue}`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="Last 30 Days"
          trendPositive={true}
        />

        <MetricCard
          title="Registered Students"
          value={overview.totalStudents}
          subtitle={`${overview.totalKitchenStaff} kitchen staff active`}
          icon={<Users className="w-5 h-5" />}
        />

        <MetricCard
          title="Active Food Items"
          value={overview.totalFoods}
          subtitle={`${overview.pendingOrders} pending in kitchen queue`}
          icon={<Utensils className="w-5 h-5" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daily Revenue Trend (Last 14 Days)</h3>
              <p className="text-xs text-slate-400">Calculated from actual completed transactions</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              INR (₹)
            </span>
          </div>

          <SalesTrendChart data={trends} />
        </div>

        {/* Category Breakdown Pie */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Revenue by Category</h3>
            <p className="text-xs text-slate-400">Share of total sales across departments</p>
          </div>

          <CategoryPieChart data={categorySales} />
        </div>
      </div>

      {/* Popular Foods Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Food Popularity Rankings</h3>
            <p className="text-xs text-slate-400">Ranked by actual cumulative portions sold</p>
          </div>
          <Link
            to="/admin/foods"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Manage Food Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <PopularFoodChart data={popular} />
      </div>
    </div>
  );
};
