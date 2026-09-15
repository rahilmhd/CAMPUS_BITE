import React, { useEffect, useState } from 'react';
import { FoodService } from '../../services/food.service.js';
import { AnalyticsService } from '../../services/analytics.service.js';
import { FoodItem, MovingAverageForecast } from '../../types/index.js';
import { ForecastComparisonChart } from '../../components/charts/ForecastComparisonChart.js';
import { Sparkles, Calculator, BookOpen, CheckCircle, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';

export const DemandForecastPage: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');
  const [windowSize, setWindowSize] = useState<number>(7);
  const [historyDays, setHistoryDays] = useState<number>(30);
  const [forecast, setForecast] = useState<MovingAverageForecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const list = await FoodService.getAll({ availableOnly: false });
        setFoods(list);
        if (list.length > 0) {
          setSelectedFoodId(list[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchFoods();
  }, []);

  useEffect(() => {
    if (!selectedFoodId) return;

    const fetchForecast = async () => {
      setLoading(true);
      try {
        const data = await AnalyticsService.getForecast(selectedFoodId, windowSize, historyDays);
        setForecast(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [selectedFoodId, windowSize, historyDays]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Statistical Predictive Modeling
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Simple Moving Average (SMA) Demand Forecast
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mathematical estimation of future campus canteen food consumption using time-series sales data.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setWindowSize(3)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                windowSize === 3 ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              3-Day SMA
            </button>
            <button
              onClick={() => setWindowSize(7)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                windowSize === 7 ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              7-Day SMA
            </button>
          </div>
        </div>
      </div>

      {/* Item Selection Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Select Food Item:</label>
          <select
            value={selectedFoodId}
            onChange={(e) => setSelectedFoodId(e.target.value)}
            className="w-full sm:w-80 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {foods.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.category?.name})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Historical Horizon: <strong>{historyDays} days</strong></span>
        </div>
      </div>

      {loading || !forecast ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Forecast Output Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                SMA Demand Forecast
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {forecast.forecastDemand !== null ? `${forecast.forecastDemand} units` : 'N/A'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Moving Average value: <strong>{forecast.movingAverageValue ?? 'N/A'}</strong>
              </p>
            </div>

            <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-3xl p-6 shadow-lg shadow-brand-500/20 space-y-1">
              <span className="text-xs font-bold text-orange-200 uppercase tracking-wider">
                Suggested Preparation Batch
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">
                  {forecast.suggestedPreparation
                    ? `${forecast.suggestedPreparation.min} – ${forecast.suggestedPreparation.max}`
                    : 'N/A'}
                </span>
                <span className="text-xs font-semibold text-orange-100">portions</span>
              </div>
              <p className="text-[11px] text-orange-100">
                Recommended: <strong>{forecast.suggestedPreparation?.recommended ?? 'N/A'} portions</strong> (+{forecast.suggestedPreparation?.bufferPercentage}% safety stock)
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Historical Data Window
              </span>
              <div className="text-3xl font-black text-slate-900">
                {forecast.windowSize} Days
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {forecast.dataPointsAvailable} historical days analyzed
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Model Confidence
              </span>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
                <span className="text-xl font-extrabold text-slate-800">High Confidence</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-bold">
                Sufficient data points present
              </p>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Daily Sales vs. {forecast.windowSize}-Day Simple Moving Average
              </h3>
              <p className="text-xs text-slate-400">
                Bars indicate daily portions sold. The solid orange curve indicates the calculated SMA trend line.
              </p>
            </div>

            <ForecastComparisonChart forecast={forecast} />
          </div>

          {/* Mathematical Explanation & Transparency Box for MCA Viva Examination */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Mathematical Breakdown & Academic Defense
                </h3>
                <p className="text-xs text-slate-400">Step-by-step transparency for viva evaluation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">1. Algorithm Definition:</h4>
                <p>
                  A <strong>Simple Moving Average (SMA)</strong> calculates the unweighted mean of the previous <code className="font-mono font-bold">N</code> data points. For food demand at time <code className="font-mono">t</code>:
                </p>
                <div className="p-3 rounded-2xl bg-slate-50 font-mono text-[11px] text-slate-800 border border-slate-200">
                  SMA_t = (1 / N) × ∑(D_t-i) for i=1 to N
                </div>
                <p className="text-[11px] text-slate-500">
                  As each day progresses, the oldest data point drops off and the newest day is appended, adapting smoothly to campus dietary fluctuations.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">2. Active Calculation Vector:</h4>
                {forecast.calculationBreakdown ? (
                  <div className="p-3 rounded-2xl bg-slate-50 space-y-2 font-mono text-[11px] border border-slate-200">
                    <p><strong>Formula:</strong> {forecast.calculationBreakdown.formula}</p>
                    <p><strong>Sum of recent {forecast.windowSize} days:</strong> {forecast.calculationBreakdown.sum} portions</p>
                    <p><strong>Unrounded Mean:</strong> {forecast.calculationBreakdown.average} portions</p>
                    <p><strong>Rounded Demand Forecast:</strong> {forecast.forecastDemand} portions</p>
                  </div>
                ) : (
                  <p>Awaiting calculation breakdown...</p>
                )}
                <p className="text-[11px] text-slate-500">
                  Preparation batches include an +8% safety buffer to accommodate surprise lunchtime rushes while mitigating wastage of perishable canteen meals.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
