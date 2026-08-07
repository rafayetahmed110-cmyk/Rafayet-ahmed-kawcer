import React from 'react';
import { FileQuestion, Plus, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  hasFilterOrSearch: boolean;
  onClearFilters: () => void;
  onCreateNewNote: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilterOrSearch,
  onClearFilters,
  onCreateNewNote,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center my-auto min-h-[320px] select-none">
      <div className="w-20 h-20 rounded-3xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 shadow-inner">
        <FileQuestion className="w-10 h-10" />
      </div>

      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
        {hasFilterOrSearch ? 'No matching notes found' : 'No notes yet'}
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6 leading-relaxed">
        {hasFilterOrSearch
          ? 'Try clearing your search query or changing active category filters.'
          : 'Tap the button below to create your first note or reset sample data.'}
      </p>

      {hasFilterOrSearch ? (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear All Filters</span>
        </button>
      ) : (
        <button
          onClick={onCreateNewNote}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create First Note</span>
        </button>
      )}
    </div>
  );
};
