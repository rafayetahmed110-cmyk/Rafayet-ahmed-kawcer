export interface FlutterFile {
  path: string;
  content: string;
  description: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    description: 'Flutter dependencies & configuration',
    content: `name: noteflow
description: "NoteFlow - A modern Material 3 Android Notes Application built with Flutter and Hive offline database."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.5.1
  go_router: ^14.2.0
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  shared_preferences: ^2.2.3
  intl: ^0.19.0
  flutter_staggered_grid_view: ^0.7.0
  animations: ^2.0.11
  google_fonts: ^6.2.1
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  hive_generator: ^2.0.1
  build_runner: ^2.4.9

flutter:
  uses-material-design: true
  assets:
    - assets/icons/
`
  },
  {
    path: '.github/workflows/build.yml',
    description: 'GitHub Actions workflow to build release APK',
    content: `name: NoteFlow Android Release Build

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-apk:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Java Development Kit (JDK 17)
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Set up Flutter SDK
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.22.x'
          channel: 'stable'
          cache: true

      - name: Install Dependencies
        run: flutter pub get

      - name: Run Build Runner for Hive
        run: flutter pub run build_runner build --delete-conflicting-outputs

      - name: Analyze Project Source
        run: flutter analyze --no-fatal-infos

      - name: Build Android APK Release
        run: flutter build apk --release

      - name: Upload APK Release Artifact
        uses: actions/upload-artifact@v4
        with:
          name: NoteFlow-release-apk
          path: build/app/outputs/flutter-apk/app-release.apk
`
  },
  {
    path: 'android/app/build.gradle',
    description: 'Android Gradle configuration target SDK 35',
    content: `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
if (flutterVersionCode == null) {
    flutterVersionCode = '1'
}

def flutterVersionName = localProperties.getProperty('flutter.versionName')
if (flutterVersionName == null) {
    flutterVersionName = '1.0'
}

android {
    namespace "com.noteflow.app"
    compileSdk 35
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = '17'
    }

    defaultConfig {
        applicationId "com.noteflow.app"
        minSdk 24
        targetSdk 35
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

flutter {
    source '../..'
}

dependencies {}
`
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    description: 'Android manifest configuration',
    content: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.noteflow.app">
    <application
        android:label="NoteFlow"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:enableOnBackInvokedCallback="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`
  },
  {
    path: 'lib/main.dart',
    description: 'Flutter Application Entry Point with Hive & Riverpod',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'core/router/app_router.dart';
import 'models/note.dart';
import 'models/category.dart';
import 'providers/theme_provider.dart';
import 'services/hive_service.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Transparent Android status bar & navigation bar
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  // Initialize Hive
  await Hive.initFlutter();
  
  // Register Adapters
  Hive.registerAdapter(NoteAdapter());
  Hive.registerAdapter(CategoryModelAdapter());

  // Initialize Hive Service boxes
  final hiveService = HiveService();
  await hiveService.init();

  runApp(
    ProviderScope(
      overrides: [
        hiveServiceProvider.overrideWithValue(hiveService),
      ],
      child: const NoteFlowApp(),
    ),
  );
}

class NoteFlowApp extends ConsumerWidget {
  const NoteFlowApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'NoteFlow',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      routerConfig: router,
    );
  }
}
`
  },
  {
    path: 'lib/core/constants/app_colors.dart',
    description: 'Material Design 3 Color Palette Definitions',
    content: `import 'package:flutter/material.dart';

class AppColors {
  // Primary M3 Color Palette
  static const Color primaryLight = Color(0xFF6750A4);
  static const Color onPrimaryLight = Color(0xFFFFFFFF);
  static const Color primaryContainerLight = Color(0xFFEADDFF);
  static const Color onPrimaryContainerLight = Color(0xFF21005D);

  static const Color primaryDark = Color(0xFFD0BCFF);
  static const Color onPrimaryDark = Color(0xFF381E72);
  static const Color primaryContainerDark = Color(0xFF4F378B);
  static const Color onPrimaryContainerDark = Color(0xFFEADDFF);

  // Background Neutrals
  static const Color bgLight = Color(0xFFF8F9FE);
  static const Color surfaceLight = Color(0xFFFFFFFF);
  static const Color bgDark = Color(0xFF141218);
  static const Color surfaceDark = Color(0xFF1D1B20);

  // Note Card Preset Colors (Light Mode)
  static const List<Color> noteColorsLight = [
    Color(0xFFFFFFFF), // Default white
    Color(0xFFFFE8E0), // Peach
    Color(0xFFE0F2F1), // Mint
    Color(0xFFF3E5F5), // Lavender
    Color(0xFFFFFDE7), // Lemon
    Color(0xFFE1F5FE), // Sky Blue
    Color(0xFFFCE4EC), // Rose
    Color(0xFFE8F5E9), // Sage
  ];

  // Note Card Preset Colors (Dark Mode)
  static const List<Color> noteColorsDark = [
    Color(0xFF25232A), // Default dark
    Color(0xFF3B2520), // Peach dark
    Color(0xFF193330), // Mint dark
    Color(0xFF2C1E33), // Lavender dark
    Color(0xFF383313), // Lemon dark
    Color(0xFF172F3D), // Sky dark
    Color(0xFF3A1B26), // Rose dark
    Color(0xFF1C3321), // Sage dark
  ];
}
`
  },
  {
    path: 'lib/core/constants/app_strings.dart',
    description: 'String Constants',
    content: `class AppStrings {
  static const String appName = 'NoteFlow';
  static const String appTagline = 'Your Modern Material Notes Engine';
  static const String searchHint = 'Search notes by title or content...';
  static const String noNotesFound = 'No notes found';
  static const String noNotesFoundSubtitle = 'Try adjusting your search or filter settings.';
  static const String createFirstNote = 'Create your first note by tapping the + button below!';
  static const String autoSaved = 'Auto saved';
  static const String saving = 'Saving...';
  static const String settings = 'Settings';
  static const String aboutNoteFlow = 'About NoteFlow';
}
`
  },
  {
    path: 'lib/core/router/app_router.dart',
    description: 'GoRouter navigation routing',
    content: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../screens/splash_screen.dart';
import '../../screens/home_screen.dart';
import '../../screens/note_editor_screen.dart';
import '../../screens/settings_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/editor',
        builder: (context, state) {
          final noteId = state.extra as String?;
          return NoteEditorScreen(noteId: noteId);
        },
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
    ],
  );
});
`
  },
  {
    path: 'lib/models/note.dart',
    description: 'Note Data Model with Hive annotations',
    content: `import 'package:hive/hive.dart';

part 'note.g.dart';

@HiveType(typeId: 0)
class Note extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  String title;

  @HiveField(2)
  String description;

  @HiveField(3)
  String category;

  @HiveField(4)
  int colorHex;

  @HiveField(5)
  bool isPinned;

  @HiveField(6)
  bool isFavorite;

  @HiveField(7)
  final DateTime createdAt;

  @HiveField(8)
  DateTime updatedAt;

  Note({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.colorHex,
    this.isPinned = false,
    this.isFavorite = false,
    required this.createdAt,
    required this.updatedAt,
  });

  Note copyWith({
    String? id,
    String? title,
    String? description,
    String? category,
    int? colorHex,
    bool? isPinned,
    bool? isFavorite,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Note(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      colorHex: colorHex ?? this.colorHex,
      isPinned: isPinned ?? this.isPinned,
      isFavorite: isFavorite ?? this.isFavorite,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
`
  },
  {
    path: 'lib/models/note.g.dart',
    description: 'Hive TypeAdapter generated for Note model',
    content: `part of 'note.dart';

class NoteAdapter extends TypeAdapter<Note> {
  @override
  final int typeId = 0;

  @override
  Note read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Note(
      id: fields[0] as String,
      title: fields[1] as String,
      description: fields[2] as String,
      category: fields[3] as String,
      colorHex: fields[4] as int,
      isPinned: fields[5] as bool,
      isFavorite: fields[6] as bool,
      createdAt: fields[7] as DateTime,
      updatedAt: fields[8] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, Note obj) {
    writer
      ..writeByte(9)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.title)
      ..writeByte(2)
      ..write(obj.description)
      ..writeByte(3)
      ..write(obj.category)
      ..writeByte(4)
      ..write(obj.colorHex)
      ..writeByte(5)
      ..write(obj.isPinned)
      ..writeByte(6)
      ..write(obj.isFavorite)
      ..writeByte(7)
      ..write(obj.createdAt)
      ..writeByte(8)
      ..write(obj.updatedAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is NoteAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
`
  },
  {
    path: 'lib/models/category.dart',
    description: 'Category Data Model with Hive annotations',
    content: `import 'package:hive/hive.dart';

part 'category.g.dart';

@HiveType(typeId: 1)
class CategoryModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final int colorHex;

  CategoryModel({
    required this.id,
    required this.name,
    required this.colorHex,
  });
}
`
  },
  {
    path: 'lib/models/category.g.dart',
    description: 'Hive TypeAdapter generated for CategoryModel',
    content: `part of 'category.dart';

class CategoryModelAdapter extends TypeAdapter<CategoryModel> {
  @override
  final int typeId = 1;

  @override
  CategoryModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return CategoryModel(
      id: fields[0] as String,
      name: fields[1] as String,
      colorHex: fields[2] as int,
    );
  }

  @override
  void write(BinaryWriter writer, CategoryModel obj) {
    writer
      ..writeByte(3)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.colorHex);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CategoryModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
`
  },
  {
    path: 'lib/services/hive_service.dart',
    description: 'Hive Database Local Storage Service',
    content: `import 'package:flutter_riverpod/flutter_riverpod.dart';
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
        description: 'NoteFlow is a modern, high-performance Android Notes app designed with Material 3 design principles.\\n\\nKey Highlights:\\n• Complete offline capability powered by Hive local DB\\n• Real-time auto save & character counter\\n• Category filtering & color coding\\n• Dark & Light mode dynamic theme',
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
        description: '- Organic Almond Milk (2x)\\n- Whole Grain Oats\\n- Fresh Avocados & Tomatoes\\n- Honey Crisp Apples',
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
        description: '1. Hive Local Storage integration\\n2. Riverpod StateNotifier for reactive UI state\\n3. Setup GitHub Actions build APK pipeline for API 35',
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
`
  },
  {
    path: 'lib/providers/note_provider.dart',
    description: 'Riverpod StateNotifier for reactive state management',
    content: `import 'package:flutter_riverpod/flutter_riverpod.dart';
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
`
  },
  {
    path: 'lib/providers/theme_provider.dart',
    description: 'Riverpod ThemeMode State Provider',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeModeNotifier extends StateNotifier<ThemeMode> {
  ThemeModeNotifier() : super(ThemeMode.system) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString('theme_mode');
    if (saved == 'light') state = ThemeMode.light;
    if (saved == 'dark') state = ThemeMode.dark;
    if (saved == 'system') state = ThemeMode.system;
  }

  Future<void> setTheme(ThemeMode mode) async {
    state = mode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('theme_mode', mode.name);
  }
}

final themeModeProvider =
    StateNotifierProvider<ThemeModeNotifier, ThemeMode>((ref) {
  return ThemeModeNotifier();
});
`
  },
  {
    path: 'lib/screens/splash_screen.dart',
    description: 'Animated Splash Screen',
    content: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    );

    _scaleAnimation = Tween<double>(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    _controller.forward();

    Future.delayed(const Duration(milliseconds: 2000), () {
      if (mounted) {
        context.go('/');
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primaryContainer,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: theme.colorScheme.primary.withOpacity(0.2),
                        blurRadius: 24,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.edit_note_rounded,
                    size: 52,
                    color: theme.colorScheme.onPrimaryContainer,
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'NoteFlow',
                  style: theme.textTheme.headlineLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.primary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Material 3 Android Notes',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/home_screen.dart',
    description: 'Main Notes Overview Screen with search, categories, grid/list',
    content: `import 'package:flutter/material.dart';
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
`
  },
  {
    path: 'lib/screens/note_editor_screen.dart',
    description: 'Create and Edit Note Screen with auto-save & character counter',
    content: `import 'package:flutter/material.dart';
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
        : _descController.text.trim().split(RegExp(r'\\s+')).length;

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
                    '\${DateFormat(\'MMM dd, yyyy • hh:mm a\').format(_createdAt)} | \$charCount chars • \$wordCount words',
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
`
  },
  {
    path: 'lib/screens/settings_screen.dart',
    description: 'Settings Screen with theme selection and database stats',
    content: `import 'package:flutter/material.dart';
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
            trailing: Chip(label: Text('\${noteState.allNotes.length} Notes')),
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
`
  },
  {
    path: 'lib/theme/app_theme.dart',
    description: 'Material Design 3 Theme Specs',
    content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants/app_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primaryLight,
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: AppColors.bgLight,
      textTheme: GoogleFonts.plusJakartaSansTextTheme(),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primaryDark,
        brightness: Brightness.dark,
      ),
      scaffoldBackgroundColor: AppColors.bgDark,
      textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }
}
`
  },
  {
    path: 'README.md',
    description: 'Documentation and build instructions',
    content: `# NoteFlow - Professional Android Notes App

NoteFlow is a production-ready Android Notes App built with **Flutter**, **Hive Local Database**, and **Material Design 3**.

## Features
- **Material Design 3 UI**: Dynamic color accents, rounded surface cards, smooth spring animations.
- **Offline First**: Powered by Hive 2.2.3. Zero internet or account required.
- **Auto Save & Real-time Stats**: Instant auto-save as user types + live word/character counters.
- **Categories & Color Badges**: Filter notes by Personal, Work, Study, Ideas, Shopping.
- **Sorting & Filtering**: Instant search by title/body, newest, oldest, A-Z, last edited.
- **Dark Mode & Light Mode**: Seamless dynamic theme switching.
- **GitHub Actions Compatible**: Ready to build release APK for API 35 (Android SDK 35).

## Build Commands
\`\`\`bash
# 1. Install dependencies
flutter pub get

# 2. Generate Hive TypeAdapters
flutter pub run build_runner build --delete-conflicting-outputs

# 3. Build Release APK
flutter build apk --release
\`\`\`
`
  }
];
