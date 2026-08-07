export type CategoryType = 'Personal' | 'Work' | 'Study' | 'Ideas' | 'Shopping' | string;

export interface Category {
  id: string;
  name: string;
  color: string; // Hex color string
  icon?: string;
  isCustom?: boolean;
}

export type SortBy = 'newest' | 'oldest' | 'a-z' | 'lastEdited';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ViewMode = 'grid' | 'list';

export interface Note {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  color: string; // Background color for note card in hex
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: number; // Timestamp ms
  updatedAt: number; // Timestamp ms
}

export interface NoteFilter {
  searchQuery: string;
  category: string | null; // null means 'All'
  pinnedOnly: boolean;
  favoritesOnly: boolean;
  sortBy: SortBy;
}

export interface AppSettings {
  themeMode: ThemeMode;
  defaultViewMode: ViewMode;
  hasSeenSplash: boolean;
}
