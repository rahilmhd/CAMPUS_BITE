import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '../../services/analytics.service.js';
import { MovingAverageForecast } from '../../types/index.js';
import { PrepRecommendationCard } from '../../components/kitchen/PrepRecommendationCard.js';
import { Sparkles, Calendar, BookOpen, RefreshCw } from 'lucide-react';

export const KitchenPrepAdvicePage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<MovingAverageForecast[]>([]);
  const [windowSize, setWindowSize] = useState<number>(7);
  const [loading, setLoading] = useState(true);

  const fetchPrepAdvice = async () => {
    setLoading(true);
    try {
      const data = await AnalyticsService.getKitchenRecommendations(windowSize);
      setRecommendations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrepAdvice();
  }, [windowSize]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Kitchen Operations Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Food Preparation Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Statistical Simple Moving Average (SMA) forecasting calculated from historical canteen sales.
          </p>
        </div>

        {/* Window Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-1 text-xs font-bold">
            <button
              onClick={() => setWindowSize(3)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                windowSize === 3
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3-Day SMA
            </button>
            <button
              onClick={() => setWindowSize(7)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                windowSize === 7
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7-Day SMA (Standard)
            </button>
          </div>

          <button
            onClick={fetchPrepAdvice}
            className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Recalculate"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Methodology Educational Note (Important for MCA Project Viva) */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 flex items-start gap-4">
        <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 flex-shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-amber-900">
          <h4 className="font-bold">Academic Project Methodology: Simple Moving Average (SMA)</h4>
          <p className="text-amber-800 leading-relaxed">
            The platform calculates the forecast demand as:
            <code className="font-mono bg-amber-100/80 px-2 py-0.5 rounded text-amber-900 mx-1">
              SMA = (D₁ + D₂ + ... + Dₙ) / N
            </code>
            where <code className="font-mono">N</code> is the chosen window period and <code className="font-mono">D</code> represents actual daily quantity sold. A safety buffer (+8%) is added to minimize stockouts while preventing perishable food wastage.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-3xl h-64 border border-slate-100 animate-pulse p-6"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((forecast) => (
            <PrepRecommendationCard key={forecast.foodItemId} forecast={forecast} />
          ))}
        </div>
      )}
    </div>
  );
};
