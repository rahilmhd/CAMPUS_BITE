import React, { useState } from 'react';
import { FoodItem } from '../../types/index.js';
import { DietaryBadge } from '../common/DietaryBadge.js';
import { useCart } from '../../context/CartContext.js';
import { Clock, Plus, Minus, X, CheckCircle2, ShieldAlert } from 'lucide-react';

interface FoodModalProps {
  food: FoodItem;
  onClose: () => void;
}

export const FoodModal: React.FC<FoodModalProps> = ({ food, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!food.available) return;
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
          <div className="absolute top-4 left-4 flex gap-2">
            <DietaryBadge type={food.dietaryType} />
            {food.category && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-dark-surface/90 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm">
                {food.category.name}
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

          {/* Stock / Availability */}
          <div className="flex items-center gap-2 text-xs font-medium">
            {food.available ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Available right now in canteen
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> Item is currently sold out
              </span>
            )}
          </div>

          {/* Quantity & CTA */}
          {food.available && (
            <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 bg-dark-elevated rounded-2xl p-1.5 border border-white/10">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-xl bg-dark-card text-white hover:bg-dark-highlight flex items-center justify-center transition-all border border-white/5 active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-bold text-sm text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-xl bg-dark-card text-white hover:bg-dark-highlight flex items-center justify-center transition-all border border-white/5 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm transition-all ${
                  added
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'btn-primary'
                }`}
              >
                {added ? 'Added to Cart! ✓' : `Add to Cart • ₹${food.price * quantity}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
