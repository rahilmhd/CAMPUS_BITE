import React, { useEffect, useState } from 'react';
import { FoodService } from '../../services/food.service.js';
import { FoodItem, FoodCategory, DietaryType } from '../../types/index.js';
import { DietaryBadge } from '../../components/common/DietaryBadge.js';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  FolderPlus,
} from 'lucide-react';

export const FoodManagementPage: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(100);
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [dietaryType, setDietaryType] = useState<DietaryType>('VEGETARIAN');
  const [preparationTime, setPreparationTime] = useState<number>(15);
  const [stockQuantity, setStockQuantity] = useState<number>(50);
  const [available, setAvailable] = useState<boolean>(true);

  // Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [fList, cList] = await Promise.all([
        FoodService.getAll({ search: search || undefined, categoryId: selectedCat || undefined }),
        FoodService.getCategories(),
      ]);
      setFoods(fList);
      setCategories(cList);
      if (cList.length > 0 && !categoryId) {
        setCategoryId(cList[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedCat]);

  const openAddModal = () => {
    setEditingFood(null);
    setName('');
    setDescription('');
    setPrice(100);
    setImageUrl('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80');
    setIngredients('Fresh ingredients');
    setDietaryType('VEGETARIAN');
    setPreparationTime(15);
    setStockQuantity(50);
    setAvailable(true);
    if (categories.length > 0) setCategoryId(categories[0].id);
    setModalOpen(true);
  };

  const openEditModal = (food: FoodItem) => {
    setEditingFood(food);
    setName(food.name);
    setCategoryId(food.categoryId);
    setDescription(food.description);
    setPrice(food.price);
    setImageUrl(food.imageUrl);
    setIngredients(food.ingredients);
    setDietaryType(food.dietaryType);
    setPreparationTime(food.preparationTime);
    setStockQuantity(food.stockQuantity);
    setAvailable(food.available);
    setModalOpen(true);
  };

  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        categoryId,
        description,
        price: Number(price),
        imageUrl,
        ingredients,
        dietaryType,
        preparationTime: Number(preparationTime),
        stockQuantity: Number(stockQuantity),
        available,
      };

      if (editingFood) {
        await FoodService.update(editingFood.id, payload);
      } else {
        await FoodService.create(payload);
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save food item');
    }
  };

  const handleToggleAvailability = async (id: string, current: boolean) => {
    try {
      await FoodService.toggleAvailability(id, !current);
      setFoods((prev) =>
        prev.map((f) => (f.id === id ? { ...f, available: !current } : f))
      );
    } catch (e: any) {
      alert(e.message || 'Failed to change availability');
    }
  };

  const handleDeleteFood = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate/delete this food item?')) return;
    try {
      await FoodService.delete(id);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to delete food item');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      await FoodService.createCategory({ name: newCatName, description: newCatDesc });
      setCategoryModalOpen(false);
      setNewCatName('');
      setNewCatDesc('');
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to create category');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.07]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Menu Administration</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Food Item Management</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add dishes, modify pricing, toggle kitchen stock availability, and categorize menu offerings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="btn-secondary text-xs py-2.5 px-3.5 flex items-center gap-1.5 font-bold"
          >
            <FolderPlus className="w-4 h-4 text-brand-400" /> New Category
          </button>

          <button
            onClick={openAddModal}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 font-bold shadow-3d-btn"
          >
            <Plus className="w-4 h-4" /> Add Food Item
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-3d p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items by name, description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-elevated border border-white/10 text-xs text-white placeholder-slate-500 focus:border-brand-500"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="py-2 px-3 rounded-xl bg-dark-elevated border border-white/10 text-xs font-semibold text-slate-200 focus:border-brand-500 w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Food Items Table */}
      <div className="card-3d overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-dark-elevated/80 border-b border-white/[0.08] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Diet</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Prep Time</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {foods.map((food) => (
                <tr key={food.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="w-10 h-10 rounded-xl object-cover bg-dark-elevated"
                      />
                      <div>
                        <span className="font-bold text-white block text-xs">{food.name}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[200px]">
                          {food.description}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">
                    {food.category?.name || 'General'}
                  </td>
                  <td className="py-3 px-4">
                    <DietaryBadge type={food.dietaryType} />
                  </td>
                  <td className="py-3 px-4 font-black text-brand-400">₹{food.price}</td>
                  <td className="py-3 px-4 text-slate-400">~{food.preparationTime}m</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleAvailability(food.id, food.available)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        food.available
                          ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950'
                          : 'bg-rose-950/70 border-rose-500/30 text-rose-300 hover:bg-rose-950'
                      }`}
                    >
                      {food.available ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Available
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Sold Out
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(food)}
                      className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFood(food.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete / Deactivate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Food Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-bg/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d max-w-xl w-full p-6 space-y-4 border border-brand-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="font-bold text-white text-base">
                {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFood} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chicken Biriyani"
                  className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white font-semibold focus:border-brand-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-brand-400 font-bold focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Dietary Preference</label>
                  <select
                    value={dietaryType}
                    onChange={(e) => setDietaryType(e.target.value as DietaryType)}
                    className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white font-semibold focus:border-brand-500"
                  >
                    <option value="VEGETARIAN">Vegetarian</option>
                    <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="EGG">Egg</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white font-mono text-[11px] focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Flavorful description for student menu"
                  className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Ingredients List</label>
                <input
                  type="text"
                  required
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Rice, Spices, Ghee, Cashews..."
                  className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white focus:border-brand-500"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-500 accent-brand-500"
                  />
                  <span>Mark as Available in Canteen</span>
                </label>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-5 font-bold shadow-3d-btn">
                  {editingFood ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-bg/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d max-w-sm w-full p-6 space-y-4 shadow-2xl border border-brand-500/30">
            <h3 className="font-bold text-white text-sm">Create Food Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Desserts"
                  className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Brief description"
                  className="w-full px-3 py-2 rounded-xl bg-dark-elevated border border-white/10 text-white focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-1.5 px-4 font-bold shadow-3d-btn">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
