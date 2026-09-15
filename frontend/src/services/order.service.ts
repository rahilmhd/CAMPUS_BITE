import { api } from './api.js';
import { Order, OrderStatus } from '../types/index.js';

export interface CreateOrderPayload {
  items: Array<{ foodItemId: string; quantity: number }>;
  pickupTime?: string;
  paymentMethod?: string;
  notes?: string;
}

export const OrderService = {
  async create(data: CreateOrderPayload): Promise<Order> {
    const res = (await api.post('/orders', data)) as any;
    return res.data;
  },

  async getOrders(params?: { status?: string; page?: number; limit?: number }): Promise<{
    orders: Order[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const res = (await api.get('/orders', { params })) as any;
    return res.data;
  },

  async getById(id: string): Promise<Order> {
    const res = (await api.get(`/orders/${id}`)) as any;
    return res.data;
  },

  async updateStatus(id: string, status: OrderStatus, notes?: string): Promise<Order> {
    const res = (await api.patch(`/orders/${id}/status`, { status, notes })) as any;
    return res.data;
  },
};
