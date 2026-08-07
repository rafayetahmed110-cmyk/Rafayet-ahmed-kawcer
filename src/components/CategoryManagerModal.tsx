import React, { useState } from 'react';
import { Category } from '../types/note';
import { X, Plus, Tag, Trash2 } from 'lucide-react';

interface CategoryManagerModalProps {
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#6750A4', '#1D6C8A', '#386A20', '#825500', '#904A42',
  '#D97706', '#059669', '#2563EB', '#7C3AED', '#DB2777'
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  categories,
  onAddCategory,
  onDeleteCategory,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat: Category = {
      id: `cat_${Date.now()}`,
      name: name.trim(),
      color,
      isCustom: true,
    };

    onAddCategory(newCat);
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Manage Categories
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Categories List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {cat.name}
                </span>
              </div>

              {cat.isCustom && (
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Remove custom category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Category Form */}
        <form onSubmit={handleAdd} className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Create Custom Category
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name"
              className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-medium border border-transparent focus:border-purple-500 outline-none"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Color Selector */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full border-2 transition-transform shrink-0 ${
                  color === c ? 'border-purple-600 scale-110 shadow-sm' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};
