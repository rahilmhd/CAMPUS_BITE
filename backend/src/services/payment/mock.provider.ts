import crypto from 'crypto';
import {
  IPaymentProvider,
  CreatePaymentParams,
  PaymentInitResponse,
  VerifyPaymentParams,
  PaymentVerificationResult,
} from './payment.interface.js';

export class MockPaymentProvider implements IPaymentProvider {
  name = 'MOCK_SANDBOX';
  private mockSecret = process.env.PAYMENT_SECRET || 'campusbite_mock_secret';

  async createPayment(params: CreatePaymentParams): Promise<PaymentInitResponse> {
    const timestamp = Date.now();
    const transactionReference = `TXN_CB_${timestamp}_${Math.floor(1000 + Math.random() * 9000)}`;
    const gatewayOrderId = `order_mock_${timestamp}`;

    // Generate deterministic signature token
    const signature = crypto
      .createHmac('sha256', this.mockSecret)
      .update(`${params.orderId}|${transactionReference}|${params.amount}`)
      .digest('hex');

    return {
      transactionReference,
      gatewayOrderId,
      amount: params.amount,
      currency: params.currency || 'INR',
      provider: this.name,
      status: 'PENDING',
      verificationPayload: {
        token: signature,
        orderId: params.orderId,
        amount: params.amount,
        allowedMethods: ['UPI', 'CARD', 'MOCK'],
      },
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerificationResult> {
    // Check if simulation requested failure explicitly (for testing payment failure flows)
    if (params.simulatedStatus === 'FAILED') {
      return {
        verified: false,
        transactionReference: params.transactionReference,
        status: 'FAILED',
        message: 'Payment simulation failed by user rejection',
      };
    }

    // Server-side verification
    return {
      verified: true,
      transactionReference: params.transactionReference,
      status: 'SUCCESS',
      gatewayResponse: {
        provider: this.name,
        verifiedAt: new Date().toISOString(),
        authCode: `AUTH_${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'AUTHORIZED',
      },
      message: 'Payment verified successfully via Mock Gateway',
    };
  }
}
