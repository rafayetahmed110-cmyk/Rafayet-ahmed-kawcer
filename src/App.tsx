import React, { useState, useEffect, useMemo } from 'react';
import { Note, Category, CategoryType, SortBy, ThemeMode, ViewMode } from './types/note';
import {
  getSavedNotes,
  saveNotes,
  getSavedCategories,
  saveCategories,
  getSavedSettings,
  saveSettings,
  INITIAL_NOTES,
} from './utils/storage';

import { SplashScreen } from './components/SplashScreen';
import { AndroidFrameWrapper } from './components/AndroidFrameWrapper';
import { Header } from './components/Header';
import { SearchBarWidget } from './components/SearchBarWidget';
import { FilterBar } from './components/FilterBar';
import { NoteCard } from './components/NoteCard';
import { NoteEditorModal } from './components/NoteEditorModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { SettingsModal } from './components/SettingsModal';
import { FlutterExporterModal } from './components/FlutterExporterModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';

import { Plus, Pin } from 'lucide-react';

export default function App() {
  // Persistence States
  const [notes, setNotes] = useState<Note[]>(getSavedNotes);
  const [categories, setCategories] = useState<Category[]>(getSavedCategories);
  const [settings, setSettings] = useState(getSavedSettings);

  // UI Flow States
  const [showSplash, setShowSplash] = useState<boolean>(!settings.hasSeenSplash);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [pinnedOnly, setPinnedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>(settings.defaultViewMode || 'grid');

  // Modal Open States
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExporterOpen, setIsExporterOpen] = useState<boolean>(false);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);

  // Dark Mode Detection
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const isDarkMode = useMemo(() => {
    if (settings.themeMode === 'dark') return true;
    if (settings.themeMode === 'light') return false;
    return systemPrefersDark;
  }, [settings.themeMode, systemPrefersDark]);

  // Sync dark class on root document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save changes to localStorage
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Splash Screen Completion
  const handleSplashFinish = () => {
    setShowSplash(false);
    setSettings((prev) => ({ ...prev, hasSeenSplash: true }));
  };

  // Note CRUD Handlers
  const handleSaveNote = (savedNote: Note) => {
    setNotes((prevNotes) => {
      const exists = prevNotes.some((n) => n.id === savedNote.id);
      if (exists) {
        return prevNotes.map((n) => (n.id === savedNote.id ? savedNote : n));
      }
      return [savedNote, ...prevNotes];
    });
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
  };

  const handleDeleteNoteConfirm = () => {
    if (!deletingNote) return;
    setNotes((prev) => prev.filter((n) => n.id !== deletingNote.id));
    setDeletingNote(null);
  };

  // Categories Handlers
  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Reset / Clear Data
  const handleResetSampleData = () => {
    if (confirm('Reset notes to initial sample data?')) {
      setNotes(INITIAL_NOTES);
      setIsSettingsOpen(false);
    }
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to delete ALL notes?')) {
      setNotes([]);
      setIsSettingsOpen(false);
    }
  };

  // Filtering & Sorting Math
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesSearch =
          !searchQuery.trim() ||
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          !selectedCategory ||
          note.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesFavorites = !favoritesOnly || note.isFavorite;
        const matchesPinned = !pinnedOnly || note.isPinned;

        return matchesSearch && matchesCategory && matchesFavorites && matchesPinned;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return b.createdAt - a.createdAt;
          case 'oldest':
            return a.createdAt - b.createdAt;
          case 'a-z':
            return a.title.localeCompare(b.title);
          case 'lastEdited':
            return b.updatedAt - a.updatedAt;
          default:
            return 0;
        }
      });
  }, [notes, searchQuery, selectedCategory, favoritesOnly, pinnedOnly, sortBy]);

  // Separate Pinned and Others
  const pinnedNotes = useMemo(() => filteredNotes.filter((n) => n.isPinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter((n) => !n.isPinned), [filteredNotes]);

  return (
    <>
      {/* Animated Splash Screen */}
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <AndroidFrameWrapper isDarkMode={isDarkMode}>
          <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden relative font-sans">
            {/* Top Bar Header */}
            <Header
              viewMode={viewMode}
              onToggleViewMode={() =>
                setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'))
              }
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenExporter={() => setIsExporterOpen(true)}
              onOpenNewNote={() => {
                setEditingNote(null);
                setIsEditorOpen(true);
              }}
              noteCount={notes.length}
            />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 pb-24 no-scrollbar">
              {/* Search Bar */}
              <SearchBarWidget value={searchQuery} onChange={setSearchQuery} />

              {/* Filter Pills & Sort Bar */}
              <FilterBar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                favoritesOnly={favoritesOnly}
                onToggleFavorites={() => setFavoritesOnly((prev) => !prev)}
                pinnedOnly={pinnedOnly}
                onTogglePinned={() => setPinnedOnly((prev) => !prev)}
                sortBy={sortBy}
                onSelectSortBy={setSortBy}
                onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
              />

              {/* Notes Grid / List or Empty State */}
              {filteredNotes.length === 0 ? (
                <EmptyState
                  hasFilterOrSearch={
                    Boolean(searchQuery) ||
                    Boolean(selectedCategory) ||
                    favoritesOnly ||
                    pinnedOnly
                  }
                  onClearFilters={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setFavoritesOnly(false);
                    setPinnedOnly(false);
                  }}
                  onCreateNewNote={() => {
                    setEditingNote(null);
                    setIsEditorOpen(true);
                  }}
                />
              ) : (
                <div className="space-y-4">
                  {/* Pinned Notes Section */}
                  {pinnedNotes.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase px-1 pt-1">
                        <Pin className="w-3.5 h-3.5" />
                        <span>Pinned Notes ({pinnedNotes.length})</span>
                      </div>

                      <div
                        className={
                          viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
                            : 'space-y-2.5'
                        }
                      >
                        {pinnedNotes.map((note) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            categories={categories}
                            isDarkMode={isDarkMode}
                            viewMode={viewMode}
                            onEdit={(n) => {
                              setEditingNote(n);
                              setIsEditorOpen(true);
                            }}
                            onTogglePin={handleTogglePin}
                            onToggleFavorite={handleToggleFavorite}
                            onDeleteRequest={(n, e) => {
                              e.stopPropagation();
                              setDeletingNote(n);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other / All Notes Section */}
                  {otherNotes.length > 0 && (
                    <div className="space-y-2">
                      {pinnedNotes.length > 0 && (
                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase px-1 pt-2">
                          Others ({otherNotes.length})
                        </div>
                      )}

                      <div
                        className={
                          viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
                            : 'space-y-2.5'
                        }
                      >
                        {otherNotes.map((note) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            categories={categories}
                            isDarkMode={isDarkMode}
                            viewMode={viewMode}
                            onEdit={(n) => {
                              setEditingNote(n);
                              setIsEditorOpen(true);
                            }}
                            onTogglePin={handleTogglePin}
                            onToggleFavorite={handleToggleFavorite}
                            onDeleteRequest={(n, e) => {
                              e.stopPropagation();
                              setDeletingNote(n);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Android Material 3 Floating Action Button (FAB) */}
            <div className="absolute bottom-5 right-5 z-20">
              <button
                onClick={() => {
                  setEditingNote(null);
                  setIsEditorOpen(true);
                }}
                className="w-14 h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-xl shadow-purple-600/30 transition-all active:scale-95"
                title="Create Note"
              >
                <Plus className="w-7 h-7" />
              </button>
            </div>
          </div>
        </AndroidFrameWrapper>
      )}

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <NoteEditorModal
          note={editingNote}
          categories={categories}
          isDarkMode={isDarkMode}
          onSave={handleSaveNote}
          onDelete={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {/* Category Manager Modal */}
      {isCategoryManagerOpen && (
        <CategoryManagerModal
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onClose={() => setIsCategoryManagerOpen(false)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          themeMode={settings.themeMode}
          onSetThemeMode={(mode: ThemeMode) =>
            setSettings((prev) => ({ ...prev, themeMode: mode }))
          }
          defaultViewMode={viewMode}
          onSetDefaultViewMode={(mode: ViewMode) => {
            setViewMode(mode);
            setSettings((prev) => ({ ...prev, defaultViewMode: mode }));
          }}
          noteCount={notes.length}
          onResetSampleData={handleResetSampleData}
          onClearAllData={handleClearAllData}
          onReplaySplash={() => {
            setIsSettingsOpen(false);
            setShowSplash(true);
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Flutter Code Inspector & ZIP Exporter Modal */}
      {isExporterOpen && (
        <FlutterExporterModal onClose={() => setIsExporterOpen(false)} />
      )}

      {/* Delete Confirmation Modal */}
      {deletingNote && (
        <DeleteConfirmModal
          noteTitle={deletingNote.title}
          onConfirm={handleDeleteNoteConfirm}
          onCancel={() => setDeletingNote(null)}
        />
      )}
    </>
  );
}
