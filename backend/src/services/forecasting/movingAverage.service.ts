import { prisma } from '../../config/index.js';
import { PaymentStatus } from '../../types/index.js';

export interface DailyDemandPoint {
  date: string; // YYYY-MM-DD
  quantity: number;
  revenue: number;
  orderCount: number;
}

export interface MovingAverageForecastResult {
  foodItemId: string;
  foodName: string;
  categoryName: string;
  dietaryType: string;
  windowSize: number;
  dataPointsAvailable: number;
  isSufficientData: boolean;
  statusMessage: string;
  historicalDemand: DailyDemandPoint[];
  movingAverageValue: number | null;
  forecastDemand: number | null;
  suggestedPreparation: {
    min: number;
    max: number;
    recommended: number;
    bufferPercentage: number;
  } | null;
  calculationBreakdown: {
    formula: string;
    windowValues: number[];
    sum: number;
    average: number;
  } | null;
}

export class MovingAverageService {
  /**
   * Calculates N-Period Simple Moving Average demand forecast for a food item
   * @param foodItemId The ID of the food item
   * @param windowSize Window period (default 7 days, or 3 days)
   * @param historyDays Number of days of history to inspect (default 30)
   */
  static async calculateForecast(
    foodItemId: string,
    windowSize: number = 7,
    historyDays: number = 30
  ): Promise<MovingAverageForecastResult> {
    const food = await prisma.foodItem.findUnique({
      where: { id: foodItemId },
      include: { category: true },
    });

    if (!food) {
      throw { statusCode: 404, message: 'Food item not found' };
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - historyDays);
    startDate.setHours(0, 0, 0, 0);

    // Fetch all successful order items for this food item in the period
    const orderItems = await prisma.orderItem.findMany({
      where: {
        foodItemId,
        order: {
          paymentStatus: PaymentStatus.SUCCESS,
          createdAt: { gte: startDate },
        },
      },
      include: {
        order: {
          select: { createdAt: true },
        },
      },
      orderBy: {
        order: { createdAt: 'asc' },
      },
    });

    // Group sales into contiguous daily buckets
    const dailyMap = new Map<string, { quantity: number; revenue: number; orderCount: number }>();

    // Pre-populate all days in range to ensure zeros are recorded for days without sales
    for (let d = historyDays; d >= 1; d--) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      const dateKey = date.toISOString().split('T')[0];
      dailyMap.set(dateKey, { quantity: 0, revenue: 0, orderCount: 0 });
    }

    // Populate actual order item quantities
    for (const item of orderItems) {
      const dateKey = item.order.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(dateKey) || { quantity: 0, revenue: 0, orderCount: 0 };
      existing.quantity += item.quantity;
      existing.revenue += item.subtotal;
      existing.orderCount += 1;
      dailyMap.set(dateKey, existing);
    }

    const historicalDemand: DailyDemandPoint[] = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({
        date,
        quantity: data.quantity,
        revenue: Math.round(data.revenue * 100) / 100,
        orderCount: data.orderCount,
      }));

    const totalDaysRecorded = historicalDemand.length;

    // Check if sufficient historical days exist
    if (totalDaysRecorded < windowSize) {
      return {
        foodItemId: food.id,
        foodName: food.name,
        categoryName: food.category.name,
        dietaryType: food.dietaryType,
        windowSize,
        dataPointsAvailable: totalDaysRecorded,
        isSufficientData: false,
        statusMessage: `Insufficient historical data. Requires at least ${windowSize} days of data, found ${totalDaysRecorded}.`,
        historicalDemand,
        movingAverageValue: null,
        forecastDemand: null,
        suggestedPreparation: null,
        calculationBreakdown: null,
      };
    }

    // Extract the most recent N days for the moving average window
    const recentWindow = historicalDemand.slice(-windowSize);
    const windowQuantities = recentWindow.map((pt) => pt.quantity);
    const sumQuantities = windowQuantities.reduce((acc, val) => acc + val, 0);
    const movingAverageRaw = sumQuantities / windowSize;
    const movingAverage = Math.round(movingAverageRaw * 10) / 10;
    const forecastDemand = Math.round(movingAverage);

    // Preparation buffer factor (safety buffer of +8% to +12% for peak surges while minimizing waste)
    const bufferPercentage = 8;
    const bufferUnits = Math.ceil(forecastDemand * (bufferPercentage / 100));
    const minPrep = forecastDemand;
    const maxPrep = forecastDemand + bufferUnits;
    const recommendedPrep = Math.round((minPrep + maxPrep) / 2);

    return {
      foodItemId: food.id,
      foodName: food.name,
      categoryName: food.category.name,
      dietaryType: food.dietaryType,
      windowSize,
      dataPointsAvailable: totalDaysRecorded,
      isSufficientData: true,
      statusMessage: `Forecast calculated using ${windowSize}-period statistical Moving Average.`,
      historicalDemand,
      movingAverageValue: movingAverage,
      forecastDemand,
      suggestedPreparation: {
        min: minPrep,
        max: maxPrep,
        recommended: recommendedPrep,
        bufferPercentage,
      },
      calculationBreakdown: {
        formula: `SMA_${windowSize} = (${windowQuantities.join(' + ')}) / ${windowSize}`,
        windowValues: windowQuantities,
        sum: sumQuantities,
        average: movingAverage,
      },
    };
  }

  /**
   * Batch forecasts all active menu items for kitchen preparation guidance
   */
  static async calculateAllRecommendations(windowSize: number = 7) {
    const activeFoods = await prisma.foodItem.findMany({
      where: { available: true },
      select: { id: true },
    });

    const results = await Promise.all(
      activeFoods.map((f) => this.calculateForecast(f.id, windowSize, 14))
    );

    return results;
  }
}
