import { prisma } from '../../config/index.js';
import { PaymentStatus, OrderStatus, Role } from '../../types/index.js';

export class SalesAnalyticsService {
  static async getOverview() {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // Queries
    const [
      totalOrders,
      totalStudents,
      totalKitchenStaff,
      totalFoods,
      pendingOrders,
      paidOrdersTotal,
      todayOrders,
      sevenDaysOrders,
      thirtyDaysOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: Role.STUDENT } }),
      prisma.user.count({ where: { role: Role.KITCHEN_STAFF } }),
      prisma.foodItem.count({ where: { available: true } }),
      prisma.order.count({
        where: {
          status: { in: [OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING] },
        },
      }),
      prisma.order.aggregate({
        where: { paymentStatus: PaymentStatus.SUCCESS },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: PaymentStatus.SUCCESS,
          createdAt: { gte: startOfToday },
        },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: PaymentStatus.SUCCESS,
          createdAt: { gte: sevenDaysAgo },
        },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: PaymentStatus.SUCCESS,
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
    ]);

    const allTimeRevenue = paidOrdersTotal._sum.totalAmount || 0;
    const paidCount = paidOrdersTotal._count.id || 0;
    const averageOrderValue = paidCount > 0 ? Math.round((allTimeRevenue / paidCount) * 100) / 100 : 0;

    return {
      totalSales: Math.round(allTimeRevenue * 100) / 100,
      todaySales: Math.round((todayOrders._sum.totalAmount || 0) * 100) / 100,
      weeklySales: Math.round((sevenDaysOrders._sum.totalAmount || 0) * 100) / 100,
      monthlySales: Math.round((thirtyDaysOrders._sum.totalAmount || 0) * 100) / 100,
      totalOrders,
      todayOrdersCount: todayOrders._count.id || 0,
      pendingOrders,
      averageOrderValue,
      totalStudents,
      totalKitchenStaff,
      totalFoods,
    };
  }

  static async getSalesTrends(days: number = 14) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: PaymentStatus.SUCCESS,
        createdAt: { gte: startDate },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const trendMap = new Map<string, { date: string; sales: number; orders: number }>();

    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      trendMap.set(dateKey, { date: displayDate, sales: 0, orders: 0 });
    }

    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      const existing = trendMap.get(dateKey);
      if (existing) {
        existing.sales += order.totalAmount;
        existing.orders += 1;
      }
    }

    return Array.from(trendMap.values()).map((t) => ({
      ...t,
      sales: Math.round(t.sales * 100) / 100,
    }));
  }

  static async getPopularFoods(limit: number = 10) {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          paymentStatus: PaymentStatus.SUCCESS,
        },
      },
      include: {
        foodItem: {
          include: { category: true },
        },
      },
    });

    let totalAllRevenue = 0;
    const foodMap = new Map<
      string,
      {
        id: string;
        name: string;
        category: string;
        dietaryType: string;
        price: number;
        imageUrl: string;
        quantitySold: number;
        revenue: number;
      }
    >();

    for (const item of orderItems) {
      totalAllRevenue += item.subtotal;
      const existing = foodMap.get(item.foodItemId);
      if (existing) {
        existing.quantitySold += item.quantity;
        existing.revenue += item.subtotal;
      } else {
        foodMap.set(item.foodItemId, {
          id: item.foodItemId,
          name: item.foodItem.name,
          category: item.foodItem.category.name,
          dietaryType: item.foodItem.dietaryType,
          price: item.foodItem.price,
          imageUrl: item.foodItem.imageUrl,
          quantitySold: item.quantity,
          revenue: item.subtotal,
        });
      }
    }

    const sorted = Array.from(foodMap.values())
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, limit)
      .map((item) => ({
        ...item,
        revenue: Math.round(item.revenue * 100) / 100,
        percentageContribution:
          totalAllRevenue > 0 ? Math.round((item.revenue / totalAllRevenue) * 1000) / 10 : 0,
      }));

    return sorted;
  }

  static async getCategorySales() {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          paymentStatus: PaymentStatus.SUCCESS,
        },
      },
      include: {
        foodItem: {
          include: { category: true },
        },
      },
    });

    let totalRevenue = 0;
    const catMap = new Map<string, { categoryId: string; name: string; revenue: number; quantity: number }>();

    for (const item of orderItems) {
      const cat = item.foodItem.category;
      totalRevenue += item.subtotal;
      const existing = catMap.get(cat.id);
      if (existing) {
        existing.revenue += item.subtotal;
        existing.quantity += item.quantity;
      } else {
        catMap.set(cat.id, {
          categoryId: cat.id,
          name: cat.name,
          revenue: item.subtotal,
          quantity: item.quantity,
        });
      }
    }

    return Array.from(catMap.values()).map((c) => ({
      ...c,
      revenue: Math.round(c.revenue * 100) / 100,
      percentage: totalRevenue > 0 ? Math.round((c.revenue / totalRevenue) * 1000) / 10 : 0,
    }));
  }
}
