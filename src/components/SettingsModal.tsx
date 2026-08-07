import React from 'react';
import { ThemeMode, ViewMode } from '../types/note';
import { X, Moon, Sun, Monitor, LayoutGrid, List, Database, Info, RefreshCw, Trash2, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  themeMode: ThemeMode;
  onSetThemeMode: (mode: ThemeMode) => void;
  defaultViewMode: ViewMode;
  onSetDefaultViewMode: (mode: ViewMode) => void;
  noteCount: number;
  onResetSampleData: () => void;
  onClearAllData: () => void;
  onReplaySplash: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  themeMode,
  onSetThemeMode,
  defaultViewMode,
  onSetDefaultViewMode,
  noteCount,
  onResetSampleData,
  onClearAllData,
  onReplaySplash,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Settings */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase">
            Appearance & Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSetThemeMode('system')}
              className={`p-3 rounded-2xl flex flex-col items-center gap-2 border text-xs font-semibold transition-all ${
                themeMode === 'system'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Monitor className="w-5 h-5" />
              <span>System</span>
            </button>

            <button
              onClick={() => onSetThemeMode('light')}
              className={`p-3 rounded-2xl flex flex-col items-center gap-2 border text-xs font-semibold transition-all ${
                themeMode === 'light'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Sun className="w-5 h-5" />
              <span>Light</span>
            </button>

            <button
              onClick={() => onSetThemeMode('dark')}
              className={`p-3 rounded-2xl flex flex-col items-center gap-2 border text-xs font-semibold transition-all ${
                themeMode === 'dark'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        {/* Layout View Mode Preference */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase">
            Default View Layout
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSetDefaultViewMode('grid')}
              className={`p-3 rounded-2xl flex items-center justify-center gap-2 border text-xs font-semibold transition-all ${
                defaultViewMode === 'grid'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Staggered Grid</span>
            </button>

            <button
              onClick={() => onSetDefaultViewMode('list')}
              className={`p-3 rounded-2xl flex items-center justify-center gap-2 border text-xs font-semibold transition-all ${
                defaultViewMode === 'list'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Single Column List</span>
            </button>
          </div>
        </div>

        {/* Database Status & Tools */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase">
            Hive Offline Database
          </label>
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-medium">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" />
                <span>Storage Engine</span>
              </div>
              <span className="font-mono bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md text-[10px]">
                Hive 2.2.3 • Offline
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span>Total Active Notes</span>
              <span className="font-bold text-slate-900 dark:text-white">{noteCount} Notes</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onResetSampleData}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
              <span>Reset Samples</span>
            </button>

            <button
              onClick={onClearAllData}
              className="flex-1 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-600 dark:text-rose-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>

        {/* About App Section */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">NoteFlow Architecture</span>
            </div>
            <button
              onClick={onReplaySplash}
              className="text-purple-600 dark:text-purple-400 hover:underline text-[11px] font-medium"
            >
              Replay Intro
            </button>
          </div>
          <p className="leading-relaxed">
            Built with Flutter 3.x, Dart 3.x, Riverpod 2.x, GoRouter, Hive DB, and Material Design 3. GitHub Actions workflow included for release APK build targeting Android SDK 35.
          </p>
        </div>
      </div>
    </div>
  );
};
