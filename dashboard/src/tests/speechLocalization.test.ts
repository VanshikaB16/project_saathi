import { describe, it, expect } from 'vitest';
import { speechTts } from '../services/speechTts';
import { CONSTITUTIONAL_LANGUAGES, getDynamicAudioGreeting, getTranslation } from '../services/localization';
import { getRoleLoginTexts, getDoctorMobileTexts, getTaskTexts } from '../services/uiLocalization';

describe('Multi-Lingual Speech Localization & TTS Engine', () => {
  it('covers all 23 constitutional languages + English in CONSTITUTIONAL_LANGUAGES', () => {
    expect(CONSTITUTIONAL_LANGUAGES.length).toBe(23);
  });

  it('provides role login texts and audio prompt phonetics across Indian languages', () => {
    for (const lang of CONSTITUTIONAL_LANGUAGES) {
      const login = getRoleLoginTexts(lang.code);
      expect(login.appTitle).toBeTruthy();
      expect(login.audioPrompt).toBeTruthy();
      if (!['hi', 'en', 'ta'].includes(lang.code)) {
        expect(login.audioPromptPhonetic).toBeDefined();
        expect(login.audioPromptPhonetic!.length).toBeGreaterThan(5);
      }
    }
  });

  it('generates dynamic audio greetings for all 23 languages without missing cases', () => {
    for (const lang of CONSTITUTIONAL_LANGUAGES) {
      const greeting0 = getDynamicAudioGreeting(lang.code, 0, 0);
      expect(greeting0.text).toBeTruthy();
      expect(greeting0.phonetic).toBeTruthy();

      const greetingMixed = getDynamicAudioGreeting(lang.code, 3, 2);
      expect(greetingMixed.text).toBeTruthy();
      expect(greetingMixed.phonetic).toBeTruthy();
    }
  });

  it('resolves phonetic Romanized text for regional scripts to prevent ElevenLabs choking', () => {
    // Punjabi
    const paLogin = getRoleLoginTexts('pa');
    const paPhonetic = speechTts.resolvePhoneticText(paLogin.audioPrompt, 'pa');
    expect(paPhonetic).toContain('Project Saathi');

    // Telugu
    const teLogin = getRoleLoginTexts('te');
    const tePhonetic = speechTts.resolvePhoneticText(teLogin.audioPrompt, 'te');
    expect(tePhonetic).toContain('Project Saathi');

    // Bengali
    const bnLogin = getRoleLoginTexts('bn');
    const bnPhonetic = speechTts.resolvePhoneticText(bnLogin.audioPrompt, 'bn');
    expect(bnPhonetic).toContain('Project Saathi');

    // Malayalam
    const mlLogin = getRoleLoginTexts('ml');
    const mlPhonetic = speechTts.resolvePhoneticText(mlLogin.audioPrompt, 'ml');
    expect(mlPhonetic).toContain('Project Saathi');

    // Odia
    const orLogin = getRoleLoginTexts('or');
    const orPhonetic = speechTts.resolvePhoneticText(orLogin.audioPrompt, 'or');
    expect(orPhonetic).toContain('Project Saathi');
  });

  it('verifies Doctor mobile view and task dictionaries exist for all languages', () => {
    for (const lang of CONSTITUTIONAL_LANGUAGES) {
      const doc = getDoctorMobileTexts(lang.code);
      expect(doc.medicalOfficerBadge).toBeTruthy();
      expect(doc.reviewBtn).toBeTruthy();

      const task = getTaskTexts(lang.code);
      expect(task.ashaRolePrefix).toBeTruthy();
      expect(task.clinicalWindow7Days).toBeTruthy();
    }
  });
});
