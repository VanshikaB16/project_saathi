import 'package:flutter_test/flutter_test.dart';
import 'package:project_saathi_mobile/core/localization/app_translations.dart';

void main() {
  group('Clinical Safety Wording Compliance Tests (Section 4 Overrides)', () {
    test('Prohibited diagnostic assertions must NOT exist anywhere in localized strings', () {
      final prohibitedPatterns = [
        'you have cancer',
        'you have leukemia',
        'you have tb',
        'you are healthy',
        'कैंसर है',
        'ल्यूकेमिया है',
        'टीबी है',
        'पूरी तरह स्वस्थ हैं'
      ];

      for (final lang in ['en', 'hi']) {
        final strings = AppTranslations.localizedValues[lang] ?? {};
        for (final entry in strings.entries) {
          final text = entry.value.toLowerCase();
          for (final pattern in prohibitedPatterns) {
            expect(
              text.contains(pattern),
              isFalse,
              reason: 'Found prohibited diagnosis phrase "$pattern" in key "${entry.key}" ($lang)',
            );
          }
        }
      }
    });

    test('Required non-diagnostic triage phrases must be present', () {
      final enStrings = AppTranslations.localizedValues['en']!;
      expect(
        enStrings['result_green_title'],
        'No concerning sign was detected by this screening.',
      );
      expect(
        enStrings['result_green_spoken'],
        'This check did not identify a concerning sign. Please continue routine care and follow any advice from your health worker.',
      );
      expect(
        enStrings['result_amber_title'],
        'Follow-up or repeat check recommended.',
      );
      expect(
        enStrings['result_red_title'],
        'Prompt medical assessment recommended.',
      );
    });
  });
}
