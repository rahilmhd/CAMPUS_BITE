import { prisma } from '../config/index.js';

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

  static async createFood(data: any) {
    return prisma.foodItem.create({
      data,
      include: {
        category: true,
      },
    });
  }

  static async updateFood(id: string, data: any) {
    await this.getFoodById(id);
    return prisma.foodItem.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  static async toggleAvailability(id: string, available: boolean) {
    await this.getFoodById(id);
    return prisma.foodItem.update({
      where: { id },
      data: { available },
    });
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
