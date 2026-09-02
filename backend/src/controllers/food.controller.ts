import { Request, Response, NextFunction } from 'express';
import { FoodService } from '../services/food.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class FoodController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, categoryId, dietaryType, availableOnly, minPrice, maxPrice, sortBy } = req.query;

      const foods = await FoodService.getAllFoods({
        search: search as string,
        categoryId: categoryId as string,
        dietaryType: dietaryType as string,
        availableOnly: availableOnly === 'true',
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        sortBy: sortBy as any,
      });

      ApiResponse.success(res, foods, 'Foods retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const food = await FoodService.getFoodById(req.params.id);
      ApiResponse.success(res, food, 'Food item details retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await FoodService.createFood(req.body);
      ApiResponse.success(res, created, 'Food item created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await FoodService.updateFood(req.params.id, req.body);
      ApiResponse.success(res, updated, 'Food item updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async toggleAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { available } = req.body;
      const updated = await FoodService.toggleAvailability(req.params.id, Boolean(available));
      ApiResponse.success(res, updated, `Item marked as ${available ? 'available' : 'unavailable'}`);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await FoodService.deleteFood(req.params.id);
      ApiResponse.success(res, result, 'Food item removed/deactivated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Categories
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await FoodService.getCategories();
      ApiResponse.success(res, categories, 'Categories retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await FoodService.createCategory(req.body);
      ApiResponse.success(res, category, 'Category created', 201);
    } catch (error) {
      next(error);
    }
  }
}
