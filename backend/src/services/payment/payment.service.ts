import { prisma } from '../../config/index.js';
import { IPaymentProvider } from './payment.interface.js';
import { MockPaymentProvider } from './mock.provider.js';
import { OrderStatus, PaymentStatus } from '../../types/index.js';
import { getSocketIO } from '../../socket/socket.handler.js';

export class PaymentService {
  private static provider: IPaymentProvider = new MockPaymentProvider();

  static setProvider(newProvider: IPaymentProvider) {
    this.provider = newProvider;
  }

  static async initiatePayment(orderId: string, userId: string, method: string = 'MOCK') {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw { statusCode: 404, message: 'Order not found for payment' };
    }

    if (order.userId !== userId) {
      throw { statusCode: 403, message: 'Unauthorized access to order' };
    }

    if (order.paymentStatus === PaymentStatus.SUCCESS) {
      throw { statusCode: 400, message: 'Order has already been paid' };
    }

    const initResult = await this.provider.createPayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      method,
      customer: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
      },
    });

    // Upsert payment record with PENDING status
    await prisma.payment.upsert({
      where: { orderId: order.id },
      update: {
        transactionReference: initResult.transactionReference,
        amount: order.totalAmount,
        method,
        status: PaymentStatus.PENDING,
      },
      create: {
        orderId: order.id,
        transactionReference: initResult.transactionReference,
        amount: order.totalAmount,
        method,
        status: PaymentStatus.PENDING,
      },
    });

    return initResult;
  }

  static async verifyAndCompletePayment(params: {
    orderId: string;
    transactionReference: string;
    signature?: string;
    simulatedStatus?: 'SUCCESS' | 'FAILED';
  }) {
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: { payment: true, user: true, items: { include: { foodItem: true } } },
    });

    if (!order) {
      throw { statusCode: 404, message: 'Order not found' };
    }

    const verification = await this.provider.verifyPayment({
      orderId: params.orderId,
      transactionReference: params.transactionReference,
      signature: params.signature,
      simulatedStatus: params.simulatedStatus,
    });

    if (!verification.verified || verification.status === 'FAILED') {
      // Record failure
      await prisma.payment.update({
        where: { orderId: params.orderId },
        data: {
          status: PaymentStatus.FAILED,
          gatewayResponse: JSON.stringify(verification.gatewayResponse || { error: verification.message }),
        },
      });

      return {
        success: false,
        message: verification.message || 'Payment verification failed',
      };
    }

    // Success transaction
    const now = new Date();
    await prisma.$transaction([
      prisma.payment.update({
        where: { orderId: params.orderId },
        data: {
          status: PaymentStatus.SUCCESS,
          paidAt: now,
          gatewayResponse: JSON.stringify(verification.gatewayResponse),
        },
      }),
      prisma.order.update({
        where: { id: params.orderId },
        data: {
          paymentStatus: PaymentStatus.SUCCESS,
          status: OrderStatus.PLACED,
        },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId: params.orderId,
          status: OrderStatus.PLACED,
          changedBy: order.userId,
          notes: 'Payment confirmed. Order placed into kitchen queue.',
          timestamp: now,
        },
      }),
      prisma.notification.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          type: 'PAYMENT_SUCCESS',
          title: 'Payment Successful! 🎉',
          message: `Your payment of ₹${order.totalAmount} for ${order.orderNumber} was successful. The kitchen has received your order.`,
        },
      }),
    ]);

    // Emit live WebSocket events
    try {
      const io = getSocketIO();
      if (io) {
        // Broadcast to student room
        io.to(`user:${order.userId}`).emit('order:status_updated', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: OrderStatus.PLACED,
          paymentStatus: PaymentStatus.SUCCESS,
        });

        // Broadcast new order to kitchen and admin
        io.to('kitchen').emit('order:created', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          studentName: order.user.name,
          itemsCount: order.items.length,
          totalAmount: order.totalAmount,
        });

        io.to('admin').emit('order:created', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
        });
      }
    } catch (e) {
      console.warn('Socket emission non-critical error:', e);
    }

    return {
      success: true,
      message: 'Payment verified and order successfully confirmed',
      transactionReference: params.transactionReference,
    };
  }
}
