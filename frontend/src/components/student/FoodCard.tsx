import React, { useState } from 'react';
import { FoodItem } from '../../types/index.js';
import { DietaryBadge } from '../common/DietaryBadge.js';
import { useCart } from '../../context/CartContext.js';
import { Clock, Plus, Eye, AlertCircle } from 'lucide-react';
import { FoodModal } from './FoodModal.js';

interface FoodCardProps {
  food: FoodItem;
  showAddToCart?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, showAddToCart = true }) => {
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isSoldOut = !food.available || food.stockQuantity <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(food, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className={`group card-3d overflow-hidden flex flex-col cursor-pointer transition-all ${
          isSoldOut ? 'opacity-70 grayscale-[30%]' : ''
        }`}
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-dark-elevated">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span className="text-white text-xs font-medium flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-brand-400" /> View Details & Ingredients
            </span>
          </div>

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
            <DietaryBadge type={food.dietaryType} />
            {food.category && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-dark-surface/90 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm">
                {food.category.name}
              </span>
            )}
            {isSoldOut ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/40">
                Sold Out
              </span>
            ) : food.stockQuantity <= 5 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40 animate-pulse">
                Only {food.stockQuantity} left!
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                {food.stockQuantity} in stock
              </span>
            )}
          </div>

          {/* Unavailable Overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-3.5 py-1.5 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                <AlertCircle className="w-4 h-4 text-rose-400" /> Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-white text-base group-hover:text-brand-400 transition-colors line-clamp-1">
                {food.name}
              </h3>
              <span className="text-base font-black text-brand-400">
                ₹{food.price}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
              {food.description}
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-brand-400/80" />
              <span>~{food.preparationTime} mins</span>
            </div>

            {showAddToCart ? (
              !isSoldOut ? (
                <button
                  onClick={handleAdd}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    justAdded
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-brand-500/15 hover:bg-brand-500 text-brand-400 hover:text-white border border-brand-500/30 hover:border-brand-500 active:scale-95 shadow-sm'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  {justAdded ? 'Added! ✓' : 'Add to Cart'}
                </button>
              ) : (
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-400 bg-rose-950/40 border border-rose-500/30">
                  Sold Out
                </span>
              )
            ) : null}
          </div>
        </div>
      </div>

      {modalOpen && (
        <FoodModal
          food={food}
          onClose={() => setModalOpen(false)}
          showAddToCart={showAddToCart}
        />
      )}
    </>
  );
};
