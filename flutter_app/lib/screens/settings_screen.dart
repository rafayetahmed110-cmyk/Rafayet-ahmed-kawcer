import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/theme_provider.dart';
import '../providers/note_provider.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final themeNotifier = ref.read(themeModeProvider.notifier);
    final noteState = ref.watch(noteNotifierProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              'APPEARANCE',
              style: theme.textTheme.labelMedium?.copyWith(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          RadioListTile<ThemeMode>(
            title: const Text('System Default'),
            subtitle: const Text('Match dynamic system theme settings'),
            value: ThemeMode.system,
            groupValue: themeMode,
            onChanged: (mode) => themeNotifier.setTheme(mode!),
          ),
          RadioListTile<ThemeMode>(
            title: const Text('Light Theme'),
            subtitle: const Text('Material 3 light canvas'),
            value: ThemeMode.light,
            groupValue: themeMode,
            onChanged: (mode) => themeNotifier.setTheme(mode!),
          ),
          RadioListTile<ThemeMode>(
            title: const Text('Dark Theme'),
            subtitle: const Text('Eye-friendly dark surface'),
            value: ThemeMode.dark,
            groupValue: themeMode,
            onChanged: (mode) => themeNotifier.setTheme(mode!),
          ),
          const Divider(),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              'LOCAL STORAGE (HIVE)',
              style: theme.textTheme.labelMedium?.copyWith(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.storage_rounded),
            title: const Text('Database Engine'),
            subtitle: const Text('Hive 2.2.3 (No Internet Required)'),
            trailing: Chip(label: Text('${noteState.allNotes.length} Notes')),
          ),
          const Divider(),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Text(
              'ABOUT NOTEFLOW',
              style: theme.textTheme.labelMedium?.copyWith(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const ListTile(
            leading: Icon(Icons.info_outline_rounded),
            title: Text('Version'),
            subtitle: Text('1.0.0 (API 35 Target, Min SDK 24)'),
          ),
          const ListTile(
            leading: Icon(Icons.architecture_rounded),
            title: Text('Architecture'),
            subtitle: Text('Clean Architecture + Riverpod + GoRouter'),
          ),
        ],
      ),
    );
  }
}
