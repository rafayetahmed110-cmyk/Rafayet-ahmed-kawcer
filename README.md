# NoteFlow - Professional Android Notes App

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
```bash
# 1. Install dependencies
flutter pub get

# 2. Generate Hive TypeAdapters
flutter pub run build_runner build --delete-conflicting-outputs

# 3. Build Release APK
flutter build apk --release
```
