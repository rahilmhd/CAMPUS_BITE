import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../config/index.js';
import { FoodService } from '../services/food.service.js';
import { OrderService } from '../services/order.service.js';
import { Role } from '../types/index.js';

describe('Real-Time Stock Management & Atomic Order Deduction', () => {
  let testCategory: any;
  let testFood: any;
  let testUser: any;

  beforeAll(async () => {
    // 1. Create or fetch test category
    testCategory = await prisma.foodCategory.findFirst({ where: { active: true } });
    if (!testCategory) {
      testCategory = await prisma.foodCategory.create({
        data: { name: 'Test Stock Category', active: true },
      });
    }

    // 2. Create or fetch test student user
    testUser = await prisma.user.findFirst({ where: { role: Role.STUDENT } });
    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          name: 'Stock Test Student',
          email: `test.student.${Date.now()}@campusbite.local`,
          passwordHash: 'dummyhash',
          role: Role.STUDENT,
        },
      });
    }

    // 3. Create test food item with stock 8
    testFood = await FoodService.createFood({
      name: `Test Stock Burger ${Date.now()}`,
      categoryId: testCategory.id,
      description: 'Delicious test food for stock management verification',
      price: 150,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
      ingredients: 'Bun, patty, cheese',
      dietaryType: 'NON_VEGETARIAN',
      preparationTime: 12,
      stockQuantity: 8,
      available: true,
    });
  });

  afterAll(async () => {
    // Cleanup test food item and its orders
    if (testFood?.id) {
      await prisma.orderItem.deleteMany({ where: { foodItemId: testFood.id } });
      await prisma.foodItem.deleteMany({ where: { id: testFood.id } });
    }
  });

  it('1. Admin can update stock quantity directly, and availability syncs dynamically', async () => {
    // Admin sets stock to 5
    let updated = await FoodService.updateStock(testFood.id, 5);
    expect(updated.stockQuantity).toBe(5);
    expect(updated.available).toBe(true);

    // Admin sets stock to 0 -> dynamically marked as unavailable (Sold Out)
    updated = await FoodService.updateStock(testFood.id, 0);
    expect(updated.stockQuantity).toBe(0);
    expect(updated.available).toBe(false);

    // Admin replenishes stock to 10 -> dynamically marked as available
    updated = await FoodService.updateStock(testFood.id, 10);
    expect(updated.stockQuantity).toBe(10);
    expect(updated.available).toBe(true);
  });

  it('2. Student purchase automatically deducts exact quantity from available stock in real time', async () => {
    // Current stock is 10. Student orders 3.
    const order = await OrderService.createOrder({
      userId: testUser.id,
      items: [{ foodItemId: testFood.id, quantity: 3 }],
    });

    expect(order).toBeDefined();
    expect(order.items.length).toBe(1);

    // Verify stock in database is now 7
    const freshFood = await prisma.foodItem.findUnique({ where: { id: testFood.id } });
    expect(freshFood?.stockQuantity).toBe(7);
    expect(freshFood?.available).toBe(true);
  });

  it('3. Prevents any purchase if the requested amount exceeds what is left', async () => {
    // Current stock is 7. Student attempts to order 12.
    await expect(
      OrderService.createOrder({
        userId: testUser.id,
        items: [{ foodItemId: testFood.id, quantity: 12 }],
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: expect.stringContaining('Insufficient stock'),
    });

    // Verify stock remains untouched at 7
    const freshFood = await prisma.foodItem.findUnique({ where: { id: testFood.id } });
    expect(freshFood?.stockQuantity).toBe(7);
    expect(freshFood?.available).toBe(true);
  });

  it('4. Purchasing exact remaining quantity immediately switches status to sold out with ordering disabled as soon as stock hits zero', async () => {
    // Current stock is 7. Student orders the exact remaining 7 items.
    const finalOrder = await OrderService.createOrder({
      userId: testUser.id,
      items: [{ foodItemId: testFood.id, quantity: 7 }],
    });

    expect(finalOrder).toBeDefined();

    // Verify stock hits exactly 0 and available immediately switches to false
    const freshFood = await prisma.foodItem.findUnique({ where: { id: testFood.id } });
    expect(freshFood?.stockQuantity).toBe(0);
    expect(freshFood?.available).toBe(false);

    // Any further purchase attempt MUST be prevented because item is sold out
    await expect(
      OrderService.createOrder({
        userId: testUser.id,
        items: [{ foodItemId: testFood.id, quantity: 1 }],
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: expect.stringContaining('sold out'),
    });
  });

  it('5. Toggling availability on when stock is 0 automatically replenishes default stock to enable ordering', async () => {
    // Toggling availability on for sold out item
    const restored = await FoodService.toggleAvailability(testFood.id, true);
    expect(restored.available).toBe(true);
    expect(restored.stockQuantity).toBeGreaterThan(0);
  });
});
