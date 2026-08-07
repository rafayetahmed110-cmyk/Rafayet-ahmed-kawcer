import React from 'react';
import { Note, Category } from '../types/note';
import { Pin, Star, Trash2 } from 'lucide-react';
import { NOTE_COLOR_PALETTE } from '../utils/storage';

interface NoteCardProps {
  note: Note;
  categories: Category[];
  isDarkMode: boolean;
  viewMode: 'grid' | 'list';
  onEdit: (note: Note) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDeleteRequest: (note: Note, e: React.MouseEvent) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  categories,
  isDarkMode,
  viewMode,
  onEdit,
  onTogglePin,
  onToggleFavorite,
  onDeleteRequest,
}) => {
  // Find category color
  const matchedCategory = categories.find(
    (c) => c.name.toLowerCase() === note.category.toLowerCase()
  );
  const categoryColor = matchedCategory?.color || '#a855f7';

  // Find note background color preset or custom hex
  const matchedPalette = NOTE_COLOR_PALETTE.find((p) => p.hex === note.color);
  const cardBg = isDarkMode
    ? matchedPalette?.darkHex || '#1e293b'
    : note.color || '#ffffff';

  // Format relative time
  const formatTime = (timeMs: number) => {
    const diffMin = Math.floor((Date.now() - timeMs) / (1000 * 60));
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(timeMs).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={() => onEdit(note)}
      style={{ backgroundColor: cardBg }}
      className={`group relative rounded-3xl p-4 cursor-pointer transition-all duration-200 border border-slate-200/60 dark:border-slate-800/80 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] select-none flex flex-col justify-between ${
        viewMode === 'list' ? 'w-full' : 'w-full'
      }`}
    >
      {/* Top Bar: Pin, Category Tag, Favorite Star */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Category Chip */}
          <span
            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white shadow-xs tracking-wider"
            style={{ backgroundColor: categoryColor }}
          >
            {note.category}
          </span>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {/* Pin Toggle */}
            <button
              onClick={(e) => onTogglePin(note.id, e)}
              className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                note.isPinned ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'
              }`}
              title={note.isPinned ? 'Unpin note' : 'Pin note'}
            >
              <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
            </button>

            {/* Favorite Toggle */}
            <button
              onClick={(e) => onToggleFavorite(note.id, e)}
              className={`p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                note.isFavorite ? 'text-amber-500' : 'text-slate-400'
              }`}
              title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Delete button */}
            <button
              onClick={(e) => onDeleteRequest(note, e)}
              className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Note Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug mb-1">
          {note.title || 'Untitled Note'}
        </h3>

        {/* Note Description Snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4 font-normal leading-relaxed whitespace-pre-line mb-3">
          {note.description || 'No additional text'}
        </p>
      </div>

      {/* Footer: Date & Character Count */}
      <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
        <span>{formatTime(note.updatedAt)}</span>
        <span>{note.description.length} chars</span>
      </div>
    </div>
  );
};
