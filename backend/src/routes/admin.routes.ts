import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { Role } from '../types/index.js';

const router = Router();

router.use(authenticate);
router.use(requireRole([Role.ADMIN]));

router.get('/users', AdminController.getUsers);
router.post('/users', AdminController.createUser);
router.patch('/users/:id/status', AdminController.toggleUserStatus);

export default router;
