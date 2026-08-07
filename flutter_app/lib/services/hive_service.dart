import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';
import '../models/note.dart';
import '../models/category.dart';

final hiveServiceProvider = Provider<HiveService>((ref) {
  throw UnimplementedError('Initialize HiveService in main.dart');
});

class HiveService {
  static const String notesBoxName = 'noteflow_notes_box';
  static const String categoriesBoxName = 'noteflow_categories_box';

  late Box<Note> _notesBox;
  late Box<CategoryModel> _categoriesBox;

  Future<void> init() async {
    _notesBox = await Hive.openBox<Note>(notesBoxName);
    _categoriesBox = await Hive.openBox<CategoryModel>(categoriesBoxName);

    // Populate initial sample data if empty
    if (_notesBox.isEmpty) {
      await _seedInitialNotes();
    }
  }

  Box<Note> get notesBox => _notesBox;
  Box<CategoryModel> get categoriesBox => _categoriesBox;

  List<Note> getAllNotes() {
    return _notesBox.values.toList();
  }

  Future<void> addNote(Note note) async {
    await _notesBox.put(note.id, note);
  }

  Future<void> updateNote(Note note) async {
    await _notesBox.put(note.id, note);
  }

  Future<void> deleteNote(String id) async {
    await _notesBox.delete(id);
  }

  Future<void> clearAll() async {
    await _notesBox.clear();
  }

  Future<void> _seedInitialNotes() async {
    final now = DateTime.now();
    final samples = [
      Note(
        id: '1',
        title: '🚀 Welcome to NoteFlow',
        description: 'NoteFlow is a modern, high-performance Android Notes app designed with Material 3 design principles.\n\nKey Highlights:\n• Complete offline capability powered by Hive local DB\n• Real-time auto save & character counter\n• Category filtering & color coding\n• Dark & Light mode dynamic theme',
        category: 'Ideas',
        colorHex: 0xFFE1F5FE,
        isPinned: true,
        isFavorite: true,
        createdAt: now.subtract(const Duration(days: 2)),
        updatedAt: now.subtract(const Duration(days: 2)),
      ),
      Note(
        id: '2',
        title: '🛒 Weekly Grocery & Supplies',
        description: '- Organic Almond Milk (2x)\n- Whole Grain Oats\n- Fresh Avocados & Tomatoes\n- Honey Crisp Apples',
        category: 'Shopping',
        colorHex: 0xFFFFE8E0,
        isPinned: true,
        isFavorite: false,
        createdAt: now.subtract(const Duration(hours: 18)),
        updatedAt: now.subtract(const Duration(hours: 5)),
      ),
      Note(
        id: '3',
        title: '📊 Q3 Mobile App Roadmap',
        description: '1. Hive Local Storage integration\n2. Riverpod StateNotifier for reactive UI state\n3. Setup GitHub Actions build APK pipeline for API 35',
        category: 'Work',
        colorHex: 0xFFE0F2F1,
        isPinned: false,
        isFavorite: true,
        createdAt: now.subtract(const Duration(hours: 12)),
        updatedAt: now.subtract(const Duration(hours: 2)),
      ),
    ];

    for (final note in samples) {
      await _notesBox.put(note.id, note);
    }
  }
}
