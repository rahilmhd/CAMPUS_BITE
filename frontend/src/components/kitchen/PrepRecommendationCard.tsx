import React from 'react';
import { MovingAverageForecast } from '../../types/index.js';
import { DietaryBadge } from '../common/DietaryBadge.js';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export const PrepRecommendationCard: React.FC<{ forecast: MovingAverageForecast }> = ({ forecast }) => {
  return (
    <div className="card-3d p-6 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">{forecast.foodName}</h3>
              <DietaryBadge type={forecast.dietaryType} showText={false} />
            </div>
            <span className="text-xs text-slate-400 font-medium">{forecast.categoryName}</span>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-dark-elevated text-brand-400 font-bold border border-white/5">
            {forecast.windowSize}-Day SMA
          </span>
        </div>

        {forecast.isSufficientData && forecast.suggestedPreparation ? (
          <div className="py-4 space-y-4">
            {/* Recommendation Highlight Box */}
            <div className="bg-gradient-to-br from-brand-950/50 to-dark-elevated rounded-2xl p-4 border border-brand-500/30">
              <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider block">
                Suggested Preparation Batch
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-brand-400">
                  {forecast.suggestedPreparation.min} – {forecast.suggestedPreparation.max}
                </span>
                <span className="text-xs font-semibold text-slate-400">portions / day</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Target: <strong className="text-white">{forecast.suggestedPreparation.recommended} portions</strong> (includes +{forecast.suggestedPreparation.bufferPercentage}% safety buffer).
              </p>
            </div>

            {/* Demand Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-dark-elevated p-3 rounded-2xl border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Moving Average</span>
                <span className="text-base font-bold text-white">{forecast.movingAverageValue} units/day</span>
              </div>

              <div className="bg-dark-elevated p-3 rounded-2xl border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Data Points Used</span>
                <span className="text-base font-bold text-white">{forecast.dataPointsAvailable} historical days</span>
              </div>
            </div>

            {/* Transparent Algorithm Note */}
            {forecast.calculationBreakdown && (
              <div className="bg-dark-elevated/80 rounded-xl p-2.5 text-[11px] font-mono text-slate-300 border border-white/[0.06]">
                <p className="truncate" title={forecast.calculationBreakdown.formula}>
                  📐 {forecast.calculationBreakdown.formula}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <p className="text-xs font-bold text-slate-200">{forecast.statusMessage}</p>
            <p className="text-[11px] text-slate-500 mt-1">More sales history is being recorded daily.</p>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-white/[0.06] text-[10px] text-slate-400 flex items-center justify-between">
        <span>Statistical Demand Forecasting</span>
        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-brand-400" /> Transparent Math</span>
      </div>
    </div>
  );
};
