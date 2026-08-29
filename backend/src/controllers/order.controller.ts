import { Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class OrderController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.createOrder({
        userId: req.user!.id,
        items: req.body.items,
        pickupTime: req.body.pickupTime,
        paymentMethod: req.body.paymentMethod,
        notes: req.body.notes,
      });

      ApiResponse.success(res, order, 'Order created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.getOrders({
        userId: req.user!.id,
        role: req.user!.role,
        status: req.query.status as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
      });

      ApiResponse.success(res, result, 'Orders retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getOrderById(req.params.id, {
        id: req.user!.id,
        role: req.user!.role,
      });

      ApiResponse.success(res, order, 'Order details retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await OrderService.updateOrderStatus(
        req.params.id,
        req.body.status,
        {
          id: req.user!.id,
          name: req.user!.name,
          role: req.user!.role,
        },
        req.body.notes
      );

      ApiResponse.success(res, updated, `Order status updated to ${req.body.status}`);
    } catch (error) {
      next(error);
    }
  }
}
