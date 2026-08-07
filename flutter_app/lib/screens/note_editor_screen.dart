import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../models/note.dart';
import '../providers/note_provider.dart';
import '../core/constants/app_colors.dart';

class NoteEditorScreen extends ConsumerStatefulWidget {
  final String? noteId;

  const NoteEditorScreen({super.key, this.noteId});

  @override
  ConsumerState<NoteEditorScreen> createState() => _NoteEditorScreenState();
}

class _NoteEditorScreenState extends ConsumerState<NoteEditorScreen> {
  late TextEditingController _titleController;
  late TextEditingController _descController;
  int _colorHex = 0xFFFFFFFF;
  String _category = 'Personal';
  bool _isPinned = false;
  bool _isFavorite = false;
  late DateTime _createdAt;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController();
    _descController = TextEditingController();
    _createdAt = DateTime.now();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (widget.noteId != null) {
        final state = ref.read(noteNotifierProvider);
        final existing = state.allNotes.firstWhere(
          (n) => n.id == widget.noteId,
          orElse: () => Note(
            id: widget.noteId!,
            title: '',
            description: '',
            category: 'Personal',
            colorHex: 0xFFFFFFFF,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
          ),
        );
        _titleController.text = existing.title;
        _descController.text = existing.description;
        setState(() {
          _colorHex = existing.colorHex;
          _category = existing.category;
          _isPinned = existing.isPinned;
          _isFavorite = existing.isFavorite;
          _createdAt = existing.createdAt;
        });
      }
    });

    _titleController.addListener(_autoSave);
    _descController.addListener(_autoSave);
  }

  void _autoSave() {
    if (_titleController.text.trim().isEmpty &&
        _descController.text.trim().isEmpty) {
      return;
    }
    setState(() => _isSaving = true);
    final now = DateTime.now();
    final note = Note(
      id: widget.noteId ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: _titleController.text.trim(),
      description: _descController.text.trim(),
      category: _category,
      colorHex: _colorHex,
      isPinned: _isPinned,
      isFavorite: _isFavorite,
      createdAt: _createdAt,
      updatedAt: now,
    );

    if (widget.noteId == null) {
      ref.read(noteNotifierProvider.notifier).addNote(note);
    } else {
      ref.read(noteNotifierProvider.notifier).updateNote(note);
    }

    Future.delayed(const Duration(milliseconds: 400), () {
      if (mounted) setState(() => _isSaving = false);
    });
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final colorPalette = isDark ? AppColors.noteColorsDark : AppColors.noteColorsLight;

    final charCount = _descController.text.length;
    final wordCount = _descController.text.trim().isEmpty
        ? 0
        : _descController.text.trim().split(RegExp(r'\s+')).length;

    return Scaffold(
      backgroundColor: Color(_colorHex == 0xFFFFFFFF && isDark ? 0xFF1D1B20 : _colorHex),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(_isPinned ? Icons.push_pin_rounded : Icons.push_pin_outlined),
            color: _isPinned ? theme.colorScheme.primary : null,
            onPressed: () {
              setState(() => _isPinned = !_isPinned);
              _autoSave();
            },
          ),
          IconButton(
            icon: Icon(_isFavorite ? Icons.star_rounded : Icons.star_outline_rounded),
            color: _isFavorite ? Colors.amber : null,
            onPressed: () {
              setState(() => _isFavorite = !_isFavorite);
              _autoSave();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextField(
                    controller: _titleController,
                    style: theme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    decoration: const InputDecoration(
                      hintText: 'Title',
                      border: InputBorder.none,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${DateFormat('MMM dd, yyyy • hh:mm a').format(_createdAt)} | $charCount chars • $wordCount words',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant.withOpacity(0.7),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _descController,
                    maxLines: null,
                    style: theme.textTheme.bodyLarge?.copyWith(height: 1.5),
                    decoration: const InputDecoration(
                      hintText: 'Start writing note...',
                      border: InputBorder.none,
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Bottom toolbar for categories & colors
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: theme.colorScheme.surface.withOpacity(0.9),
              border: Border(top: BorderSide(color: theme.dividerColor.withOpacity(0.2))),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  height: 36,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: colorPalette.map((col) {
                      final isSel = _colorHex == col.value;
                      return GestureDetector(
                        onTap: () {
                          setState(() => _colorHex = col.value);
                          _autoSave();
                        },
                        child: Container(
                          width: 32,
                          height: 32,
                          margin: const EdgeInsets.only(right: 8),
                          decoration: BoxDecoration(
                            color: col,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isSel ? theme.colorScheme.primary : Colors.grey.shade300,
                              width: isSel ? 3 : 1,
                            ),
                          ),
                          child: isSel
                              ? Icon(Icons.check, size: 16, color: theme.colorScheme.primary)
                              : null,
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
