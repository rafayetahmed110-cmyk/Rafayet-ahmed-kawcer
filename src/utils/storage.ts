import { Note, Category, AppSettings, CategoryType } from '../types/note';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_personal', name: 'Personal', color: '#6750A4', icon: 'User' },
  { id: 'cat_work', name: 'Work', color: '#1D6C8A', icon: 'Briefcase' },
  { id: 'cat_study', name: 'Study', color: '#386A20', icon: 'BookOpen' },
  { id: 'cat_ideas', name: 'Ideas', color: '#825500', icon: 'Lightbulb' },
  { id: 'cat_shopping', name: 'Shopping', color: '#904A42', icon: 'ShoppingCart' },
];

export const NOTE_COLOR_PALETTE = [
  { name: 'Default', hex: '#ffffff', darkHex: '#1f1f23', borderHex: '#e2e8f0' },
  { name: 'Peach', hex: '#ffe8e0', darkHex: '#3b2520', borderHex: '#ffccbc' },
  { name: 'Mint', hex: '#e0f2f1', darkHex: '#193330', borderHex: '#b2dfdb' },
  { name: 'Lavender', hex: '#f3e5f5', darkHex: '#2c1e33', borderHex: '#e1bee7' },
  { name: 'Lemon', hex: '#fffde7', darkHex: '#383313', borderHex: '#fff9c4' },
  { name: 'Sky Blue', hex: '#e1f5fe', darkHex: '#172f3d', borderHex: '#b3e5fc' },
  { name: 'Rose', hex: '#fce4ec', darkHex: '#3a1b26', borderHex: '#f8bbd0' },
  { name: 'Sage', hex: '#e8f5e9', darkHex: '#1c3321', borderHex: '#c8e6c9' },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_1',
    title: '🚀 Welcome to NoteFlow',
    description: 'NoteFlow is a modern, high-performance Android Notes app designed with Material 3 design principles.\n\nKey Highlights:\n• Complete offline capability powered by Hive local DB\n• Real-time auto save & character counter\n• Category filtering & color coding\n• Dark & Light mode dynamic theme\n• Staggered Grid & List layout options\n• Full Flutter + Clean Architecture project generator!',
    category: 'Ideas',
    color: '#e1f5fe',
    isPinned: true,
    isFavorite: true,
    createdAt: Date.now() - 3600000 * 24 * 2,
    updatedAt: Date.now() - 3600000 * 24 * 2,
  },
  {
    id: 'note_2',
    title: '🛒 Weekly Grocery & Supplies',
    description: '- Organic Almond Milk (2x)\n- Whole Grain Oats\n- Fresh Avocados & Tomatoes\n- Honey Crisp Apples\n- Greek Yogurt (Vanilla)\n- Dark Chocolate 85%',
    category: 'Shopping',
    color: '#ffe8e0',
    isPinned: true,
    isFavorite: false,
    createdAt: Date.now() - 3600000 * 18,
    updatedAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'note_3',
    title: '📊 Q3 Mobile App Roadmap',
    description: '1. Complete Hive Local Storage integration with Adapter registration\n2. Add Flutter Riverpod StateNotifier for reactive UI state\n3. Finalize GoRouter routing with splash and settings screens\n4. Setup GitHub Actions build APK pipeline for target SDK 35',
    category: 'Work',
    color: '#e0f2f1',
    isPinned: false,
    isFavorite: true,
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'note_4',
    title: '📚 Computer Science Study Checklist',
    description: '• System Design: Caching strategies & Indexing in DBs\n• Data Structures: B-Trees, Trie, Graphs & Dynamic Programming\n• Clean Architecture: Repository pattern & State Management\n• Flutter: Riverpod 2.x family providers and Hive box operations',
    category: 'Study',
    color: '#f3e5f5',
    isPinned: false,
    isFavorite: false,
    createdAt: Date.now() - 3600000 * 6,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'note_5',
    title: '💡 App Feature Ideas',
    description: '- Rich text formatting with Markdown support\n- Voice note recorder with waveform preview\n- Encrypted private notes box with biometric lock\n- Interactive canvas drawings & sketching',
    category: 'Ideas',
    color: '#fffde7',
    isPinned: false,
    isFavorite: false,
    createdAt: Date.now() - 3600000 * 3,
    updatedAt: Date.now() - 3600000 * 3,
  },
];

const NOTES_STORAGE_KEY = 'noteflow_notes_v1';
const CATEGORIES_STORAGE_KEY = 'noteflow_categories_v1';
const SETTINGS_STORAGE_KEY = 'noteflow_settings_v1';

export const getSavedNotes = (): Note[] => {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(INITIAL_NOTES));
      return INITIAL_NOTES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load notes from localStorage', e);
    return INITIAL_NOTES;
  }
};

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes to localStorage', e);
  }
};

export const getSavedCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load categories', e);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories', e);
  }
};

export const getSavedSettings = (): AppSettings => {
  const defaultSettings: AppSettings = {
    themeMode: 'system',
    defaultViewMode: 'grid',
    hasSeenSplash: false,
  };
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return defaultSettings;
    }
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (e) {
    return defaultSettings;
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};
