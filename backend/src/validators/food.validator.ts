import { z } from 'zod';
import { DietaryType } from '../types/index.js';

export const createFoodSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    categoryId: z.string().uuid('Valid Category ID is required'),
    description: z.string().min(5, 'Description must be at least 5 characters'),
    price: z.number().positive('Price must be greater than 0'),
    imageUrl: z.string().url('Must be a valid image URL'),
    ingredients: z.string().min(2, 'Ingredients are required'),
    dietaryType: z.enum([
      DietaryType.VEGETARIAN,
      DietaryType.NON_VEGETARIAN,
      DietaryType.VEGAN,
      DietaryType.EGG,
    ]),
    available: z.boolean().optional().default(true),
    stockQuantity: z.number().int().nonnegative().optional().default(50),
    preparationTime: z.number().int().positive().optional().default(15),
  }),
});

export const updateFoodSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    categoryId: z.string().uuid().optional(),
    description: z.string().min(5).optional(),
    price: z.number().positive().optional(),
    imageUrl: z.string().url().optional(),
    ingredients: z.string().optional(),
    dietaryType: z.enum([
      DietaryType.VEGETARIAN,
      DietaryType.NON_VEGETARIAN,
      DietaryType.VEGAN,
      DietaryType.EGG,
    ]).optional(),
    available: z.boolean().optional(),
    stockQuantity: z.number().int().nonnegative().optional(),
    preparationTime: z.number().int().positive().optional(),
  }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters'),
    description: z.string().optional(),
  }),
});
