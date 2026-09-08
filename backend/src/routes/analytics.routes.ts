import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { Role } from '../types/index.js';

const router = Router();

router.use(authenticate);
router.use(requireRole([Role.ADMIN, Role.KITCHEN_STAFF]));

router.get('/overview', AnalyticsController.getOverview);
router.get('/sales-trends', AnalyticsController.getSalesTrends);
router.get('/popularity', AnalyticsController.getPopularity);
router.get('/category-sales', AnalyticsController.getCategorySales);
router.get('/forecast/:foodItemId', AnalyticsController.getForecast);
router.get('/recommendations', AnalyticsController.getKitchenRecommendations);
router.get('/reports/csv', AnalyticsController.exportCsv);
router.get('/reports/pdf', AnalyticsController.exportPdf);

export default router;
