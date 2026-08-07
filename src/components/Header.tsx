import React from 'react';
import { ViewMode } from '../types/note';
import { LayoutGrid, List, Settings, Code, Sparkles, Plus } from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  onOpenSettings: () => void;
  onOpenExporter: () => void;
  onOpenNewNote: () => void;
  noteCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onToggleViewMode,
  onOpenSettings,
  onOpenExporter,
  onOpenNewNote,
  noteCount,
}) => {
  return (
    <header className="sticky top-0 z-20 w-full px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between select-none">
      {/* Title & Badge */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
          <Sparkles className="w-5 h-5 fill-current" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              NoteFlow
            </h1>
            <span className="text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300">
              {noteCount}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Material 3 • Hive Offline
          </p>
        </div>
      </div>

      {/* Action Bar Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Quick Add Button */}
        <button
          onClick={onOpenNewNote}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
          title="Create New Note"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Note</span>
        </button>

        {/* View Mode Toggle */}
        <button
          onClick={onToggleViewMode}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
        >
          {viewMode === 'grid' ? (
            <List className="w-5 h-5" />
          ) : (
            <LayoutGrid className="w-5 h-5" />
          )}
        </button>

        {/* Flutter Code Exporter */}
        <button
          onClick={onOpenExporter}
          className="p-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors relative"
          title="View & Export Flutter Source Code"
        >
          <Code className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
