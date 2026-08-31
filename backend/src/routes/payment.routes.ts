import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/initiate', PaymentController.initiate);
router.post('/verify', PaymentController.verify);

export default router;
