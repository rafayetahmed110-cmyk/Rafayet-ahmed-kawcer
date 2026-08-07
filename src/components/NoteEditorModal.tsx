import React, { useState, useEffect, useRef } from 'react';
import { Note, Category, CategoryType } from '../types/note';
import { NOTE_COLOR_PALETTE } from '../utils/storage';
import { ArrowLeft, Pin, Star, Trash2, CheckCircle2, Clock } from 'lucide-react';

interface NoteEditorModalProps {
  note: Note | null; // null if creating new
  categories: Category[];
  isDarkMode: boolean;
  onSave: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onClose: () => void;
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  note,
  categories,
  isDarkMode,
  onSave,
  onDelete,
  onClose,
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [description, setDescription] = useState(note?.description || '');
  const [category, setCategory] = useState<CategoryType>(note?.category || 'Personal');
  const [color, setColor] = useState<string>(note?.color || '#ffffff');
  const [isPinned, setIsPinned] = useState<boolean>(note?.isPinned || false);
  const [isFavorite, setIsFavorite] = useState<boolean>(note?.isFavorite || false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  const isInitialMount = useRef(true);

  // Auto-save debouncer
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      handleSaveInternal();
      setSaveStatus('saved');
    }, 500);

    return () => clearTimeout(timer);
  }, [title, description, category, color, isPinned, isFavorite]);

  const handleSaveInternal = () => {
    if (!title.trim() && !description.trim()) return;

    const updatedNote: Note = {
      id: note?.id || `note_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      color,
      isPinned,
      isFavorite,
      createdAt: note?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    onSave(updatedNote);
  };

  // Find card background color
  const matchedPalette = NOTE_COLOR_PALETTE.find((p) => p.hex === color);
  const editorBg = isDarkMode
    ? matchedPalette?.darkHex || '#111827'
    : color || '#ffffff';

  const charCount = description.length;
  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-hidden select-none">
      <div
        style={{ backgroundColor: editorBg }}
        className="w-full max-w-2xl h-full max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/40 dark:border-slate-800 transition-colors duration-300"
      >
        {/* Top Header Navigation Bar */}
        <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-slate-800 dark:text-slate-100 font-medium text-xs hover:bg-black/10 dark:hover:bg-white/20 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Save Status & Action Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {saveStatus === 'saving' ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin text-purple-500" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Auto saved</span>
                </>
              )}
            </div>

            {/* Pin Button */}
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                isPinned ? 'text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-950/50' : 'text-slate-400'
              }`}
              title={isPinned ? 'Unpin note' : 'Pin note'}
            >
              <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                isFavorite ? 'text-amber-500 bg-amber-100/50 dark:bg-amber-950/50' : 'text-slate-400'
              }`}
              title={isFavorite ? 'Remove favorite' : 'Mark favorite'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Delete button (if existing note) */}
            {note && (
              <button
                onClick={() => {
                  if (confirm('Delete this note permanently?')) {
                    onDelete(note.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Note Body Inputs */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {/* Category Picker Selector Pill */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Category:</span>
            {categories.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.name)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Note Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full text-2xl sm:text-3xl font-extrabold bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400/80 outline-none border-none tracking-tight"
          />

          {/* Time & Counter Stats Header */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 pb-2 border-b border-black/5 dark:border-white/5">
            <span>{new Date(note?.createdAt || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span>•</span>
            <span>{charCount} characters</span>
            <span>•</span>
            <span>{wordCount} words</span>
          </div>

          {/* Description Textarea */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Start writing your thoughts, checklists, or ideas..."
            className="w-full h-64 sm:h-80 bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400/70 outline-none resize-none leading-relaxed text-sm sm:text-base font-normal"
          />
        </div>

        {/* Bottom Color Palette Bar */}
        <div className="p-4 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Color:</span>
            {NOTE_COLOR_PALETTE.map((palette) => {
              const isSelected = color === palette.hex;
              return (
                <button
                  key={palette.name}
                  onClick={() => setColor(palette.hex)}
                  style={{ backgroundColor: isDarkMode ? palette.darkHex : palette.hex }}
                  className={`w-7 h-7 rounded-full border-2 transition-all shrink-0 ${
                    isSelected
                      ? 'border-purple-600 scale-110 shadow-md ring-2 ring-purple-400/50'
                      : 'border-slate-300 dark:border-slate-700 hover:scale-105'
                  }`}
                  title={palette.name}
                />
              );
            })}
          </div>

          <button
            onClick={() => {
              handleSaveInternal();
              onClose();
            }}
            className="px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
