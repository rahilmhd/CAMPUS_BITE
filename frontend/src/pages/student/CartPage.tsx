import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.js';
import { DietaryBadge } from '../../components/common/DietaryBadge.js';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Clock } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, itemCount, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Explore our delicious campus canteen catalog and add your favorite dishes.
        </p>
        <Link to="/student/menu" className="btn-primary text-xs sm:text-sm py-3 px-6 inline-flex">
          Browse Live Menu
        </Link>
      </div>
    );
  }

  // Check if any cart item is unavailable
  const hasUnavailableItems = items.some((i) => !i.food.available);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Review Items</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Food Cart ({itemCount})</h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {hasUnavailableItems && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>Some items in your cart have just sold out. Please remove them before proceeding.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ food, quantity }) => (
            <div
              key={food.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center gap-4 transition-all"
            >
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <DietaryBadge type={food.dietaryType} showText={false} />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">{food.name}</h3>
                </div>

                <p className="text-xs text-brand-600 font-extrabold">₹{food.price} each</p>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>Prep ~{food.preparationTime} mins</span>
                </div>
              </div>

              {/* Quantity Controls & Subtotal */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(food.id, quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50 shadow-xs"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(food.id, quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="text-sm font-black text-slate-900">₹{food.price * quantity}</span>
                </div>

                <button
                  onClick={() => removeFromCart(food.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Checkout Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-semibold text-slate-800">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Campus Canteen Convenience Fee</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Prep Time</span>
                <span className="font-semibold text-slate-800">~15-20 mins</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-900">Total Payable</span>
              <span className="text-2xl font-black text-brand-600">₹{totalAmount}</span>
            </div>

            <button
              onClick={() => navigate('/student/checkout')}
              disabled={hasUnavailableItems}
              className="w-full btn-primary py-3.5 text-sm font-bold shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              🔒 Instant server-side payment verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
