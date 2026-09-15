import { api } from './api.js';
import {
  SalesOverview,
  DailyTrend,
  PopularFood,
  CategorySales,
  MovingAverageForecast,
} from '../types/index.js';

export const AnalyticsService = {
  async getOverview(): Promise<SalesOverview> {
    const res = (await api.get('/analytics/overview')) as any;
    return res.data;
  },

  async getSalesTrends(days: number = 14): Promise<DailyTrend[]> {
    const res = (await api.get('/analytics/sales-trends', { params: { days } })) as any;
    return res.data;
  },

  async getPopularity(limit: number = 10): Promise<PopularFood[]> {
    const res = (await api.get('/analytics/popularity', { params: { limit } })) as any;
    return res.data;
  },

  async getCategorySales(): Promise<CategorySales[]> {
    const res = (await api.get('/analytics/category-sales')) as any;
    return res.data;
  },

  async getForecast(foodItemId: string, window: number = 7, history: number = 30): Promise<MovingAverageForecast> {
    const res = (await api.get(`/analytics/forecast/${foodItemId}`, {
      params: { window, history },
    })) as any;
    return res.data;
  },

  async getKitchenRecommendations(window: number = 7): Promise<MovingAverageForecast[]> {
    const res = (await api.get('/analytics/recommendations', { params: { window } })) as any;
    return res.data;
  },

  downloadCsv(range: string = '30d') {
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/reports/csv?range=${range}`;
    const token = localStorage.getItem('campusbite_token');
    window.open(`${url}&token=${token}`, '_blank');
  },

  downloadPdf(range: string = '30d') {
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analytics/reports/pdf?range=${range}`;
    const token = localStorage.getItem('campusbite_token');
    window.open(`${url}&token=${token}`, '_blank');
  },
};
