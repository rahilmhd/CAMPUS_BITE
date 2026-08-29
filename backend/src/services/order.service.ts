import { prisma } from '../config/index.js';
import { OrderStatus, PaymentStatus, PaymentMethod, Role } from '../types/index.js';
import { getSocketIO } from '../socket/socket.handler.js';

export interface CreateOrderItemInput {
  foodItemId: string;
  quantity: number;
}

export interface CreateOrderInput {
  userId: string;
  items: CreateOrderItemInput[];
  pickupTime?: string;
  paymentMethod?: string;
  notes?: string;
}

export class OrderService {
  static async createOrder(input: CreateOrderInput) {
    if (!input.items || input.items.length === 0) {
      throw { statusCode: 400, message: 'Cart cannot be empty' };
    }

    // Fetch all requested items from database
    const foodItemIds = input.items.map((i) => i.foodItemId);
    const foods = await prisma.foodItem.findMany({
      where: { id: { in: foodItemIds } },
    });

    const foodMap = new Map(foods.map((f) => [f.id, f]));

    // Validate availability and stock
    let calculatedTotal = 0;
    const verifiedOrderItems: Array<{
      foodItemId: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }> = [];

    for (const item of input.items) {
      const food = foodMap.get(item.foodItemId);
      if (!food) {
        throw { statusCode: 404, message: `Food item not found: ${item.foodItemId}` };
      }

      if (!food.available) {
        throw { statusCode: 400, message: `"${food.name}" is currently unavailable for order.` };
      }

      if (item.quantity <= 0) {
        throw { statusCode: 400, message: `Invalid quantity for "${food.name}". Must be at least 1.` };
      }

      if (food.stockQuantity < item.quantity) {
        throw { statusCode: 400, message: `Insufficient stock for "${food.name}". Available: ${food.stockQuantity}` };
      }

      const subtotal = food.price * item.quantity;
      calculatedTotal += subtotal;

      verifiedOrderItems.push({
        foodItemId: food.id,
        quantity: item.quantity,
        unitPrice: food.price,
        subtotal,
      });
    }

    const orderCount = await prisma.order.count();
    const orderNumber = `CB-${new Date().getFullYear()}-${1000 + orderCount + 1}`;
    const txRef = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const parsedPickupTime = input.pickupTime ? new Date(input.pickupTime) : new Date(Date.now() + 20 * 60000);

    // Database transaction: Create order + items + payment + status history
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock
      for (const item of verifiedOrderItems) {
        await tx.foodItem.update({
          where: { id: item.foodItemId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: input.userId,
          totalAmount: calculatedTotal,
          status: OrderStatus.PLACED,
          paymentStatus: PaymentStatus.PENDING,
          pickupTime: parsedPickupTime,
          notes: input.notes || null,
          items: {
            create: verifiedOrderItems,
          },
          payment: {
            create: {
              transactionReference: txRef,
              amount: calculatedTotal,
              method: input.paymentMethod || PaymentMethod.MOCK,
              status: PaymentStatus.PENDING,
            },
          },
          statusHistory: {
            create: {
              status: OrderStatus.PLACED,
              changedBy: input.userId,
              notes: 'Order placed by student',
            },
          },
        },
        include: {
          items: {
            include: {
              foodItem: true,
            },
          },
          payment: true,
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      });

      return createdOrder;
    });

    return order;
  }

  static async getOrders(query: {
    userId?: string;
    status?: string;
    role?: string;
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.userId && query.role === Role.STUDENT) {
      where.userId = query.userId;
    }

    if (query.status) {
      where.status = query.status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              foodItem: {
                select: { id: true, name: true, price: true, imageUrl: true, dietaryType: true },
              },
            },
          },
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          payment: true,
          statusHistory: {
            orderBy: { timestamp: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getOrderById(orderId: string, requestUser: { id: string; role: string }) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            foodItem: true,
          },
        },
        payment: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        statusHistory: {
          include: {
            user: { select: { id: true, name: true, role: true } },
          },
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!order) {
      throw { statusCode: 404, message: 'Order not found' };
    }

    if (requestUser.role === Role.STUDENT && order.userId !== requestUser.id) {
      throw { statusCode: 403, message: 'Unauthorized to view this order' };
    }

    return order;
  }

  static async updateOrderStatus(
    orderId: string,
    newStatus: string,
    actor: { id: string; name: string; role: string },
    notes?: string
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: { include: { foodItem: true } } },
    });

    if (!order) {
      throw { statusCode: 404, message: 'Order not found' };
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw { statusCode: 400, message: 'Completed orders cannot be modified' };
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw { statusCode: 400, message: 'Cancelled orders cannot be modified' };
    }

    // Determine notification title and message
    let notifTitle = `Order Status: ${newStatus}`;
    let notifMessage = `Your order ${order.orderNumber} status changed to ${newStatus.toLowerCase()}.`;

    if (newStatus === OrderStatus.CONFIRMED) {
      notifTitle = 'Order Confirmed! 👍';
      notifMessage = `Your order #${order.orderNumber} has been accepted by the kitchen staff.`;
    } else if (newStatus === OrderStatus.PREPARING) {
      notifTitle = 'Preparing Your Food 👨‍🍳';
      notifMessage = `The kitchen is now preparing your delicious meal.`;
    } else if (newStatus === OrderStatus.READY) {
      notifTitle = 'Order Ready for Pickup! 🔔';
      notifMessage = `Order #${order.orderNumber} is ready for collection at the canteen pickup counter.`;
    } else if (newStatus === OrderStatus.COMPLETED) {
      notifTitle = 'Order Completed 🌟';
      notifMessage = `Thank you for ordering with CampusBite! Enjoy your meal.`;
    } else if (newStatus === OrderStatus.CANCELLED) {
      notifTitle = 'Order Cancelled ⚠️';
      notifMessage = `Your order #${order.orderNumber} has been cancelled.`;
    }

    // Execute atomic update
    const updated = await prisma.$transaction(async (tx) => {
      const orderUpdated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: newStatus,
        },
        include: {
          items: { include: { foodItem: true } },
          payment: true,
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: newStatus,
          changedBy: actor.id,
          notes: notes || `Status updated by ${actor.name} (${actor.role})`,
        },
      });

      await tx.notification.create({
        data: {
          userId: order.userId,
          orderId,
          type: 'ORDER_UPDATE',
          title: notifTitle,
          message: notifMessage,
        },
      });

      return orderUpdated;
    });

    // Real-time WebSocket emission
    try {
      const io = getSocketIO();
      if (io) {
        // Notify student room
        io.to(`user:${order.userId}`).emit('order:status_updated', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: newStatus,
          title: notifTitle,
          message: notifMessage,
          updatedAt: new Date().toISOString(),
        });

        io.to(`user:${order.userId}`).emit('notification:new', {
          title: notifTitle,
          message: notifMessage,
          orderId: order.id,
          createdAt: new Date().toISOString(),
        });

        // Notify kitchen & admin rooms
        io.to('kitchen').emit('order:status_updated', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: newStatus,
        });

        io.to('admin').emit('order:status_updated', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: newStatus,
        });
      }
    } catch (e) {
      console.warn('Real-time notification emit warning:', e);
    }

    return updated;
  }
}
