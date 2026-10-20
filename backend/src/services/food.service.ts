import { prisma } from '../config/index.js';
import { getSocketIO } from '../socket/socket.handler.js';

export interface FoodFilterQuery {
  search?: string;
  categoryId?: string;
  dietaryType?: string;
  availableOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'popularity' | 'name';
}

export class FoodService {
  static async getAllFoods(filters: FoodFilterQuery) {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { ingredients: { contains: filters.search } },
      ];
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.dietaryType) {
      where.dietaryType = filters.dietaryType;
    }

    if (filters.availableOnly) {
      where.available = true;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (filters.sortBy === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (filters.sortBy === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (filters.sortBy === 'name') {
      orderBy = { name: 'asc' };
    }

    const foods = await prisma.foodItem.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
      orderBy,
    });

    if (filters.sortBy === 'popularity') {
      foods.sort((a, b) => b._count.orderItems - a._count.orderItems);
    }

    return foods;
  }

  static async getFoodById(id: string) {
    const food = await prisma.foodItem.findUnique({
      where: { id },
      include: {
        category: true,
        _count: {
          select: { orderItems: true },
        },
      },
    });

    if (!food) {
      throw { statusCode: 404, message: 'Food item not found' };
    }

    return food;
  }

  public static emitStockUpdated(food: { id: string; name: string; stockQuantity: number; available: boolean }) {
    try {
      const io = getSocketIO();
      if (io) {
        io.emit('food:stock_updated', {
          foodItemId: food.id,
          name: food.name,
          stockQuantity: food.stockQuantity,
          available: food.available,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Socket emission failed for stock update:', err);
    }
  }

  static async createFood(data: any) {
    const stockQuantity = data.stockQuantity !== undefined ? Math.max(0, Number(data.stockQuantity)) : 50;
    // Automatically switch to sold out if stock is 0, or available if > 0 (unless explicitly false)
    const available = stockQuantity > 0 ? (data.available !== undefined ? Boolean(data.available) : true) : false;

    const created = await prisma.foodItem.create({
      data: {
        ...data,
        stockQuantity,
        available,
      },
      include: {
        category: true,
      },
    });

    this.emitStockUpdated(created);
    return created;
  }

  static async updateFood(id: string, data: any) {
    const existing = await this.getFoodById(id);

    const updateData: any = { ...data };

    if (data.stockQuantity !== undefined) {
      const safeStock = Math.max(0, Number(data.stockQuantity));
      updateData.stockQuantity = safeStock;
      if (safeStock === 0) {
        // Immediately switch to sold out when quantity hits zero
        updateData.available = false;
      } else if (data.available === undefined && !existing.available) {
        // Dynamically update to available when stock is set above zero
        updateData.available = true;
      }
    }

    const updated = await prisma.foodItem.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    this.emitStockUpdated(updated);
    return updated;
  }

  static async updateStock(id: string, stockQuantity: number) {
    await this.getFoodById(id);
    const safeStock = Math.max(0, Math.floor(stockQuantity));
    // Dynamically mark available if > 0, immediately switch to sold out (false) when quantity hits zero
    const available = safeStock > 0;

    const updated = await prisma.foodItem.update({
      where: { id },
      data: {
        stockQuantity: safeStock,
        available,
      },
      include: {
        category: true,
      },
    });

    this.emitStockUpdated(updated);
    return updated;
  }

  static async toggleAvailability(id: string, available: boolean) {
    const existing = await this.getFoodById(id);

    // If making available but stock is 0, replenish default stock to 10 so it can actually be ordered
    let newStock = existing.stockQuantity;
    if (available && newStock <= 0) {
      newStock = 10;
    } else if (!available) {
      // Admin explicitly marked unavailable
    }

    const updated = await prisma.foodItem.update({
      where: { id },
      data: {
        available,
        stockQuantity: newStock,
      },
      include: {
        category: true,
      },
    });

    this.emitStockUpdated(updated);
    return updated;
  }

  static async deleteFood(id: string) {
    // Check if food has existing orders; if so, soft delete by marking available=false to protect historical integrity
    const orderItemCount = await prisma.orderItem.count({ where: { foodItemId: id } });
    if (orderItemCount > 0) {
      return prisma.foodItem.update({
        where: { id },
        data: { available: false },
      });
    }

    return prisma.foodItem.delete({
      where: { id },
    });
  }

  // Categories
  static async getCategories() {
    return prisma.foodCategory.findMany({
      where: { active: true },
      include: {
        _count: {
          select: { foodItems: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async createCategory(data: { name: string; description?: string }) {
    return prisma.foodCategory.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        active: true,
      },
    });
  }
}
