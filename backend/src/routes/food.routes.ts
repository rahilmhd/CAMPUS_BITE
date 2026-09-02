import { Router } from 'express';
import { FoodController } from '../controllers/food.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { createFoodSchema, updateFoodSchema, createCategorySchema } from '../validators/food.validator.js';
import { Role } from '../types/index.js';

const router = Router();

// Public routes for browsing
router.get('/', FoodController.getAll);
router.get('/categories', FoodController.getCategories);
router.get('/:id', FoodController.getById);

// Protected routes (Admin / Kitchen)
router.post(
  '/',
  authenticate,
  requireRole([Role.ADMIN]),
  validateRequest(createFoodSchema),
  FoodController.create
);

router.put(
  '/:id',
  authenticate,
  requireRole([Role.ADMIN]),
  validateRequest(updateFoodSchema),
  FoodController.update
);

router.patch(
  '/:id/availability',
  authenticate,
  requireRole([Role.ADMIN, Role.KITCHEN_STAFF]),
  FoodController.toggleAvailability
);

router.delete(
  '/:id',
  authenticate,
  requireRole([Role.ADMIN]),
  FoodController.delete
);

router.post(
  '/categories',
  authenticate,
  requireRole([Role.ADMIN]),
  validateRequest(createCategorySchema),
  FoodController.createCategory
);

export default router;
