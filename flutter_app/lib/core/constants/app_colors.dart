import 'package:flutter/material.dart';

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
