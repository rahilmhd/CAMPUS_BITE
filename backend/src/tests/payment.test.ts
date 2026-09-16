import { describe, it, expect } from 'vitest';
import { MockPaymentProvider } from '../services/payment/mock.provider.js';

describe('Payment Abstraction & Verification', () => {
  const provider = new MockPaymentProvider();

  it('should initialize payment with transaction reference and status PENDING', async () => {
    const init = await provider.createPayment({
      orderId: 'ord_123',
      orderNumber: 'CB-2026-1001',
      amount: 240,
      method: 'UPI',
      customer: {
        id: 'usr_1',
        name: 'Arjun Das',
        email: 'student@campusbite.local',
      },
    });

    expect(init.transactionReference).toMatch(/^TXN_CB_/);
    expect(init.status).toBe('PENDING');
    expect(init.amount).toBe(240);
  });

  it('should verify payment successfully when no simulated failure', async () => {
    const result = await provider.verifyPayment({
      orderId: 'ord_123',
      transactionReference: 'TXN_CB_12345',
    });

    expect(result.verified).toBe(true);
    expect(result.status).toBe('SUCCESS');
    expect(result.gatewayResponse.status).toBe('AUTHORIZED');
  });

  it('should reject payment verification when simulation requests failure', async () => {
    const result = await provider.verifyPayment({
      orderId: 'ord_123',
      transactionReference: 'TXN_CB_12345',
      simulatedStatus: 'FAILED',
    });

    expect(result.verified).toBe(false);
    expect(result.status).toBe('FAILED');
  });
});
