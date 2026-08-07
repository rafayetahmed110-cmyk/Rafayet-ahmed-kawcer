import React from 'react';
import { Category, SortBy, CategoryType } from '../types/note';
import { Star, Pin, SlidersHorizontal, Plus } from 'lucide-react';

interface FilterBarProps {
  categories: Category[];
  selectedCategory: CategoryType | null;
  onSelectCategory: (category: CategoryType | null) => void;
  favoritesOnly: boolean;
  onToggleFavorites: () => void;
  pinnedOnly: boolean;
  onTogglePinned: () => void;
  sortBy: SortBy;
  onSelectSortBy: (sort: SortBy) => void;
  onOpenCategoryManager: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  favoritesOnly,
  onToggleFavorites,
  pinnedOnly,
  onTogglePinned,
  sortBy,
  onSelectSortBy,
  onOpenCategoryManager,
}) => {
  return (
    <div className="w-full space-y-2 py-1 select-none">
      {/* Category Pills & Quick Actions Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
        {/* All Category Pill */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === null && !favoritesOnly && !pinnedOnly
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          All Notes
        </button>

        {/* Favorites Quick Pill */}
        <button
          onClick={onToggleFavorites}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            favoritesOnly
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-current' : ''}`} />
          <span>Favorites</span>
        </button>

        {/* Pinned Quick Pill */}
        <button
          onClick={onTogglePinned}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            pinnedOnly
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
          <span>Pinned</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1 shrink-0" />

        {/* Categories Pills */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(isSelected ? null : cat.name);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.name}</span>
            </button>
          );
        })}

        {/* Add Category Button */}
        <button
          onClick={onOpenCategoryManager}
          className="px-2 py-1.5 rounded-xl text-xs font-medium bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center gap-1 shrink-0"
          title="Manage Categories"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sort By Dropdown Selector Row */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 pt-1">
        <span className="font-medium flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-purple-500" />
          Sort Order:
        </span>

        <select
          value={sortBy}
          onChange={(e) => onSelectSortBy(e.target.value as SortBy)}
          className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="newest" className="dark:bg-slate-900">Newest First</option>
          <option value="oldest" className="dark:bg-slate-900">Oldest First</option>
          <option value="a-z" className="dark:bg-slate-900">Alphabetical (A-Z)</option>
          <option value="lastEdited" className="dark:bg-slate-900">Recently Edited</option>
        </select>
      </div>
    </div>
  );
};
