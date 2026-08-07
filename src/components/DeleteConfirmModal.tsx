import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  noteTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  noteTitle,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Note?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 px-2">
            Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{noteTitle || 'Untitled Note'}"</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
