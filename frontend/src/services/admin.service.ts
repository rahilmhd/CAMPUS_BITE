import { api } from './api.js';
import { User, Role } from '../types/index.js';

export const AdminService = {
  async getUsers(params?: { search?: string; role?: string; status?: string }): Promise<User[]> {
    const res = (await api.get('/admin/users', { params })) as any;
    return res.data;
  },

  async createUser(data: { name: string; email: string; phone?: string; password: string; role: Role }): Promise<User> {
    const res = (await api.post('/admin/users', data)) as any;
    return res.data;
  },

  async toggleUserStatus(id: string, status: boolean): Promise<User> {
    const res = (await api.patch(`/admin/users/${id}/status`, { status })) as any;
    return res.data;
  },
};
