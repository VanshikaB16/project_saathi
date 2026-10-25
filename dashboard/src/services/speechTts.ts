/**
 * Project Saathi Web Speech TTS Service
 * Multi-Lingual Speech Synthesis Engine for all 22 Constitutional Languages + English.
 * 
 * Provides Dual-Tier Speech Synthesis:
 * 1. Tier 1: ElevenLabs Realistic Voice Synthesis (Sarah)
 *    - For 'en', 'hi', and 'ta', sends native scripts directly.
 *    - For all other regional languages (Telugu, Bengali, Punjabi, Marathi, Gujarati,
 *      Kannada, Malayalam, Odia, Sindhi, Santali, etc.), converts text to natural
 *      phonetic Romanized representations so ElevenLabs pronounces every syllable
 *      with emotive human realism instead of choking on unsupported Unicode scripts.
 * 2. Tier 2: Seamless On-Device Web Speech API Fallback
 *    - Uses native OS voices if installed (e.g. 'pa-IN', 'te-IN', or 'hi-IN' for Devanagari).
 *    - If OS lacks a regional voice pack, vocalizes phonetic Romanized strings with
 *      an Indian-English voice ('en-IN'), ensuring 0 dropped words.
 */

import { getBcp47Tag, getTranslation } from './localization';
import { elevenLabsService } from './elevenLabsService';
import { getRoleLoginTexts } from './uiLocalization';

function olChikiToLatin(str: string): string {
  const map: Record<string, string> = {
    '᱐': '0', '᱑': '1', '᱒': '2', '᱓': '3', '᱔': '4', '᱕': '5', '᱖': '6', '᱗': '7', '᱘': '8', '᱙': '9',
    'ᱚ': 'o', 'ᱛ': 't', 'ᱜ': 'g', 'ᱝ': 'ng', 'ᱞ': 'l',
    'ᱟ': 'a', 'ᱠ': 'k', 'ᱡ': 'j', 'ᱢ': 'm', 'ᱣ': 'w',
    'ᱤ': 'i', 'ᱥ': 's', 'ᱦ': 'h', 'ᱧ': 'ny', 'ᱨ': 'r',
    'ᱩ': 'u', 'ᱪ': 'ch', 'ᱫ': 'd', 'ᱬ': 'n', 'ᱭ': 'y',
    'ᱮ': 'e', 'ᱯ': 'p', 'ᱰ': 'd', 'ᱱ': 'n', 'ᱲ': 'r',
    'ᱳ': 'o', 'ᱴ': 't', 'ᱵ': 'b', 'ᱶ': 'w', 'ᱷ': 'h',
    'ᱸ': 'n', 'ᱹ': '', 'ᱺ': '', 'ᱻ': '', 'ᱼ': '', 'ᱽ': 'h'
  };
  return str.replace(/[\u1C50-\u1C7F]/g, ch => map[ch] !== undefined ? map[ch] : ch);
}

const consonantOffsets: Record<number, string> = {
  0x15: 'k', 0x16: 'kh', 0x17: 'g', 0x18: 'gh', 0x19: 'ng',
  0x1A: 'ch', 0x1B: 'chh', 0x1C: 'j', 0x1D: 'jh', 0x1E: 'ny',
  0x1F: 't', 0x20: 'th', 0x21: 'd', 0x22: 'dh', 0x23: 'n',
  0x24: 't', 0x25: 'th', 0x26: 'd', 0x27: 'dh', 0x28: 'n', 0x29: 'nn',
  0x2A: 'p', 0x2B: 'ph', 0x2C: 'b', 0x2D: 'bh', 0x2E: 'm',
  0x2F: 'y', 0x30: 'r', 0x31: 'rr', 0x32: 'l', 0x33: 'l', 0x34: 'zh', 0x35: 'v',
  0x36: 'sh', 0x37: 'sh', 0x38: 's', 0x39: 'h',
  0x58: 'q', 0x59: 'kh', 0x5A: 'gh', 0x5B: 'z', 0x5C: 'r', 0x5D: 'rh', 0x5E: 'f', 0x5F: 'y'
};

const vowelOffsets: Record<number, string> = {
  0x05: 'a', 0x06: 'aa', 0x07: 'i', 0x08: 'ee', 0x09: 'u', 0x0A: 'oo', 0x0B: 'ri',
  0x0E: 'e', 0x0F: 'e', 0x10: 'ai', 0x12: 'o', 0x13: 'o', 0x14: 'au'
};

const matraOffsets: Record<number, string> = {
  0x3E: 'aa', 0x3F: 'i', 0x40: 'ee', 0x41: 'u', 0x42: 'oo', 0x43: 'ri',
  0x46: 'e', 0x47: 'e', 0x48: 'ai', 0x4A: 'o', 0x4B: 'o', 0x4C: 'au'
};

function transliterateBrahmic(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0x0900 && code <= 0x0D7F) {
      const block = Math.floor((code - 0x0900) / 0x80);
      const offset = (code - 0x0900) % 0x80;

      if (consonantOffsets[offset]) {
        const c = consonantOffsets[offset];
        const nextCode = i + 1 < text.length ? text.charCodeAt(i + 1) : 0;
        const nextBlock = Math.floor((nextCode - 0x0900) / 0x80);
        const nextOffset = (nextCode - 0x0900) % 0x80;

        if (nextBlock === block && nextOffset === 0x4D) {
          result += c;
          i++; // skip virama
        } else if (nextBlock === block && matraOffsets[nextOffset]) {
          result += c + matraOffsets[nextOffset];
          i++; // skip matra
        } else {
          result += c + 'a';
        }
      } else if (vowelOffsets[offset]) {
        result += vowelOffsets[offset];
      } else if (matraOffsets[offset]) {
        result += matraOffsets[offset];
      } else if (offset === 0x02 || offset === 0x01) {
        result += 'n';
      } else if (offset === 0x03) {
        result += 'h';
      }
    } else {
      result += text[i];
    }
  }
  return result.replace(/a([aeiou])/g, '$1').replace(/\s+/g, ' ').trim();
}

class WebSpeechTtsService {
  private isMuted: boolean = false;
  private currentLanguageCode: string = 'hi';
  private currentBcp47: string = 'hi-IN';
  private speechRate: number = 0.9;

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    elevenLabsService.stop();
    if (muted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setLanguage(langCode: string): void {
    this.currentLanguageCode = langCode;
    this.currentBcp47 = getBcp47Tag(langCode);
  }

  public getLanguage(): string {
    return this.currentLanguageCode;
  }

  public getBcp47(): string {
    return this.currentBcp47;
  }

  public setRate(rate: number): void {
    this.speechRate = rate;
  }

  public resolvePhoneticText(text: string, langCode: string, explicitPhonetic?: string): string {
    if (explicitPhonetic && explicitPhonetic.trim()) {
      return explicitPhonetic.trim();
    }

    // 1. Check curated localization.ts prompts
    try {
      const t = getTranslation(langCode);
      if (text === t.audioGreeting && t.audioGreetingPhonetic) return t.audioGreetingPhonetic;
      if (text === t.audioSelectPathway && t.audioSelectPathwayPhonetic) return t.audioSelectPathwayPhonetic;
      if (text === t.audioCameraGuide && t.audioCameraGuidePhonetic) return t.audioCameraGuidePhonetic;
      if (text === t.audioResultGreen && t.audioResultGreenPhonetic) return t.audioResultGreenPhonetic;
      if (text === t.audioResultAmber && t.audioResultAmberPhonetic) return t.audioResultAmberPhonetic;
      if (text === t.audioResultRed && t.audioResultRedPhonetic) return t.audioResultRedPhonetic;
    } catch {
      // ignore
    }

    // 2. Check role login prompts
    try {
      const loginTexts = getRoleLoginTexts(langCode);
      if (text === loginTexts.audioPrompt && loginTexts.audioPromptPhonetic) {
        return loginTexts.audioPromptPhonetic;
      }
    } catch {
      // ignore
    }

    // 3. Ol Chiki transliteration for Santali
    if (langCode === 'sat' || /[\u1C50-\u1C7F]/.test(text)) {
      return olChikiToLatin(text);
    }

    // 4. Brahmic transliteration for Indic scripts (Gurmukhi, Bengali, Telugu, Gujarati, Kannada, Malayalam, Odia)
    if (/[\u0900-\u0D7F]/.test(text)) {
      const transliterated = transliterateBrahmic(text);
      if (transliterated) {
        return transliterated;
      }
    }

    return text;
  }

  public async speak(text: string, langCode?: string, explicitPhonetic?: string): Promise<void> {
    if (this.isMuted || !text) return;

    const code = langCode || this.currentLanguageCode || 'hi';

    // Tier 1: Try ElevenLabs high-fidelity voice if online and configured
    if (elevenLabsService.hasApiKey()) {
      try {
        // ElevenLabs Multilingual V2 natively supports: 'en' (Latin), 'hi' (Devanagari), 'ta' (Tamil script).
        // Regional Indic scripts (Telugu, Bengali, Gurmukhi/Punjabi, Gujarati, Kannada, Malayalam, Odia, Ol Chiki)
        // are not in ElevenLabs' script vocabulary and result in garbled sounds if sent directly.
        // Sending their phonetic Romanized equivalent enables ElevenLabs to pronounce them with
        // natural, human-quality inflection!
        const elevenNativeScripts = ['en', 'hi', 'ta'];
        let elevenText = text;

        if (!elevenNativeScripts.includes(code) || explicitPhonetic) {
          elevenText = this.resolvePhoneticText(text, code, explicitPhonetic);
        }

        const played = await elevenLabsService.speak(elevenText);
        if (played) {
          return;
        }
      } catch (err) {
        console.warn('[TTS] ElevenLabs voice synthesis failed, falling back to Web Speech:', err);
      }
    }

    // Tier 2: Seamless fallback to on-device Web Speech API
    this.speakNativeBrowser(text, langCode, explicitPhonetic);
  }

  public speakNativeBrowser(text: string, langCode?: string, explicitPhonetic?: string): void {
    if (this.isMuted || !text) return;

    if (!('speechSynthesis' in window)) {
      console.warn('[TTS] Web Speech API is not supported in this browser environment.');
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending utterance

      const code = langCode || this.currentLanguageCode || 'hi';
      const bcpTag = getBcp47Tag(code);
      const voices = window.speechSynthesis.getVoices();

      // 1. Direct language match (e.g. 'ne-IN', 'ta-IN', 'pa-IN', 'te-IN')
      let nativeVoice = voices.find(v => 
        v.lang.toLowerCase() === bcpTag.toLowerCase() ||
        (code !== 'en' && v.lang.toLowerCase().startsWith(code.toLowerCase()))
      );

      // 2. For Devanagari languages (e.g. Nepali, Maithili, Sindhi, Dogri, Sanskrit, Konkani, Bodo), Hindi voice can read native Devanagari
      const isDevanagari = ['ne', 'mai', 'doi', 'brx', 'kok', 'sa', 'sd'].includes(code);
      if (!nativeVoice && isDevanagari) {
        nativeVoice = voices.find(v => v.lang.toLowerCase().startsWith('hi'));
      }

      let textToSpeak = text;
      let voiceToUse: SpeechSynthesisVoice | undefined = nativeVoice;
      let targetLang = nativeVoice ? nativeVoice.lang : bcpTag;

      if (!nativeVoice) {
        // Fallback: Host lacks a native voice for this Indic script.
        // Look up phonetic spoken text so words are not silently dropped.
        textToSpeak = this.resolvePhoneticText(text, code, explicitPhonetic);

        // Pick best available Indian English voice or English voice
        voiceToUse = voices.find(v => v.lang.toLowerCase() === 'en-in') ||
                     voices.find(v => v.lang.toLowerCase().includes('in') && v.lang.toLowerCase().startsWith('en')) ||
                     voices.find(v => v.name.toLowerCase().includes('rishi') || v.name.toLowerCase().includes('aman')) ||
                     voices.find(v => v.lang.toLowerCase().startsWith('en')) ||
                     voices[0];

        targetLang = voiceToUse?.lang || 'en-IN';
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = targetLang;
      utterance.rate = this.speechRate;
      utterance.pitch = 1.0;

      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('[TTS] Error playing speech utterance:', err);
    }
  }

  public stop(): void {
    elevenLabsService.stop();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechTts = new WebSpeechTtsService();
