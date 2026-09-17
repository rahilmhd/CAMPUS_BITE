import React from 'react';
import { FoodCategory } from '../../types/index.js';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
  categories: FoodCategory[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  dietaryFilter: string;
  onDietaryChange: (diet: string) => void;
  availableOnly: boolean;
  onAvailableChange: (avail: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  dietaryFilter,
  onDietaryChange,
  availableOnly,
  onAvailableChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="card-3d p-5 space-y-4">
      {/* Search Input and Sort Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by food name, dish, ingredients..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-dark-elevated border border-white/10 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 whitespace-nowrap">
            <SlidersHorizontal className="w-4 h-4 text-brand-400" />
            <span>Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="py-2.5 px-3 rounded-xl bg-dark-elevated border border-white/10 text-xs font-semibold text-slate-200 focus:border-brand-500 w-full sm:w-auto"
          >
            <option value="popularity">Most Popular 🔥</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectCategory('')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === ''
              ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-3d-btn border border-brand-400/40'
              : 'bg-dark-elevated text-slate-300 hover:text-white hover:bg-dark-highlight border border-white/5'
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-3d-btn border border-brand-400/40'
                : 'bg-dark-elevated text-slate-300 hover:text-white hover:bg-dark-highlight border border-white/5'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Secondary Filter Badges (Dietary & Availability) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.07]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">Diet:</span>
          {[
            { label: 'All', val: '' },
            { label: 'Veg Only', val: 'VEGETARIAN' },
            { label: 'Non-Veg', val: 'NON_VEGETARIAN' },
            { label: 'Vegan', val: 'VEGAN' },
            { label: 'Egg', val: 'EGG' },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => onDietaryChange(item.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                dietaryFilter === item.val
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40 font-bold shadow-glow-orange-sm'
                  : 'bg-dark-elevated text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => onAvailableChange(e.target.checked)}
            className="w-4 h-4 rounded text-brand-500 accent-brand-500 focus:ring-brand-400 border-white/10"
          />
          <span>In-Stock Only</span>
        </label>
      </div>
    </div>
  );
};
