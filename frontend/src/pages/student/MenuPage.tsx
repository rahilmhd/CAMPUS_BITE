import React, { useEffect, useState } from 'react';
import { FoodService } from '../../services/food.service.js';
import { FoodItem, FoodCategory } from '../../types/index.js';
import { FoodCard } from '../../components/student/FoodCard.js';
import { FilterBar } from '../../components/student/FilterBar.js';
import { Utensils } from 'lucide-react';

export const MenuPage: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catList = await FoodService.getCategories();
        setCategories(catList);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
  }, []);

  const loadFoods = async () => {
    setLoading(true);
    try {
      const items = await FoodService.getAll({
        search: searchQuery || undefined,
        categoryId: selectedCategory || undefined,
        dietaryType: dietaryFilter || undefined,
        availableOnly: availableOnly || undefined,
        sortBy: sortBy as any,
      });
      setFoods(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFoods();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, dietaryFilter, availableOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
          Campus Canteen Menu
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">
          Explore Today's Dishes
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Freshly cooked meals, snacks, and beverages prepared daily by our campus culinary team.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dietaryFilter={dietaryFilter}
        onDietaryChange={setDietaryFilter}
        availableOnly={availableOnly}
        onAvailableChange={setAvailableOnly}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Food Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="card-3d h-72 animate-pulse p-4 space-y-3"
            >
              <div className="h-36 bg-dark-elevated rounded-xl"></div>
              <div className="h-4 bg-dark-elevated rounded w-3/4"></div>
              <div className="h-3 bg-dark-elevated rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="card-3d p-12 text-center space-y-3">
          <Utensils className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No food items found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, removing dietary filters, or exploring another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              setDietaryFilter('');
              setAvailableOnly(false);
            }}
            className="btn-secondary text-xs font-bold py-2 px-4"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};
