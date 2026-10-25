class EdgeQualityCheck {
  final bool isUsable;
  final String instructionEn;
  final String instructionHi;
  final String audioEn;
  final String audioHi;

  EdgeQualityCheck({
    required this.isUsable,
    required this.instructionEn,
    required this.instructionHi,
    required this.audioEn,
    required this.audioHi,
  });

  static EdgeQualityCheck evaluateImage({
    required double blurVariance,
    required double luminance,
    required bool hardwareMatched,
  }) {
    if (!hardwareMatched) {
      return EdgeQualityCheck(
        isUsable: false,
        instructionEn: 'Specialized optical attachment required. Standard camera is incompatible.',
        instructionHi: 'विशेष लेंस की आवश्यकता है। साधारण कैमरा उपयुक्त नहीं है।',
        audioEn: 'Compatible optical attachment required.',
        audioHi: 'विशेष लेंस लगाना आवश्यक है।',
      );
    }

    if (blurVariance < 110.0) {
      return EdgeQualityCheck(
        isUsable: false,
        instructionEn: 'Image is blurry. Please hold the phone steady and retake.',
        instructionHi: 'फ़ोटो धुंधली है। कृपया हाथ स्थिर रखकर दोबारा फ़ोटो लें।',
        audioEn: 'Hold the phone steady.',
        audioHi: 'फ़ोन को स्थिर पकड़ें।',
      );
    }

    if (luminance < 45.0) {
      return EdgeQualityCheck(
        isUsable: false,
        instructionEn: 'Lighting is too dark. Move near a window or natural daylight.',
        instructionHi: 'रोशनी बहुत कम है। कृपया खिड़की या बाहर प्राकृतिक रोशनी में आएं।',
        audioEn: 'Move to better light.',
        audioHi: 'बेहतर रोशनी में आएं।',
      );
    }

    if (luminance > 220.0) {
      return EdgeQualityCheck(
        isUsable: false,
        instructionEn: 'Severe flash glare detected. Please turn off flash.',
        instructionHi: 'बहुत तेज़ चमक है। फ़्लैश बंद करें।',
        audioEn: 'Avoid flash glare.',
        audioHi: 'सीधी चमक से बचें।',
      );
    }

    return EdgeQualityCheck(
      isUsable: true,
      instructionEn: 'Image quality is sharp and properly illuminated.',
      instructionHi: 'फ़ोटो स्पष्ट है और जाँच के लिए उपयुक्त है।',
      audioEn: 'Image captured properly.',
      audioHi: 'फ़ोटो सही ली गई है।',
    );
  }
}
