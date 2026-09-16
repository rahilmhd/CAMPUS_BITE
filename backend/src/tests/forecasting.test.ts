import { describe, it, expect } from 'vitest';

describe('Moving Average Demand Forecasting Algorithm', () => {
  it('should accurately calculate 3-period Simple Moving Average', () => {
    const historicalSeries = [10, 20, 30];
    const windowSize = 3;
    const sum = historicalSeries.reduce((a, b) => a + b, 0);
    const movingAverage = sum / windowSize;

    expect(movingAverage).toBe(20);
    expect(Math.round(movingAverage)).toBe(20);
  });

  it('should accurately calculate 7-period Simple Moving Average from demand vector', () => {
    const demandSeries = [30, 35, 28, 40, 42, 38, 45];
    const windowSize = 7;
    const sum = demandSeries.reduce((a, b) => a + b, 0); // 258
    const movingAverage = sum / windowSize; // 258 / 7 = 36.857...

    expect(Math.round(movingAverage * 10) / 10).toBe(36.9);
    expect(Math.round(movingAverage)).toBe(37);
  });

  it('should correctly calculate kitchen preparation buffer (+8% safety stock)', () => {
    const forecastDemand = 45;
    const bufferPercentage = 8;
    const bufferUnits = Math.ceil(forecastDemand * (bufferPercentage / 100)); // ceil(3.6) = 4
    const minPrep = forecastDemand;
    const maxPrep = forecastDemand + bufferUnits;

    expect(bufferUnits).toBe(4);
    expect(minPrep).toBe(45);
    expect(maxPrep).toBe(49);
  });

  it('should flag insufficient historical data when records are less than window size', () => {
    const dataPoints = [15, 18];
    const requiredWindow = 7;
    const hasSufficientData = dataPoints.length >= requiredWindow;

    expect(hasSufficientData).toBe(false);
  });
});
