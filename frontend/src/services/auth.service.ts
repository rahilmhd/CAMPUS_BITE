import { api } from './api.js';
import { User } from '../types/index.js';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export const AuthService = {
  async register(data: { name: string; email: string; phone?: string; password: string }) {
    const res = (await api.post('/auth/register', data)) as any;
    return res.data;
  },

  async login(credentials: { email: string; password: string }) {
    const res = (await api.post('/auth/login', credentials)) as any;
    return res.data;
  },

  async getMe() {
    const res = (await api.get('/auth/me')) as any;
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    }
  },
};
