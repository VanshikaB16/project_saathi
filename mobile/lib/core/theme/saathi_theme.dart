import 'package:flutter/material.dart';

/// Project Saathi Brand & Design System
/// High-contrast healthcare palette optimized for bright rural sunlight.
class SaathiColors {
  static const Color primaryNavy = Color(0xFF16324F);
  static const Color deepNavy = Color(0xFF10263A);
  static const Color clinicalTeal = Color(0xFF168C8C);
  static const Color softMint = Color(0xFFBDE8D5);
  static const Color paleMintBg = Color(0xFFEAF6F1);
  static const Color warmOffWhite = Color(0xFFF7F8F4);
  static const Color whiteSurface = Color(0xFFFFFFFF);
  static const Color primaryText = Color(0xFF183044);
  static const Color secondaryText = Color(0xFF526779);
  static const Color mutedText = Color(0xFF6D7F8C);
  static const Color border = Color(0xFFD8E3E8);

  // Status & Urgency Indicators
  static const Color successGreen = Color(0xFF218653);
  static const Color amberWarning = Color(0xFFA96600);
  static const Color redAlert = Color(0xFFB42332);
}

class SaathiTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: const ColorScheme(
        brightness: Brightness.light,
        primary: SaathiColors.primaryNavy,
        onPrimary: SaathiColors.whiteSurface,
        secondary: SaathiColors.clinicalTeal,
        onSecondary: SaathiColors.whiteSurface,
        error: SaathiColors.redAlert,
        onError: SaathiColors.whiteSurface,
        surface: SaathiColors.whiteSurface,
        onSurface: SaathiColors.primaryText,
      ),
      scaffoldBackgroundColor: SaathiColors.warmOffWhite,
      cardTheme: CardTheme(
        color: SaathiColors.whiteSurface,
        elevation: 1,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: SaathiColors.border, width: 1.5),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: SaathiColors.clinicalTeal,
          foregroundColor: SaathiColors.whiteSurface,
          minimumSize: const Size.fromHeight(56),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: SaathiColors.primaryNavy,
        ),
        headlineMedium: TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: SaathiColors.primaryNavy,
        ),
        bodyLarge: TextStyle(
          fontSize: 18,
          color: SaathiColors.primaryText,
          height: 1.4,
        ),
        bodyMedium: TextStyle(
          fontSize: 16,
          color: SaathiColors.secondaryText,
          height: 1.4,
        ),
        labelLarge: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: SaathiColors.whiteSurface,
        ),
      ),
    );
  }
}
