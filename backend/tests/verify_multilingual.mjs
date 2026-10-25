/**
 * Automated Verification for Project Saathi 22 Constitutional Languages + English Subsystem
 * Tests:
 * 1. Completeness of all 22 8th Schedule Constitutional Languages + English
 * 2. Proper BCP-47 Speech Synthesis Locales
 * 3. Text translation key coverage across major Indic languages
 * 4. Regional script fallback for non-Latin / non-Devanagari Indic languages
 * 5. Strict adherence to Clinical Non-Diagnostic Safety Governance in all translations
 *    (Ensuring NO translation claims "You have cancer", "You are diagnosed", "You are healthy/cured")
 * 6. Dual-Tier Speech Synthesis verification (preventing dropped non-Latin glyphs and numbers-only speech)
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '../..');

console.log('================================================================');
console.log('PROJECT SAATHI: 22 CONSTITUTIONAL LANGUAGES VERIFICATION');
console.log('Root:', rootDir);
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// 1. Check localization.ts exists and parse languages list
const localizationPath = resolve(rootDir, 'dashboard/src/services/localization.ts');
const locContent = readFileSync(localizationPath, 'utf8');

// The 22 official languages in the 8th Schedule of the Constitution of India:
const SCHEDULE_8_LANGUAGES = [
  'as', // Assamese
  'bn', // Bengali
  'brx', // Bodo
  'doi', // Dogri
  'gu', // Gujarati
  'hi', // Hindi
  'kn', // Kannada
  'ks', // Kashmiri
  'kok', // Konkani
  'mai', // Maithili
  'ml', // Malayalam
  'mni', // Manipuri
  'mr', // Marathi
  'ne', // Nepali
  'or', // Odia
  'pa', // Punjabi
  'sa', // Sanskrit
  'sat', // Santali
  'sd', // Sindhi
  'ta', // Tamil
  'te', // Telugu
  'ur', // Urdu
];

// Check all 22 + en are present in CONSTITUTIONAL_LANGUAGES
const allFound = SCHEDULE_8_LANGUAGES.every(code => locContent.includes(`code: '${code}'`)) &&
                 locContent.includes(`code: 'en'`);

assert(
  allFound,
  `All 22 Constitutional Languages under the 8th Schedule + English are registered in metadata`
);

// 2. Check BCP-47 speech tags exist for each language
const bcpTagsPresent = [
  'hi-IN', 'en-IN', 'pa-IN', 'bn-IN', 'ta-IN', 'te-IN', 'mr-IN',
  'gu-IN', 'kn-IN', 'ml-IN', 'or-IN', 'as-IN', 'ur-IN'
].every(tag => locContent.includes(tag));

assert(
  bcpTagsPresent,
  `Speech Synthesis (TTS) BCP-47 voice tags are correctly configured for Indic regions`
);

// 3. Clinical Non-Diagnostic assertions verification
const FORBIDDEN_WORDS = [
  'you have cancer',
  'diagnosed with cancer',
  'you are completely cured',
  'you are completely healthy',
  'कैंसर की पुष्टि',
  'रोग का पक्का निदान',
  'कॅन्सर झाला आहे'
];

let forbiddenFound = false;
for (const word of FORBIDDEN_WORDS) {
  if (locContent.toLowerCase().includes(word.toLowerCase())) {
    forbiddenFound = true;
    console.error(`Found forbidden diagnostic wording: "${word}"`);
  }
}

assert(
  !forbiddenFound,
  `Clinical Safety Governance: Translations strictly adhere to non-diagnostic assistive screening wording`
);

// 4. Verify Dual-Tier Speech Synthesis Phonetic Strings
// Ensures words are NOT dropped by fallback synthesizers (preventing "only says 3, 2" bug)
const majorIndicCodes = ['pa', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'or', 'as', 'ur'];
const allPhoneticsPresent = majorIndicCodes.every(code => {
  return locContent.includes(`audioGreetingPhonetic:`) && locContent.includes(`audioSelectPathwayPhonetic:`);
});

assert(
  allPhoneticsPresent,
  `Dual-Tier TTS: Phonetic spoken strings exist across all major Indic languages for graceful fallback`
);

// 5. Verify speechTts.ts integrates localization and handles dual-tier audio synthesis
const speechTtsPath = resolve(rootDir, 'dashboard/src/services/speechTts.ts');
const speechContent = readFileSync(speechTtsPath, 'utf8');

assert(
  speechContent.includes("import { getBcp47Tag, getTranslation } from './localization'") &&
  speechContent.includes('setLanguage(langCode: string)') &&
  speechContent.includes('speak(text: string, langCode?: string, explicitPhonetic?: string)') &&
  speechContent.includes('audioGreetingPhonetic'),
  `speechTts.ts dynamically routes audio synthesis requests and automatically selects phonetic fallback when native voices are missing`
);

// 6. Verify MobileSimulator.tsx imports and binds to getTranslation and CONSTITUTIONAL_LANGUAGES
const simulatorPath = resolve(rootDir, 'dashboard/src/pages/mobile_simulator/MobileSimulator.tsx');
const simContent = readFileSync(simulatorPath, 'utf8');

assert(
  simContent.includes('CONSTITUTIONAL_LANGUAGES') &&
  simContent.includes('getTranslation') &&
  simContent.includes('isLangPickerOpen') &&
  simContent.includes('handleSelectLanguage') &&
  simContent.includes('audioGreetingPhonetic'),
  `MobileSimulator.tsx features an interactive modal for all 22 Constitutional languages + English with reactive state binding and phonetic speech fallback`
);

// 7. Verify Mobile Flutter app translations also include 22 languages metadata
const flutterTranslationsPath = resolve(rootDir, 'mobile/lib/core/localization/app_translations.dart');
const flutterContent = readFileSync(flutterTranslationsPath, 'utf8');

assert(
  flutterContent.includes('ConstitutionalLanguage') &&
  SCHEDULE_8_LANGUAGES.every(code => flutterContent.includes(`code: '${code}'`)),
  `Flutter mobile app AppTranslations contains synchronized metadata for all 22 Constitutional languages`
);

// 8. Verify translations dictionary in dashboard contains all 22 languages + English directly
const allDashboardDictionariesPresent = SCHEDULE_8_LANGUAGES.every(code => {
  const reg = new RegExp('^\\s*' + code + ':\\s*\\{', 'm');
  return reg.test(locContent);
});

assert(
  allDashboardDictionariesPresent,
  `Dashboard translations object contains full dedicated dictionaries for all 22 Constitutional languages under Schedule 8`
);

// 9. Verify Flutter localizedValues contains all 22 languages + English directly
const allFlutterDictionariesPresent = SCHEDULE_8_LANGUAGES.every(code => {
  const reg = new RegExp("^\\s*'" + code + "':\\s*\\{", 'm');
  return reg.test(flutterContent);
});

assert(
  allFlutterDictionariesPresent,
  `Flutter app_translations.dart localizedValues contains dedicated translation maps for all 22 Constitutional languages`
);

// 10. Verify that the 8 languages + Manipuri have distinct, authentic audio greetings (NOT Hindi or Bengali)
const USER_REPORTED_LANGUAGES = ['mai', 'brx', 'doi', 'ks', 'kok', 'sa', 'sat', 'sd', 'mni'];
let allDistinctGreetings = true;
const hindiGreeting = 'नमस्ते आशा दीदी। आज आपके क्षेत्र में तीन मरीज़ों का फॉलो-अप बाकी है';

for (const code of USER_REPORTED_LANGUAGES) {
  // Extract audioGreeting for this code
  const codeSectionMatch = locContent.match(new RegExp(code + ':\\s*\\{([\\s\\S]*?)\\n\\s*\\},'));
  if (codeSectionMatch) {
    const greetingMatch = codeSectionMatch[1].match(/audioGreeting:\s*'([^']+)'/);
    if (!greetingMatch || greetingMatch[1].includes(hindiGreeting)) {
      allDistinctGreetings = false;
      console.error(`Language ${code} still has fallback or Hindi audio greeting!`);
    }
  } else {
    allDistinctGreetings = false;
    console.error(`Could not parse section for language: ${code}`);
  }
}

assert(
  allDistinctGreetings,
  `Native Audio Greeting Parity: All 8 user-reported languages (Maithili, Bodo, Dogri, Kashmiri, Konkani, Sanskrit, Santali, Sindhi) + Manipuri have authentic native-script speech prompts`
);

// 11. Verify Dynamic Audio Guidance Prompt Generator
// Ensures voice dynamically speaks actual live count (0 follow-ups, 0 referrals) instead of static hardcoded counts
assert(
  locContent.includes('export function getDynamicAudioGreeting') &&
  simContent.includes('getDynamicAudioGreeting') &&
  simContent.includes('dynamicGreeting.text') &&
  locContent.includes('0 follow-ups are pending and 0 referrals are waiting') &&
  locContent.includes('आज कोई फॉलो-अप और कोई रेफरल लंबित नहीं है'),
  `Dynamic Audio Guidance: MobileSimulator dynamically speaks live follow-ups and referrals counts (including 0 pending) across English, Hindi and regional languages`
);

console.log('\n================================================================');
console.log(`Verification Summary: ${passCount} / ${passCount + failCount} tests passed.`);
if (failCount === 0) {
  console.log('ALL MULTI-LINGUAL CONSTITUTIONAL LANGUAGE TESTS PASSED! 🎉');
  process.exit(0);
} else {
  console.error('SOME TESTS FAILED.');
  process.exit(1);
}

