import { Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment/payment.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class PaymentController {
  static async initiate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { orderId, method } = req.body;
      const result = await PaymentService.initiatePayment(orderId, req.user!.id, method);
      ApiResponse.success(res, result, 'Payment session initiated', 200);
    } catch (error) {
      next(error);
    }
  }

  static async verify(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { orderId, transactionReference, signature, simulatedStatus } = req.body;
      const result = await PaymentService.verifyAndCompletePayment({
        orderId,
        transactionReference,
        signature,
        simulatedStatus,
      });

      if (!result.success) {
        ApiResponse.error(res, result.message, 400);
        return;
      }

      ApiResponse.success(res, result, 'Payment verified successfully');
    } catch (error) {
      next(error);
    }
  }
}
