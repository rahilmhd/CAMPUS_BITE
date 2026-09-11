import { api } from './api.js';
import { FoodItem, FoodCategory } from '../types/index.js';

export interface FoodQueryParams {
  search?: string;
  categoryId?: string;
  dietaryType?: string;
  availableOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export const FoodService = {
  async getAll(params?: FoodQueryParams): Promise<FoodItem[]> {
    const res = (await api.get('/foods', { params })) as any;
    return res.data;
  },

  async getById(id: string): Promise<FoodItem> {
    const res = (await api.get(`/foods/${id}`)) as any;
    return res.data;
  },

  async getCategories(): Promise<FoodCategory[]> {
    const res = (await api.get('/foods/categories')) as any;
    return res.data;
  },

  async create(data: any): Promise<FoodItem> {
    const res = (await api.post('/foods', data)) as any;
    return res.data;
  },

  async update(id: string, data: any): Promise<FoodItem> {
    const res = (await api.put(`/foods/${id}`, data)) as any;
    return res.data;
  },

  async toggleAvailability(id: string, available: boolean): Promise<FoodItem> {
    const res = (await api.patch(`/foods/${id}/availability`, { available })) as any;
    return res.data;
  },

  async delete(id: string): Promise<any> {
    const res = (await api.delete(`/foods/${id}`)) as any;
    return res.data;
  },

  async createCategory(data: { name: string; description?: string }): Promise<FoodCategory> {
    const res = (await api.post('/foods/categories', data)) as any;
    return res.data;
  },
};
