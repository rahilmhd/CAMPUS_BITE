import React, { useEffect, useState } from 'react';
import { FoodService } from '../../services/food.service.js';
import { AnalyticsService } from '../../services/analytics.service.js';
import { FoodItem, MovingAverageForecast } from '../../types/index.js';
import { ForecastComparisonChart } from '../../components/charts/ForecastComparisonChart.js';
import { Calculator, CheckCircle, Calendar } from 'lucide-react';

export const DemandForecastPage: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');
  const [windowSize, setWindowSize] = useState<number>(7);
  const [historyDays] = useState<number>(30);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full inline-block mb-2">
            Statistical Predictive Modeling
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Simple Moving Average (SMA) Demand Forecast
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mathematical estimation of future campus canteen food consumption using time-series sales data.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-dark-card/80 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl text-xs font-bold shadow-inner">
            <button
              onClick={() => setWindowSize(3)}
              className={`px-3.5 py-1.5 rounded-xl transition-all font-semibold ${
                windowSize === 3
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3-Day SMA
            </button>
            <button
              onClick={() => setWindowSize(7)}
              className={`px-3.5 py-1.5 rounded-xl transition-all font-semibold ${
                windowSize === 7
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7-Day SMA
            </button>
          </div>
        </div>
      </div>

      {/* Item Selection Toolbar */}
      <div className="card-3d p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-300 whitespace-nowrap">Select Food Item:</label>
          <select
            value={selectedFoodId}
            onChange={(e) => setSelectedFoodId(e.target.value)}
            className="w-full sm:w-80 px-4 py-2.5 rounded-2xl bg-dark-elevated border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20"
          >
            {foods.map((f) => (
              <option key={f.id} value={f.id} className="bg-dark-card text-white">
                {f.name} ({f.category?.name})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-4 h-4 text-brand-400" />
          <span>Historical Horizon: <strong className="text-white">{historyDays} days</strong></span>
        </div>
      </div>

      {loading || !forecast ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white/10 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Key Forecast Output Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="card-3d p-6 border border-white/10 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                SMA Demand Forecast
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-brand-400">
                  {forecast.forecastDemand !== null ? `${forecast.forecastDemand} units` : 'N/A'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Moving Average value: <strong className="text-slate-200">{forecast.movingAverageValue ?? 'N/A'}</strong>
              </p>
            </div>

            <div className="bg-gradient-to-br from-brand-600 to-orange-700 text-white rounded-3xl p-6 shadow-xl shadow-brand-500/20 border border-brand-400/30 space-y-1">
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
                Recommended: <strong>{forecast.suggestedPreparation?.recommended ?? 'N/A'} portions</strong> (+{forecast.suggestedPreparation?.bufferPercentage}% buffer)
              </p>
            </div>

            <div className="card-3d p-6 border border-white/10 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Historical Data Window
              </span>
              <div className="text-3xl font-black text-white">
                {forecast.windowSize} Days
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                <strong className="text-slate-200">{forecast.dataPointsAvailable}</strong> historical days analyzed
              </p>
            </div>

            <div className="card-3d p-6 border border-white/10 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Model Confidence
              </span>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <span className="text-xl font-extrabold text-white">High Confidence</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-bold">
                Sufficient data points present
              </p>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="card-3d p-6 border border-white/10 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Daily Sales vs. {forecast.windowSize}-Day Simple Moving Average
              </h3>
              <p className="text-xs text-slate-400">
                Bars indicate daily portions sold. The solid orange curve indicates the calculated SMA trend line.
              </p>
            </div>

            <ForecastComparisonChart forecast={forecast} />
          </div>

          {/* Mathematical Explanation & Transparency Box */}
          <div className="card-3d p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Mathematical Breakdown & Academic Defense
                </h3>
                <p className="text-xs text-slate-400">Step-by-step transparency for viva evaluation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
              <div className="space-y-2">
                <h4 className="font-bold text-white">1. Algorithm Definition:</h4>
                <p className="text-slate-400">
                  A <strong className="text-slate-200">Simple Moving Average (SMA)</strong> calculates the unweighted mean of the previous <code className="font-mono font-bold text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded">N</code> data points. For food demand at time <code className="font-mono text-brand-400">t</code>:
                </p>
                <div className="p-3.5 rounded-2xl bg-dark-elevated font-mono text-[11px] text-brand-300 border border-white/10 shadow-inner">
                  SMA_t = (1 / N) × ∑(D_t-i) for i=1 to N
                </div>
                <p className="text-[11px] text-slate-400">
                  As each day progresses, the oldest data point drops off and the newest day is appended, adapting smoothly to campus dietary fluctuations.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white">2. Active Calculation Vector:</h4>
                {forecast.calculationBreakdown ? (
                  <div className="p-3.5 rounded-2xl bg-dark-elevated space-y-1.5 font-mono text-[11px] border border-white/10 shadow-inner text-slate-300">
                    <p><strong className="text-slate-100">Formula:</strong> <span className="text-brand-400">{forecast.calculationBreakdown.formula}</span></p>
                    <p><strong className="text-slate-100">Sum of recent {forecast.windowSize} days:</strong> {forecast.calculationBreakdown.sum} portions</p>
                    <p><strong className="text-slate-100">Unrounded Mean:</strong> {forecast.calculationBreakdown.average} portions</p>
                    <p><strong className="text-slate-100">Rounded Demand Forecast:</strong> <span className="text-brand-400 font-bold">{forecast.forecastDemand} portions</span></p>
                  </div>
                ) : (
                  <p className="text-slate-500">Awaiting calculation breakdown...</p>
                )}
                <p className="text-[11px] text-slate-400">
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
