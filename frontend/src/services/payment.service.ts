import { api } from './api.js';

export const PaymentService = {
  async initiate(orderId: string, method: string = 'MOCK') {
    const res = (await api.post('/payments/initiate', { orderId, method })) as any;
    return res.data;
  },

  async verify(data: {
    orderId: string;
    transactionReference: string;
    signature?: string;
    simulatedStatus?: 'SUCCESS' | 'FAILED';
  }) {
    const res = (await api.post('/payments/verify', data)) as any;
    return res.data;
  },
};
