import 'package:flutter_tts/flutter_tts.dart';

/// Project Saathi Voice-First Audio Service
/// Supports Hindi ('hi-IN') and English ('en-IN') spoken guidance.
/// Silent mode toggleable.
class TtsService {
  static final TtsService instance = TtsService._init();
  final FlutterTts _flutterTts = FlutterTts();
  bool _isMuted = false;
  String _currentLanguage = 'hi-IN';

  TtsService._init() {
    _initTts();
  }

  Future<void> _initTts() async {
    try {
      await _flutterTts.setLanguage(_currentLanguage);
      await _flutterTts.setSpeechRate(0.45); // Calm, deliberate pace for clarity
      await _flutterTts.setVolume(1.0);
      await _flutterTts.setPitch(1.0);
    } catch (e) {
      // Fallback gracefully on simulator / web
      print('[TtsService] Initialization notice: $e');
    }
  }

  void toggleMute() {
    _isMuted = !_isMuted;
    if (_isMuted) {
      stop();
    }
  }

  bool get isMuted => _isMuted;

  Future<void> setLanguage(String langCode) async {
    _currentLanguage = langCode == 'en' ? 'en-IN' : 'hi-IN';
    try {
      await _flutterTts.setLanguage(_currentLanguage);
    } catch (_) {}
  }

  Future<void> speak(String text) async {
    if (_isMuted || text.isEmpty) return;
    try {
      await _flutterTts.stop();
      await _flutterTts.speak(text);
    } catch (e) {
      print('[TtsService] Speak error: $e');
    }
  }

  Future<void> stop() async {
    try {
      await _flutterTts.stop();
    } catch (_) {}
  }
}
