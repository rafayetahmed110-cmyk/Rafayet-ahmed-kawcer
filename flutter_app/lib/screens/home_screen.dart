import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../providers/note_provider.dart';
import '../widgets/note_card.dart';
import '../widgets/search_bar_widget.dart';
import '../widgets/empty_state.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final noteState = ref.watch(noteNotifierProvider);
    final noteNotifier = ref.read(noteNotifierProvider.notifier);
    final theme = Theme.of(context);

    final filteredNotes = noteState.filteredNotes;
    final pinnedNotes = filteredNotes.where((n) => n.isPinned).toList();
    final otherNotes = filteredNotes.where((n) => !n.isPinned).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'NoteFlow',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: Icon(noteState.isGridView ? Icons.view_list_rounded : Icons.grid_view_rounded),
            tooltip: 'Toggle View',
            onPressed: () => noteNotifier.toggleViewMode(),
          ),
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            tooltip: 'Settings',
            onPressed: () => context.push('/settings'),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: SearchBarWidget(
              onChanged: (q) => noteNotifier.setSearchQuery(q),
            ),
          ),
          // Category filter pills
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
            child: Row(
              children: [
                _buildFilterChip('All', noteState.selectedCategory == null, () {
                  noteNotifier.setCategory(null);
                }, theme),
                const SizedBox(width: 8),
                _buildFilterChip('Favorites', noteState.favoritesOnly, () {
                  noteNotifier.toggleFavoritesOnly();
                }, theme, icon: Icons.star_rounded),
                const SizedBox(width: 8),
                _buildFilterChip('Pinned', noteState.pinnedOnly, () {
                  noteNotifier.togglePinnedOnly();
                }, theme, icon: Icons.push_pin_rounded),
                const SizedBox(width: 8),
                ...['Personal', 'Work', 'Study', 'Ideas', 'Shopping'].map((cat) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: _buildFilterChip(
                      cat,
                      noteState.selectedCategory == cat,
                      () => noteNotifier.setCategory(cat),
                      theme,
                    ),
                  );
                }),
              ],
            ),
          ),
          Expanded(
            child: filteredNotes.isEmpty
                ? const EmptyState()
                : CustomScrollView(
                    slivers: [
                      if (pinnedNotes.isNotEmpty) ...[
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                            child: Text(
                              'PINNED',
                              style: theme.textTheme.labelMedium?.copyWith(
                                color: theme.colorScheme.primary,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.2,
                              ),
                            ),
                          ),
                        ),
                        _buildNoteGrid(pinnedNotes, noteState.isGridView, context, ref),
                      ],
                      if (otherNotes.isNotEmpty) ...[
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                            child: Text(
                              pinnedNotes.isNotEmpty ? 'OTHERS' : 'ALL NOTES',
                              style: theme.textTheme.labelMedium?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.2,
                              ),
                            ),
                          ),
                        ),
                        _buildNoteGrid(otherNotes, noteState.isGridView, context, ref),
                      ],
                      const SliverPadding(padding: EdgeInsets.only(bottom: 88)),
                    ],
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/editor'),
        icon: const Icon(Icons.add_rounded),
        label: const Text('New Note'),
      ),
    );
  }

  Widget _buildFilterChip(
      String label, bool isSelected, VoidCallback onTap, ThemeData theme,
      {IconData? icon}) {
    return FilterChip(
      label: Text(label),
      avatar: icon != null ? Icon(icon, size: 16) : null,
      selected: isSelected,
      onSelected: (_) => onTap(),
      showCheckmark: false,
      selectedColor: theme.colorScheme.primaryContainer,
      labelStyle: TextStyle(
        color: isSelected
            ? theme.colorScheme.onPrimaryContainer
            : theme.colorScheme.onSurface,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
    );
  }

  Widget _buildNoteGrid(List notes, bool isGrid, BuildContext context, WidgetRef ref) {
    if (isGrid) {
      return SliverPadding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        sliver: SliverMasonryGrid.count(
          crossAxisCount: 2,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childCount: notes.length,
          itemBuilder: (context, index) {
            final note = notes[index];
            return NoteCard(note: note);
          },
        ),
      );
    } else {
      return SliverPadding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        sliver: SliverList(
          delegate: SliverChildBuilderDelegate(
            (context, index) {
              final note = notes[index];
              return Padding(
                padding: const EdgeInsets.only(bottom: 12.0),
                child: NoteCard(note: note),
              );
            },
            childCount: notes.length,
          ),
        ),
      );
    }
  }
}
