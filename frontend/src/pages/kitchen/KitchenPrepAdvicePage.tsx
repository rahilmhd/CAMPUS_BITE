import React, { useEffect, useState } from 'react';
import { AnalyticsService } from '../../services/analytics.service.js';
import { MovingAverageForecast } from '../../types/index.js';
import { PrepRecommendationCard } from '../../components/kitchen/PrepRecommendationCard.js';
import { BookOpen, RefreshCw } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.07]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Kitchen Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Food Preparation Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Statistical Simple Moving Average (SMA) forecasting calculated from historical canteen sales.
          </p>
        </div>

        {/* Window Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-dark-elevated rounded-2xl p-1 text-xs font-bold border border-white/10">
            <button
              onClick={() => setWindowSize(3)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                windowSize === 3
                  ? 'bg-brand-500 text-white shadow-3d-btn'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3-Day SMA
            </button>
            <button
              onClick={() => setWindowSize(7)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                windowSize === 7
                  ? 'bg-brand-500 text-white shadow-3d-btn'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7-Day SMA (Standard)
            </button>
          </div>

          <button
            onClick={fetchPrepAdvice}
            className="p-2.5 rounded-xl btn-secondary"
            title="Recalculate"
          >
            <RefreshCw className="w-4 h-4 text-brand-400" />
          </button>
        </div>
      </div>

      {/* Methodology Educational Note */}
      <div className="bg-gradient-to-r from-dark-surface to-brand-950/30 border border-brand-500/20 rounded-3xl p-5 flex items-start gap-4">
        <div className="p-2.5 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex-shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-slate-300">
          <h4 className="font-bold text-white">Demand Forecasting Model: Simple Moving Average (SMA)</h4>
          <p className="text-slate-400 leading-relaxed">
            The platform calculates the forecast demand as:
            <code className="font-mono bg-dark-elevated px-2 py-0.5 rounded text-brand-300 mx-1 border border-white/5">
              SMA = (D₁ + D₂ + ... + Dₙ) / N
            </code>
            where <code className="font-mono text-brand-400">N</code> is the chosen window period and <code className="font-mono text-brand-400">D</code> represents actual daily quantity sold. A safety buffer (+8%) is added to minimize stockouts while preventing perishable food wastage.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="card-3d h-64 animate-pulse p-6"></div>
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
