import { Request, Response, NextFunction } from 'express';
import { SalesAnalyticsService } from '../services/analytics/salesAnalytics.service.js';
import { MovingAverageService } from '../services/forecasting/movingAverage.service.js';
import { ReportGenerator } from '../utils/reportGenerator.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AnalyticsController {
  static async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const overview = await SalesAnalyticsService.getOverview();
      ApiResponse.success(res, overview, 'Analytics overview retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getSalesTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 14;
      const trends = await SalesAnalyticsService.getSalesTrends(days);
      ApiResponse.success(res, trends, 'Sales trends retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getPopularity(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const popular = await SalesAnalyticsService.getPopularFoods(limit);
      ApiResponse.success(res, popular, 'Popular foods retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getCategorySales(req: Request, res: Response, next: NextFunction) {
    try {
      const categorySales = await SalesAnalyticsService.getCategorySales();
      ApiResponse.success(res, categorySales, 'Category sales retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const foodItemId = req.params.foodItemId as string;
      const window = req.query.window ? parseInt(req.query.window as string, 10) : 7;
      const history = req.query.history ? parseInt(req.query.history as string, 10) : 30;

      const forecast = await MovingAverageService.calculateForecast(foodItemId, window, history);
      ApiResponse.success(res, forecast, 'Moving average forecast calculated');
    } catch (error) {
      next(error);
    }
  }

  static async getKitchenRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const window = req.query.window ? parseInt(req.query.window as string, 10) : 7;
      const recommendations = await MovingAverageService.calculateAllRecommendations(window);
      ApiResponse.success(res, recommendations, 'Kitchen preparation recommendations retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async exportCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const range = (req.query.range as string) || '30d';
      const csv = await ReportGenerator.generateSalesCsv(range);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=campusbite-sales-${range}.csv`);
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }

  static async exportPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const range = (req.query.range as string) || '30d';
      const pdfBuffer = await ReportGenerator.generatePdfReport(range);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=campusbite-report-${range}.pdf`);
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }
}
