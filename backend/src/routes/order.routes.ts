import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator.js';
import { Role } from '../types/index.js';

const router = Router();

router.use(authenticate);

router.post('/', validateRequest(createOrderSchema), OrderController.create);
router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getById);

router.patch(
  '/:id/status',
  requireRole([Role.ADMIN, Role.KITCHEN_STAFF]),
  validateRequest(updateOrderStatusSchema),
  OrderController.updateStatus
);

export default router;
