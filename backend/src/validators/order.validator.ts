import { z } from 'zod';
import { OrderStatus, PaymentMethod } from '../types/index.js';

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          foodItemId: z.string().uuid(),
          quantity: z.number().int().positive('Quantity must be at least 1'),
        })
      )
      .min(1, 'Order must contain at least one item'),
    pickupTime: z.string().optional(),
    paymentMethod: z.enum([
      PaymentMethod.MOCK,
      PaymentMethod.UPI,
      PaymentMethod.CARD,
      PaymentMethod.ONLINE,
    ]).default(PaymentMethod.MOCK),
    notes: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      OrderStatus.PLACED,
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARING,
      OrderStatus.READY,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELLED,
    ]),
    notes: z.string().optional(),
  }),
});
