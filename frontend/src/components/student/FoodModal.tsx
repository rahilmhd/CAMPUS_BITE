import React, { useState } from 'react';
import { FoodItem } from '../../types/index.js';
import { DietaryBadge } from '../common/DietaryBadge.js';
import { useCart } from '../../context/CartContext.js';
import { Clock, Plus, Minus, X, CheckCircle2, ShieldAlert } from 'lucide-react';

interface FoodModalProps {
  food: FoodItem;
  onClose: () => void;
  showAddToCart?: boolean;
}

export const FoodModal: React.FC<FoodModalProps> = ({ food, onClose, showAddToCart = true }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isSoldOut = !food.available || food.stockQuantity <= 0;
  const maxAvailable = Math.max(0, food.stockQuantity);

  const handleAddToCart = () => {
    if (isSoldOut) return;
    addToCart(food, quantity);
    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-bg/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="card-3d max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Image Header */}
        <div className="relative h-64 w-full bg-dark-elevated">
          <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-dark-bg/80 text-white hover:bg-brand-500 flex items-center justify-center transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <DietaryBadge type={food.dietaryType} />
            {food.category && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-dark-surface/90 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm">
                {food.category.name}
              </span>
            )}
            {isSoldOut && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-500/40">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">{food.name}</h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>Estimated preparation: ~{food.preparationTime} minutes</span>
              </div>
            </div>
            <span className="text-2xl font-black text-brand-400">₹{food.price}</span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{food.description}</p>

          {/* Ingredients Section */}
          <div className="bg-dark-elevated/80 rounded-2xl p-4 border border-white/[0.06]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-1.5">
              Ingredients & Preparation
            </h4>
            <p className="text-xs text-slate-300 leading-normal">{food.ingredients}</p>
          </div>

          {/* Stock / Availability Status Banner */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {isSoldOut ? (
              <span className="w-full px-3 py-2 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Currently Sold Out — Ordering is disabled until restocked by kitchen</span>
              </span>
            ) : food.stockQuantity <= 5 ? (
              <span className="w-full px-3 py-2 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300 flex items-center gap-2 animate-pulse">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Limited stock remaining: Only {food.stockQuantity} portion{food.stockQuantity === 1 ? '' : 's'} available!</span>
              </span>
            ) : (
              <span className="w-full px-3 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Fresh & In Stock: {food.stockQuantity} portions ready in kitchen</span>
              </span>
            )}
          </div>

          {/* Quantity & CTA */}
          {showAddToCart && (
            <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between gap-4">
              {!isSoldOut ? (
                <>
                  <div className="flex items-center gap-3 bg-dark-elevated rounded-2xl p-1.5 border border-white/10">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-xl bg-dark-card text-white hover:bg-dark-highlight disabled:opacity-40 flex items-center justify-center transition-all border border-white/5 active:scale-95"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(maxAvailable, q + 1))}
                      disabled={quantity >= maxAvailable}
                      className="w-8 h-8 rounded-xl bg-dark-card text-white hover:bg-dark-highlight disabled:opacity-40 flex items-center justify-center transition-all border border-white/5 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={added || isSoldOut}
                    className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm transition-all ${
                      added
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                        : 'btn-primary'
                    }`}
                  >
                    {added ? 'Added to Cart! ✓' : `Add to Cart • ₹${food.price * quantity}`}
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-6 rounded-2xl font-bold text-sm bg-rose-950/40 text-rose-400 border border-rose-500/30 cursor-not-allowed"
                >
                  Item Sold Out • Ordering Disabled
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
