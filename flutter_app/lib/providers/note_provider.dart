import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/note.dart';
import '../services/hive_service.dart';

enum SortOption { newest, oldest, aToZ, lastEdited }

class NoteState {
  final List<Note> allNotes;
  final String searchQuery;
  final String? selectedCategory;
  final bool favoritesOnly;
  final bool pinnedOnly;
  final SortOption sortBy;
  final bool isGridView;

  NoteState({
    required this.allNotes,
    this.searchQuery = '',
    this.selectedCategory,
    this.favoritesOnly = false,
    this.pinnedOnly = false,
    this.sortBy = SortOption.newest,
    this.isGridView = true,
  });

  NoteState copyWith({
    List<Note>? allNotes,
    String? searchQuery,
    String? selectedCategory,
    bool? favoritesOnly,
    bool? pinnedOnly,
    SortOption? sortBy,
    bool? isGridView,
  }) {
    return NoteState(
      allNotes: allNotes ?? this.allNotes,
      searchQuery: searchQuery ?? this.searchQuery,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      favoritesOnly: favoritesOnly ?? this.favoritesOnly,
      pinnedOnly: pinnedOnly ?? this.pinnedOnly,
      sortBy: sortBy ?? this.sortBy,
      isGridView: isGridView ?? this.isGridView,
    );
  }

  List<Note> get filteredNotes {
    return allNotes.where((note) {
      final matchesSearch = searchQuery.isEmpty ||
          note.title.toLowerCase().contains(searchQuery.toLowerCase()) ||
          note.description.toLowerCase().contains(searchQuery.toLowerCase());

      final matchesCategory = selectedCategory == null ||
          selectedCategory == 'All' ||
          note.category == selectedCategory;

      final matchesFav = !favoritesOnly || note.isFavorite;
      final matchesPinned = !pinnedOnly || note.isPinned;

      return matchesSearch && matchesCategory && matchesFav && matchesPinned;
    }).toList()
      ..sort((a, b) {
        switch (sortBy) {
          case SortOption.newest:
            return b.createdAt.compareTo(a.createdAt);
          case SortOption.oldest:
            return a.createdAt.compareTo(b.createdAt);
          case SortOption.aToZ:
            return a.title.toLowerCase().compareTo(b.title.toLowerCase());
          case SortOption.lastEdited:
            return b.updatedAt.compareTo(a.updatedAt);
        }
      });
  }
}

class NoteNotifier extends StateNotifier<NoteState> {
  final HiveService _hiveService;

  NoteNotifier(this._hiveService)
      : super(NoteState(allNotes: _hiveService.getAllNotes()));

  void refresh() {
    state = state.copyWith(allNotes: _hiveService.getAllNotes());
  }

  void setSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
  }

  void setCategory(String? category) {
    state = state.copyWith(selectedCategory: category);
  }

  void toggleFavoritesOnly() {
    state = state.copyWith(favoritesOnly: !state.favoritesOnly);
  }

  void togglePinnedOnly() {
    state = state.copyWith(pinnedOnly: !state.pinnedOnly);
  }

  void setSortOption(SortOption sort) {
    state = state.copyWith(sortBy: sort);
  }

  void toggleViewMode() {
    state = state.copyWith(isGridView: !state.isGridView);
  }

  Future<void> addNote(Note note) async {
    await _hiveService.addNote(note);
    refresh();
  }

  Future<void> updateNote(Note note) async {
    await _hiveService.updateNote(note);
    refresh();
  }

  Future<void> deleteNote(String id) async {
    await _hiveService.deleteNote(id);
    refresh();
  }

  Future<void> togglePin(String id) async {
    final note = state.allNotes.firstWhere((n) => n.id == id);
    final updated = note.copyWith(isPinned: !note.isPinned);
    await _hiveService.updateNote(updated);
    refresh();
  }

  Future<void> toggleFavorite(String id) async {
    final note = state.allNotes.firstWhere((n) => n.id == id);
    final updated = note.copyWith(isFavorite: !note.isFavorite);
    await _hiveService.updateNote(updated);
    refresh();
  }
}

final noteNotifierProvider =
    StateNotifierProvider<NoteNotifier, NoteState>((ref) {
  final hiveService = ref.watch(hiveServiceProvider);
  return NoteNotifier(hiveService);
});
