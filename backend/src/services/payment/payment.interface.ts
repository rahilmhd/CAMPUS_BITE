export interface CreatePaymentParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency?: string;
  method: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PaymentInitResponse {
  transactionReference: string;
  gatewayOrderId: string;
  amount: number;
  currency: string;
  provider: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  verificationPayload?: Record<string, any>;
}

export interface VerifyPaymentParams {
  transactionReference: string;
  orderId: string;
  signature?: string;
  simulatedStatus?: 'SUCCESS' | 'FAILED';
}

export interface PaymentVerificationResult {
  verified: boolean;
  transactionReference: string;
  status: 'SUCCESS' | 'FAILED';
  gatewayResponse?: any;
  message?: string;
}

export interface IPaymentProvider {
  name: string;
  createPayment(params: CreatePaymentParams): Promise<PaymentInitResponse>;
  verifyPayment(params: VerifyPaymentParams): Promise<PaymentVerificationResult>;
}
