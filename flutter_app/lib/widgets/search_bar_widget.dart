import 'package:flutter/material.dart';

class SearchBarWidget extends StatelessWidget {
  final ValueChanged<String> onChanged;

  const SearchBarWidget({super.key, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SearchBar(
      hintText: 'Search notes...',
      leading: const Icon(Icons.search_rounded),
      elevation: const WidgetStatePropertyAll(0),
      backgroundColor:
          WidgetStatePropertyAll(theme.colorScheme.surfaceContainerHigh),
      onChanged: onChanged,
    );
  }
}
