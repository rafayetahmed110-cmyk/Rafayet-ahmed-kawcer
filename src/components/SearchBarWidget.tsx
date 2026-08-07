import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarWidgetProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBarWidget: React.FC<SearchBarWidgetProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search title, content, or tags..."
        className="w-full pl-10 pr-9 py-2.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/60 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl text-sm font-medium border border-transparent focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
      />

      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
