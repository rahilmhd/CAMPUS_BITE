import React, { useState } from 'react';
import { FoodItem } from '../../types/index.js';
import { DietaryBadge } from '../common/DietaryBadge.js';
import { useCart } from '../../context/CartContext.js';
import { Clock, Plus, Eye, AlertCircle } from 'lucide-react';
import { FoodModal } from './FoodModal.js';

export const FoodCard: React.FC<{ food: FoodItem }> = ({ food }) => {
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!food.available) return;
    addToCart(food, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className={`group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer ${
          !food.available ? 'opacity-70 grayscale-[30%]' : ''
        }`}
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span className="text-white text-xs font-medium flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> View Details & Ingredients
            </span>
          </div>

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <DietaryBadge type={food.dietaryType} />
            {food.category && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm">
                {food.category.name}
              </span>
            )}
          </div>

          {/* Unavailable overlay */}
          {!food.available && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-lg">
                <AlertCircle className="w-4 h-4" /> Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors line-clamp-1">
                {food.name}
              </h3>
              <span className="text-base font-extrabold text-brand-600">
                ₹{food.price}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
              {food.description}
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>~{food.preparationTime} mins</span>
            </div>

            {food.available ? (
              <button
                onClick={handleAdd}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                {justAdded ? 'Added! ✓' : 'Add to Cart'}
              </button>
            ) : (
              <span className="text-xs text-rose-500 font-semibold">Unavailable</span>
            )}
          </div>
        </div>
      </div>

      {modalOpen && <FoodModal food={food} onClose={() => setModalOpen(false)} />}
    </>
  );
};
