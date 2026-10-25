/**
 * Project Saathi - 22 Constitutional Languages + English Localization Subsystem
 * Covers all languages recognized under the 8th Schedule of the Constitution of India.
 * Provides synchronized text and spoken voice synthesis strings.
 */

export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  bcp47: string;
  region: string;
}

export interface AppTranslationStrings {
  // Common & Header
  appTitle: string;
  tagline: string;
  demoBadge: string;
  homeTitle: string;
  registerTitle: string;
  consentTitle: string;
  pathwaySelectTitle: string;
  skinScreeningTitle: string;
  eyeScreeningTitle: string;
  chestScreeningTitle: string;
  bloodScreeningTitle: string;
  resultTitle: string;
  referralsTitle: string;
  timelineTitle: string;
  followupsTitle: string;
  settingsTitle: string;

  // Home Screen
  offlineStatusReady: string;
  todayTasksHeader: string;
  followupTaskCount: string;
  followupTaskDesc: string;
  openReferralsCount: string;
  openReferralsDesc: string;
  pendingBadge: string;
  activeBadge: string;
  startScreening: string;
  registerPatient: string;
  patientTimeline: string;
  syncAndLanguage: string;

  // Registration & Consent
  villageLabel: string;
  ageLabel: string;
  genderLabel: string;
  phoneLabel: string;
  genderFemale: string;
  genderTrans?: string;
  genderOther: string;
  genderMale: string;
  optionalPhotoNotice: string;
  takeOptionalPhoto: string;
  photoAttached: string;
  nextConsent: string;
  consentNotice: string;
  consentCareTitle: string;
  consentCareDesc: string;
  consentReferralTitle: string;
  consentReferralDesc: string;
  consentSmsTitle: string;
  consentSmsDesc: string;
  consentResearchTitle: string;
  consentResearchDesc: string;
  saveConsentAndSelect: string;

  // Pathways
  pathwaySkinTitle: string;
  pathwaySkinDesc: string;
  pathwayEyeTitle: string;
  pathwayEyeDesc: string;
  pathwayChestTitle: string;
  pathwayChestDesc: string;
  pathwayBloodTitle: string;
  pathwayBloodDesc: string;
  emergencyAlertBanner: string;

  // Screening Steps & Camera
  step1Of3: string;
  step2Of3: string;
  step3Of3: string;
  cameraDistanceGuide: string;
  cameraLightingGuide: string;
  qualityValidated: string;
  captureImage: string;
  reviewResult: string;

  // Results & Clinical Safety
  resultGreenTitle: string;
  resultGreenDesc: string;
  resultAmberTitle: string;
  resultAmberDesc: string;
  resultRedTitle: string;
  resultRedDesc: string;
  resultDisclaimer: string;
  createReferral: string;
  returnHome: string;

  // Referrals & Follow-through
  openReferralsHeader: string;
  recordHospitalOutcome: string;
  closeLoopSuccess: string;

  // Bottom Navigation
  navHome: string;
  navScreening: string;
  navReferrals: string;
  navSettings: string;

  // Audio Guidance Prompts (Native script for native Indic speech engines)
  audioGreeting: string;
  audioSelectPathway: string;
  audioCameraGuide: string;
  audioResultGreen: string;
  audioResultAmber: string;
  audioResultRed: string;

  // Phonetic Spoken Strings (For English/Indic fallback synthesizers when host OS lacks regional voice pack)
  audioGreetingPhonetic?: string;
  audioSelectPathwayPhonetic?: string;
  audioCameraGuidePhonetic?: string;
  audioResultGreenPhonetic?: string;
  audioResultAmberPhonetic?: string;
  audioResultRedPhonetic?: string;
}

export const CONSTITUTIONAL_LANGUAGES: LanguageMeta[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', bcp47: 'hi-IN', region: 'North / Central India' },
  { code: 'en', name: 'English', nativeName: 'English', bcp47: 'en-IN', region: 'Pan-India' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', bcp47: 'pa-IN', region: 'Punjab / North India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', bcp47: 'bn-IN', region: 'West Bengal / Tripura' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', bcp47: 'ta-IN', region: 'Tamil Nadu / Puducherry' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', bcp47: 'te-IN', region: 'Andhra Pradesh / Telangana' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', bcp47: 'mr-IN', region: 'Maharashtra / Goa' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', bcp47: 'gu-IN', region: 'Gujarat' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', bcp47: 'kn-IN', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', bcp47: 'ml-IN', region: 'Kerala / Lakshadweep' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', bcp47: 'or-IN', region: 'Odisha' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', bcp47: 'as-IN', region: 'Assam' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', bcp47: 'ur-IN', region: 'Pan-India' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', bcp47: 'mai-IN', region: 'Bihar / Jharkhand' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', bcp47: 'brx-IN', region: 'Assam / Bodoland' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', bcp47: 'doi-IN', region: 'Jammu & Kashmir' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर', bcp47: 'ks-IN', region: 'Kashmir Valley' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', bcp47: 'kok-IN', region: 'Goa / Coastal Karnataka' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', bcp47: 'mni-IN', region: 'Manipur' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', bcp47: 'ne-IN', region: 'Sikkim / West Bengal' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', bcp47: 'sa-IN', region: 'Pan-India Classical' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', bcp47: 'sat-IN', region: 'Jharkhand / Odisha / WB' },
  { code: 'sd', name: 'Sindhi', nativeName: 'सिंधी', bcp47: 'sd-IN', region: 'Gujarat / Rajasthan' },
];

export const translations: Record<string, AppTranslationStrings> = {
  // 1. Hindi (Default Indic)
  hi: {
    appTitle: 'प्रोजेक्ट साथी',
    tagline: 'देखभाल के थोड़ा करीब। स्वास्थ्य की ओर एक कदम पहले।',
    demoBadge: 'प्रदर्शन मोड — चिकित्सीय उपयोग के लिए नहीं',
    homeTitle: 'आशा स्वास्थ्य सहायक',
    registerTitle: 'मरीज़ पंजीकरण',
    consentTitle: 'मरीज़ सहमति पत्र',
    pathwaySelectTitle: 'जाँच का तरीका चुनें',
    skinScreeningTitle: 'त्वचा लक्षण जाँच',
    eyeScreeningTitle: 'आंख एवं पर्दा जाँच',
    chestScreeningTitle: 'छाती एवं टीबी जाँच',
    bloodScreeningTitle: 'रक्त जाँच (CBC फनल)',
    resultTitle: 'स्क्रीनिंग परिणाम',
    referralsTitle: 'खुले रेफरल',
    timelineTitle: 'मरीज़ स्वास्थ्य इतिहास',
    followupsTitle: 'पुनः जाँच और फॉलो-अप',
    settingsTitle: 'सेटिंग्स एवं सिंक',

    offlineStatusReady: 'ऑफ़लाइन सक्रिय • 3 रिकॉर्ड्स सिंक के लिए तैयार',
    todayTasksHeader: "आज के मुख्य कार्य (Today's Tasks)",
    followupTaskCount: '3 लोगों की पुनः जाँच (Follow-up)',
    followupTaskDesc: 'गाँव: रामपूर • 7 दिन की समयसीमा',
    openReferralsCount: '2 रेफरल अस्पताल परिणाम के लिए खुले हैं',
    openReferralsDesc: 'सीएचसी नाभा • फॉलो-थ्रू लूप सक्रिय',
    pendingBadge: 'लंबित',
    activeBadge: 'सक्रिय',
    startScreening: 'जाँच शुरू करें (Start Screening)',
    registerPatient: 'नया मरीज़ पंजीकृत करें (Register)',
    patientTimeline: 'मरीज़ इतिहास',
    syncAndLanguage: 'सिंक एवं भाषा',

    villageLabel: 'गाँव का नाम (Village Name)',
    ageLabel: 'उम्र (Age in Years)',
    genderLabel: 'लिंग (Gender)',
    phoneLabel: 'पारिवारिक संपर्क फ़ोन (Family Phone)',
    genderFemale: 'महिला (Female)',
    genderTrans: 'ट्रांसजेंडर (Trans)',
    genderOther: 'अन्य (Other)',
    genderMale: 'पुरुष (Male)',
    optionalPhotoNotice: 'गोपनीयता सुरक्षा: फ़ोटो इलाज के लिए अनिवार्य नहीं है। सुरक्षित कोड स्वतः जारी होगा।',
    takeOptionalPhoto: 'वैकल्पिक पहचान फ़ोटो लें',
    photoAttached: 'वैकल्पिक फ़ोटो संलग्न ✓',
    nextConsent: 'सहमति एवं आगे बढ़ें (Next: Consent)',
    consentNotice: 'सहमति न देने पर भी मरीज़ को डॉक्टर या आपातकालीन सेवा से वंचित नहीं किया जा सकता।',
    consentCareTitle: '1. प्राथमिक स्वास्थ्य जाँच की सहमति',
    consentCareDesc: 'त्वचा, आंख या लक्षणों की प्राथमिक स्क्रीनिंग।',
    consentReferralTitle: '2. अस्पताल रेफरल समन्वय',
    consentReferralDesc: 'लक्षण दिखने पर सीएचसी डॉक्टर से रिपोर्ट साझा करना।',
    consentSmsTitle: '3. परिवार को सूचना संदेश (SMS)',
    consentSmsDesc: 'केवल समय व तारीख का तटस्थ संदेश (बीमारी का नाम नहीं)।',
    consentResearchTitle: '4. गैर-अनिवार्य शोध उपयोग (Research)',
    consentResearchDesc: 'अनाम शोध उपयोग। इलाज के लिए बिल्कुल अनिवार्य नहीं।',
    saveConsentAndSelect: 'सहमति सहेजें और जाँच चुनें (Select Pathway)',

    pathwaySkinTitle: 'त्वचा लक्षण जाँच (Skin-Sign)',
    pathwaySkinDesc: 'असामान्य घाव, नीले निशान, दाने या पीलापन।',
    pathwayEyeTitle: 'आंख एवं पर्दा जाँच (Retina Check)',
    pathwayEyeDesc: 'मधुमेह मरीज़ों में रेटिना जांच (फंडस लेंस आवश्यक)।',
    pathwayChestTitle: 'छाती एवं टीबी जाँच (Chest / TB)',
    pathwayChestDesc: 'डिजिटल एक्स-रे या 2 सप्ताह खांसी लक्षण प्रोटोकॉल।',
    pathwayBloodTitle: 'रक्त जाँच (CBC Cancer Funnel)',
    pathwayBloodDesc: 'सीबीसी मान, प्लेटलेट्स व माइक्रोस्कोप स्लाइड समीक्षा।',
    emergencyAlertBanner: 'सांस लेने में भारी तकलीफ या बेहोशी है? आपातकालीन 108 सहायता यहां देखें।',

    step1Of3: 'चरण 1/3: स्क्रीनिंग प्रकार चुनें',
    step2Of3: 'चरण 2/3: फ़ोटो एवं गुणवत्ता सत्यापन',
    step3Of3: 'चरण 3/3: परिणाम एवं आगामी कदम',
    cameraDistanceGuide: 'प्राकृतिक रोशनी में 15 सेमी की दूरी रखें',
    cameraLightingGuide: 'Blur > 110 • पर्याप्त रोशनी में हाथ स्थिर रखें',
    qualityValidated: 'फ़ोटो गुणवत्ता सत्यापित (Sharp & Clear)',
    captureImage: 'फ़ोटो खींचें एवं जाँचें (Capture)',
    reviewResult: 'जाँच परिणाम देखें (Review Result)',

    resultGreenTitle: 'इस जाँच में कोई चिंताजनक लक्षण नहीं दिखा।',
    resultGreenDesc: 'इस जाँच में कोई चिंता की बात नहीं पाई गई है। कृपया सामान्य देखभाल जारी रखें और अपनी आशा दीदी की सलाह का पालन करें।',
    resultAmberTitle: 'कुछ लक्षणों की डॉक्टर द्वारा जाँच आवश्यक है।',
    resultAmberDesc: 'एक बार फिर जाँच करवाना मददगार हो सकता है। आपकी आशा कार्यकर्ता आगे का मार्गदर्शन करेंगी।',
    resultRedTitle: 'तुरंत डॉक्टर से जाँच कराने की सलाह दी जाती है।',
    resultRedDesc: 'इस जाँच से पता चलता है कि डॉक्टर से मिलना आवश्यक है। आपकी आशा कार्यकर्ता अस्पताल रेफरल में सहायता करेंगी।',
    resultDisclaimer: 'चिकित्सीय सीमा: यह जाँच किसी बीमारी का पक्का निदान नहीं है। नकारात्मक परिणाम भी बीमारी की पूर्ण अनुपस्थिति साबित नहीं करता।',
    createReferral: 'अस्पताल रेफरल बनाएं (Create Referral)',
    returnHome: 'आशा होम पर लौटें (Return Home)',

    openReferralsHeader: 'सक्रिय खुले रेफरल (Open Follow-Through)',
    recordHospitalOutcome: 'अस्पताल परिणाम दर्ज करें (Close Loop)',
    closeLoopSuccess: 'रेफरल पूर्ण हुआ और क्लिनिकल लूप समाप्त हुआ।',

    navHome: 'होम',
    navScreening: 'स्क्रीनिंग',
    navReferrals: 'रेफरल',
    navSettings: 'सेटिंग्स',

    audioGreeting: 'नमस्ते आशा दीदी। आज आपके क्षेत्र में 3 लोगों का फॉलो-अप बाकी है और 2 रेफरल अस्पताल रिपोर्ट की प्रतीक्षा में हैं।',
    audioSelectPathway: 'कृपया जाँच का तरीका चुनें: त्वचा, आंख, छाती या खून की रिपोर्ट।',
    audioCameraGuide: 'मरीज़ को पर्याप्त प्राकृतिक रोशनी में बैठाएं। कैमरे को स्थिर पकड़कर फोटो खींचें।',
    audioResultGreen: 'इस जाँच में कोई चिंता की बात नहीं पाई गई है। कृपया सामान्य देखभाल जारी रखें।',
    audioResultAmber: 'एक बार फिर जाँच करवाना मददगार हो सकता है। आपकी आशा कार्यकर्ता आगे का मार्गदर्शन करेंगी।',
    audioResultRed: 'इस जाँच से पता चलता है कि डॉक्टर से मिलना आवश्यक है। अस्पताल रेफरल बनाया जा रहा है।',
    audioGreetingPhonetic: 'Namaste ASHA didi. Aaj aapke kshetra mein teen mareezon ka follow-up baaki hai aur do referral hospital report ki pratiksha mein hain.',
    audioSelectPathwayPhonetic: 'Kripya jaanch ka tarika chunein: twacha, aankh, chhati ya khoon ki report.',
    audioCameraGuidePhonetic: 'Mareez ko acchi roshni mein bithaayein aur camera sthir rakh kar photo lein.',
    audioResultGreenPhonetic: 'Is jaanch mein koi chinta ki baat nahi paayi gayi. Saamaanya dekhbhal jaari rakhein.',
    audioResultAmberPhonetic: 'Kuch lakshanon ke liye doctor ki jaanch zaroori hai. ASHA didi margdarshan karengi.',
    audioResultRedPhonetic: 'Is jaanch se pata chalta hai ki doctor se milna zaroori hai. Turant hospital referral karein.',
  },

  // 2. English (Administrative / National)
  en: {
    appTitle: 'Project Saathi',
    tagline: 'A little closer to care. A step earlier to health.',
    demoBadge: 'DEMO — NOT FOR CLINICAL USE',
    homeTitle: 'ASHA Health Assistant',
    registerTitle: 'Patient Registration',
    consentTitle: 'Informed Consent Form',
    pathwaySelectTitle: 'Select Screening Pathway',
    skinScreeningTitle: 'Skin-Sign Triage',
    eyeScreeningTitle: 'Retina & Vision Check',
    chestScreeningTitle: 'Chest & Respiratory Check',
    bloodScreeningTitle: 'CBC Blood Cancer Funnel',
    resultTitle: 'Screening Result',
    referralsTitle: 'Open Referrals',
    timelineTitle: 'Patient Health Timeline',
    followupsTitle: 'Rechecks & Follow-ups',
    settingsTitle: 'Settings & Sync',

    offlineStatusReady: 'Offline Mode Active • 3 records queued for sync',
    todayTasksHeader: "Today's Task List",
    followupTaskCount: '3 people require a follow-up recheck',
    followupTaskDesc: 'Village: Rampur • 7-day clinical window',
    openReferralsCount: '2 referrals waiting for clinical outcome',
    openReferralsDesc: 'Nabha CHC • Follow-through loop open',
    pendingBadge: 'Pending',
    activeBadge: 'Active',
    startScreening: 'Start Screening',
    registerPatient: 'Register Patient',
    patientTimeline: 'Patient Timeline',
    syncAndLanguage: 'Sync & Language',

    villageLabel: 'Village Name',
    ageLabel: 'Age in Years',
    genderLabel: 'Gender',
    phoneLabel: 'Family Contact Phone',
    genderFemale: 'Female',
    genderTrans: 'Trans',
    genderOther: 'Other',
    genderMale: 'Male',
    optionalPhotoNotice: 'Privacy protection: A photograph is never mandatory to receive care. A safe municipal ID is generated.',
    takeOptionalPhoto: 'Take Optional Reference Photo',
    photoAttached: 'Optional Photo Attached ✓',
    nextConsent: 'Proceed to Consent',
    consentNotice: 'Declining consent never blocks access to primary healthcare or emergency assistance.',
    consentCareTitle: '1. Primary Screening Consent',
    consentCareDesc: 'Consent for ASHA triage check (skin, eye, or symptoms).',
    consentReferralTitle: '2. Hospital Referral Coordination',
    consentReferralDesc: 'Share triage findings with PHC/CHC medical officers.',
    consentSmsTitle: '3. Neutral Family SMS Notifications',
    consentSmsDesc: 'Logistics appointment reminders only (no disease names).',
    consentResearchTitle: '4. Optional Research Use',
    consentResearchDesc: 'Anonymized quality improvement (never mandatory for care).',
    saveConsentAndSelect: 'Save Consent & Select Pathway',

    pathwaySkinTitle: 'Skin-Sign Triage',
    pathwaySkinDesc: 'Unusual lesions, unexplained bruising, petechiae, or pallor.',
    pathwayEyeTitle: 'Retina & Vision Check',
    pathwayEyeDesc: 'Diabetic eye screening (optical fundus lens attachment required).',
    pathwayChestTitle: 'Chest & Respiratory Check',
    pathwayChestDesc: 'Digital radiograph import or NTEP 2-week cough symptom protocol.',
    pathwayBloodTitle: 'CBC Blood Cancer Funnel',
    pathwayBloodDesc: 'CBC report entry, deterministic rules engine, and smear review.',
    emergencyAlertBanner: 'Severe breathing distress or collapse? Open 108 Emergency Protocol.',

    step1Of3: 'Step 1/3: Select Pathway',
    step2Of3: 'Step 2/3: Capture & Validate Quality',
    step3Of3: 'Step 3/3: Review Result & Next Step',
    cameraDistanceGuide: 'Keep 15 cm distance in natural daylight',
    cameraLightingGuide: 'Blur variance > 110 • Hold phone steady with good lighting',
    qualityValidated: 'Image Quality Validated (Sharp & Clear)',
    captureImage: 'Capture & Validate Image',
    reviewResult: 'Review Screening Result',

    resultGreenTitle: 'No concerning sign was detected by this screening.',
    resultGreenDesc: 'This check did not identify a concerning sign. Please continue routine care and follow any advice from your health worker.',
    resultAmberTitle: 'Some signs need a closer medical check.',
    resultAmberDesc: 'A closer check may be helpful. Your health worker will explain the next step.',
    resultRedTitle: 'Prompt medical assessment recommended.',
    resultRedDesc: 'This check suggests that a medical assessment is needed. Your health worker can help arrange the next step.',
    resultDisclaimer: 'Clinical Governance: This screening is an assistive triage tool and is not a medical diagnosis. A negative result does not rule out disease.',
    createReferral: 'Create Hospital Referral (Open Loop)',
    returnHome: 'Return to Worker Home',

    openReferralsHeader: 'Open Referrals (Follow-Through Loop)',
    recordHospitalOutcome: 'Record Hospital Outcome (Close Loop)',
    closeLoopSuccess: 'Clinical outcome recorded. Follow-through loop successfully closed.',

    navHome: 'Home',
    navScreening: 'Screening',
    navReferrals: 'Referrals',
    navSettings: 'Settings',

    audioGreeting: 'Welcome ASHA worker. Today 3 follow-ups are due and 2 referrals are waiting for clinical outcome.',
    audioSelectPathway: 'Please select a screening pathway: skin signs, retinal fundus, chest, or blood report.',
    audioCameraGuide: 'Position patient in natural indirect daylight. Hold the smartphone camera steady at 15 centimeters.',
    audioResultGreen: 'No concerning sign was detected by this screening. Please continue routine care.',
    audioResultAmber: 'A closer check may be helpful. Your health worker will explain the next step.',
    audioResultRed: 'This check suggests that a medical assessment is needed. Your health worker is arranging a referral.',
    audioGreetingPhonetic: 'Welcome ASHA worker. Today 3 follow-ups are due and 2 referrals are waiting for clinical outcome.',
    audioSelectPathwayPhonetic: 'Please select a screening pathway: skin signs, retinal fundus, chest, or blood report.',
    audioCameraGuidePhonetic: 'Position patient in natural indirect daylight. Hold the smartphone camera steady at 15 centimeters.',
    audioResultGreenPhonetic: 'No concerning sign was detected by this screening. Please continue routine care.',
    audioResultAmberPhonetic: 'A closer check may be helpful. Your health worker will explain the next step.',
    audioResultRedPhonetic: 'This check suggests that a medical assessment is needed. Your health worker is arranging a referral.',
  },

  // 3. Punjabi (ਪੰਜਾਬੀ) - Crucial for Punjab deployment (Patiala/Nabha)
  pa: {
    appTitle: 'ਪ੍ਰੋਜੈਕਟ ਸਾਥੀ',
    tagline: 'ਦੇਖਭਾਲ ਦੇ ਥੋੜ੍ਹਾ ਨੇੜੇ। ਸਿਹਤ ਵੱਲ ਇੱਕ ਕਦਮ ਪਹਿਲਾਂ।',
    demoBadge: 'ਪ੍ਰਦਰਸ਼ਨ ਮੋਡ — ਕਲੀਨਿਕਲ ਵਰਤੋਂ ਲਈ ਨਹੀਂ',
    homeTitle: 'ਆਸ਼ਾ ਸਿਹਤ ਸਹਾਇਕ',
    registerTitle: 'ਮਰੀਜ਼ ਰਜਿਸਟ੍ਰੇਸ਼ਨ',
    consentTitle: 'ਮਰੀਜ਼ ਸਹਿਮਤੀ ਪੱਤਰ',
    pathwaySelectTitle: 'ਜਾਂਚ ਦਾ ਤਰੀਕਾ ਚੁਣੋ',
    skinScreeningTitle: 'ਚਮੜੀ ਲੱਛਣ ਜਾਂਚ',
    eyeScreeningTitle: 'ਅੱਖ ਅਤੇ ਪਰਦਾ ਜਾਂਚ',
    chestScreeningTitle: 'ਛਾਤੀ ਅਤੇ ਟੀਬੀ ਜਾਂਚ',
    bloodScreeningTitle: 'ਖੂਨ ਜਾਂਚ (CBC ਫਨਲ)',
    resultTitle: 'ਜਾਂਚ ਨਤੀਜਾ',
    referralsTitle: 'ਖੁੱਲ੍ਹੇ ਰੈਫਰਲ',
    timelineTitle: 'ਮਰੀਜ਼ ਸਿਹਤ ਇਤਿਹਾਸ',
    followupsTitle: 'ਦੁਬਾਰਾ ਜਾਂਚ ਅਤੇ ਫਾਲੋ-ਅੱਪ',
    settingsTitle: 'ਸੈਟਿੰਗਾਂ ਅਤੇ ਸਿੰਕ',

    offlineStatusReady: 'ਆਫ਼ਲਾਈਨ ਕਿਰਿਆਸ਼ੀਲ • 3 ਰਿਕਾਰਡ ਸਿੰਕ ਲਈ ਤਿਆਰ',
    todayTasksHeader: 'ਅੱਜ ਦੇ ਮੁੱਖ ਕਾਰਜ (Today Tasks)',
    followupTaskCount: '3 ਮਰੀਜ਼ਾਂ ਦੀ ਮੁੜ ਜਾਂਚ (Follow-up) ਬਾਕੀ ਹੈ',
    followupTaskDesc: 'ਪਿੰਡ: ਰਾਮਪੁਰ • 7 ਦਿਨਾਂ ਦੀ ਮਿਆਦ',
    openReferralsCount: '2 ਰੈਫਰਲ ਹਸਪਤਾਲ ਰਿਪੋਰਟ ਦੀ ਉਡੀਕ ਵਿੱਚ ਹਨ',
    openReferralsDesc: 'ਸੀਐਚਸੀ ਨਾਭਾ • ਫਾਲੋ-ਥਰੂ ਲੂਪ ਕਿਰਿਆਸ਼ੀਲ',
    pendingBadge: 'ਬਕਾਇਆ',
    activeBadge: 'ਕਿਰਿਆਸ਼ੀਲ',
    startScreening: 'ਜਾਂਚ ਸ਼ੁਰੂ ਕਰੋ (Start Screening)',
    registerPatient: 'ਨਵਾਂ ਮਰੀਜ਼ ਰਜਿਸਟਰ ਕਰੋ (Register)',
    patientTimeline: 'ਮਰੀਜ਼ ਇਤਿਹਾਸ',
    syncAndLanguage: 'ਸਿੰਕ ਅਤੇ ਭਾਸ਼ਾ',

    villageLabel: 'ਪਿੰਡ ਦਾ ਨਾਮ (Village Name)',
    ageLabel: 'ਉਮਰ (ਸਾਲਾਂ ਵਿੱਚ)',
    genderLabel: 'ਲਿੰਗ (Gender)',
    phoneLabel: 'ਪਰਿਵਾਰਕ ਸੰਪਰਕ ਫ਼ੋਨ',
    genderFemale: 'ਔਰਤ (Female)',
    genderMale: 'ਮਰਦ (Male)',
    genderOther: 'ਹੋਰ (Other)',
    optionalPhotoNotice: 'ਗੋਪਨੀਯਤਾ ਸੁਰੱਖਿਆ: ਫੋਟੋ ਇਲਾਜ ਲਈ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ। ਇੱਕ ਸੁਰੱਖਿਅਤ ਕੋਡ ਜਾਰੀ ਹੋਵੇਗਾ।',
    takeOptionalPhoto: 'ਵਿਕਲਪਿਕ ਪਛਾਣ ਫੋਟੋ ਲਓ',
    photoAttached: 'ਵਿਕਲਪਿਕ ਫੋਟੋ ਨੱਥੀ ਹੈ ✓',
    nextConsent: 'ਸਹਿਮਤੀ ਅਤੇ ਅੱਗੇ ਵਧੋ (Next: Consent)',
    consentNotice: 'ਸਹਿਮਤੀ ਨਾ ਦੇਣ ਤੇ ਵੀ ਮਰੀਜ਼ ਨੂੰ ਡਾਕਟਰ ਜਾਂ ਐਮਰਜੈਂਸੀ ਸੇਵਾ ਤੋਂ ਵਾਂਝਾ ਨਹੀਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ।',
    consentCareTitle: '1. ਮੁੱਢਲੀ ਸਿਹਤ ਜਾਂਚ ਦੀ ਸਹਿਮਤੀ',
    consentCareDesc: 'ਚਮੜੀ, ਅੱਖ ਜਾਂ ਲੱਛਣਾਂ ਦੀ ਮੁੱਢਲੀ ਜਾਂਚ।',
    consentReferralTitle: '2. ਹਸਪਤਾਲ ਰੈਫਰਲ ਤਾਲਮੇਲ',
    consentReferralDesc: 'ਲੱਛਣ ਦਿਸਣ ਤੇ ਸੀਐਚਸੀ ਡਾਕਟਰ ਨਾਲ ਰਿਪੋਰਟ ਸਾਂਝੀ ਕਰਨਾ।',
    consentSmsTitle: '3. ਪਰਿਵਾਰ ਨੂੰ ਸੂਚਨਾ ਸੁਨੇਹਾ (SMS)',
    consentSmsDesc: 'ਸਿਰਫ਼ ਤਾਰੀਖ ਦਾ ਨਿਰਪੱਖ ਸੁਨੇਹਾ (ਬਿਮਾਰੀ ਦਾ ਨਾਮ ਨਹੀਂ)।',
    consentResearchTitle: '4. ਗੈਰ-ਲਾਜ਼ਮੀ ਖੋਜ ਵਰਤੋਂ (Research)',
    consentResearchDesc: 'ਗੁਮਨਾਮ ਖੋਜ ਵਰਤੋਂ। ਇਲਾਜ ਲਈ ਬਿਲਕੁਲ ਲਾਜ਼ਮੀ ਨਹੀਂ।',
    saveConsentAndSelect: 'ਸਹਿਮਤੀ ਸੁਰੱਖਿਅਤ ਕਰੋ ਅਤੇ ਜਾਂਚ ਚੁਣੋ',

    pathwaySkinTitle: 'ਚਮੜੀ ਲੱਛਣ ਜਾਂਚ (Skin-Sign)',
    pathwaySkinDesc: 'ਅਸਧਾਰਨ ਜ਼ਖ਼ਮ, ਨੀਲੇ ਨਿਸ਼ਾਨ, ਦਾਣੇ ਜਾਂ ਪੀਲਾਪਣ।',
    pathwayEyeTitle: 'ਅੱਖ ਅਤੇ ਪਰਦਾ ਜਾਂਚ (Retina Check)',
    pathwayEyeDesc: 'ਸ਼ੂਗਰ ਵਾਲੇ ਮਰੀਜ਼ਾਂ ਵਿੱਚ ਰੈਟੀਨਾ ਜਾਂਚ (ਫੰਡਸ ਲੈਂਜ਼ ਲਾਜ਼ਮੀ)।',
    pathwayChestTitle: 'ਛਾਤੀ ਅਤੇ ਟੀਬੀ ਜਾਂਚ (Chest / TB)',
    pathwayChestDesc: 'ਡਿਜੀਟਲ ਐਕਸ-ਰੇਅ ਜਾਂ 2 ਹਫ਼ਤੇ ਦੀ ਖੰਘ ਲੱਛਣ ਪ੍ਰੋਟੋਕੋਲ।',
    pathwayBloodTitle: 'ਖੂਨ ਜਾਂਚ (CBC Cancer Funnel)',
    pathwayBloodDesc: 'ਸੀਬੀਸੀ ਮੁੱਲ, ਪਲੇਟਲੈਟਸ ਅਤੇ ਮਾਈਕਰੋਸਕੋਪ ਸਲਾਈਡ ਸਮੀਖਿਆ।',
    emergencyAlertBanner: 'ਸਾਹ ਲੈਣ ਵਿੱਚ ਭਾਰੀ ਤਕਲੀਫ ਜਾਂ ਬੇਹੋਸ਼ੀ ਹੈ? 108 ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ ਇੱਥੇ ਵੇਖੋ।',

    step1Of3: 'ਕਦਮ 1/3: ਜਾਂਚ ਕਿਸਮ ਚੁਣੋ',
    step2Of3: 'ਕਦਮ 2/3: ਫੋਟੋ ਅਤੇ ਗੁਣਵੱਤਾ ਤਸਦੀਕ',
    step3Of3: 'ਕਦਮ 3/3: ਨਤੀਜਾ ਅਤੇ ਅਗਲੇ ਕਦਮ',
    cameraDistanceGuide: 'ਕੁਦਰਤੀ ਰੋਸ਼ਨੀ ਵਿੱਚ 15 ਸੈਂਟੀਮੀਟਰ ਦੀ ਦੂਰੀ ਰੱਖੋ',
    cameraLightingGuide: 'Blur > 110 • ਹੱਥ ਸਥਿਰ ਰੱਖ ਕੇ ਫੋਟੋ ਖਿੱਚੋ',
    qualityValidated: 'ਫੋਟੋ ਗੁਣਵੱਤਾ ਤਸਦੀਕ ਹੋਈ (Sharp & Clear)',
    captureImage: 'ਫੋਟੋ ਖਿੱਚੋ ਅਤੇ ਜਾਂਚੋ (Capture)',
    reviewResult: 'ਜਾਂਚ ਨਤੀਜਾ ਵੇਖੋ (Review Result)',

    resultGreenTitle: 'ਇਸ ਜਾਂਚ ਵਿੱਚ ਕੋਈ ਚਿੰਤਾਜਨਕ ਲੱਛਣ ਨਹੀਂ ਮਿਲਿਆ।',
    resultGreenDesc: 'ਇਸ ਜਾਂਚ ਵਿੱਚ ਕੋਈ ਚਿੰਤਾ ਦੀ ਗੱਲ ਨਹੀਂ ਪਾਈ ਗਈ। ਆਮ ਦੇਖਭਾਲ ਜਾਰੀ ਰੱਖੋ ਅਤੇ ਆਸ਼ਾ ਵਰਕਰ ਦੀ ਸਲਾਹ ਮੰਨੋ।',
    resultAmberTitle: 'ਕੁਝ ਲੱਛਣਾਂ ਦੀ ਡਾਕਟਰ ਵੱਲੋਂ ਜਾਂਚ ਜ਼ਰੂਰੀ ਹੈ।',
    resultAmberDesc: 'ਇੱਕ ਵਾਰ ਦੁਬਾਰਾ ਜਾਂਚ ਕਰਵਾਉਣਾ ਮਦਦਗਾਰ ਹੋ ਸਕਦਾ ਹੈ। ਤੁਹਾਡੀ ਆਸ਼ਾ ਭੈਣ ਅੱਗੇ ਦੱਸੇਗੀ।',
    resultRedTitle: 'ਤੁਰੰਤ ਡਾਕਟਰ ਤੋਂ ਜਾਂਚ ਕਰਵਾਉਣ ਦੀ ਸਲਾਹ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।',
    resultRedDesc: 'ਇਸ ਜਾਂਚ ਤੋਂ ਪਤਾ ਲੱਗਦਾ ਹੈ ਕਿ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਉਣਾ ਜ਼ਰੂਰੀ ਹੈ। ਆਸ਼ਾ ਵਰਕਰ ਹਸਪਤਾਲ ਰੈਫਰਲ ਕਰੇਗੀ।',
    resultDisclaimer: 'ਕਲੀਨਿਕਲ ਸੀਮਾ: ਇਹ ਜਾਂਚ ਕੋਈ ਪੱਕਾ ਨਿਦਾਨ ਨਹੀਂ ਹੈ। ਹਰਾ ਨਤੀਜਾ ਵੀ ਬਿਮਾਰੀ ਦੀ ਮੁਕੰਮਲ ਅਣਹੋਂਦ ਦੀ ਗਰੰਟੀ ਨਹੀਂ ਹੈ।',
    createReferral: 'ਹਸਪਤਾਲ ਰੈਫਰਲ ਬਣਾਓ (Create Referral)',
    returnHome: 'ਆਸ਼ਾ ਹੋਮ ਤੇ ਵਾਪਸ ਜਾਓ (Return Home)',

    openReferralsHeader: 'ਸਰਗਰਮ ਖੁੱਲ੍ਹੇ ਰੈਫਰਲ (Open Follow-Through)',
    recordHospitalOutcome: 'ਹਸਪਤਾਲ ਨਤੀਜਾ ਦਰਜ ਕਰੋ (Close Loop)',
    closeLoopSuccess: 'ਰੈਫਰਲ ਮੁਕੰਮਲ ਹੋਇਆ ਅਤੇ ਕਲੀਨਿਕਲ ਲੂਪ ਬੰਦ ਹੋ ਗਿਆ।',

    navHome: 'ਹੋਮ',
    navScreening: 'ਸਕ੍ਰੀਨਿੰਗ',
    navReferrals: 'ਰੈਫਰਲ',
    navSettings: 'ਸੈਟਿੰਗਾਂ',

    audioGreeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਆਸ਼ਾ ਦੀਦੀ। ਅੱਜ ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ਤਿੰਨ ਮਰੀਜ਼ਾਂ ਦਾ ਫਾਲੋ-ਅੱਪ ਬਾਕੀ ਹੈ ਅਤੇ ਦੋ ਰੈਫਰਲ ਹਸਪਤਾਲ ਰਿਪੋਰਟ ਦੀ ਉਡੀਕ ਵਿੱਚ ਹਨ।',
    audioSelectPathway: 'ਕਿਰਪਾ ਕਰਕੇ ਜਾਂਚ ਦਾ ਤਰੀਕਾ ਚੁਣੋ: ਚਮੜੀ, ਅੱਖ, ਛਾਤੀ ਜਾਂ ਖੂਨ ਦੀ ਰਿਪੋਰਟ।',
    audioCameraGuide: 'ਮਰੀਜ਼ ਨੂੰ ਚੰਗੀ ਰੋਸ਼ਨੀ ਵਿੱਚ ਬਿਠਾਓ ਅਤੇ ਕੈਮਰਾ ਸਥਿਰ ਰੱਖ ਕੇ ਫੋਟੋ ਲਓ।',
    audioResultGreen: 'ਇਸ ਜਾਂਚ ਵਿੱਚ ਕੋਈ ਚਿੰਤਾ ਦੀ ਗੱਲ ਨਹੀਂ ਮਿਲੀ। ਆਮ ਦੇਖਭਾਲ ਜਾਰੀ ਰੱਖੋ।',
    audioResultAmber: 'ਕੁਝ ਲੱਛਣਾਂ ਦੀ ਡਾਕਟਰ ਵੱਲੋਂ ਜਾਂਚ ਜ਼ਰੂਰੀ ਹੈ। ਤੁਹਾਡੀ ਆਸ਼ਾ ਵਰਕਰ ਸਹਾਇਤਾ ਕਰੇਗੀ।',
    audioResultRed: 'ਇਸ ਜਾਂਚ ਤੋਂ ਪਤਾ ਲੱਗਦਾ ਹੈ ਕਿ ਤੁਰੰਤ ਹਸਪਤਾਲ ਦੇ ਡਾਕਟਰ ਨੂੰ ਦਿਖਾਉਣਾ ਜ਼ਰੂਰੀ ਹੈ।',
    audioGreetingPhonetic: 'Sat Sri Akaal ASHA didi. Ajj tuhaade kshetar vich tinn mareezaan da follow-up baaki hai te do referral hospital report di udeek vich han.',
    audioSelectPathwayPhonetic: 'Kripa karke jaanch da tareeka chuno: chamdi, akh, chhaati ya khoon di report.',
    audioCameraGuidePhonetic: 'Mareejan nu changi kudrati roshni vich bithaao te camera sthir rakh ke photo lo.',
    audioResultGreenPhonetic: 'Is jaanch vich koi chinta di gall nahi mili. Aam dekhbhaal jaari rakkho.',
    audioResultAmberPhonetic: 'Kujh lachhanaan di doctor vallon jaanch zaroori hai. Tuhaadi ASHA didi sahayata karegi.',
    audioResultRedPhonetic: 'Is jaanch ton pata lagda hai ke turant hospital de doctor nu dikhaana zaroori hai.',
  },

  // 4. Tamil (தமிழ்)
  ta: {
    appTitle: 'ப்ராஜெக்ட் சாதி',
    tagline: 'பராமரிப்பிற்கு மிக அருகில். ஆரோக்கியத்தை நோக்கிய முதல் படி.',
    demoBadge: 'டெமோ பயன்முறை — மருத்துவ பயன்பாட்டிற்கு அல்ல',
    homeTitle: 'ஆஷா சுகாதார உதவியாளர்',
    registerTitle: 'நோயாளி பதிவு',
    consentTitle: 'நோயாளி சம்மதப் படிவம்',
    pathwaySelectTitle: 'பரிசோதனை வழியைத் தேர்ந்தெடுக்கவும்',
    skinScreeningTitle: 'தோல் அறிகுறி பரிசோதனை',
    eyeScreeningTitle: 'கண் மற்றும் விழித்திரை சோதனை',
    chestScreeningTitle: 'மார்பு மற்றும் காசநோய் சோதனை',
    bloodScreeningTitle: 'இரத்தப் பரிசோதனை (CBC)',
    resultTitle: 'பரிசோதனை முடிவு',
    referralsTitle: 'திறந்த பரிந்துரைகள்',
    timelineTitle: 'நோயாளி சுகாதார வரலாறு',
    followupsTitle: 'மறுபரிசீலனை மற்றும் பின்தொடர்தல்',
    settingsTitle: 'அமைப்புகள் மற்றும் ஒத்திசைவு',

    offlineStatusReady: 'ஆஃப்லைன் செயலில் உள்ளது • 3 பதிவுகள் ஒத்திசைவுக்குத் தயார்',
    todayTasksHeader: 'இன்றைய முக்கிய பணிகள் (Tasks)',
    followupTaskCount: '3 பேருக்கு மறுபரிசீலனை (Follow-up) தேவை',
    followupTaskDesc: 'கிராமம்: ராம்பூர் • 7 நாள் காலக்கெடு',
    openReferralsCount: '2 பரிந்துரைகள் மருத்துவமனை முடிவுக்கு காத்திருக்கின்றன',
    openReferralsDesc: 'நபா CHC • பின்தொடர்தல் வளையம் செயலில் உள்ளது',
    pendingBadge: 'நிலுவையில்',
    activeBadge: 'செயலில்',
    startScreening: 'பரிசோதனையைத் தொடங்குங்கள்',
    registerPatient: 'புதிய நோயாளியைப் பதிவு செய்க',
    patientTimeline: 'நோயாளி வரலாறு',
    syncAndLanguage: 'ஒத்திசைவு & மொழி',

    villageLabel: 'கிராமத்தின் பெயர்',
    ageLabel: 'வயது (ஆண்டுகளில்)',
    genderLabel: 'பாலினம்',
    phoneLabel: 'குடும்பத் தொடர்பு எண்',
    genderFemale: 'பெண்',
    genderMale: 'ஆண்',
    genderOther: 'மற்றவை',
    optionalPhotoNotice: 'தனியுரிமைப் பாதுகாப்பு: சிகிச்சை பெற புகைப்படம் கட்டாயமில்லை. பாதுகாப்பான குறியீடு வழங்கப்படும்.',
    takeOptionalPhoto: 'விருப்ப அடையாள புகைப்படம் எடுக்கவும்',
    photoAttached: 'புகைப்படம் இணைக்கப்பட்டது ✓',
    nextConsent: 'சம்மதம் மற்றும் தொடரவும்',
    consentNotice: 'சம்மதம் தெரிவிக்காத போதும் நோயாளிக்கு அவசர சிகிச்சை மறுக்கப்படாது.',
    consentCareTitle: '1. ஆரம்ப சுகாதார பரிசோதனை சம்மதம்',
    consentCareDesc: 'தோல், கண் அல்லது அறிகுறிகளுக்கான ஆரம்ப சோதனை.',
    consentReferralTitle: '2. மருத்துவமனை பரிந்துரை ஒருங்கிணைப்பு',
    consentReferralDesc: 'தேவைப்பட்டால் அரசு மருத்துவருடன் தகவலைப் பகிர்தல்.',
    consentSmsTitle: '3. குடும்பத்திற்கு தகவல் செய்தி (SMS)',
    consentSmsDesc: 'நேரம் மற்றும் தேதி மட்டுமே (நோய் பெயர் குறிப்பிடப்படாது).',
    consentResearchTitle: '4. கட்டாயமற்ற ஆராய்ச்சி பயன்பாடு',
    consentResearchDesc: 'பெயரற்ற ஆராய்ச்சி. சிகிச்சைக்கு கட்டாயமில்லை.',
    saveConsentAndSelect: 'சம்மதத்தை சேமித்து வழியைத் தேர்ந்தெடுக்கவும்',

    pathwaySkinTitle: 'தோல் அறிகுறி பரிசோதனை',
    pathwaySkinDesc: 'அசாதாரண புண்கள், விவரிக்க முடியாத தழும்புகள் அல்லது வெளிர்தல்.',
    pathwayEyeTitle: 'கண் மற்றும் விழித்திரை சோதனை',
    pathwayEyeDesc: 'நீரிழிவு நோயாளிகளுக்கான விழித்திரை பரிசோதனை (லென்ஸ் தேவை).',
    pathwayChestTitle: 'மார்பு மற்றும் காசநோய் சோதனை',
    pathwayChestDesc: 'டிஜிட்டல் எக்ஸ்ரே அல்லது 2 வார இருமல் நெறிமுறை.',
    pathwayBloodTitle: 'இரத்தப் பரிசோதனை (CBC Funnel)',
    pathwayBloodDesc: 'சிபிசி அளவுகள், பிளேட்லெட்டுகள் மற்றும் மைக்ரோஸ்கோப் ஆய்வு.',
    emergencyAlertBanner: 'கடுமையான மூச்சுத் திணறல் அல்லது மயக்கமா? 108 அவசர உதவி பெறவும்.',

    step1Of3: 'படி 1/3: பரிசோதனை வகையைத் தேர்வுசெய்க',
    step2Of3: 'படி 2/3: புகைப்படம் மற்றும் தரம் சரிபார்த்தல்',
    step3Of3: 'படி 3/3: முடிவு மற்றும் அடுத்த கட்டம்',
    cameraDistanceGuide: 'இயற்கை வெளிச்சத்தில் 15 செ.மீ தூரம் வைக்கவும்',
    cameraLightingGuide: 'Blur > 110 • கையை அசைக்காமல் புகைப்படம் எடுக்கவும்',
    qualityValidated: 'புகைப்படத் தரம் சரிபார்க்கப்பட்டது (Clear)',
    captureImage: 'புகைப்படம் எடுத்து சோதிக்கவும்',
    reviewResult: 'பரிசோதனை முடிவைக் காண்க',

    resultGreenTitle: 'இந்த பரிசோதனையில் கவலைக்கிடமான அறிகுறிகள் எதுவும் இல்லை.',
    resultGreenDesc: 'இந்த பரிசோதனையில் எந்த ஆபத்தான அறிகுறிகளும் கண்டறியப்படவில்லை. வழக்கமான பராமரிப்பைத் தொடரவும்.',
    resultAmberTitle: 'சில அறிகுறிகளுக்கு மருத்துவரின் பரிசோதனை தேவை.',
    resultAmberDesc: 'மீண்டும் ஒருமுறை பரிசோதிப்பது நல்லது. உங்கள் ஆஷா பணியாளர் வழிகாட்டுவார்.',
    resultRedTitle: 'உடனடியாக மருத்துவ பரிசோதனை செய்ய பரிந்துரைக்கப்படுகிறது.',
    resultRedDesc: 'மருத்துவரை உடனடியாகப் பார்க்க வேண்டும் என்பதை இது காட்டுகிறது. ஆஷா பணியாளர் பரிந்துரை செய்வார்.',
    resultDisclaimer: 'மருத்துவ வரம்பு: இது மருத்துவ நோயறிதல் அல்ல. பச்சை முடிவு நோய் முற்றிலும் இல்லை என்பதற்கு சான்றல்ல.',
    createReferral: 'மருத்துவமனை பரிந்துரையை உருவாக்கவும்',
    returnHome: 'முகப்பு பக்கத்திற்குத் திரும்புக',

    openReferralsHeader: 'திறந்த பரிந்துரைகள் (Follow-Through)',
    recordHospitalOutcome: 'மருத்துவமனை முடிவை பதிவு செய்க',
    closeLoopSuccess: 'பரிந்துரை முடிந்தது மற்றும் வளையம் நிறைவடைந்தது.',

    navHome: 'முகப்பு',
    navScreening: 'பரிசோதனை',
    navReferrals: 'பரிந்துரை',
    navSettings: 'அமைப்புகள்',

    audioGreeting: 'வணக்கம் ஆஷா பணியாளரே. இன்று உங்கள் பகுதியில் மூன்று பேருக்கு மறுபரிசீலனை உள்ளது மற்றும் இரண்டு பரிந்துரைகள் நிலுவையில் உள்ளன.',
    audioSelectPathway: 'தயவுசெய்து பரிசோதனை வழியைத் தேர்ந்தெடுக்கவும்: தோல், கண், மார்பு அல்லது இரத்த அறிக்கை.',
    audioCameraGuide: 'நோயாளியை நல்ல வெளிச்சத்தில் உட்கார வைத்து கேமராவை அசைக்காமல் படம் எடுக்கவும்.',
    audioResultGreen: 'இந்த பரிசோதனையில் எந்த ஆபத்தான அறிகுறிகளும் இல்லை. வழக்கமான கவனிப்பைத் தொடரவும்.',
    audioResultAmber: 'சில அறிகுறிகளுக்கு மருத்துவரின் பரிசோதனை தேவை. ஆஷா பணியாளர் வழிகாட்டுவார்.',
    audioResultRed: 'உடனடியாக அரசு மருத்துவரை அணுக வேண்டும் என இந்த சோதனை காட்டுகிறது.',
    audioGreetingPhonetic: 'Vanakkam ASHA sagothari. Indru ungal pagudhiyil moondru follow-up matrum irandu maruthuvamanai referrals kaathirukkindrana.',
    audioSelectPathwayPhonetic: 'Thoal, kan, maarbagam alladhu ratha pariseelanai vazhimuraiyai therindhedunkal.',
    audioCameraGuidePhonetic: 'Nalla velichathil amara vaithu, camera-vai asaikaamal padam edunkal.',
    audioResultGreenPhonetic: 'Indha pariseelanaiyil kavalaippadum alavukku aabathaana arikuri edhuvum illai. Vazhakkamaana gavanithalai thodaravum.',
    audioResultAmberPhonetic: 'Sila arikurigalukku maruthuvarin aalosanai thevaipadukiradhu. ASHA sagothari udhavuvaar.',
    audioResultRedPhonetic: 'Udanadiyaaga maruthuvamanai senru maruthuvarai sandhikka vendumena indha pariseelanai therivikkiradhu.',
  },

  // 5. Telugu (తెలుగు)
  te: {
    appTitle: 'ప్రాజెక్ట్ సాథీ',
    tagline: 'వైద్య సంరక్షణకు మరింత దగ్గరగా. ఆరోగ్యానికి ముందస్తు అడుగు.',
    demoBadge: 'డెమో మోడ్ — వైద్యపరమైన నిర్ధారణ కోసం కాదు',
    homeTitle: 'ఆశా ఆరోగ్య సహాయకురాలు',
    registerTitle: 'రోగి నమోదు',
    consentTitle: 'రోగి సమ్మతి పత్రం',
    pathwaySelectTitle: 'పరీక్షా మార్గాన్ని ఎంచుకోండి',
    skinScreeningTitle: 'చర్మ లక్షణాల పరీక్ష',
    eyeScreeningTitle: 'కంటి & రెటీనా పరీక్ష',
    chestScreeningTitle: 'ఛాతీ & క్షయ (TB) పరీక్ష',
    bloodScreeningTitle: 'రక్త పరీక్ష (CBC ఫన్నెల్)',
    resultTitle: 'పరీక్ష ఫలితం',
    referralsTitle: 'యాక్టివ్ రెఫరల్స్',
    timelineTitle: 'రోగి ఆరోగ్య చరిత్ర',
    followupsTitle: 'పునఃపరిశీలన మరియు ఫాలో-అప్',
    settingsTitle: 'సెట్టింగ్‌లు మరియు సింక్',

    offlineStatusReady: 'ఆఫ్‌లైన్ యాక్టివ్‌గా ఉంది • 3 రికార్డులు సింక్‌కు సిద్ధంగా ఉన్నాయి',
    todayTasksHeader: 'నేటి ముఖ్య పనులు (Today Tasks)',
    followupTaskCount: '3 మందికి తిరిగి తనిఖీ (Follow-up) అవసరం',
    followupTaskDesc: 'గ్రామం: రాంపూర్ • 7 రోజుల వ్యవధి',
    openReferralsCount: '2 రెఫరల్స్ ఆసుపత్రి ఫలితం కోసం వేచి ఉన్నాయి',
    openReferralsDesc: 'CHC నాభా • ఫాలో-త్రూ లూప్ యాక్టివ్‌గా ఉంది',
    pendingBadge: 'పెండింగ్',
    activeBadge: 'యాక్టివ్',
    startScreening: 'పరీక్ష ప్రారంభించండి (Start Screening)',
    registerPatient: 'కొత్త రోగిని నమోదు చేయండి',
    patientTimeline: 'రోగి చరిత్ర',
    syncAndLanguage: 'సింక్ & భాష',

    villageLabel: 'గ్రామం పేరు',
    ageLabel: 'వయస్సు (సంవత్సరాలలో)',
    genderLabel: 'లింగం',
    phoneLabel: 'కుటుంబ సంప్రదింపు ఫోన్ నంబర్',
    genderFemale: 'మహిళ',
    genderMale: 'పురుషుడు',
    genderOther: 'ఇతర',
    optionalPhotoNotice: 'గోప్యతా రక్షణ: చికిత్సకు ఫోటో తప్పనిసరి కాదు. సురక్షితమైన కోడ్ అందించబడుతుంది.',
    takeOptionalPhoto: 'ఐచ్ఛిక గుర్తింపు ఫోటో తీయండి',
    photoAttached: 'ఐచ్ఛిక ఫోటో జతచేయబడింది ✓',
    nextConsent: 'సమ్మతి మరియు ముందుకు సాగండి',
    consentNotice: 'సమ్మతి నిరాకరించినా రోగికి అత్యవసర సేవ లేదా వైద్యుని సంరక్షణ నిరాకరించబడదు.',
    consentCareTitle: '1. ప్రాథమిక స్క్రీనింగ్ సమ్మతి',
    consentCareDesc: 'చర్మం, కంటి లేదా లక్షణాల ప్రాథమిక పరీక్ష.',
    consentReferralTitle: '2. ఆసుపత్రి రెఫరల్ సమన్వయం',
    consentReferralDesc: 'లక్షణాలు కనిపిస్తే ప్రభుత్వ వైద్యుడితో వివరాలు పంచుకోవడం.',
    consentSmsTitle: '3. కుటుంబానికి సమాచార సందేశం (SMS)',
    consentSmsDesc: 'తేదీ మరియు సమయం మాత్రమే (వ్యాధి పేరు ప్రస్తావించబడదు).',
    consentResearchTitle: '4. ఐచ్ఛిక పరిశోధన ఉపయోగం',
    consentResearchDesc: 'గుర్తింపు లేని పరిశోధన. చికిత్సకు తప్పనిసరి కాదు.',
    saveConsentAndSelect: 'సమ్మతిని సేవ్ చేసి మార్గాన్ని ఎంచుకోండి',

    pathwaySkinTitle: 'చర్మ లక్షణాల పరీక్ష',
    pathwaySkinDesc: 'అసాధారణ పుండ్లు, గాయం లేని నీలి మచ్చలు లేదా పాలిపోవడం.',
    pathwayEyeTitle: 'కంటి & రెటీనా పరీక్ష',
    pathwayEyeDesc: 'మధుమేహం ఉన్న రోగులలో రెటీనా తనిఖీ (లెన్స్ అవసరం).',
    pathwayChestTitle: 'ఛాతీ & క్షయ (TB) పరీక్ష',
    pathwayChestDesc: 'డిజిటల్ ఎక్స్-రే లేదా 2 వారాల దగ్గు లక్షణాల ప్రోటోకాల్.',
    pathwayBloodTitle: 'రక్త పరీక్ష (CBC Funnel)',
    pathwayBloodDesc: 'సీబీసీ నివేదిక, ప్లేట్‌లెట్స్ మరియు మైక్రోస్కోప్ సమీక్ష.',
    emergencyAlertBanner: 'తీవ్రమైన శ్వాస సమస్య లేదా స్పృహ తప్పిపోయారా? 108 అత్యవసర సేవను సంప్రదించండి.',

    step1Of3: 'దశ 1/3: పరీక్ష రకాన్ని ఎంచుకోండి',
    step2Of3: 'దశ 2/3: ఫోటో మరియు నాణ్యత నిర్ధారణ',
    step3Of3: 'దశ 3/3: ఫలితం మరియు తదుపరి చర్య',
    cameraDistanceGuide: 'సహజ వెలుతురులో 15 సెం.మీ దూరం ఉంచండి',
    cameraLightingGuide: 'Blur > 110 • ఫోన్ స్థిరంగా పట్టుకుని ఫోటో తీయండి',
    qualityValidated: 'ఫోటో నాణ్యత నిర్ధారించబడింది (Sharp & Clear)',
    captureImage: 'ఫోటో తీసి తనిఖీ చేయండి',
    reviewResult: 'పరీక్ష ఫలితాన్ని చూడండి',

    resultGreenTitle: 'ఈ పరీక్షలో ఎటువంటి ఆందోళనకరమైన లక్షణాలు కనిపించలేదు.',
    resultGreenDesc: 'ఈ పరీక్షలో ఎటువంటి ప్రమాదకర లక్షణాలు కనుగొనబడలేదు. సాధారణ సంరక్షణను కొనసాగించండి.',
    resultAmberTitle: 'కొన్ని లక్షణాలను వైద్యుడు తనిఖీ చేయడం అవసరం.',
    resultAmberDesc: 'మరొకసారి తనిఖీ చేయించుకోవడం సహాయకరంగా ఉంటుంది. మీ ఆశా కార్యకర్త మార్గదర్శనం చేస్తుంది.',
    resultRedTitle: 'వెంటనే వైద్యుడిని సంప్రదించాలని సిఫార్సు చేయబడింది.',
    resultRedDesc: 'వెంటనే ఆసుపత్రి వైద్యుడిని సంప్రదించాలని ఈ పరీక్ష సూచిస్తుంది. ఆశా కార్యకర్త రెఫరల్ ఏర్పాటు చేస్తుంది.',
    resultDisclaimer: 'వైద్య పరిమితి: ఇది వ్యాధి నిర్ధారణ కాదు. గ్రీన్ ఫలితం వ్యాధి పూర్తిగా లేదని హామీ ఇవ్వదు.',
    createReferral: 'ఆసుపత్రి రెఫరల్ సృష్టించండి',
    returnHome: 'ఆశా హోమ్ పేజీకి తిరిగి వెళ్లండి',

    openReferralsHeader: 'యాక్టివ్ రెఫరల్స్ (Follow-Through)',
    recordHospitalOutcome: 'ఆసుపత్రి ఫలితాన్ని నమోదు చేయండి',
    closeLoopSuccess: 'రెఫరల్ పూర్తయింది మరియు ఫాలో-త్రూ లూప్ ముగిసింది.',

    navHome: 'హోమ్',
    navScreening: 'స్క్రీనింగ్',
    navReferrals: 'రెఫరల్స్',
    navSettings: 'సెట్టింగ్‌లు',

    audioGreeting: 'నమస్కారం ఆశా కార్యకర్త. ఈరోజు మీ ప్రాంతంలో మూడు ఫాలో-అప్‌లు మరియు రెండు ఆసుపత్రి రెఫరల్స్ వేచి ఉన్నాయి.',
    audioSelectPathway: 'దయచేసి పరీక్షా మార్గాన్ని ఎంచుకోండి: చర్మం, కన్ను, ఛాతీ లేదా రక్త నివేదిక.',
    audioCameraGuide: 'రోగిని తగినంత సహజ కాంతిలో కూర్చోబెట్టి ఫోన్ కదలకుండా ఫోటో తీయండి.',
    audioResultGreen: 'ఈ పరీక్షలో ఎటువంటి ఆందోళనకరమైన లక్షణాలు కనిపించలేదు. సాధారణ సంరక్షణ కొనసాగించండి.',
    audioResultAmber: 'కొన్ని లక్షణాలను డాక్టర్ పరిశీలించాల్సిన అవసరం ఉంది. ఆశా కార్యకర్త సహాయం చేస్తుంది.',
    audioResultRed: 'వెంటనే ఆసుపత్రి వైద్యుడిని సంప్రదించాలని ఈ పరీక్ష సూచిస్తుంది.',
    audioGreetingPhonetic: 'Namaskaram ASHA didi. Eeroju mee praanthamlo moodu follow-up mariyu rendu hospital referrals unnaayi.',
    audioSelectPathwayPhonetic: 'Dayachesi pariksha vidhaanaanni empika cheyandi: charmam, kannu, chaathi leda raktha pariksha.',
    audioCameraGuidePhonetic: 'Rogini manchi veluthurulo koorchobetti camera kadalchani photo theeyandi.',
    audioResultGreenPhonetic: 'Ee screening lo elanti aandholanakara lakshanaalu kanipinchaledu. Saadaarana samrakshana konasaaginchandi.',
    audioResultAmberPhonetic: 'Konni lakshanaala kosam doctor sampradhimpu avasaram. ASHA didi maargadarshakam chesthaaru.',
    audioResultRedPhonetic: 'Ventane aaspathri doctor nu kalisi pariksha cheyinchukovaalani ee pariksha soochisthondi.',
  },

  // 6. Bengali (বাংলা)
  bn: {
    appTitle: 'প্রজেক্ট সাথী',
    tagline: 'চিকিৎসার একটু কাছে। সুস্থতার দিকে এক ধাপ এগিয়ে।',
    demoBadge: 'ডেমো মোড — ক্লিনিকাল নির্ণয়ের জন্য নয়',
    homeTitle: 'আশা স্বাস্থ্য সহকারী',
    registerTitle: 'রোগী নিবন্ধন',
    consentTitle: 'রোগীর সম্মতিপত্র',
    pathwaySelectTitle: 'পরীক্ষার পদ্ধতি নির্বাচন করুন',
    skinScreeningTitle: 'ত্বকের লক্ষণ পরীক্ষা',
    eyeScreeningTitle: 'চোখ ও রেটিনা পরীক্ষা',
    chestScreeningTitle: 'বুক ও যক্ষ্মা পরীক্ষা',
    bloodScreeningTitle: 'রক্ত পরীক্ষা (CBC ফানেল)',
    resultTitle: 'স্ক্রীনিং ফলাফল',
    referralsTitle: 'খোলা রেফারেল',
    timelineTitle: 'রোগীর স্বাস্থ্য ইতিহাস',
    followupsTitle: 'পুনরায় পরীক্ষা ও ফলো-আপ',
    settingsTitle: 'সেটিংস এবং সিঙ্ক',

    offlineStatusReady: 'অফলাইন সক্রিয় • ৩টি রেকর্ড সিঙ্কের জন্য প্রস্তুত',
    todayTasksHeader: 'আজকের প্রধান কাজ (Tasks)',
    followupTaskCount: '৩ জনের পুনরায় পরীক্ষা (Follow-up) প্রয়োজন',
    followupTaskDesc: 'গ্রাম: রামপুর • ৭ দিনের সময়সীমা',
    openReferralsCount: '২টি রেফারেল হাসপাতালের ফলাফলের অপেক্ষায় আছে',
    openReferralsDesc: 'সিএইচসি নাভা • ফলো-থ্রু লুপ সক্রিয়',
    pendingBadge: 'মুলতুবি',
    activeBadge: 'সক্রিয়',
    startScreening: 'পরীক্ষা শুরু করুন (Start Screening)',
    registerPatient: 'নতুন রোগী নিবন্ধন করুন',
    patientTimeline: 'রোগীর ইতিহাস',
    syncAndLanguage: 'সিঙ্ক ও ভাষা',

    villageLabel: 'গ্রামের নাম',
    ageLabel: 'বয়স (বছরে)',
    genderLabel: 'লিঙ্গ',
    phoneLabel: 'পারিবারিক যোগাযোগের ফোন',
    genderFemale: 'মহিলা',
    genderMale: 'পুরুষ',
    genderOther: 'অন্যান্য',
    optionalPhotoNotice: 'গোপনীয়তা সুরক্ষা: চিকিৎসার জন্য ছবি বাধ্যতামূলক নয়। একটি নিরাপদ কোড প্রদান করা হবে।',
    takeOptionalPhoto: 'ঐচ্ছিক শনাক্তকরণ ছবি তুলুন',
    photoAttached: 'ছবি সংযুক্ত হয়েছে ✓',
    nextConsent: 'সম্মতি ও পরবর্তী ধাপ',
    consentNotice: 'সম্মতি না দিলেও রোগীকে জরুরি চিকিৎসা পরিষেবা থেকে বঞ্চিত করা যাবে না।',
    consentCareTitle: '১. প্রাথমিক স্বাস্থ্য পরীক্ষার সম্মতি',
    consentCareDesc: 'ত্বক, চোখ বা লক্ষণের প্রাথমিক স্ক্রীনিং।',
    consentReferralTitle: '২. হাসপাতাল রেফারেল সমন্বয়',
    consentReferralDesc: 'লক্ষণ দেখা দিলে সরকারি চিকিৎসকের সাথে তথ্য ভাগ করে নেওয়া।',
    consentSmsTitle: '৩. পরিবারকে তথ্য বার্তা (SMS)',
    consentSmsDesc: 'শুধুমাত্র তারিখ ও সময় (কোনো রোগের নাম উল্লেখ থাকবে না)।',
    consentResearchTitle: '৪. অ-বাধ্যতামূলক গবেষণা ব্যবহার',
    consentResearchDesc: 'নামহীন গবেষণা। চিকিৎসার জন্য বাধ্যতামূলক নয়।',
    saveConsentAndSelect: 'সম্মতি সংরক্ষণ করুন এবং পদ্ধতি বাছুন',

    pathwaySkinTitle: 'ত্বকের লক্ষণ পরীক্ষা',
    pathwaySkinDesc: 'অস্বাভাবিক ক্ষত, নীলচে দাগ বা ফ্যাকাশে ভাব।',
    pathwayEyeTitle: 'চোখ ও রেটিনা পরীক্ষা',
    pathwayEyeDesc: 'ডায়াবেটিস রোগীদের রেটিনা পরীক্ষা (লেন্স প্রয়োজন)।',
    pathwayChestTitle: 'বুক ও যক্ষ্মা পরীক্ষা',
    pathwayChestDesc: 'ডিজিটাল এক্স-রে বা ২ সপ্তাহের কাশির প্রোটোকল।',
    pathwayBloodTitle: 'রক্ত পরীক্ষা (CBC Funnel)',
    pathwayBloodDesc: 'সিবিসি মান, প্লেটলেট ও মাইক্রোস্কোপ স্লাইড পর্যালোচনা।',
    emergencyAlertBanner: 'মারাত্মক শ্বাসকষ্ট বা অজ্ঞান হয়ে গেছেন? ১০৮ জরুরি নম্বরে যোগাযোগ করুন।',

    step1Of3: 'ধাপ ১/৩: স্ক্রীনিং প্রকার বাছুন',
    step2Of3: 'ধাপ ২/৩: ছবি ও গুণমান যাচাই',
    step3Of3: 'ধাপ ৩/৩: ফলাফল ও পরবর্তী পদক্ষেপ',
    cameraDistanceGuide: 'প্রাকৃতিক আলোতে ১৫ সেমি দূরত্ব রাখুন',
    cameraLightingGuide: 'Blur > 110 • হাত স্থির রেখে ছবি তুলুন',
    qualityValidated: 'ছবির গুণমান যাচাই করা হয়েছে (Clear)',
    captureImage: 'ছবি তুলুন ও যাচাই করুন',
    reviewResult: 'পরীক্ষার ফলাফল দেখুন',

    resultGreenTitle: 'এই পরীক্ষায় উদ্বেগের কোনো লক্ষণ দেখা যায়নি।',
    resultGreenDesc: 'এই পরীক্ষায় কোনো আশঙ্কাজনক লক্ষণ পাওয়া যায়নি। স্বাভাবিক যত্ন চালিয়ে যান এবং আশাকর্মীর পরামর্শ মানুন।',
    resultAmberTitle: 'কিছু লক্ষণের জন্য চিকিৎসকের পরামর্শ প্রয়োজন।',
    resultAmberDesc: 'আরেকবার পরীক্ষা করানো সহায়ক হতে পারে। আপনার আশাকর্মী আপনাকে বুঝিয়ে দেবেন।',
    resultRedTitle: 'অবিলম্বে চিকিৎসকের পরামর্শ নেওয়ার নির্দেশ দেওয়া হচ্ছে।',
    resultRedDesc: 'এই পরীক্ষা ইঙ্গিত দেয় যে দ্রুত হাসপাতালে ডাক্তার দেখানো জরুরি। আশাকর্মী রেফারেলের ব্যবস্থা করবেন।',
    resultDisclaimer: 'ক্লিনিকাল সীমা: এটি কোনো চূড়ান্ত রোগ নির্ণয় নয়। সবুজ ফলাফলও রোগের সম্পূর্ণ অনুপস্থিতির প্রমাণ নয়।',
    createReferral: 'হাসপাতাল রেফারেল তৈরি করুন',
    returnHome: 'হোম পেজে ফিরে যান',

    openReferralsHeader: 'সক্রিয় খোলা রেফারেল (Follow-Through)',
    recordHospitalOutcome: 'হাসপাতালের ফলাফল নথিভুক্ত করুন',
    closeLoopSuccess: 'রেফারেল সম্পন্ন হয়েছে এবং ফলো-থ্রু লুপ সমাপ্ত হয়েছে।',

    navHome: 'হোম',
    navScreening: 'স্ক্রীনিং',
    navReferrals: 'রেফারেল',
    navSettings: 'সেটিংস',

    audioGreeting: 'নমস্কার আশা দিদি। আজ আপনার এলাকায় তিন জনের ফলো-আপ এবং দুটি হাসপাতালের রেফারেল বাকি আছে।',
    audioSelectPathway: 'অনুগ্রহ করে পরীক্ষার ধরন বাছুন: ত্বক, চোখ, বুক বা রক্তের রিপোর্ট।',
    audioCameraGuide: 'রোগীকে পর্যাপ্ত প্রাকৃতিক আলোতে বসিয়ে হাত স্থির রেখে ছবি তুলুন।',
    audioResultGreen: 'এই পরীক্ষায় কোনো ভয়ের কারণ মেলেনি। স্বাভাবিক যত্ন চালিয়ে যান।',
    audioResultAmber: 'কিছু লক্ষণের জন্য ডাক্তার দেখানো প্রয়োজন। আশাকর্মী আপনাকে সাহায্য করবেন।',
    audioResultRed: 'দ্রুত হাসপাতালে চিকিৎসকের পরামর্শ নেওয়া জরুরি বলে এই পরীক্ষায় দেখা যাচ্ছে।',
    audioGreetingPhonetic: 'Nomoshkar ASHA didi. Aaji aapnar elakaay teen joner follow-up ebong duti hospital referral baaki aachhe.',
    audioSelectPathwayPhonetic: 'Onugroho kore jaanch podhdhoti baachhun: chaamra, chokh, buuk ba rokter report.',
    audioCameraGuidePhonetic: 'Rogike bhalo aalote bosiye camera sthir rekhe chobi tulun.',
    audioResultGreenPhonetic: 'Ei screening e kono udvegjonok lokkhon dhora poreni. Shaadhaaron jotno chaaliye jaan.',
    audioResultAmberPhonetic: 'Kichhu lokkhoner jonno daktarer poramorsho proyojon. ASHA didi sahajjo korben.',
    audioResultRedPhonetic: 'Ei screening nirdesh kore je druto hospital e daktaar dekhano dorkar.',
  },

  // 7. Marathi (मराठी)
  mr: {
    appTitle: 'प्रोजेक्ट साथी',
    tagline: 'काळजीच्या थोडे जवळ. आरोग्याकडे एक पाऊल आधी.',
    demoBadge: 'डेमो मोड — वैद्यकीय निदानासाठी नाही',
    homeTitle: 'आशा आरोग्य सहाय्यक',
    registerTitle: 'रुग्ण नोंदणी',
    consentTitle: 'रुग्ण संमती पत्र',
    pathwaySelectTitle: 'तपासणीचा मार्ग निवडा',
    skinScreeningTitle: 'त्वचा लक्षण तपासणी',
    eyeScreeningTitle: 'डोळे व रेटिना तपासणी',
    chestScreeningTitle: 'छाती व टीबी तपासणी',
    bloodScreeningTitle: 'रक्त तपासणी (CBC फनेल)',
    resultTitle: 'तपासणी निकाल',
    referralsTitle: 'खुले संदर्भ (Referrals)',
    timelineTitle: 'रुग्ण आरोग्य इतिहास',
    followupsTitle: 'पुनर्तपासणी आणि पाठपुरावा',
    settingsTitle: 'सेटिंग्ज आणि सिंक',

    offlineStatusReady: 'ऑफलाइन सक्रिय • ३ रेकॉर्ड सिंकसाठी तयार',
    todayTasksHeader: 'आजची महत्त्वाची कामे (Tasks)',
    followupTaskCount: '३ रुग्णांची पुनर्तपासणी (Follow-up) आवश्यक',
    followupTaskDesc: 'गाव: रामपूर • ७ दिवसांची मुदत',
    openReferralsCount: '२ संदर्भ रुग्णालय निकालाच्या प्रतीक्षेत आहेत',
    openReferralsDesc: 'सीएचसी नाभा • फॉलो-थ्रू लूप सक्रिय',
    pendingBadge: 'प्रलंबित',
    activeBadge: 'सक्रिय',
    startScreening: 'तपासणी सुरू करा (Start Screening)',
    registerPatient: 'नवीन रुग्ण नोंदवा (Register)',
    patientTimeline: 'रुग्ण इतिहास',
    syncAndLanguage: 'सिंक आणि भाषा',

    villageLabel: 'गावाचे नाव',
    ageLabel: 'वय (वर्षे)',
    genderLabel: 'लिंग',
    phoneLabel: 'कुटुंबाचा संपर्क फोन नंबर',
    genderFemale: 'महिला',
    genderMale: 'पुरुष',
    genderOther: 'इतर',
    optionalPhotoNotice: 'गोपनीयता संरक्षण: उपचारासाठी फोटो अनिवार्य नाही. सुरक्षित कोड दिला जाईल.',
    takeOptionalPhoto: 'पर्यायी ओळख फोटो घ्या',
    photoAttached: 'फोटो जोडला गेला ✓',
    nextConsent: 'संमती आणि पुढे जा',
    consentNotice: 'संमती नाकारली तरी रुग्णाला प्राथमिक किंवा आपत्कालीन उपचारांपासून वंचित ठेवले जाणार नाही.',
    consentCareTitle: '१. प्राथमिक आरोग्य तपासणी संमती',
    consentCareDesc: 'त्वचा, डोळे किंवा लक्षणांची प्राथमिक तपासणी.',
    consentReferralTitle: '२. रुग्णालय संदर्भ समन्वय',
    consentReferralDesc: 'लक्षणे आढळल्यास सरकारी डॉक्टरांशी माहिती शेअर करणे.',
    consentSmsTitle: '३. कुटुंबासाठी माहिती संदेश (SMS)',
    consentSmsDesc: 'केवळ वेळ व तारीख (कोणत्याही आजाराचे नाव नाही).',
    consentResearchTitle: '४. गैर-अनिवार्य संशोधन वापर',
    consentResearchDesc: 'निनावी संशोधन वापर. उपचारासाठी अनिवार्य नाही.',
    saveConsentAndSelect: 'संमती जतन करा आणि मार्ग निवडा',

    pathwaySkinTitle: 'त्वचा लक्षण तपासणी',
    pathwaySkinDesc: 'असामान्य जखमा, निळे डाग किंवा फिकटपणा.',
    pathwayEyeTitle: 'डोळे व रेटिना तपासणी',
    pathwayEyeDesc: 'मधुमेह रुग्णांमध्ये डोळ्यांच्या पडद्याची तपासणी (लेन्स आवश्यक).',
    pathwayChestTitle: 'छाती व टीबी तपासणी',
    pathwayChestDesc: 'डिजिटल क्ष-किरण किंवा २ आठवड्यांचा खोकला प्रोटोकॉल.',
    pathwayBloodTitle: 'रक्त तपासणी (CBC Funnel)',
    pathwayBloodDesc: 'सीबीसी मूल्ये, प्लेटलेट्स आणि सूक्ष्मदर्शक स्लाईड पुनरावलोकन.',
    emergencyAlertBanner: 'श्वास घेण्यास तीव्र त्रास किंवा बेशुद्धी आहे का? १०८ आपत्कालीन मदत घ्या.',

    step1Of3: 'टप्पा १/३: तपासणी प्रकार निवडा',
    step2Of3: 'टप्पा २/३: फोटो आणि गुणवत्ता पडताळणी',
    step3Of3: 'टप्पा ३/३: निकाल आणि पुढील पाऊल',
    cameraDistanceGuide: 'नैसर्गिक प्रकाशात १५ सेंमी अंतर ठेवा',
    cameraLightingGuide: 'Blur > 110 • हात स्थिर ठेवून फोटो काढा',
    qualityValidated: 'फोटो गुणवत्ता पडताळली गेली (Clear)',
    captureImage: 'फोटो काढा आणि तपासा',
    reviewResult: 'तपासणी निकाल पहा',

    resultGreenTitle: 'या तपासणीत कोणतीही चिंताजनक लक्षणे आढळली नाहीत.',
    resultGreenDesc: 'या तपासणीत काळजीचे कोणतेही लक्षण आढळले नाही. नेहमीची काळजी सुरू ठेवा आणि आशा कार्यकर्तीचा सल्ला घ्या.',
    resultAmberTitle: 'काही लक्षणांची डॉक्टरांकडून तपासणी आवश्यक आहे.',
    resultAmberDesc: 'पुन्हा एकदा तपासणी करून घेणे उपयुक्त ठरेल. तुमची आशा ताई मार्गदर्शन करेल.',
    resultRedTitle: 'त्वरित डॉक्टरांकडून तपासणी करून घेण्याचा सल्ला दिला जातो.',
    resultRedDesc: 'तातडीने सरकारी रुग्णालयात डॉक्टरांना दाखवणे आवश्यक असल्याचे ही तपासणी दर्शवते.',
    resultDisclaimer: 'वैद्यकीय मर्यादा: हे कोणतेही अंतिम निदान नाही. हिरवा निकाल हा आजार पूर्णपणे नसल्याचा पुरावा नाही.',
    createReferral: 'रुग्णालय संदर्भ तयार करा',
    returnHome: 'होम स्क्रीनवर परत जा',

    openReferralsHeader: 'सक्रिय खुले संदर्भ (Follow-Through)',
    recordHospitalOutcome: 'रुग्णालय निकाल नोंदवा',
    closeLoopSuccess: 'संदर्भ पूर्ण झाला आणि क्लिनिकल लूप यशस्वीपणे समाप्त झाला.',

    navHome: 'होम',
    navScreening: 'तपासणी',
    navReferrals: 'संदर्भ',
    navSettings: 'सेटिंग्ज',

    audioGreeting: 'नमस्कार आशा ताई. आज तुमच्या भागात तीन जणांचा पाठपुरावा बाकी आहे आणि दोन रुग्णालयाचे निकाल प्रलंबित आहेत.',
    audioSelectPathway: 'कृपया तपासणीचा प्रकार निवडा: त्वचा, डोळे, छाती किंवा रक्त तपासणी.',
    audioCameraGuide: 'रुग्णाला चांगल्या नैसर्गिक प्रकाशात बसवून कॅमेरा स्थिर धरून फोटो घ्या.',
    audioResultGreen: 'या तपासणीत काळजीचे कोणतेही कारण आढळले नाही. नियमित काळजी सुरू ठेवा.',
    audioResultAmber: 'काही लक्षणांसाठी डॉक्टरांना दाखवणे आवश्यक आहे. आशा ताई मदत करेल.',
    audioResultRed: 'तातडीने सरकारी रुग्णालयातील डॉक्टरांना दाखवणे आवश्यक आहे.',
    audioGreetingPhonetic: 'Namaskar ASHA tai. Aaj aaplya bhagaat teen lokancha pathpurava aani don rugnalay referrals baki aahet.',
    audioSelectPathwayPhonetic: 'Kripaya tapasnicha prakar nivaada: twacha, dola, chhaati kinva rakta tapasni.',
    audioCameraGuidePhonetic: 'Rugnala chaanglya prakaashaat basva aani camera sthir thevun photo ghya.',
    audioResultGreenPhonetic: 'Ya tapasnit konthihi chintajanak lakshane aadhalli naahit. Niyameet kaalji suru theva.',
    audioResultAmberPhonetic: 'Kaahi lakshanaansathi doctorancha salla aavashyak aahe. ASHA tai madat kartil.',
    audioResultRedPhonetic: 'Taatdine sarkari rugnalayat jaun doctoranna dakhavne aavashyak aahe.',
  },

  // 8. Gujarati (ગુજરાતી)
  gu: {
    appTitle: 'પ્રોજેક્ટ સાથી',
    tagline: 'સંભાળની થોડી નજીક. સ્વાસ્થ્ય તરફ એક પગલું વહેલા.',
    demoBadge: 'ડેમો મોડ — તબીબી નિદાન માટે નથી',
    homeTitle: 'આશા આરોગ્ય સહાયક',
    registerTitle: 'દર્દી નોંધણી',
    consentTitle: 'દર્દી સંમતિ પત્રક',
    pathwaySelectTitle: 'તપાસ પદ્ધતિ પસંદ કરો',
    skinScreeningTitle: 'ત્વચા લક્ષણ તપાસ',
    eyeScreeningTitle: 'આંખ અને રેટિના તપાસ',
    chestScreeningTitle: 'છાતી અને ટીબી તપાસ',
    bloodScreeningTitle: 'લોહી તપાસ (CBC ફનલ)',
    resultTitle: 'સ્ક્રીનીંગ પરિણામ',
    referralsTitle: 'ખુલ્લા રેફરલ',
    timelineTitle: 'દર્દી સ્વાસ્થ્ય ઇતિહાસ',
    followupsTitle: 'ફરીથી તપાસ અને ફોલો-અપ',
    settingsTitle: 'સેટિંગ્સ અને સિંક',

    offlineStatusReady: 'ઑફલાઇન સક્રિય • ૩ રેકોર્ડ્સ સિંક માટે તૈયાર',
    todayTasksHeader: 'આજના મુખ્ય કાર્યો (Tasks)',
    followupTaskCount: '૩ દર્દીઓની ફરી તપાસ (Follow-up) જરૂરી',
    followupTaskDesc: 'ગામ: રામપુર • ૭ દિવસની સમયમર્યાદા',
    openReferralsCount: '૨ રેફરલ હોસ્પિટલ પરિણામની રાહ જોઈ રહ્યા છે',
    openReferralsDesc: 'સીએચસી નાભા • ફોલો-થ્રૂ લૂપ સક્રિય',
    pendingBadge: 'બાકી',
    activeBadge: 'સક્રિય',
    startScreening: 'તપાસ શરૂ કરો (Start Screening)',
    registerPatient: 'નવા દર્દીની નોંધણી કરો',
    patientTimeline: 'દર્દી ઇતિહાસ',
    syncAndLanguage: 'સિંક અને ભાષા',

    villageLabel: 'ગામનું નામ',
    ageLabel: 'ઉંમર (વર્ષમાં)',
    genderLabel: 'જાતિ (Gender)',
    phoneLabel: 'પરિવારનો સંપર્ક ફોન નંબર',
    genderFemale: 'સ્ત્રી',
    genderMale: 'પુરુષ',
    genderOther: 'અન્ય',
    optionalPhotoNotice: 'ગોપનીયતા સુરક્ષા: સારવાર માટે ફોટો ફરજિયાત નથી. સુરક્ષિત કોડ આપવામાં આવશે.',
    takeOptionalPhoto: 'વૈકલ્પિક ઓળખ ફોટો લો',
    photoAttached: 'ફોટો જોડાયેલ છે ✓',
    nextConsent: 'સંમતિ અને આગળ વધો',
    consentNotice: 'સંમતિ ન આપવા છતાં દર્દીને પ્રાથમિક અથવા કટોકટી સારવારથી વંચિત રાખી શકાય નહીં.',
    consentCareTitle: '૧. પ્રાથમિક આરોગ્ય તપાસ સંમતિ',
    consentCareDesc: 'ત્વચા, આંખ અથવા લક્ષણોની પ્રાથમિક તપાસ.',
    consentReferralTitle: '૨. હોસ્પિટલ રેફરલ સંકલન',
    consentReferralDesc: 'લક્ષણો જણાય તો સરકારી ડૉક્ટર સાથે વિગતો વહેંચવી.',
    consentSmsTitle: '૩. પરિવારને માહિતી સંદેશ (SMS)',
    consentSmsDesc: 'માત્ર સમય અને તારીખ (કોઈ રોગનું નામ દર્શાવવામાં આવશે નહીં).',
    consentResearchTitle: '૪. બિન-ફરજિયાત સંશોધન ઉપયોગ',
    consentResearchDesc: 'અનામી સંશોધન. સારવાર માટે ફરજિયાત નથી.',
    saveConsentAndSelect: 'સંમતિ સાચવો અને પદ્ધતિ પસંદ કરો',

    pathwaySkinTitle: 'ત્વચા લક્ષણ તપાસ',
    pathwaySkinDesc: 'અસામાન્ય ઘા, નીલા નિશાન કે પીળાશ.',
    pathwayEyeTitle: 'આંખ અને રેટિના તપાસ',
    pathwayEyeDesc: 'ડાયાબિટીસ દર્દીઓમાં રેટિના તપાસ (લેન્સ જરૂરી).',
    pathwayChestTitle: 'છાતી અને ટીબી તપાસ',
    pathwayChestDesc: 'ડિજિટલ એક્સ-રે અથવા ૨ અઠવાડિયાની ખાંસી પ્રોટોકોલ.',
    pathwayBloodTitle: 'લોહી તપાસ (CBC Funnel)',
    pathwayBloodDesc: 'સીબીસી પરિણામો, પ્લેટલેટ્સ અને સ્લાઇડ તપાસ.',
    emergencyAlertBanner: 'શ્વાસ લેવામાં ભારે તકલીફ કે બેભાન અવસ્થા છે? ૧૦૮ ઇમરજન્સી સેવાનો સંપર્ક કરો.',

    step1Of3: 'પગલું ૧/૩: તપાસ પ્રકાર પસંદ કરો',
    step2Of3: 'પગલું ૨/૩: ફોટો અને ગુણવત્તા ચકાસણી',
    step3Of3: 'પગલું ૩/૩: પરિણામ અને આગળનું પગલું',
    cameraDistanceGuide: 'કુદરતી પ્રકાશમાં ૧૫ સેમી અંતર રાખો',
    cameraLightingGuide: 'Blur > 110 • હાથ સ્થિર રાખીને ફોટો લો',
    qualityValidated: 'ફોટો ગુણવત્તા પ્રમાણિત (Clear)',
    captureImage: 'ફોટો લો અને તપાસો',
    reviewResult: 'તપાસ પરિણામ જુઓ',

    resultGreenTitle: 'આ તપાસમાં કોઈ ચિંતાજનક લક્ષણ જણાયું નથી.',
    resultGreenDesc: 'આ તપાસમાં કોઈ જોખમી લક્ષણ મળ્યું નથી. નિયમિત સંભાળ ચાલુ રાખો અને આશા બહેનની સલાહ લો.',
    resultAmberTitle: 'કેટલાક લક્ષણો માટે ડૉક્ટર દ્વારા તપાસ જરૂરી છે.',
    resultAmberDesc: 'ફરી એકવાર તપાસ કરાવવી મદદરૂપ થઈ શકે છે. તમારા આશા કાર્યકર આગળ માર્ગદર્શન આપશે.',
    resultRedTitle: 'ત્વરિત ડૉક્ટર પાસે તપાસ કરાવવાની ભલામણ કરવામાં આવે છે.',
    resultRedDesc: 'તરત જ સરકારી હોસ્પિટલમાં ડૉક્ટરને બતાવવું જરૂરી છે. આશા કાર્યકર રેફરલ ગોઠવશે.',
    resultDisclaimer: 'તબીબી મર્યાદા: આ કોઈ અંતિમ નિદાન નથી. લીલું પરિણામ રોગની સંપૂર્ણ ગેરહાજરીની ખાતરી આપતું નથી.',
    createReferral: 'હોસ્પિટલ રેફરલ બનાવો',
    returnHome: 'હોમ પેજ પર પાછા ફરો',

    openReferralsHeader: 'સક્રિય ખુલ્લા રેફરલ (Follow-Through)',
    recordHospitalOutcome: 'હોસ્પિટલ પરિણામ નોંધો',
    closeLoopSuccess: 'રેફરલ પૂર્ણ થયું અને લૂપ સફળતાપૂર્વક બંધ થયું.',

    navHome: 'હોમ',
    navScreening: 'સ્ક્રીનીંગ',
    navReferrals: 'રેફરલ',
    navSettings: 'સેટિંગ્સ',

    audioGreeting: 'નમસ્તે આશા બહેન. આજે તમારા વિસ્તારમાં ત્રણ લોકોનું ફોલો-અપ બાકી છે અને બે રેફરલ રિપોર્ટની રાહ જોઈ રહ્યા છે.',
    audioSelectPathway: 'કૃપા કરીને તપાસનો પ્રકાર પસંદ કરો: ત્વચા, આંખ, છાતી અથવા લોહીની તપાસ.',
    audioCameraGuide: 'દર્દીને સારા કુદરતી પ્રકાશમાં બેસાડીને કૅમેરા સ્થિર રાખી ફોટો લો.',
    audioResultGreen: 'આ તપાસમાં કોઈ ચિંતાજનક બાબત નથી. સામાન્ય સંભાળ ચાલુ રાખો.',
    audioResultAmber: 'કેટલાક લક્ષણો માટે ડૉક્ટરની સલાહ લેવી જરૂરી છે.',
    audioResultRed: 'તરત જ સરકારી હોસ્પિટલના ડૉક્ટરનો સંપર્ક કરવો જરૂરી છે.',
    audioGreetingPhonetic: 'Namaste ASHA bahen. Aaje tamara vistar ma tran lokonu follow-up ane be hospital referrals baki chhe.',
    audioSelectPathwayPhonetic: 'Krupa kari ne tapas no prakar pasand karo: chamdi, aankh, chhaati athva lohi ni tapas.',
    audioCameraGuidePhonetic: 'Dardine saara prakaash ma besaadi ne camera sthir raakhi photo lo.',
    audioResultGreenPhonetic: 'Aa tapas ma koi chintajanak lakshan maliyu nathi. Saamaanya sambhaal chaalu raakho.',
    audioResultAmberPhonetic: 'Ketlaak lakshano maate doctor ni tapas jaroori chhe. ASHA bahen margadarshan aapshe.',
    audioResultRedPhonetic: 'Taatkaalik sarkari hospital ma doctor ne batavavu aavashyak chhe.',
  },

  // 9. Kannada (ಕನ್ನಡ)
  kn: {
    appTitle: 'ಪ್ರಾಜೆಕ್ಟ್ ಸಾಥಿ',
    tagline: 'ಆರೈಕೆಗೆ ಹತ್ತಿರ. ಆರೋಗ್ಯದತ್ತ ಮೊದಲ ಹೆಜ್ಜೆ.',
    demoBadge: 'ಡೆಮೊ ಮೋಡ್ — ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯಕ್ಕಾಗಿ ಅಲ್ಲ',
    homeTitle: 'ಆಶಾ ಆರೋಗ್ಯ ಸಹಾಯಕ',
    registerTitle: 'ರೋಗಿ ನೋಂದಣಿ',
    consentTitle: 'ರೋಗಿ ಸಮ್ಮತಿ ಪತ್ರ',
    pathwaySelectTitle: 'ಪರೀಕ್ಷಾ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    skinScreeningTitle: 'ಚರ್ಮದ ಲಕ್ಷಣ ತಪಾಸಣೆ',
    eyeScreeningTitle: 'ಕಣ್ಣು ಮತ್ತು ರೆಟಿನಾ ತಪಾಸಣೆ',
    chestScreeningTitle: 'ಎದೆ ಮತ್ತು ಕ್ಷಯ (TB) ತಪಾಸಣೆ',
    bloodScreeningTitle: 'ರಕ್ತ ಪರೀಕ್ಷೆ (CBC ಫನಲ್)',
    resultTitle: 'ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶ',
    referralsTitle: 'ತೆರೆದ ರೆಫರಲ್‌ಗಳು',
    timelineTitle: 'ರೋಗಿ ಆರೋಗ್ಯ ಇತಿಹಾಸ',
    followupsTitle: 'ಮರುಪರಿಶೀಲನೆ ಮತ್ತು ಫಾಲೋ-ಅಪ್',
    settingsTitle: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಸಿಂಕ್',

    offlineStatusReady: 'ಆಫ್‌ಲೈನ್ ಸಕ್ರಿಯವಾಗಿದೆ • 3 ದಾಖಲೆಗಳು ಸಿಂಕ್‌ಗೆ ಸಿದ್ಧವಾಗಿವೆ',
    todayTasksHeader: 'ಇಂದಿನ ಪ್ರಮುಖ ಕಾರ್ಯಗಳು (Tasks)',
    followupTaskCount: '3 ಜನರಿಗೆ ಮರುಪರಿಶೀಲನೆ (Follow-up) ಅಗತ್ಯವಿದೆ',
    followupTaskDesc: 'ಗ್ರಾಮ: ರಾಂಪುರ • 7 ದಿನಗಳ ಕಾಲಮಿತಿ',
    openReferralsCount: '2 ರೆಫರಲ್‌ಗಳು ಆಸ್ಪತ್ರೆ ವರದಿಗಾಗಿ ಕಾಯುತ್ತಿವೆ',
    openReferralsDesc: 'CHC ನಾಭಾ • ಫಾಲೋ-ಥ್ರೂ ಲೂಪ್ ಸಕ್ರಿಯವಾಗಿದೆ',
    pendingBadge: 'ಬಾಕಿ',
    activeBadge: 'ಸಕ್ರಿಯ',
    startScreening: 'ಪರೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ (Start Screening)',
    registerPatient: 'ಹೊಸ ರೋಗಿಯನ್ನು ನೋಂದಾಯಿಸಿ',
    patientTimeline: 'ರೋಗಿಯ ಇತಿಹಾಸ',
    syncAndLanguage: 'ಸಿಂಕ್ ಮತ್ತು ಭಾಷೆ',

    villageLabel: 'ಗ್ರಾಮದ ಹೆಸರು',
    ageLabel: 'ವಯಸ್ಸು (ವರ್ಷಗಳಲ್ಲಿ)',
    genderLabel: 'ಲಿಂಗ (Gender)',
    phoneLabel: 'ಕುಟುಂಬದ ಸಂಪರ್ಕ ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
    genderFemale: 'ಮಹಿಳೆ',
    genderMale: 'ಪುರುಷ',
    genderOther: 'ಇತರ',
    optionalPhotoNotice: 'ಗೌಪ್ಯತೆ ರಕ್ಷಣೆ: ಚಿಕಿತ್ಸೆ ಪಡೆಯಲು ಫೋಟೋ ಕಡ್ಡಾಯವಲ್ಲ. ಸುರಕ್ಷಿತ ಕೋಡ್ ನೀಡಲಾಗುತ್ತದೆ.',
    takeOptionalPhoto: 'ಐಚ್ಛಿಕ ಗುರುತಿನ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    photoAttached: 'ಫೋಟೋ ಲಗತ್ತಿಸಲಾಗಿದೆ ✓',
    nextConsent: 'ಸಮ್ಮತಿ ಮತ್ತು ಮುಂದುವರಿಯಿರಿ',
    consentNotice: 'ಸಮ್ಮತಿ ನಿರಾಕರಿಸಿದರೂ ರೋಗಿಗೆ ತುರ್ತು ಅಥವಾ ವೈದ್ಯಕೀಯ ಆರೈಕೆಯನ್ನು ನಿರಾಕರಿಸಲಾಗುವುದಿಲ್ಲ.',
    consentCareTitle: '1. ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ತಪಾಸಣೆ ಸಮ್ಮತಿ',
    consentCareDesc: 'ಚರ್ಮ, ಕಣ್ಣು ಅಥವಾ ರೋಗಲಕ್ಷಣಗಳ ಪ್ರಾಥಮಿಕ ಪರೀಕ್ಷೆ.',
    consentReferralTitle: '2. ಆಸ್ಪತ್ರೆ ರೆಫರಲ್ ಸಮನ್ವಯ',
    consentReferralDesc: 'ಅಗತ್ಯವಿದ್ದರೆ ಸರ್ಕಾರಿ ವೈದ್ಯರೊಂದಿಗೆ ಮಾಹಿತಿ ಹಂಚಿಕೊಳ್ಳುವುದು.',
    consentSmsTitle: '3. ಕುಟುಂಬಕ್ಕೆ ಮಾಹಿತಿ ಸಂದೇಶ (SMS)',
    consentSmsDesc: 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯ ಮಾತ್ರ (ಯಾವುದೇ ಕಾಯಿಲೆಯ ಹೆಸರನ್ನು ಉಲ್ಲೇಖಿಸಲಾಗುವುದಿಲ್ಲ).',
    consentResearchTitle: '4. ಐಚ್ಛಿಕ ಸಂಶೋಧನಾ ಬಳಕೆ',
    consentResearchDesc: 'ಅನಾಮಧೇಯ ಸಂಶೋಧನೆ. ಚಿಕಿತ್ಸೆಗೆ ಕಡ್ಡಾಯವಲ್ಲ.',
    saveConsentAndSelect: 'ಸಮ್ಮತಿ ಉಳಿಸಿ ಮತ್ತು ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ',

    pathwaySkinTitle: 'ಚರ್ಮದ ಲಕ್ಷಣ ತಪಾಸಣೆ',
    pathwaySkinDesc: 'ಅಸಾಮಾನ್ಯ ಗಾಯಗಳು, ನೀಲಿ ಕಲೆಗಳು ಅಥವಾ ಬಿಳಿಚಿಕೊಳ್ಳುವಿಕೆ.',
    pathwayEyeTitle: 'ಕಣ್ಣು ಮತ್ತು ರೆಟಿನಾ ತಪಾಸಣೆ',
    pathwayEyeDesc: 'ಮಧುಮೇಹ ರೋಗಿಗಳಲ್ಲಿ ರೆಟಿನಾ ತಪಾಸಣೆ (ಲೆನ್ಸ್ ಅಗತ್ಯವಿದೆ).',
    pathwayChestTitle: 'ಎದೆ ಮತ್ತು ಕ್ಷಯ (TB) ತಪಾಸಣೆ',
    pathwayChestDesc: 'ಡಿಜಿಟಲ್ ಎಕ್ಸ್-ರೇ ಅಥವಾ 2 ವಾರಗಳ ಕೆಮ್ಮಿನ ಪ್ರೋಟೋಕಾಲ್.',
    pathwayBloodTitle: 'ರಕ್ತ ಪರೀಕ್ಷೆ (CBC Funnel)',
    pathwayBloodDesc: 'ಸಿಬಿಸಿ ಮೌಲ್ಯಗಳು, ಪ್ಲೇಟ್‌ಲೆಟ್‌ಗಳು ಮತ್ತು ಮೈಕ್ರೋಸ್ಕೋಪ್ ವಿಶ್ಲೇಷಣೆ.',
    emergencyAlertBanner: 'ಉಸಿರಾಟದ ತೀವ್ರ ತೊಂದರೆ ಅಥವಾ ಪ್ರಜ್ಞಾಹೀನತೆಯೇ? 108 ತುರ್ತು ಸಹಾಯ ಪಡೆಯಿರಿ.',

    step1Of3: 'ಹಂತ 1/3: ಪರೀಕ್ಷಾ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    step2Of3: 'ಹಂತ 2/3: ಫೋಟೋ ಮತ್ತು ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ',
    step3Of3: 'ಹಂತ 3/3: ಫಲಿತಾಂಶ ಮತ್ತು ಮುಂದಿನ ಕ್ರಮ',
    cameraDistanceGuide: 'ನೈಸರ್ಗಿಕ ಬೆಳಕಿನಲ್ಲಿ 15 ಸೆಂ.ಮೀ ಅಂತರವಿರಲಿ',
    cameraLightingGuide: 'Blur > 110 • ಕೈ ಅಲುಗಾಡಿಸದೆ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    qualityValidated: 'ಫೋಟೋ ಗುಣಮಟ್ಟ ದೃಢೀಕರಿಸಲಾಗಿದೆ (Clear)',
    captureImage: 'ಫೋಟೋ ತೆಗೆದು ಪರಿಶೀಲಿಸಿ',
    reviewResult: 'ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶವನ್ನು ವೀಕ್ಷಿಸಿ',

    resultGreenTitle: 'ಈ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಯಾವುದೇ ಆತಂಕಕಾರಿ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
    resultGreenDesc: 'ಈ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಯಾವುದೇ ಗಂಭೀರ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಸಾಮಾನ್ಯ ಆರೈಕೆ ಮುಂದುವರಿಸಿ ಮತ್ತು ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯ ಸಲಹೆ ಪಾಲಿಸಿ.',
    resultAmberTitle: 'ಕೆಲವು ಲಕ್ಷಣಗಳನ್ನು ವೈದ್ಯರು ಪರೀಕ್ಷಿಸುವುದು ಅಗತ್ಯವಿದೆ.',
    resultAmberDesc: 'ಮತ್ತೊಮ್ಮೆ ವೈದ್ಯರಿಂದ ತಪಾಸಣೆ ಮಾಡಿಸುವುದು ಸೂಕ್ತ. ನಿಮ್ಮ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತಾರೆ.',
    resultRedTitle: 'ತಕ್ಷಣವೇ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಲು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.',
    resultRedDesc: 'ತಕ್ಷಣವೇ ಆಸ್ಪತ್ರೆಯ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡುವುದು ಅವಶ್ಯಕ ಎಂದು ಈ ಪರೀಕ್ಷೆ ತೋರಿಸುತ್ತದೆ.',
    resultDisclaimer: 'ವೈದ್ಯಕೀಯ ಮಿತಿ: ಇದು ರೋಗನಿರ್ಣಯವಲ್ಲ. ಹಸಿರು ಫಲಿತಾಂಶವು ರೋಗವು ಸಂಪೂರ್ಣವಾಗಿ ಇಲ್ಲ ಎಂದು ಖಾತರಿಪಡಿಸುವುದಿಲ್ಲ.',
    createReferral: 'ಆಸ್ಪತ್ರೆ ರೆಫರಲ್ ರಚಿಸಿ',
    returnHome: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',

    openReferralsHeader: 'ತೆರೆದ ರೆಫರಲ್‌ಗಳು (Follow-Through)',
    recordHospitalOutcome: 'ಆಸ್ಪತ್ರೆಯ ಫಲಿತಾಂಶವನ್ನು ದಾಖಲಿಸಿ',
    closeLoopSuccess: 'ರೆಫರಲ್ ಪೂರ್ಣಗೊಂಡಿದೆ ಮತ್ತು ಲೂಪ್ ಮುಕ್ತಾಯಗೊಂಡಿದೆ.',

    navHome: 'ಮುಖಪುಟ',
    navScreening: 'ಪರೀಕ್ಷೆ',
    navReferrals: 'ರೆಫರಲ್',
    navSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',

    audioGreeting: 'ನಮಸ್ಕಾರ ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯೇ. ಇಂದು ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಮೂರು ಜನರಿಗೆ ಫಾಲೋ-ಅಪ್ ಮತ್ತು ಎರಡು ಆಸ್ಪತ್ರೆ ರೆಫರಲ್‌ಗಳು ಬಾಕಿ ಇವೆ.',
    audioSelectPathway: 'ದಯವಿಟ್ಟು ಪರೀಕ್ಷೆಯ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ: ಚರ್ಮ, ಕಣ್ಣು, ಎದೆ ಅಥವಾ ರಕ್ತ ಪರೀಕ್ಷೆ.',
    audioCameraGuide: 'ರೋಗಿಯನ್ನು ಸೂಕ್ತ ನೈಸರ್ಗಿಕ ಬೆಳಕಿನಲ್ಲಿ ಕೂರಿಸಿ ಕ್ಯಾಮೆರಾ ಅಲುಗಾಡಿಸದೆ ಫೋಟೋ ತೆಗೆಯಿರಿ.',
    audioResultGreen: 'ಈ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಯಾವುದೇ ಆತಂಕಕಾರಿ ಲಕ್ಷಣಗಳಿಲ್ಲ. ಸಾಮಾನ್ಯ ಆರೈಕೆ ಮುಂದುವರಿಸಿ.',
    audioResultAmber: 'ಕೆಲವು ಲಕ್ಷಣಗಳಿಗಾಗಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸುವುದು ಸೂಕ್ತ. ಆಶಾ ಸಹಾಯ ಮಾಡುತ್ತಾರೆ.',
    audioResultRed: 'ತಕ್ಷಣವೇ ಆಸ್ಪತ್ರೆ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡುವುದು ಅಗತ್ಯವಾಗಿದೆ.',
    audioGreetingPhonetic: 'Namaskara ASHA karyakarthe. Indu nimma pradeshadalli mooru janarige follow-up matthu eradu aaspagre referral baaki ide.',
    audioSelectPathwayPhonetic: 'Dayavittu pariksheya vidhaanavannu aayke maadi: charma, kannu, ede athava raktha parikshe.',
    audioCameraGuidePhonetic: 'Rogiyannu manchi belakinalli koorisi camera allugadadhe photo thegeyeeri.',
    audioResultGreenPhonetic: 'Ee pariksheyalli yaavude aathankakaari lakshanagalu kandubandilla. Saamaanya aaraike mundhuvarisi.',
    audioResultAmberPhonetic: 'Kela lakshanagaligaagi vaidyarannu samparkisuvudu sooktha. ASHA sahayakaru maargadarshana needuttaare.',
    audioResultRedPhonetic: 'Thakshanave aaspagre vaidyarannu bheti maadi parikshisikolluvudu athyagathya.',
  },

  // 10. Malayalam (മലയാളം)
  ml: {
    appTitle: 'പ്രോജക്ട് സാഥി',
    tagline: 'പരിചരണത്തിലേക്ക് അല്പം അടുത്ത്. ആരോഗ്യത്തിലേക്ക് ഒരു ചുവട് മുന്നോട്ട്.',
    demoBadge: 'ഡെമോ മോഡ് — ക്ലിനിക്കൽ രോഗനിർണയത്തിനല്ല',
    homeTitle: 'ആശ ആരോഗ്യ സഹായി',
    registerTitle: 'രോഗി രജിസ്ട്രേഷൻ',
    consentTitle: 'സമ്മതപത്രം',
    pathwaySelectTitle: 'പരിശോധനാ രീതി തിരഞ്ഞെടുക്കുക',
    skinScreeningTitle: 'ചർമ്മ ലക്ഷണ പരിശോധന',
    eyeScreeningTitle: 'കണ്ണ് & റെറ്റിന പരിശോധന',
    chestScreeningTitle: 'നെഞ്ചും ക്ഷയരോഗ (TB) പരിശോധനയും',
    bloodScreeningTitle: 'രക്തപരിശോധന (CBC ഫണൽ)',
    resultTitle: 'പരിശോധനാ ഫലം',
    referralsTitle: 'തുറന്ന റഫറലുകൾ',
    timelineTitle: 'രോഗിയുടെ ആരോഗ്യ ചരിത്രം',
    followupsTitle: 'പുനഃപരിശോധനയും ഫോളോ-അപ്പും',
    settingsTitle: 'ക്രമീകരണങ്ങളും സമന്വയവും',

    offlineStatusReady: 'ഓഫ്‌ലൈൻ സജീവമാണ് • 3 രേഖകൾ സമന്വയത്തിന് തയ്യാറാണ്',
    todayTasksHeader: 'ഇന്നത്തെ പ്രധാന ജോലികൾ (Tasks)',
    followupTaskCount: '3 പേർക്ക് പുനഃപരിശോധന (Follow-up) ആവശ്യമാണ്',
    followupTaskDesc: 'ഗ്രാമം: രാംപൂർ • 7 ദിവസത്തെ സമയപരിധി',
    openReferralsCount: '2 റഫറലുകൾ ആശുപത്രി ഫലത്തിനായി കാത്തിരിക്കുന്നു',
    openReferralsDesc: 'സി.എച്ച്.സി നാഭ • ഫോളോ-ത്രൂ ലൂപ്പ് സജീവമാണ്',
    pendingBadge: 'തീർപ്പുകൽപ്പിക്കാത്തത്',
    activeBadge: 'സജീവം',
    startScreening: 'പരിശോധന ആരംഭിക്കുക',
    registerPatient: 'പുതിയ രോഗിയെ രജിസ്റ്റർ ചെയ്യുക',
    patientTimeline: 'രോഗിയുടെ ചരിത്രം',
    syncAndLanguage: 'സമന്വയവും ഭാഷയും',

    villageLabel: 'ഗ്രാമത്തിന്റെ പേര്',
    ageLabel: 'പ്രായം (വർഷങ്ങളിൽ)',
    genderLabel: 'ലിംഗഭേദം',
    phoneLabel: 'കുടുംബത്തിന്റെ ഫോൺ നമ്പർ',
    genderFemale: 'സ്ത്രീ',
    genderMale: 'പുരുഷൻ',
    genderOther: 'മറ്റുള്ളവ',
    optionalPhotoNotice: 'സ്വകാര്യതാ സംരക്ഷണം: ഫോട്ടോ നിർബന്ധമല്ല. സുരക്ഷിതമായ ഐഡി നൽകും.',
    takeOptionalPhoto: 'ഐച്ഛിക തിരിച്ചറിയൽ ഫോട്ടോ എടുക്കുക',
    photoAttached: 'ഫോട്ടോ ചേർത്തു ✓',
    nextConsent: 'സമ്മതപത്രത്തിലേക്ക് പോകുക',
    consentNotice: 'സമ്മതം നിരസിച്ചാലും രോഗിക്ക് പ്രാഥമിക അല്ലെങ്കിൽ അടിയന്തര ചികിത്സ നിഷേധിക്കില്ല.',
    consentCareTitle: '1. പ്രാഥമിക ആരോഗ്യ പരിശോധന സമ്മതം',
    consentCareDesc: 'ചർമ്മം, കണ്ണ് അല്ലെങ്കിൽ ലക്ഷണങ്ങളുടെ പ്രാഥമിക പരിശോധന.',
    consentReferralTitle: '2. ആശുപത്രി റഫറൽ ഏകോപനം',
    consentReferralDesc: 'ആവശ്യമെങ്കിൽ സർക്കാർ ഡോക്ടറുമായി വിവരങ്ങൾ പങ്കിടുക.',
    consentSmsTitle: '3. കുടുംബത്തിനുള്ള വിവര സന്ദേശം (SMS)',
    consentSmsDesc: 'തീയതിയും സമയവും മാത്രം (രോഗത്തിന്റെ പേര് നൽകില്ല).',
    consentResearchTitle: '4. ഐച്ഛിക ഗവേഷണ ഉപയോഗം',
    consentResearchDesc: 'പേരില്ലാത്ത ഗവേഷണം. ചികിത്സയ്ക്ക് നിർബന്ധമല്ല.',
    saveConsentAndSelect: 'സമ്മതം സംരക്ഷിച്ച് രീതി തിരഞ്ഞെടുക്കുക',

    pathwaySkinTitle: 'ചർമ്മ ലക്ഷണ പരിശോധന',
    pathwaySkinDesc: 'അസാധാരണ മുറിവുകൾ, നീല പാടുകൾ അല്ലെങ്കിൽ വിളർച്ച.',
    pathwayEyeTitle: 'കണ്ണ് & റെറ്റിന പരിശോധന',
    pathwayEyeDesc: 'പ്രമേഹ രോഗികളിൽ റെറ്റിന പരിശോധന (ലെൻസ് ആവശ്യമാണ്).',
    pathwayChestTitle: 'നെഞ്ചും ക്ഷയരോഗ (TB) പരിശോധനയും',
    pathwayChestDesc: 'ഡിജിറ്റൽ എക്സ്-റേ അല്ലെങ്കിൽ 2 ആഴ്ചത്തെ ചുമ പ്രോട്ടോക്കോൾ.',
    pathwayBloodTitle: 'രക്തപരിശോധന (CBC Funnel)',
    pathwayBloodDesc: 'സിബിസി അളവുകൾ, പ്ലേറ്റ്‌ലെറ്റുകൾ, മൈക്രോസ്കോപ്പ് പരിശോധന.',
    emergencyAlertBanner: 'കഠിനമായ ശ്വാസതടസ്സം അല്ലെങ്കിൽ ബോധക്ഷയമുണ്ടോ? 108 അടിയന്തര സഹായം തേടുക.',

    step1Of3: 'ഘട്ടം 1/3: പരിശോധന തരം തിരഞ്ഞെടുക്കുക',
    step2Of3: 'ഘട്ടം 2/3: ഫോട്ടോയും ഗുണനിലവാരവും ഉറപ്പാക്കുക',
    step3Of3: 'ഘട്ടം 3/3: ഫലവും അടുത്ത നടപടിയും',
    cameraDistanceGuide: 'നല്ല വെളിച്ചത്തിൽ 15 സെ.മീ അകലം പാലിക്കുക',
    cameraLightingGuide: 'Blur > 110 • കൈ അനക്കാതെ ഫോട്ടോ എടുക്കുക',
    qualityValidated: 'ഫോട്ടോ ഗുണനിലവാരം ഉറപ്പാക്കി (Clear)',
    captureImage: 'ഫോട്ടോ എടുത്ത് പരിശോധിക്കുക',
    reviewResult: 'പരിശോധനാ ഫലം കാണുക',

    resultGreenTitle: 'ഈ പരിശോധനയിൽ ആശങ്കാജനകമായ ലക്ഷണങ്ങളൊന്നും കണ്ടില്ല.',
    resultGreenDesc: 'ഈ പരിശോധനയിൽ അപകടകരമായ ലക്ഷണങ്ങളൊന്നും കണ്ടെത്തിയിട്ടില്ല. സാധാരണ പരിചരണം തുടരുക.',
    resultAmberTitle: 'ചില ലക്ഷണങ്ങൾക്ക് ഡോക്ടറുടെ പരിശോധന ആവശ്യമാണ്.',
    resultAmberDesc: 'ഒരിക്കൽ കൂടി പരിശോധിക്കുന്നത് നല്ലതാണ്. നിങ്ങളുടെ ആശാ പ്രവർത്തക സഹായിക്കും.',
    resultRedTitle: 'ഉടൻ തന്നെ ഡോക്ടറുടെ സേവനം തേടാൻ നിർദ്ദേശിക്കുന്നു.',
    resultRedDesc: 'ഉടൻ തന്നെ സർക്കാർ ആശുപത്രിയിൽ ഡോക്ടറെ കാണണമെന്ന് ഈ പരിശോധന സൂചിപ്പിക്കുന്നു.',
    resultDisclaimer: 'ക്ലിനിക്കൽ പരിമിതി: ഇതൊരു രോഗനിർണയമല്ല. രോഗമില്ല എന്നതിന് പച്ച ഫലം പൂർണ്ണ തെളിവല്ല.',
    createReferral: 'ആശുപത്രി റഫറൽ ഉണ്ടാക്കുക',
    returnHome: 'ഹോം പേജിലേക്ക് മടങ്ങുക',

    openReferralsHeader: 'തുറന്ന റഫറലുകൾ (Follow-Through)',
    recordHospitalOutcome: 'ആശുപത്രി ഫലം രേഖപ്പെടുത്തുക',
    closeLoopSuccess: 'റഫറൽ പൂർത്തിയായി, ഫോളോ-ത്രൂ ലൂപ്പ് അവസാനിച്ചു.',

    navHome: 'ഹോം',
    navScreening: 'പരിശോധന',
    navReferrals: 'റഫറലുകൾ',
    navSettings: 'ക്രമീകരണങ്ങൾ',

    audioGreeting: 'നമസ്കാരം ആശ പ്രവർത്തകരെ. ഇന്ന് മൂന്ന് പേരുടെ ഫോളോ-അപ്പും രണ്ട് ആശുപത്രി റഫറലുകളും കാത്തിരിക്കുന്നു.',
    audioSelectPathway: 'ദയവായി പരിശോധന തിരഞ്ഞെടുക്കുക: ചർമ്മം, കണ്ണ്, നെഞ്ച് അല്ലെങ്കിൽ രക്ത റിപ്പോർട്ട്.',
    audioCameraGuide: 'രോഗിയെ നല്ല വെളിച്ചത്തിൽ ഇരുത്തി ക്യാമറ അനക്കാതെ ചിത്രമെടുക്കുക.',
    audioResultGreen: 'ഈ പരിശോധനയിൽ ആശങ്കപ്പെടേണ്ട ലക്ഷണങ്ങളൊന്നും കണ്ടെത്തിയിട്ടില്ല.',
    audioResultAmber: 'ചില ലക്ഷണങ്ങൾക്കായി ഡോക്ടറെ കാണുന്നത് നല്ലതാണ്. ആശ സഹായിക്കും.',
    audioResultRed: 'ഉടൻ തന്നെ ആശുപത്രിയിലെ ഡോക്ടറെ കാണണമെന്ന് ഈ പരിശോധന കാണിക്കുന്നു.',
    audioGreetingPhonetic: 'Namaskaram ASHA pravarthakare. Innu moonnu perude follow-upum randu hospital referralukalum kaathirikkunnu.',
    audioSelectPathwayPhonetic: 'Dhayavaayi pareekshana reethi thiranjedukkuka: thwakku, kannu, nenju allenkil raktha report.',
    audioCameraGuidePhonetic: 'Rogiye nalla velichathil iruthi camera anangaathe photoyidukka.',
    audioResultGreenPhonetic: 'Ee pareekshanathil aashangapedenda lakshanangal onnum kandethiyittilla. Sadharana paricharanam thudaruka.',
    audioResultAmberPhonetic: 'Chila lakshanangalkkaayi doctor-e kaanikkunnathu nallathaannu. ASHA sahayikkum.',
    audioResultRedPhonetic: 'Udan thanne aashupathriyil doctor-e kaananamennu ee pareekshanam vyakthamaakkunnu.',
  },

  // 11. Odia (ଓଡ଼ିଆ)
  or: {
    appTitle: 'ପ୍ରୋଜେକ୍ଟ ସାଥୀ',
    tagline: 'ଚିକିତ୍ସାର ନିକଟତର। ସ୍ୱାସ୍ଥ୍ୟ ଦିଗରେ ଏକ ପଦକ୍ଷେପ ଆଗୁଆ।',
    demoBadge: 'ଡେମୋ ମୋଡ୍ — ଡାକ୍ତରୀ ନିଦାନ ପାଇଁ ନୁହେଁ',
    homeTitle: 'ଆଶା ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ',
    registerTitle: 'ରୋଗୀ ପଞ୍ଜୀକରଣ',
    consentTitle: 'ରୋଗୀ ସମ୍ମତି ପତ୍ର',
    pathwaySelectTitle: 'ପରୀକ୍ଷା ପଦ୍ଧତି ଚୟନ କରନ୍ତୁ',
    skinScreeningTitle: 'ଚର୍ମ ଲକ୍ଷଣ ପରୀକ୍ଷା',
    eyeScreeningTitle: 'ଆଖି ଏବଂ ରେଟିନା ପରୀକ୍ଷା',
    chestScreeningTitle: 'ଛାତି ଏବଂ ଯକ୍ଷ୍ମା (TB) ପରୀକ୍ଷା',
    bloodScreeningTitle: 'ରକ୍ତ ପରୀକ୍ଷା (CBC ଫନେଲ୍)',
    resultTitle: 'ପରୀକ୍ଷା ଫଳାଫଳ',
    referralsTitle: 'ଖୋଲା ରେଫରାଲ୍',
    timelineTitle: 'ରୋଗୀ ସ୍ୱାସ୍ଥ୍ୟ ଇତିହାସ',
    followupsTitle: 'ପୁନଃ ଯାଞ୍ଚ ଏବଂ ଫଲୋ-ଅପ୍',
    settingsTitle: 'ସେଟିଙ୍ଗ୍ ଏବଂ ସିଙ୍କ୍',

    offlineStatusReady: 'ଅଫଲାଇନ୍ ସକ୍ରିୟ • ୩ଟି ରେକର୍ଡ ସିଙ୍କ୍ ପାଇଁ ପ୍ରସ୍ତୁତ',
    todayTasksHeader: 'ଆଜିର ମୁଖ୍ୟ କାର୍ଯ୍ୟ (Tasks)',
    followupTaskCount: '୩ ଜଣଙ୍କର ପୁନଃ ଯାଞ୍ଚ (Follow-up) ଆବଶ୍ୟକ',
    followupTaskDesc: 'ଗ୍ରାମ: ରାମପୁର • ୭ ଦିନର ସମୟସୀମା',
    openReferralsCount: '୨ଟି ରେଫରାଲ୍ ଡାକ୍ତରଖାନା ଫଳାଫଳ ଅପେକ୍ଷାରେ ଅଛି',
    openReferralsDesc: 'ସିଏଚସି ନାଭା • ଫଲୋ-ଥ୍ରୁ ଲୁପ୍ ସକ୍ରିୟ',
    pendingBadge: 'ବାକି',
    activeBadge: 'ସକ୍ରିୟ',
    startScreening: 'ପରୀକ୍ଷା ଆରମ୍ଭ କରନ୍ତୁ',
    registerPatient: 'ନୂତନ ରୋଗୀ ପଞ୍ଜୀକରଣ କରନ୍ତୁ',
    patientTimeline: 'ରୋଗୀ ଇତିହାସ',
    syncAndLanguage: 'ସିଙ୍କ୍ ଏବଂ ଭାଷା',

    villageLabel: 'ଗ୍ରାମର ନାମ',
    ageLabel: 'ବୟସ (ବର୍ଷରେ)',
    genderLabel: 'ଲିଙ୍ଗ',
    phoneLabel: 'ପରିବାର ଯୋଗାଯୋଗ ଫୋନ୍ ନମ୍ବର',
    genderFemale: 'ମହିଳା',
    genderMale: 'ପୁରୁଷ',
    genderOther: 'ଅନ୍ୟାନ୍ୟ',
    optionalPhotoNotice: 'ଗୋପନୀୟତା ସୁରକ୍ଷା: ଫଟୋ ବାଧ୍ୟତାମୂଳକ ନୁହେଁ। ଏକ ସୁରକ୍ଷିତ କୋଡ୍ ଦିଆଯିବ।',
    takeOptionalPhoto: 'ଇଚ୍ଛାଧୀନ ପରିଚୟ ଫଟୋ ଉଠାନ୍ତୁ',
    photoAttached: 'ଫଟୋ ସଂଲଗ୍ନ ହୋଇଛି ✓',
    nextConsent: 'ସମ୍ମତି ଏବଂ ଆଗକୁ ବଢ଼ନ୍ତୁ',
    consentNotice: 'ସମ୍ମତି ନଦେଲେ ମଧ୍ୟ ରୋଗୀଙ୍କୁ ଜରୁରୀକାଳୀନ ଚିକିତ୍ସାରୁ ବଞ୍ଚିତ କରାଯିବ ନାହିଁ।',
    consentCareTitle: '୧. ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା ସମ୍ମତି',
    consentCareDesc: 'ଚର୍ମ, ଆଖି କିମ୍ବା ଲକ୍ଷଣର ପ୍ରାଥମିକ ଯାଞ୍ଚ।',
    consentReferralTitle: '୨. ଡାକ୍ତରଖାନା ରେଫରାଲ୍ ସମନ୍ୱୟ',
    consentReferralDesc: 'ଡାକ୍ତରଙ୍କ ସହିତ ତଥ୍ୟ ବାଣ୍ଟିବା।',
    consentSmsTitle: '୩. ପରିବାର ପାଇଁ ସୂଚନା ବାର୍ତ୍ତା (SMS)',
    consentSmsDesc: 'କେବଳ ତାରିଖ ଏବଂ ସମୟ (କୌଣସି ରୋଗର ନାମ ନାହିଁ)।',
    consentResearchTitle: '୪. ଅଣ-ବାଧ୍ୟତାମୂଳକ ଗବେଷଣା ବ୍ୟବହାର',
    consentResearchDesc: 'ନାମହୀନ ଗବେଷଣା। ଚିକିତ୍ସା ପାଇଁ ବାଧ୍ୟତାମୂଳକ ନୁହେଁ।',
    saveConsentAndSelect: 'ସମ୍ମତି ସଂରକ୍ଷଣ କରନ୍ତୁ ଏବଂ ପଦ୍ଧତି ଚୟନ କରନ୍ତୁ',

    pathwaySkinTitle: 'ଚର୍ମ ଲକ୍ଷଣ ପରୀକ୍ଷା',
    pathwaySkinDesc: 'ଅସ୍ୱାଭାବିକ କ୍ଷତ, ନୀଳ ଦାଗ ବା ଫିକା ପଡ଼ିବା।',
    pathwayEyeTitle: 'ଆଖି ଏବଂ ରେଟିନା ପରୀକ୍ଷା',
    pathwayEyeDesc: 'ମଧୁମେହ ରୋଗୀଙ୍କ ରେଟିନା ଯାଞ୍ଚ (ଲେନ୍ସ ଆବଶ୍ୟକ)।',
    pathwayChestTitle: 'ଛାତି ଏବଂ ଯକ୍ଷ୍ମା (TB) ପରୀକ୍ଷା',
    pathwayChestDesc: 'ଡିଜିଟାଲ୍ ଏକ୍ସ-ରେ କିମ୍ବା ୨ ସପ୍ତାହର କାଶ ପ୍ରୋଟୋକଲ୍।',
    pathwayBloodTitle: 'ରକ୍ତ ପରୀକ୍ଷା (CBC Funnel)',
    pathwayBloodDesc: 'ସିବିସି ମାନ, ପ୍ଲେଟଲେଟ୍ ଏବଂ ମାଇକ୍ରୋସ୍କୋପ୍ ଯାଞ୍ଚ।',
    emergencyAlertBanner: 'ପ୍ରବଳ ଶ୍ୱାସକଷ୍ଟ କିମ୍ବା ଚେତାଶୂନ୍ୟତା ଅଛି କି? ୧୦୮ ଜରୁରୀକାଳୀନ ସେବା ନିଅନ୍ତୁ।',

    step1Of3: 'ପଦକ୍ଷେପ ୧/୩: ପରୀକ୍ଷା ପ୍ରକାର ବାଛନ୍ତୁ',
    step2Of3: 'ପଦକ୍ଷେପ ୨/୩: ଫଟୋ ଏବଂ ଗୁଣବତ୍ତା ଯାଞ୍ଚ',
    step3Of3: 'ପଦକ୍ଷେପ ୩/୩: ଫଳାଫଳ ଏବଂ ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ',
    cameraDistanceGuide: 'ପ୍ରାକୃତିକ ଆଲୋକରେ ୧୫ ସେମି ଦୂରତା ରଖନ୍ତୁ',
    cameraLightingGuide: 'Blur > 110 • ହାତ ସ୍ଥିର ରଖି ଫଟୋ ଉଠାନ୍ତୁ',
    qualityValidated: 'ଫଟୋ ଗୁଣବତ୍ତା ପ୍ରମାଣିତ (Clear)',
    captureImage: 'ଫଟୋ ଉଠାନ୍ତୁ ଏବଂ ଯାଞ୍ଚ କରନ୍ତୁ',
    reviewResult: 'ପରୀକ୍ଷା ଫଳାଫଳ ଦେଖନ୍ତୁ',

    resultGreenTitle: 'ଏହି ପରୀକ୍ଷାରେ କୌଣସି ଚିନ୍ତାଜନକ ଲକ୍ଷଣ ଦେଖାଯାଇ ନାହିଁ।',
    resultGreenDesc: 'ଏହି ଯାଞ୍ଚରେ କୌଣସି ବିପଦଜନକ ଲକ୍ଷଣ ମିଳିନାହିଁ। ନିୟମିତ ଯତ୍ନ ଜାରି ରଖନ୍ତୁ ଏବଂ ଆଶା କର୍ମୀଙ୍କ ପରାମର୍ଶ ମାନନ୍ତୁ।',
    resultAmberTitle: 'କିଛି ଲକ୍ଷଣ ଡାକ୍ତରଙ୍କ ଦ୍ୱାରା ଯାଞ୍ଚ ହେବା ଆବଶ୍ୟକ।',
    resultAmberDesc: 'ପୁନର୍ବାର ଯାଞ୍ଚ କରାଇବା ଲାଭଦାୟକ ହୋଇପାରେ। ଆପଣଙ୍କ ଆଶା ଦିଦି ସାହାଯ୍ୟ କରିବେ।',
    resultRedTitle: 'ତୁରନ୍ତ ଡାକ୍ତରଙ୍କ ସହିତ ପରାମର୍ଶ କରିବାକୁ ପରାମର୍ଶ ଦିଆଯାଉଛି।',
    resultRedDesc: 'ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯିବା ଆବଶ୍ୟକ ବୋଲି ଏହି ପରୀକ୍ଷା ସୂଚାଉଛି। ଆଶା କର୍ମୀ ରେଫରାଲ୍ କରିବେ।',
    resultDisclaimer: 'କ୍ଲିନିକାଲ୍ ସୀମା: ଏହା ଚୂଡ଼ାନ୍ତ ନିଦାନ ନୁହେଁ। ସବୁଜ ଫଳାଫଳ ମଧ୍ୟ ରୋଗ ସମ୍ପୂର୍ଣ୍ଣ ନଥିବାର ପ୍ରମାଣ ନୁହେଁ।',
    createReferral: 'ଡାକ୍ତରଖାନା ରେଫରାଲ୍ ତିଆରି କରନ୍ତୁ',
    returnHome: 'ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଫେରନ୍ତୁ',

    openReferralsHeader: 'ସକ୍ରିୟ ଖୋଲା ରେଫରାଲ୍ (Follow-Through)',
    recordHospitalOutcome: 'ଡାକ୍ତରଖାନା ଫଳାଫଳ ରେକର୍ଡ କରନ୍ତୁ',
    closeLoopSuccess: 'ରେଫରାଲ୍ ସମ୍ପୂର୍ଣ୍ଣ ହେଲା ଏବଂ ଲୁପ୍ ସମାପ୍ତ ହେଲା।',

    navHome: 'ହୋମ୍',
    navScreening: 'ପରୀକ୍ଷା',
    navReferrals: 'ରେଫରାଲ୍',
    navSettings: 'ସେଟିଙ୍ଗ୍',

    audioGreeting: 'ନମସ୍କାର ଆଶା ଦିଦି। ଆଜି ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ତିନି ଜଣଙ୍କ ଫଲୋ-ଅପ୍ ଏବଂ ଦୁଇଟି ରେଫରାଲ୍ ବାକି ଅଛି।',
    audioSelectPathway: 'ଦୟାକରି ପରୀକ୍ଷା ପଦ୍ଧତି ଚୟନ କରନ୍ତୁ: ଚର୍ମ, ଆଖି, ଛାତି କିମ୍ବା ରକ୍ତ ପରୀକ୍ଷା।',
    audioCameraGuide: 'ରୋଗୀଙ୍କୁ ଭଲ ପ୍ରାକୃତିକ ଆଲୋକରେ ବସାଇ କ୍ୟାମେରା ସ୍ଥିର ରଖି ଫଟୋ ଉଠାନ୍ତୁ।',
    audioResultGreen: 'ଏହି ପରୀକ୍ଷାରେ କୌଣସି ଚିନ୍ତାର ବିଷୟ ମିଳିନାହିଁ। ସାଧାରଣ ଯତ୍ନ ଜାରି ରଖନ୍ତୁ।',
    audioResultAmber: 'କିଛି ଲକ୍ଷଣ ପାଇଁ ଡାକ୍ତରଙ୍କୁ ଦେଖାଇବା ଆବଶ୍ୟକ। ଆଶା ଦିଦି ସାହାଯ୍ୟ କରିବେ।',
    audioResultRed: 'ତୁରନ୍ତ ସରକାରୀ ଡାକ୍ତରଖାନାରେ ଡାକ୍ତରଙ୍କୁ ଦେଖାଇବା ଜରୁରୀ।',
    audioGreetingPhonetic: 'Namaskar ASHA didi. Aaji aapananka anchalare teeni jananka follow-up ebong dui hospital referral baaki achhi.',
    audioSelectPathwayPhonetic: 'Dayakari pariksha padhdhati chayan karantu: charma, aakhi, chhaati kimba rakta pariksha.',
    audioCameraGuidePhonetic: 'Roginku bhalo aalokare basai camera sthir rakhi photo uthantu.',
    audioResultGreenPhonetic: 'Ehi parikshare kounasi chintara bishaya milinahi. Sadharana yatna jaari rakhantu.',
    audioResultAmberPhonetic: 'Kichi lakshana pain daktaranku dekhaiba aavashyaka. ASHA didi saahajya karibe.',
    audioResultRedPhonetic: 'Turanta sarkaari daktarkhana re daktaranku dekhaiba jaroori.',
  },

  // 12. Assamese (অসমীয়া)
  as: {
    appTitle: 'প্ৰজেক্ট সাথী',
    tagline: 'সেৱাৰ আৰু ওচৰলৈ। সুস্বাস্থ্যৰ দিশত এটা খোজ আগুৱাই।',
    demoBadge: 'ডেমো মোড — চিকিৎসাজনিত নিদানৰ বাবে নহয়',
    homeTitle: 'আশা স্বাস্থ্য সহায়ক',
    registerTitle: 'ৰোগী পঞ্জীয়ন',
    consentTitle: 'ৰোগীৰ সন্মতি পত্ৰ',
    pathwaySelectTitle: 'পৰীক্ষাৰ পদ্ধতি বাছক',
    skinScreeningTitle: 'ছালৰ লক্ষণ পৰীক্ষা',
    eyeScreeningTitle: 'চকু আৰু ৰেটিনা পৰীক্ষা',
    chestScreeningTitle: 'বুকু আৰু যক্ষ্মা পৰীক্ষা',
    bloodScreeningTitle: 'তেজৰ পৰীক্ষা (CBC ফানেল)',
    resultTitle: 'পৰীক্ষাৰ ফলাফল',
    referralsTitle: 'মুকলি ৰেফাৰেল',
    timelineTitle: 'ৰোগীৰ স্বাস্থ্য ইতিহাস',
    followupsTitle: 'পুনৰ পৰীক্ষা আৰু ফলো-আপ',
    settingsTitle: 'ছেটিংছ আৰু ছিংক',

    offlineStatusReady: 'অফলাইন সক্ৰিয় • ৩টা ৰেকৰ্ড ছিংকৰ বাবে প্ৰস্তুত',
    todayTasksHeader: 'আজিৰ মূল কামসমূহ (Tasks)',
    followupTaskCount: '৩ জনৰ পুনৰ পৰীক্ষা (Follow-up) প্ৰয়োজন',
    followupTaskDesc: 'গাঁও: ৰামপুৰ • ৭ দিনৰ সময়সীমা',
    openReferralsCount: '২টা ৰেফাৰেল চিকিৎসালয়ৰ ফলাফলৰ অপেক্ষাত আছে',
    openReferralsDesc: 'চিএইচচি নাভা • ফলো-থ্ৰু লুপ সক্ৰিয়',
    pendingBadge: 'বাকী',
    activeBadge: 'সক্ৰিয়',
    startScreening: 'পৰীক্ষা আৰম্ভ কৰক',
    registerPatient: 'নতুন ৰোগী পঞ্জীয়ন কৰক',
    patientTimeline: 'ৰোগীৰ ইতিহাস',
    syncAndLanguage: 'ছিংক আৰু ভাষা',

    villageLabel: 'গাঁৱৰ নাম',
    ageLabel: 'বয়স (বছৰত)',
    genderLabel: 'লিংগ',
    phoneLabel: 'পৰিয়ালৰ যোগাযোগ ফোন',
    genderFemale: 'মহিলা',
    genderMale: 'পুৰুষ',
    genderOther: 'অন্যান্য',
    optionalPhotoNotice: 'গোপনীয়তা সুৰক্ষা: চিকিৎসাৰ বাবে ফটো বাধ্যতামূলক নহয়। সুৰক্ষিত কʼড দিয়া হʼব।',
    takeOptionalPhoto: 'ঐচ্ছিক পৰিচয় ফটো তোলক',
    photoAttached: 'ফটো সংলগ্ন কৰা হʼল ✓',
    nextConsent: 'সন্মতি আৰু পৰৱৰ্তী পদক্ষেপ',
    consentNotice: 'সন্মতি নিদিলেও ৰোগীক জৰুৰীকালীন চিকিৎসা সেৱাৰ পৰা বঞ্চিত কৰা নহʼব।',
    consentCareTitle: '১. প্ৰাথমিক স্বাস্থ্য পৰীক্ষাৰ সন্মতি',
    consentCareDesc: 'ছাল, চকু বা লক্ষণৰ প্ৰাথমিক পৰীক্ষা।',
    consentReferralTitle: '২. চিকিৎসালয় ৰেফাৰেল সমন্বয়',
    consentReferralDesc: 'প্ৰয়োজন হʼলে চৰকাৰী চিকিৎসকৰ সৈতে তথ্য ভাগ কৰা।',
    consentSmsTitle: '৩. পৰিয়াললৈ বাৰ্তা (SMS)',
    consentSmsDesc: 'কেৱল তাৰিখ আৰু সময় (ৰোগৰ নাম উল্লেখ নাথাকে)।',
    consentResearchTitle: '৪. ঐচ্ছিক গৱেষণা ব্যৱহাৰ',
    consentResearchDesc: 'নামহীন গৱেষণা। চিকিৎসাৰ বাবে বাধ্যতামূলক নহয়।',
    saveConsentAndSelect: 'সন্মতি সংৰক্ষণ কৰক আৰু পদ্ধতি বাছক',

    pathwaySkinTitle: 'ছালৰ লক্ষণ পৰীক্ষা',
    pathwaySkinDesc: 'অস্বাভাৱিক ঘাঁ, নীলা দাগ বা শেঁতা পৰা।',
    pathwayEyeTitle: 'চকু আৰু ৰেটিনা পৰীক্ষা',
    pathwayEyeDesc: 'ডায়েবেটিছ ৰোগীৰ ৰেটিনা পৰীক্ষা (লেন্স প্ৰয়োজন)।',
    pathwayChestTitle: 'বুকু আৰু যক্ষ্মা পৰীক্ষা',
    pathwayChestDesc: 'ডিজিটেল এক্স-ৰে বা ২ সপ্তাহৰ কাহৰ নিয়ম।',
    pathwayBloodTitle: 'তেজৰ পৰীক্ষা (CBC Funnel)',
    pathwayBloodDesc: 'চিবিচি মান, প্লেটলেট আৰু মাইক্ৰʼস্কোপ পৰীক্ষা।',
    emergencyAlertBanner: 'উশাহ লোৱাত কষ্ট বা অচেতন নেকি? ১০৮ জৰুৰীকালীন সেৱা লওক।',

    step1Of3: 'পদক্ষেপ ১/৩: পৰীক্ষাৰ প্ৰকাৰ বাছক',
    step2Of3: 'পদক্ষেপ ২/৩: ফটো আৰু গুণমান পৰীক্ষা',
    step3Of3: 'পদক্ষেপ ৩/৩: ফলাফল আৰু পৰৱৰ্তী পদক্ষেপ',
    cameraDistanceGuide: 'পোহৰত ১৫ চেমি দূৰত্ব ৰাখক',
    cameraLightingGuide: 'Blur > 110 • হাত স্থিৰ ৰাখি ফটো তোলক',
    qualityValidated: 'ফটোৰ গুণমান নিশ্চিত হʼল (Clear)',
    captureImage: 'ফটো তোলক আৰু পৰীক্ষা কৰক',
    reviewResult: 'পৰীক্ষাৰ ফলাফল চাওক',

    resultGreenTitle: 'এই পৰীক্ষাত কোনো চিন্তাৰ লক্ষণ দেখা পোৱা নগʼল।',
    resultGreenDesc: 'এই পৰীক্ষাত কোনো বিপদজনক লক্ষণ পোৱা নগʼল। স্বাভাৱিক যত্ন লওক আৰু আশা বাইদেউৰ পৰামৰ্শ মানক।',
    resultAmberTitle: 'কিছুমান লক্ষণৰ বাবে চিকিৎসকৰ পৰামৰ্শ প্ৰয়োজন।',
    resultAmberDesc: 'আকৌ এবাৰ পৰীক্ষা কৰোৱা ভাল হʼব। আশা বাইদেৱে সহায় কৰিব।',
    resultRedTitle: 'পলম নকৰি চিকিৎসকৰ কাষ চপাৰ পৰামৰ্শ দিয়া হৈছে।',
    resultRedDesc: 'চিকিৎসালয়লৈ যোৱাটো জৰুৰী বুলি এই পৰীক্ষাই দেখুৱাইছে। আশা কৰ্মীয়ে ৰেফাৰেল কৰিব।',
    resultDisclaimer: 'চিকিৎসাজনিত সীমা: এইটো চূড়ান্ত নিদান নহয়। সেউজীয়া ফলাফলেও ৰোগ সম্পূৰ্ণ নাই বুলি প্ৰমাণ নকৰে।',
    createReferral: 'চিকিৎসালয় ৰেফাৰেল সৃষ্টি কৰক',
    returnHome: 'মূল পৃষ্ঠালৈ উভতি যাওক',

    openReferralsHeader: 'সক্ৰিয় মুকলি ৰেফাৰেল (Follow-Through)',
    recordHospitalOutcome: 'চিকিৎসালয়ৰ ফলাফল নথিভুক্ত কৰক',
    closeLoopSuccess: 'ৰেফাৰেল সম্পন্ন হʼল আৰু লুপ সমাপ্ত হʼল।',

    navHome: 'হোম',
    navScreening: 'পৰীক্ষা',
    navReferrals: 'ৰেফাৰেল',
    navSettings: 'ছেটিংছ',

    audioGreeting: 'নমস্কাৰ আশা বাইদেউ। আজি তিনি জনৰ ফলো-আপ আৰু দুটা চিকিৎসালয়ৰ ৰেফাৰেল বাকী আছে।',
    audioSelectPathway: 'অনুগ্ৰহ কৰি পৰীক্ষা বাছক: ছাল, চকু, বুকু বা তেজৰ ৰিপৰ্ট।',
    audioCameraGuide: 'ৰোগীক ভাল পোহৰত বহুৱাই হাত স্থিৰ ৰাখি ফটো তোলক।',
    audioResultGreen: 'এই পৰীক্ষাত কোনো চিন্তাৰ লক্ষণ নাই। নিয়মিত যত্ন লওক।',
    audioResultAmber: 'কিছুমান লক্ষণৰ বাবে চিকিৎসকক দেখুওৱা ভাল। আশা সহায় কৰিব।',
    audioResultRed: 'অনুগ্ৰহ কৰি অতি সোনকালে চৰকাৰী চিকিৎসালয়ত চিকিৎসকক দেখুৱাওক।',
    audioGreetingPhonetic: 'Nomoskar ASHA baideu. Aaji teeni jonor follow-up aaru duto hospital referral baaki aase.',
    audioSelectPathwayPhonetic: 'Onugroho kori porikkha baasok: saal, soku, buku ba tezor report.',
    audioCameraGuidePhonetic: 'Rogeek bhalo pohorot bohuwai camera sthir raakhi photo tulok.',
    audioResultGreenPhonetic: 'Ei porikkhyat kono sintar karon powa nogol. Niyomiya jotno laok.',
    audioResultAmberPhonetic: 'Khisumaan lokkhonor baabe chikitsokor poramorsho proyojon. ASHA sahay koribo.',
    audioResultRedPhonetic: 'Onugroho kori oti xonkaale sorkari chikitsaloyot chikitsokok dekhaok.',
  },

  // 13. Urdu (اردو)
  ur: {
    appTitle: 'پروجیکٹ ساتھی',
    tagline: 'نگہداشت کے قریب۔ صحت کی جانب ایک قدم پہلے۔',
    demoBadge: 'ڈیمو موڈ — طبی تشخیص کے لیے نہیں ہے',
    homeTitle: 'آشا ہیلتھ اسسٹنٹ',
    registerTitle: 'مریض کا اندراج',
    consentTitle: 'مریض کا رضامندی فارم',
    pathwaySelectTitle: 'اسکریننگ کا طریقہ منتخب کریں',
    skinScreeningTitle: 'جلد کی علامات کی جانچ',
    eyeScreeningTitle: 'آنکھ اور پردہ چشم کی جانچ',
    chestScreeningTitle: 'سینے اور ٹی بی کی جانچ',
    bloodScreeningTitle: 'خون کی جانچ (CBC فنل)',
    resultTitle: 'اسکریننگ کا نتیجہ',
    referralsTitle: 'کھلے ریفرلز',
    timelineTitle: 'مریض کی صحت کی تاریخ',
    followupsTitle: 'دوبارہ جانچ اور فالو اپ',
    settingsTitle: 'ترتیبات اور مطابقت پذیری',

    offlineStatusReady: 'آف لائن فعال ہے • 3 ریکارڈز ہم آہنگی کے لیے تیار ہیں',
    todayTasksHeader: 'آج کے اہم کام (Today Tasks)',
    followupTaskCount: '3 افراد کا دوبارہ معائنہ (Follow-up) ضروری ہے',
    followupTaskDesc: 'گاؤں: رام پور • 7 دن کی آخری تاریخ',
    openReferralsCount: '2 ریفرلز اسپتال کے نتائج کے منتظر ہیں',
    openReferralsDesc: 'سی ایچ سی نابھہ • فالو تھرو لوپ فعال ہے',
    pendingBadge: 'زیر التواء',
    activeBadge: 'فعال',
    startScreening: 'جانچ شروع کریں (Start Screening)',
    registerPatient: 'نیا مریض درج کریں (Register)',
    patientTimeline: 'مریض کی تاریخ',
    syncAndLanguage: 'مطابقت اور زبان',

    villageLabel: 'گاؤں کا نام',
    ageLabel: 'عمر (سالوں میں)',
    genderLabel: 'جنس',
    phoneLabel: 'خاندانی رابطہ فون نمبر',
    genderFemale: 'خاتون',
    genderMale: 'مرد',
    genderOther: 'دیگر',
    optionalPhotoNotice: 'رازداری کا تحفظ: علاج کے لیے تصویر لازمی نہیں ہے۔ ایک محفوظ کوڈ دیا جائے گا۔',
    takeOptionalPhoto: 'اختیاری شناختی تصویر لیں',
    photoAttached: 'تصویر منسلک کر دی گئی ✓',
    nextConsent: 'رضامندی اور آگے بڑھیں',
    consentNotice: 'رضامندی نہ دینے پر بھی مریض کو ہنگامی خدمات یا ڈاکٹر کے معائنے سے محروم نہیں کیا جائے گا۔',
    consentCareTitle: '1. بنیادی اسکریننگ کی رضامندی',
    consentCareDesc: 'جلد، آنکھ یا علامات کی ابتدائی جانچ۔',
    consentReferralTitle: '2. اسپتال ریفرل کوآرڈینیشن',
    consentReferralDesc: 'ضرورت پڑنے پر سرکاری ڈاکٹر سے تفصیلات کا تبادلہ۔',
    consentSmsTitle: '3. خاندان کو معلوماتی پیغام (SMS)',
    consentSmsDesc: 'صرف وقت اور تاریخ (بیماری کا نام ظاہر نہیں کیا جائے گا)۔',
    consentResearchTitle: '4. غیر لازمی تحقیقی استعمال',
    consentResearchDesc: 'گمنام تحقیق۔ علاج کے لیے قطعاً لازمی نہیں۔',
    saveConsentAndSelect: 'رضامندی محفوظ کریں اور طریقہ منتخب کریں',

    pathwaySkinTitle: 'جلد کی علامات کی جانچ',
    pathwaySkinDesc: 'غیر معمولی زخم، نیلے نشانات یا زردی۔',
    pathwayEyeTitle: 'آنکھ اور پردہ چشم کی جانچ',
    pathwayEyeDesc: 'ذیابیطس کے مریضوں میں ریٹینا کی جانچ (لینس ضروری ہے)۔',
    pathwayChestTitle: 'سینے اور ٹی بی کی جانچ',
    pathwayChestDesc: 'ڈیجیٹل ایکسرے یا 2 ہفتے کی کھانسی کا پروٹوکول۔',
    pathwayBloodTitle: 'خون کی جانچ (CBC Funnel)',
    pathwayBloodDesc: 'سی بی سی رپورٹ، پلیٹلیٹس اور مائیکروسکوپک جانچ۔',
    emergencyAlertBanner: 'سانس لینے میں شدید تکلیف یا بے ہوشی ہے؟ 108 ایمرجنسی سروس سے رجوع کریں۔',

    step1Of3: 'مرحلہ 1/3: جانچ کی قسم منتخب کریں',
    step2Of3: 'مرحلہ 2/3: تصویر اور معیار کی تصدیق',
    step3Of3: 'مرحلہ 3/3: نتیجہ اور اگلا قدم',
    cameraDistanceGuide: 'قدرتی روشنی میں 15 سینٹی میٹر کا فاصلہ رکھیں',
    cameraLightingGuide: 'Blur > 110 • ہاتھ کو مستحکم رکھ کر تصویر لیں',
    qualityValidated: 'تصویر کا معیار تصدیق شدہ (Clear)',
    captureImage: 'تصویر لیں اور جانچیں',
    reviewResult: 'جانچ کا نتیجہ دیکھیں',

    resultGreenTitle: 'اس جانچ میں کوئی تشویشناک علامت نہیں پائی گئی۔',
    resultGreenDesc: 'اس جانچ میں کوئی خطرناک علامت نہیں ملی۔ معمول کی دیکھ بھال جاری رکھیں اور آشا ورکر کے مشورے پر عمل کریں۔',
    resultAmberTitle: 'کچھ علامات کے لیے ڈاکٹر سے معائنہ ضروری ہے۔',
    resultAmberDesc: 'ایک بار پھر ڈاکٹر سے معائنہ کروانا مفید ہو سکتا ہے۔ آپ کی آشا دیدی رہنمائی کرے گی۔',
    resultRedTitle: 'فوری طور پر ڈاکٹر سے معائنہ کروانے کی سفارش کی جاتی ہے۔',
    resultRedDesc: 'اس جانچ سے ظاہر ہوتا ہے کہ فوری طور پر اسپتال کے ڈاکٹر سے ملنا ضروری ہے۔ آشا ورکر ریفرل کرے گی۔',
    resultDisclaimer: 'طبی حد: یہ حتمی طبی تشخیص نہیں ہے۔ سبز نتیجہ بھی بیماری کی مکمل غیر موجودگی کا ثبوت نہیں ہے۔',
    createReferral: 'اسپتال ریفرل بنائیں',
    returnHome: 'ہوم اسکرین پر واپس جائیں',

    openReferralsHeader: 'فعال کھلے ریفرلز (Follow-Through)',
    recordHospitalOutcome: 'اسپتال کا نتیجہ درج کریں',
    closeLoopSuccess: 'ریفرل مکمل ہوا اور فالو تھرو لوپ بند ہو گیا۔',

    navHome: 'ہوم',
    navScreening: 'اسکریننگ',
    navReferrals: 'ریفرل',
    navSettings: 'ترتیبات',

    audioGreeting: 'آداب آشا دیدی۔ آج تین افراد کا فالو اپ اور دو اسپتال کے ریفرلز نتائج کے منتظر ہیں۔',
    audioSelectPathway: 'برائے مہربانی جانچ کا طریقہ منتخب کریں: جلد، آنکھ، سینہ یا خون کی جانچ۔',
    audioCameraGuide: 'مریض کو مناسب قدرتی روشنی میں بٹھائیں اور کیمرے کو مستحکم رکھ کر تصویر لیں۔',
    audioResultGreen: 'اس جانچ میں کوئی تشویش کی بات نہیں پائی گئی۔ معمول کی دیکھ بھال جاری رکھیں۔',
    audioResultAmber: 'کچھ علامات کے لیے ڈاکٹر کا معائنہ ضروری ہے۔ آشا دیدی مدد کرے گی۔',
    audioResultRed: 'فوری طور پر سرکاری اسپتال میں ڈاکٹر سے معائنہ کروانا ضروری ہے۔',
    audioGreetingPhonetic: 'Aadaab ASHA didi. Aaj teen afraad ka follow-up aur do hospital referrals baaqi hain.',
    audioSelectPathwayPhonetic: 'Barahe meharbani jaanch ka tareeqa chunein: jild, aankh, seena ya khoon ki jaanch.',
    audioCameraGuidePhonetic: 'Mareez ko munasib roshni mein bitha kar camera mustahkam rakh kar photo lein.',
    audioResultGreenPhonetic: 'Is jaanch mein koi tashweeshnaak alaamat nahi paayi gayi. Mamool ki dekhbhaal jaari rakhein.',
    audioResultAmberPhonetic: 'Kuch alaamaat ke liye doctor ka muaayna zaroori hai. ASHA didi madad karegi.',
    audioResultRedPhonetic: 'Is jaanch se pata chalta hai ke fori taur par hospital ke doctor se milna zaroori hai.',
  },
  // 14. Nepali (नेपाली) - Official 8th Schedule Language (Sikkim, North Bengal & Pan-India)
  ne: {
    appTitle: 'प्रोजेक्ट साथी',
    tagline: 'हेरचाहको अलि नजिक। स्वास्थ्यतर्फ एक कदम अगाडि।',
    demoBadge: 'प्रदर्शन मोड — क्लिनिकल प्रयोगको लागि होइन',
    homeTitle: 'आशा स्वास्थ्य सहयोगी',
    registerTitle: 'बिरामी दर्ता',
    consentTitle: 'बिरामी सहमति पत्र',
    pathwaySelectTitle: 'जाँचको विधि छान्नुहोस्',
    skinScreeningTitle: 'छाला लक्षण जाँच',
    eyeScreeningTitle: 'आँखा तथा पर्दा जाँच',
    chestScreeningTitle: 'छाती तथा क्षयरोग जाँच',
    bloodScreeningTitle: 'रगत जाँच (CBC फनेल)',
    resultTitle: 'स्क्रिनिङ नतिजा',
    referralsTitle: 'खुल्ला सिफारिसहरू',
    timelineTitle: 'बिरामी स्वास्थ्य इतिहास',
    followupsTitle: 'पुनः जाँच र फलो-अप',
    settingsTitle: 'सेटिङ र सिंक',

    offlineStatusReady: 'अफलाइन सक्रिय • ३ रेकर्डहरू सिंकका लागि तयार',
    todayTasksHeader: "आजका मुख्य कार्यहरू (Today's Tasks)",
    followupTaskCount: '३ जना बिरामीको पुनः जाँच (Follow-up) बाँकी छ',
    followupTaskDesc: 'गाउँ: रामपुर • ७ दिनको समयसीमा',
    openReferralsCount: '२ वटा अस्पताल सिफारिस रिपोर्टको पर्खाइमा छन्',
    openReferralsDesc: 'सीएचसी नाभा • फलो-थ्रु लूप सक्रिय',
    pendingBadge: 'बाँकी',
    activeBadge: 'सक्रिय',
    startScreening: 'जाँच सुरु गर्नुहोस् (Start Screening)',
    registerPatient: 'नयाँ बिरामी दर्ता गर्नुहोस् (Register)',
    patientTimeline: 'बिरामी इतिहास',
    syncAndLanguage: 'सिंक र भाषा',

    villageLabel: 'गाउँको नाम (Village Name)',
    ageLabel: 'उमेर (वर्षमा)',
    genderLabel: 'लिङ्ग (Gender)',
    phoneLabel: 'पारिवारिक सम्पर्क फोन',
    genderFemale: 'महिला (Female)',
    genderMale: 'पुरुष (Male)',
    genderOther: 'अन्य (Other)',
    optionalPhotoNotice: 'गोपनीयता सुरक्षा: तस्बिर उपचारको लागि अनिवार्य छैन। सुरक्षित कोड स्वतः जारी हुनेछ।',
    takeOptionalPhoto: 'वैकल्पिक पहिचान तस्बिर लिनुहोस्',
    photoAttached: 'वैकल्पिक तस्बिर संलग्न छ ✓',
    nextConsent: 'सहमति र अगाडि बढ्नुहोस् (Next: Consent)',
    consentNotice: 'सहमति नदिँदा पनि बिरामीलाई डाक्टर वा आपत्कालीन सेवाबाट वञ्चित गरिने छैन।',
    consentCareTitle: '१. प्राथमिक स्वास्थ्य जाँचको सहमति',
    consentCareDesc: 'छाला, आँखा वा लक्षणहरूको प्राथमिक स्क्रिनिङ।',
    consentReferralTitle: '२. अस्पताल सिफारिस समन्वय',
    consentReferralDesc: 'लक्षण देखिएमा स्वास्थ्य चौकी वा अस्पतालका डाक्टरसँग रिपोर्ट आदानप्रदान।',
    consentSmsTitle: '३. परिवारलाई सूचना सन्देश (SMS)',
    consentSmsDesc: 'केवल मिति र समयको तटस्थ सन्देश (रोगको नाम लेखिने छैन)।',
    consentResearchTitle: '४. गैर-अनिवार्य अनुसन्धान प्रयोग (Research)',
    consentResearchDesc: 'अनाम गुणस्तर सुधार प्रयोग। उपचारका लागि बिल्कुलै अनिवार्य छैन।',
    saveConsentAndSelect: 'सहमति सुरक्षित गर्नुहोस् र जाँच छान्नुहोस्',

    pathwaySkinTitle: 'छाला लक्षण जाँच (Skin-Sign)',
    pathwaySkinDesc: 'असामान्य घाउ, निलडाम, दाना वा पहेँलोपन।',
    pathwayEyeTitle: 'आँखा तथा पर्दा जाँच (Retina Check)',
    pathwayEyeDesc: 'मधुमेह भएका बिरामीहरूमा रेटिना जाँच (फन्डस लेन्स आवश्यक)।',
    pathwayChestTitle: 'छाती तथा क्षयरोग जाँच (Chest / TB)',
    pathwayChestDesc: 'डिजिटल एक्स-रे वा २ हप्ता लामो खोकी लक्षण प्रोटोकल।',
    pathwayBloodTitle: 'रगत जाँच (CBC Cancer Funnel)',
    pathwayBloodDesc: 'सीबीसी मान, प्लेटलेट्स र माइक्रोस्कोप स्लाइड समीक्षा।',
    emergencyAlertBanner: 'सास फेर्न गम्भीर कठिनाइ वा बेहोशी छ? १०८ आपत्कालीन सहायता यहाँ हेर्नुहोस्।',

    step1Of3: 'चरण १/३: स्क्रिनिङ प्रकार छान्नुहोस्',
    step2Of3: 'चरण २/३: तस्बिर र गुणस्तर प्रमाणीकरण',
    step3Of3: 'चरण ३/३: नतिजा र आगामी कदम',
    cameraDistanceGuide: 'प्राकृतिक उज्यालोमा १५ सेमीको दूरी राख्नुहोस्',
    cameraLightingGuide: 'Blur > 110 • क्यामेरा स्थिर राखेर फोटो खिच्नुहोस्',
    qualityValidated: 'तस्बिर गुणस्तर प्रमाणित भयो (Sharp & Clear)',
    captureImage: 'तस्बिर खिच्नुहोस् र जाँच गर्नुहोस् (Capture)',
    reviewResult: 'जाँच नतिजा हेर्नुहोस् (Review Result)',

    resultGreenTitle: 'यस जाँचमा कुनै चिन्ताजनक लक्षण भेटिएन।',
    resultGreenDesc: 'यस जाँचमा कुनै खतराको लक्षण भेटिएन। सामान्य हेरचाह जारी राख्नुहोस् र आफ्नो आशा दिदीको सल्लाह मान्नुहोस्।',
    resultAmberTitle: 'केही लक्षणहरूको लागि डाक्टरबाट पुनः जाँच आवश्यक छ।',
    resultAmberDesc: 'एकपटक फेरि डाक्टरबाट जाँच गराउनु उपयोगी हुनेछ। तपाईंको आशा दिदीले मार्गदर्शन गर्नुहुनेछ।',
    resultRedTitle: 'तत्काल डाक्टरबाट स्वास्थ्य परीक्षण गराउन सिफारिस गरिन्छ।',
    resultRedDesc: 'यस जाँचले देखाउँछ कि अस्पतालका डाक्टरलाई तत्काल भेट्नु आवश्यक छ। आशा कार्यकर्ताले सिफारिसमा सहयोग गर्नेछिन्।',
    resultDisclaimer: 'क्लिनिकल सीमा: यो जाँच कुनै अन्तिम चिकित्सा निदान होइन। हरियो नतिजा पनि रोगको पूर्ण अनुपस्थितिको प्रमाण होइन।',
    createReferral: 'अस्पताल सिफारिस बनाउनुहोस् (Create Referral)',
    returnHome: 'गृहपृष्ठमा फर्कनुहोस् (Return Home)',

    openReferralsHeader: 'सक्रिय खुल्ला सिफारिसहरू (Open Follow-Through)',
    recordHospitalOutcome: 'अस्पताल नतिजा दर्ता गर्नुहोस् (Close Loop)',
    closeLoopSuccess: 'सिफारिस सम्पन्न भयो र क्लिनिकल लूप बन्द गरियो।',

    navHome: 'गृहपृष्ठ',
    navScreening: 'स्क्रिनिङ',
    navReferrals: 'सिफारिस',
    navSettings: 'सेटिङ',

    audioGreeting: 'नमस्ते आशा दिदी। आज तपाईंको क्षेत्रमा तीन जनाको फलो-अप बाँकी छ र दुई जना अस्पताल सिफारिस रिपोर्टको पर्खाइमा छन्।',
    audioSelectPathway: 'कृपया जाँचको विधि छान्नुहोस्: छाला, आँखा, छाती वा रगतको रिपोर्ट।',
    audioCameraGuide: 'बिरामीलाई राम्रो प्राकृतिक उज्यालोमा राख्नुहोस् र क्यामेरा स्थिर राखेर फोटो लिनुहोस्।',
    audioResultGreen: 'यस जाँचमा कुनै चिन्ताको विषय भेटिएन। सामान्य हेरचाह जारी राख्नुहोस्।',
    audioResultAmber: 'केही लक्षणहरूको लागि डाक्टरबाट जाँच गराउनु उपयुक्त हुनेछ। आशा दिदीले सहयोग गर्नुहुनेछ।',
    audioResultRed: 'यस जाँचले देखाउँछ कि तुरुन्तै अस्पतालको डाक्टरलाई देखाउन आवश्यक छ।',

    audioGreetingPhonetic: 'Namaste ASHA didi. Aaja tapaanko kshetrama teen janako follow-up baaki chha ra dui jana hospital referral reportko parkhaima chhan.',
    audioSelectPathwayPhonetic: 'Kripaya jaanchko bidhi chhaannuhos: chhaala, aankha, chhaati waa ragatko report.',
    audioCameraGuidePhonetic: 'Biraamilaai raamro praakritik ujyaalomaa raakhnuhos ra camera sthir raakhera photo linuhos.',
    audioResultGreenPhonetic: 'Yas jaanchmaa kunai chintaako bishaya bhetiyena. Saamaanya herchaaha jaari raakhnuhos.',
    audioResultAmberPhonetic: 'Kehi lakshanko laagi doctorbaata jaanch garaaunu upajukta hunechha. ASHA didile sahayog garnuhunechha.',
    audioResultRedPhonetic: 'Yas jaanchle dekhaaunchha ki turuntai hospitalko doctorlaai dekhaauna aawashyak chha.',
  },

  // 15. Maithili (मैथिली - Bihar / Mithila)
  mai: {
    appTitle: 'प्रोजेक्ट साथी',
    tagline: 'देखभालक किछु नज़दीक। स्वास्थ्य दिस पहिल कदम।',
    demoBadge: 'प्रदर्शन मोड — चिकित्सीय उपयोग लेल नहि',
    homeTitle: 'आशा स्वास्थ्य सहायिका',
    registerTitle: 'रोगी पंजीकरण',
    consentTitle: 'रोगी सहमति पत्र',
    pathwaySelectTitle: 'जाँचक तरीका चुनू',
    skinScreeningTitle: 'चाम लक्षण जाँच',
    eyeScreeningTitle: 'आँखि एवं पर्दा जाँच',
    chestScreeningTitle: 'छाती एवं टीबी जाँच',
    bloodScreeningTitle: 'रक्त जाँच (CBC फनल)',
    resultTitle: 'जाँच परिणाम',
    referralsTitle: 'खुजल रेफरल',
    timelineTitle: 'रोगी इतिहास',
    followupsTitle: 'पुनः जाँच एवं फलो-अप',
    settingsTitle: 'सेटिंग्स एवं सिंक',

    offlineStatusReady: 'ऑफलाइन सक्रिय • ३ रिकॉर्ड सिंक लेल तैयार',
    todayTasksHeader: 'आइ-क मुख्य काज (Today Tasks)',
    followupTaskCount: '३ लोकनि के पुनः जाँच (Follow-up) बाँकी अछि',
    followupTaskDesc: 'गाम: रामपूर • ७ दिनक समयसीमा',
    openReferralsCount: '२ रेफरल अस्पताल परिणामक प्रतीक्षा मे अछि',
    openReferralsDesc: 'सीएचसी नाभा • फलो-थ्रू लूप सक्रिय',
    pendingBadge: 'लंबित',
    activeBadge: 'सक्रिय',

    startScreening: 'जाँच शुरू करू (Start Screening)',
    registerPatient: 'नया रोगी पंजीकृत करू (Register)',
    patientTimeline: 'रोगी स्वास्थ्य इतिहास',
    syncAndLanguage: 'सिंक एवं भाषा',

    villageLabel: 'गामक नाम (Village Name)',
    ageLabel: 'उमिर (वर्ष मे)',
    genderLabel: 'लिंग (Gender)',
    phoneLabel: 'पारिवारिक संपर्क फोन',
    genderFemale: 'महिला (Female)',
    genderMale: 'पुरुष (Male)',
    genderOther: 'अन्य (Other)',
    optionalPhotoNotice: 'गोपनीयता सुरक्षा: फोटो इलाज लेल अनिवार्य नहि अछि। सुरक्षित कोड स्वतः जारी होयत।',
    takeOptionalPhoto: 'वैकल्पिक पहचान फोटो लिअ',
    photoAttached: 'वैकल्पिक फोटो संलग्न अछि ✓',
    nextConsent: 'सहमति एवं आगू बढ़ू (Next: Consent)',
    consentNotice: 'सहमति नहि देला परो रोगी के डॉक्टर वा आपातकालीन सेवा सं वंचित नहि कएल जा सकैत अछि।',
    consentCareTitle: '१. प्राथमिक स्वास्थ्य जाँचक सहमति',
    consentCareDesc: 'चाम, आँखि वा लक्षणक प्राथमिक स्क्रीनिंग।',
    consentReferralTitle: '२. अस्पताल रेफरल समन्वय',
    consentReferralDesc: 'लक्षण देखला पर सीएचसी डॉक्टर सं रिपोर्ट साझा करब।',
    consentSmsTitle: '३. परिवार के सूचना संदेश (SMS)',
    consentSmsDesc: 'मात्र समय व तारीकक तटस्थ संदेश (बीमारीक नाम नहि)।',
    consentResearchTitle: '४. गैर-अनिवार्य शोध उपयोग (Research)',
    consentResearchDesc: 'अनाम शोध उपयोग। इलाज लेल बिल्कुल अनिवार्य नहि।',
    saveConsentAndSelect: 'सहमति सहेजूं एवं जाँच चुनू',

    pathwaySkinTitle: 'चाम लक्षण जाँच (Skin-Sign)',
    pathwaySkinDesc: 'असामान्य घाव, नील दाग, दाना वा पीयरपन।',
    pathwayEyeTitle: 'आँखि एवं पर्दा जाँच (Retina Check)',
    pathwayEyeDesc: 'मधुमेह रोगी मे रेटिना जाँच (फंडस लेंस आवश्यक)।',
    pathwayChestTitle: 'छाती एवं टीबी जाँच (Chest / TB)',
    pathwayChestDesc: 'डिजिटल एक्स-रे वा २ सप्ताहक खोंखी लक्षण प्रोटोकॉल।',
    pathwayBloodTitle: 'रक्त जाँच (CBC Cancer Funnel)',
    pathwayBloodDesc: 'सीबीसी मान, प्लेटलेट्स व माइक्रोस्कोप स्लाइड समीक्षा।',
    emergencyAlertBanner: 'सांस लेबय मे भारी तकलीफ वा बेहोशी अछि? १०८ आपातकालीन सहायता एतय देखू।',

    step1Of3: 'चरण १/३: स्क्रीनिंग प्रकार चुनू',
    step2Of3: 'चरण २/३: फोटो एवं गुणवत्ता सत्यापन',
    step3Of3: 'चरण ३/३: परिणाम एवं आगूक कदम',
    cameraDistanceGuide: 'प्राकृतिक इजोत मे १५ सेमीक दूरी राखू',
    cameraLightingGuide: 'Blur > 110 • हाथ स्थिर राखि फोटो लिअ',
    qualityValidated: 'फोटो गुणवत्ता सत्यापित भेल (Sharp & Clear)',
    captureImage: 'फोटो खींचू एवं जाँचू (Capture)',
    reviewResult: 'जाँच परिणाम देखू (Review Result)',

    resultGreenTitle: 'एहि जाँच मे कोनो चिंताजनक लक्षण नहि देखल गेल।',
    resultGreenDesc: 'एहि जाँच मे कोनो चिंताक बात नहि पाओल गेल अछि। सामान्य देखभाल जारी राखू एवं आशा दीदीक सलाहक पालन करू।',
    resultAmberTitle: 'किछु लक्षणक डॉक्टर द्वारा जाँच आवश्यक अछि।',
    resultAmberDesc: 'एक बेर फेर जाँच करवायब मददगार भ सकैत अछि। अहाँक आशा कार्यकर्ता आगूक मार्गदर्शन करतीह।',
    resultRedTitle: 'तुरंत डॉक्टर सं जाँच करबाक सलाह देल जाइत अछि।',
    resultRedDesc: 'एहि जाँच सं पता चलैत अछि जे डॉक्टर सं भेटब आवश्यक अछि। आशा कार्यकर्ता अस्पताल रेफरल मे सहयोग करतीह।',
    resultDisclaimer: 'क्लिनिकल सीमा: ई जाँच कोनो बीमारीक पक्का निदान नहि अछि। हरियर परिणाम सेहो बीमारीक पूर्ण अनुपस्थिति सिद्ध नहि करैत अछि।',
    createReferral: 'अस्पताल रेफरल बनाउ (Create Referral)',
    returnHome: 'आशा होम पर वापस जाउ (Return Home)',

    openReferralsHeader: 'सक्रिय खुजल रेफरल (Open Follow-Through)',
    recordHospitalOutcome: 'अस्पताल परिणाम दर्ज करू (Close Loop)',
    closeLoopSuccess: 'रेफरल पूर्ण भेल एवं क्लिनिकल लूप समाप्त भेल।',

    navHome: 'होम',
    navScreening: 'स्क्रीनिंग',
    navReferrals: 'रेफरल',
    navSettings: 'सेटिंग्स',

    audioGreeting: 'प्रणाम आशा दीदी। आइ अहाँक क्षेत्र मे तीन लोकनि के फलो-अप बाँकी अछि आ दू टा रेफरल अस्पताल रिपोर्टक प्रतीक्षा मे अछि।',
    audioSelectPathway: 'कृपा कए जाँचक तरीका चुनू: चाम, आँखि, छाती वा खूनक रिपोर्ट।',
    audioCameraGuide: 'रोगी के निक प्राकृतिक इजोत मे बैसाउ। कैमरा के स्थिर राखि फोटो लिअ।',
    audioResultGreen: 'एहि जाँच मे कोनो चिंताक बात नहि पाओल गेल अछि। सामान्य देखभाल जारी राखू।',
    audioResultAmber: 'किछु लक्षण लेल डॉक्टरक जाँच आवश्यक अछि। आशा दीदी मार्गदर्शन करतीह।',
    audioResultRed: 'एहि जाँच सं पता चलैत अछि जे डॉक्टर सं भेटब जरूरी अछि। अस्पताल रेफरल कएल जा रहल अछि।',

    audioGreetingPhonetic: 'Pranam ASHA didi. Aai ahanke kshetra mein teen lokanik follow-up baaki achhi aa du ta referral hospital reportak pratiksha mein achhi.',
    audioSelectPathwayPhonetic: 'Kripa kae jaanchak tarika chunu: chaam, aankhi, chhati ya khoonak report.',
    audioCameraGuidePhonetic: 'Rogi ke neek prakritik ijot mein baisau. Camera sthir raakhi photo lia.',
    audioResultGreenPhonetic: 'Ehi jaanch mein kono chintak baat nahi paol gel. Saamanya dekhbhal jaari rakhu.',
    audioResultAmberPhonetic: 'Kichhu lakshan lel doctorak jaanch zaroori achhi. ASHA didi margdarshan karti.',
    audioResultRedPhonetic: 'Ehi jaanch se pata chalait achhi je doctor se bhetab zaroori achhi. Turant hospital referral karu.',
  },

  // 16. Bodo (बड़ो - Assam / Bodoland)
  brx: {
    appTitle: 'प्रोजेक्ट साथी',
    tagline: 'फाहामनायनि खाथिराव। साबसिन सावस्रिनि थाखाय सेथि आगान।',
    demoBadge: 'दिन्थिनाय मड — फाहामथायनि बाहायनाय नङा',
    homeTitle: 'आशा सावस्री हेफाजाबगिरि',
    registerTitle: 'मोजां सायारि मुं थिसननाय',
    consentTitle: 'सायारिनि गनायथि बिलाइ',
    pathwaySelectTitle: 'आनजादनि राहा सायख\'',
    skinScreeningTitle: 'बिगुरनि दिन्थि आनजाद',
    eyeScreeningTitle: 'मेगन आरो रेटिना आनजाद',
    chestScreeningTitle: 'बिखा आरो टिबि आनजाद',
    bloodScreeningTitle: 'थै आनजाद (CBC Funnel)',
    resultTitle: 'आनजाद फिथाय',
    referralsTitle: 'उदां रेफारेल',
    timelineTitle: 'सायारि जारिमिन',
    followupsTitle: 'फिन नायगिरनाय आरो फलो-आप',
    settingsTitle: 'सेटिं आरो सिंक',

    offlineStatusReady: 'अफ़लाइन दं • ३ संथ्रि सिंकनि थाखाय थियारि',
    todayTasksHeader: 'दिनैनि गाहाय खामानि (Today Tasks)',
    followupTaskCount: '३ सायारिनि फिन नायगिरनाय (Follow-up) खालामनांगौ',
    followupTaskDesc: 'गामि: रामपुर • ७ साननि समाव',
    openReferralsCount: '२ रेफारेल देहा फाहामसालि फिथायनि नेनायाव दं',
    openReferralsDesc: 'सि.एच.सि. नाभा • फलो-थ्रु लुप जाफुंदों',
    pendingBadge: 'नेनाय',
    activeBadge: 'जाफुं',

    startScreening: 'आनजाद जागाय (Start Screening)',
    registerPatient: 'गोदान सायारि मुं थिसन (Register)',
    patientTimeline: 'सायारि सावस्री जारिमिन',
    syncAndLanguage: 'सिंक आरो राव',

    villageLabel: 'गामिनि मुं (Village Name)',
    ageLabel: 'बैसो (बोसोराव)',
    genderLabel: 'लिंग (Gender)',
    phoneLabel: 'नखरनि फोन नम्बर',
    genderFemale: 'हिनजाव (Female)',
    genderMale: 'हौवा (Male)',
    genderOther: 'गुबुन (Other)',
    optionalPhotoNotice: 'गोपनीयता रैखाथि: फोटो फाहामनायनि थाखाय गोनांथार नङा। रैखाथि कोड सोरजिंगोन।',
    takeOptionalPhoto: 'गावनि मोजां मोन्नाय फोटो ला',
    photoAttached: 'फोटो फोनांजाबबाय ✓',
    nextConsent: 'गनायथि आरो सिगां थां (Next: Consent)',
    consentNotice: 'गनायथि होयिब्लाबो सायारिया डाक्टर एबा जंखाय समनि फाहामथाय मोन्नायाव हेंथा मोन्नाय नङा।',
    consentCareTitle: '१. गिबि सावस्री आनजादनि गनायथि',
    consentCareDesc: 'बिगुर, मेगन एबा दिन्थिनि गिबि स्क्रिनिं।',
    consentReferralTitle: '२. देहा फाहामसालि रेफारेल',
    consentReferralDesc: 'दिन्थि नुब्ला सि.एच.सि. डाक्टरजों रिपोर्ट राननाय।',
    consentSmsTitle: '३. नखरनो खौरां एस.एम.एस. (SMS)',
    consentSmsDesc: 'सान आरो समनि खौरांखल\' (बेरामनि मुं गैया)।',
    consentResearchTitle: '४. नागिरनाय रिसर्च बाहायनाय',
    consentResearchDesc: 'मुंगैयै गुन बांहोनाय। फाहामथायनि थाखाय गोनांथार नङा।',
    saveConsentAndSelect: 'गनायथि दोनथुम आरो आनजाद सायख\'',

    pathwaySkinTitle: 'बिगुरनि दिन्थि आनजाद (Skin-Sign)',
    pathwaySkinDesc: 'अखरां घाव, गोमोनाय, फोथा एबा गोमो जानाय।',
    pathwayEyeTitle: 'मेगन आरो रेटिना आनजाद (Retina Check)',
    pathwayEyeDesc: 'डाइबेटिस सायारिनि रेटिना आनजाद (फन्डस लेन्स गोनां)।',
    pathwayChestTitle: 'बिखा आरो टिबि आनजाद (Chest / TB)',
    pathwayChestDesc: 'डिजिटेल एक्स-रे एबा २ सप्ता खंख्रायनाय प्रोटोकल।',
    pathwayBloodTitle: 'थै आनजाद (CBC Cancer Funnel)',
    pathwayBloodDesc: 'सिबिसि मान, प्लेटलेट्स आरो माइक्रोस्कोप स्लाइड नायनाय।',
    emergencyAlertBanner: 'हाबसोनाय गोब्राब जानाय एबा गोसो गैयै जादों नामा? १०८ गोख्रों हेफाजाब नाय।',

    step1Of3: 'आगान १/३: आनजाद प्रकार सायख\'',
    step2Of3: 'आगान २/३: फोटो आरो गुन नायबिजिरनाय',
    step3Of3: 'आगान ३/३: फिथाय आरो उनाव आगान',
    cameraDistanceGuide: 'मिथिंगायारि सोरांआव १५ से.मि. गोजानाव दोन',
    cameraLightingGuide: 'Blur > 110 • आखाय दोलोहोआलासे फोटो ला',
    qualityValidated: 'फोटोनि गुन थार जाबाय (Sharp & Clear)',
    captureImage: 'फोटो ला आरो आनजाद खालाम (Capture)',
    reviewResult: 'आनजाद फिथाय नाय (Review Result)',

    resultGreenTitle: 'बे आनजादाव गिनांगौ महर नुवाखै।',
    resultGreenDesc: 'बे आनजादाव गिनांगौ जाथाय मोन्नाय जायाखै। सरासनस्रा जतन लाबाय था आरो आशा दीदीनि बाथ्रा मान।',
    resultAmberTitle: 'माखासे दिन्थिनि थाखाय डाक्टरजों नायबिजिरनाया गोनां।',
    resultAmberDesc: 'आरो फिन खेबसे डाक्टरनो दिन्थिनाया मोजां जागोन। नोंनि आशा हेफाजाबगिरिया लामा दिन्थिगोन।',
    resultRedTitle: 'गोख्रै डाक्टरनो दिन्थिनो थि खालामनाय जाबाय।',
    resultRedDesc: 'बे आनजादा डाक्टरजों लोगो हमनाया गोनांथार होन्ना दिन्थियो। आशा दिदिया रेफारेल खालामनायाव हेफाजाब होगोन।',
    resultDisclaimer: 'क्लिनिकेल सिमा: बे आनजादा जोबथा बेराम निदान नङा। गाज्रि नङि फिथायाबो बेराम गैयैनि थार साक्षी नङा।',
    createReferral: 'देहा फाहामसालि रेफारेल बानाय (Create Referral)',
    returnHome: 'आशा न\'सिम गिदिंफिन (Return Home)',

    openReferralsHeader: 'जाफुं उदां रेफारेल (Open Follow-Through)',
    recordHospitalOutcome: 'देहा फाहामसालि फिथाय लिर (Close Loop)',
    closeLoopSuccess: 'रेफारेल जोबबाय आरो क्लिनिकेल लुप बन्द जाबाय।',

    navHome: 'न\'',
    navScreening: 'आनजाद',
    navReferrals: 'रेफारेल',
    navSettings: 'सेटिं',

    audioGreeting: 'खुलुमबाय आशा दीदी। दिनै नोंनि ओनसोलआव ३ सायारिनि फलो-आप दं आरो २ रेफारेल अस्पताल रिपोर्टनि नेनायाव दं।',
    audioSelectPathway: 'अननानै आनजादनि राहा सायख\': बिगुर, मेगन, बिखा एबा थैनि रिपोर्ट।',
    audioCameraGuide: 'सायारिखौ मोजां मिथिंगायारि सोरांआव फुजा। क्यामेराखौ दोलोहोआलासे फोटो ला।',
    audioResultGreen: 'बे आनजादाव गिनांगौ खोथा मोन्नाय जायाखै। सरासनस्रा जतन लाबाय था।',
    audioResultAmber: 'माखासे दिन्थिखौ डाक्टरनो दिन्थिनाया मोजां। आशा दीदिया हेफाजाब होगोन।',
    audioResultRed: 'बे आनजादा डाक्टरनो गोख्रै दिन्थिनो गोनांथार होन्ना दिन्थियो। अस्पताल रेफारेल खालामनाय जाबाय।',

    audioGreetingPhonetic: 'Khulumbai ASHA didi. Dini noni onsolao tham sayarini follow-up dong aro noi referral hospital reportni nenaiao dong.',
    audioSelectPathwayPhonetic: 'Onnanoi anjaadni raha saikho: bigur, megon, bikha eba thoini report.',
    audioCameraGuidePhonetic: 'Sayarikhou mojaang mothingyari soraangao phuja. Camera dolo-ho-alase photo la.',
    audioResultGreenPhonetic: 'Be anjaadao ginangou khotha monnai jayakhoi. Sorasonsra joton labay tha.',
    audioResultAmberPhonetic: 'Makhase dinthikhou doctorno dinthinaya mojang. ASHA didiya hephajab hogon.',
    audioResultRedPhonetic: 'Be anjaada doctorno gokhroi dinthino gonanthar honna dinthiyo. Hospital referral khalamnay jabay.',
  },

  // 17. Dogri (डोगरी - Jammu & Kashmir)
  doi: {
    appTitle: 'प्रोजेक्ट साथी',
    tagline: 'देखभाल दे थोड़े नेड़े। सेहत आह्ले पासे पैह्ला कदम।',
    demoBadge: 'प्रदर्शन मोड — क्लिनिकल बरतारे लेई नेईं',
    homeTitle: 'आशा सेहत मददगार',
    registerTitle: 'मरीज़ पंजीकरण',
    consentTitle: 'मरीज़ रज़ामंदी पत्र',
    pathwaySelectTitle: 'जाँच दा तरीका चुनो',
    skinScreeningTitle: 'चमड़ी लक्षण जाँच',
    eyeScreeningTitle: 'अक्खी ते पर्दा जाँच',
    chestScreeningTitle: 'छाती ते टीबी जाँच',
    bloodScreeningTitle: 'खून जाँच (CBC फनल)',
    resultTitle: 'जाँच नतीजा',
    referralsTitle: 'खुह्ले रेफरल',
    timelineTitle: 'मरीज़ सेहत इतिहास',
    followupsTitle: 'परतियै जाँच ते फालो-अप',
    settingsTitle: 'सेटिंग्स ते सिंक',

    offlineStatusReady: 'ऑफलाइन चालू • ३ रिकार्ड सिंक लेई त्यार',
    todayTasksHeader: 'अज्ज दे मुख्य कम्म (Today Tasks)',
    followupTaskCount: '३ मरीज़ें दी मुड़ जाँच (Follow-up) बाकी ऐ',
    followupTaskDesc: 'ग्रां: रामपुर • ७ दिनें दी मियाद',
    openReferralsCount: '२ रेफरल हस्पताल रिपोर्ट दी उडीक च न',
    openReferralsDesc: 'सीएचसी नाभा • फालो-थ्रू लूप चालू',
    pendingBadge: 'बाकी',
    activeBadge: 'चालू',

    startScreening: 'जाँच शुरू करो (Start Screening)',
    registerPatient: 'नमां मरीज़ दर्ज करो (Register)',
    patientTimeline: 'मरीज़ इतिहास',
    syncAndLanguage: 'सिंक ते बोली',

    villageLabel: 'ग्रां दा नां (Village Name)',
    ageLabel: 'उमर (सालें च)',
    genderLabel: 'लिंग (Gender)',
    phoneLabel: 'टब्बर दा राबता फोन',
    genderFemale: 'जनानी (Female)',
    genderMale: 'मर्द (Male)',
    genderOther: 'होर (Other)',
    optionalPhotoNotice: 'गोपनीयता सुरक्षा: फोटो इलाज लेई लाज़मी नेईं ऐ। इक महफूज़ कोड जारी होग।',
    takeOptionalPhoto: 'मर्जी दी पछान फोटो लैओ',
    photoAttached: 'फोटो जुड़ी गेई ऐ ✓',
    nextConsent: 'रज़ामंदी ते अग्गें बद्धो (Next: Consent)',
    consentNotice: 'रज़ामंदी नेईं देने पर वी मरीज़ गी डाक्टर जां इमरजेंसी सेवा थमां वंचित नेईं रक्खेआ जाई सकदा।',
    consentCareTitle: '१. प्राथमिक सेहत जाँच दी रज़ामंदी',
    consentCareDesc: 'चमड़ी, अक्खी जां लक्षणें दी मुढली स्क्रीनिंग।',
    consentReferralTitle: '२. हस्पताल रेफरल तालमेल',
    consentReferralDesc: 'लक्षण दिसने पर सीएचसी डाक्टर कन्नै रिपोर्ट साझी करना।',
    consentSmsTitle: '३. टब्बर गी सूचना सुनेहा (SMS)',
    consentSmsDesc: 'सिर्फ तरीक ते वेहले दा सुनेहा (बमारी दा नां नेईं)।',
    consentResearchTitle: '४. गैर-लाज़मी खोज बरतारा',
    consentResearchDesc: 'गुमनाम खोज बरतारा। इलाज लेई बिल्कुल लाज़मी नेईं।',
    saveConsentAndSelect: 'रज़ामंदी सांभो ते जाँच चुनो',

    pathwaySkinTitle: 'चमड़ी लक्षण जाँच (Skin-Sign)',
    pathwaySkinDesc: 'असाधारण फट्ट, नीले नशान, दाने जां पीलापन।',
    pathwayEyeTitle: 'अक्खी ते पर्दा जाँच (Retina Check)',
    pathwayEyeDesc: 'शुगर आह्ले मरीज़ें च रेटिना जाँच (फंडस लेंस लोड़चदा)।',
    pathwayChestTitle: 'छाती ते टीबी जाँच (Chest / TB)',
    pathwayChestDesc: 'डिजिटल एक्स-रे जां २ हफ्ते दी खंग प्रोटोकाल।',
    pathwayBloodTitle: 'खून जाँच (CBC Cancer Funnel)',
    pathwayBloodDesc: 'सीबीसी मान, प्लेटलेट्स ते माइक्रोस्कोप स्लाइड समीक्षा।',
    emergencyAlertBanner: 'साह लैने च भारी तकलीफ जां बेहोशी ऐ? १०८ इमरजेंसी मद्द ऐत्थै दिखो।',

    step1Of3: 'कदम १/३: जाँच दा प्रकार चुनो',
    step2Of3: 'कदम २/३: फोटो ते मयार परताल',
    step3Of3: 'कदम ३/३: नतीजा ते अग्गले कदम',
    cameraDistanceGuide: 'कुदरती चानने च १५ सेमी दी दूरी रक्खो',
    cameraLightingGuide: 'Blur > 110 • हत्थ स्थिर रक्खी फोटो खींचो',
    qualityValidated: 'फोटो दा मयार सही ऐ (Sharp & Clear)',
    captureImage: 'फोटो खींचो ते परखो (Capture)',
    reviewResult: 'जाँच नतीजा दिखो (Review Result)',

    resultGreenTitle: 'इस जाँच च कोई चिंताजनक लक्षण नेईं दिक्खेआ गेआ।',
    resultGreenDesc: 'इस जाँच च कोई फिक्र दी गल्ल नेईं पाई गेई। आम संभाल जारी रक्खो ते अपनी आशा दीदी दी सलाह मन्नो।',
    resultAmberTitle: 'कुझ लक्षणें दी डाक्टर थमां जाँच जरूरी ऐ।',
    resultAmberDesc: 'इक बारी परतियै डाक्टर गी दस्सणा मददगार होई सकदा ऐ। तुहांदी आशा दीदी अग्गें दस्सग।',
    resultRedTitle: 'झटपट डाक्टर थमां जाँच करवाइ लैने दी सलाह दित्ती जंदी ऐ।',
    resultRedDesc: 'इस जाँच थमां पता लगदा ऐ जे डाक्टर गी दिक्खाना जरूरी ऐ। आशा कार्यकर्ता हस्पताल रेफरल च मद्द करग।',
    resultDisclaimer: 'क्लिनिकल सीमा: एह् जाँच कोई पक्का निदान नेईं ऐ। हरा नतीजा वी बमारी दे पूरे ना होने दा पक्का सबूत नेईं ऐ।',
    createReferral: 'हस्पताल रेफरल बनाओ (Create Referral)',
    returnHome: 'आशा होम पर परतो (Return Home)',

    openReferralsHeader: 'चालू खुह्ले रेफरल (Open Follow-Through)',
    recordHospitalOutcome: 'हस्पताल नतीजा दर्ज करो (Close Loop)',
    closeLoopSuccess: 'रेफरल पूरा होआ ते क्लिनिकल लूप मुक्की गेआ।',

    navHome: 'होम',
    navScreening: 'स्क्रीनिंग',
    navReferrals: 'रेफरल',
    navSettings: 'सेटिंग्स',

    audioGreeting: 'नमस्ते आशा दीदी। अज्ज तुहांदे इलाके च त्रैह मरीज़ें दा फालो-अप बाकी ऐ ते दो रेफरल हस्पताल रिपोर्ट दी उडीक च न।',
    audioSelectPathway: 'किरपा करियै जाँच दा तरीका चुनो: चमड़ी, अक्खी, छाती जां खून दी रिपोर्ट।',
    audioCameraGuide: 'मरीज़ गी चंगे कुदरती चानने च ब्हालो। कैमरा स्थिर रक्खी फोटो लैओ।',
    audioResultGreen: 'इस जाँच च कोई चिंता दी गल्ल नेईं पाई गेई। आम देखभाल जारी रक्खो।',
    audioResultAmber: 'कुझ लक्षणें लेई डाक्टर दी जाँच जरूरी ऐ। आशा दीदी मदद करग।',
    audioResultRed: 'इस जाँच थमां पता लगदा ऐ जे डाक्टर गी झटपट दिक्खाना जरूरी ऐ। हस्पताल रेफरल तैय्यार ऐ।',

    audioGreetingPhonetic: 'Namaste ASHA didi. Ajj tuhande ilaake ch traih mareezen da follow-up baaki ai te do referral hospital report di udeek ch nan.',
    audioSelectPathwayPhonetic: 'Kirpa kariyai jaanch da tareeka chuno: chamdi, akkhi, chhati jaan khoon di report.',
    audioCameraGuidePhonetic: 'Mareez gi change kudrati chanane ch bhalo. Camera sthir rakkhi photo laio.',
    audioResultGreenPhonetic: 'Is jaanch ch koi chinta di gall neein paayi gayi. Aam dekhbhal jaari rakkho.',
    audioResultAmberPhonetic: 'Kujh lakshanen leii doctor di jaanch zaroori ai. ASHA didi madad karag.',
    audioResultRedPhonetic: 'Is jaanch thama pata lagda ai je doctor gi jhatpat dikhana zaroori ai. Hospital referral tayyar ai.',
  },

  // 18. Kashmiri (कॉशुर - Kashmir Valley)
  ks: {
    appTitle: 'प्रोजेक्ट साथी',
    tagline: 'देखभाले निश करीब। सेहतुक गोडन्युक कदम।',
    demoBadge: 'नुमाइशी मोड — इलाज खातिर छु न',
    homeTitle: 'आशा सेहत मददगार',
    registerTitle: 'मरीज़ इंदराज़',
    consentTitle: 'मरीज़ रज़ामंदी फॉर्म',
    pathwaySelectTitle: 'जाँचुक तरीक़ा चुनिव',
    skinScreeningTitle: 'चमड़ी अलामत जाँच',
    eyeScreeningTitle: 'अछ ते पर्दा जाँच',
    chestScreeningTitle: 'सीने ते टीबी जाँच',
    bloodScreeningTitle: 'खून जाँच (CBC फनल)',
    resultTitle: 'जाँचुक नतीजा',
    referralsTitle: 'खुलिमित रेफरल',
    timelineTitle: 'मरीज़ सेहत तवारीख',
    followupsTitle: 'दोबारा जाँच ते फालो-अप',
    settingsTitle: 'सेटिंग्स ते सिंक',

    offlineStatusReady: 'ऑफलाइन चालू • ३ रिकार्ड सिंक खातिर तय्यार',
    todayTasksHeader: 'अज़ुक अहम काम (Today Tasks)',
    followupTaskCount: '३ मरीज़न हुंद दोबारा जाँच (Follow-up) बाकी',
    followupTaskDesc: 'गाम: रामपुर • ७ दोहन हुंद वक़्त',
    openReferralsCount: '२ रेफरल हस्पताल रिपोर्टुक इंतज़ार करान',
    openReferralsDesc: 'सीएचसी नाभा • फालो-थ्रू लूप चालू',
    pendingBadge: 'बाकी',
    activeBadge: 'चालू',

    startScreening: 'जाँच शुरू करिव (Start Screening)',
    registerPatient: 'नव्युव मरीज़ दर्ज करिव (Register)',
    patientTimeline: 'मरीज़ तवारीख',
    syncAndLanguage: 'सिंक ते ज़बान',

    villageLabel: 'गामुक नाव (Village Name)',
    ageLabel: 'उमर (वरियन मंज़)',
    genderLabel: 'जिंस (Gender)',
    phoneLabel: 'खानदानी राबता फोन',
    genderFemale: 'ज़नान (Female)',
    genderMale: 'मर्द (Male)',
    genderOther: 'बाक़ी (Other)',
    optionalPhotoNotice: 'राज़दारी तहफ़्फ़ुज़: फोटो इलाज खातिर लाज़मी छु न। अख महफ़ूज़ कोड बननि यियि।',
    takeOptionalPhoto: 'इख्तियारी पछान फोटो तुलिव',
    photoAttached: 'फोटो छु जोड़ित्ह ✓',
    nextConsent: 'रज़ामंदी ते ब्रोंह पखिव (Next: Consent)',
    consentNotice: 'रज़ामंदी न दिनस बावज़ूद त मरीज़स डाक्टर या हंगामी इमदाद निश महरूम थावनि यियि न।',
    consentCareTitle: '१. बुनियादी सेहत जाँचेच रज़ामंदी',
    consentCareDesc: 'चमड़ी, अछ या अलामतेच गोडनिच स्क्रीनिंग।',
    consentReferralTitle: '२. हस्पताल रेफरल राबता',
    consentReferralDesc: 'अलामत दिखनेस प्यठ सीएचसी डाक्टरस रिपोर्ट हवाल करिन।',
    consentSmsTitle: '३. खानदानस पैगाम (SMS)',
    consentSmsDesc: 'सिर्फ तरीक ते वक़्तुक पैगाम (बमारी हुंद नाव छु न)।',
    consentResearchTitle: '४. गैर-लाज़मी तहक़ीक़ी इस्तिमाल',
    consentResearchDesc: 'बेनाव तहक़ीक़। इलाज खातिर लाज़मी छु न।',
    saveConsentAndSelect: 'रज़ामंदी महफ़ूज़ करिव ते जाँच चुनिव',

    pathwaySkinTitle: 'चमड़ी अलामत जाँच (Skin-Sign)',
    pathwaySkinDesc: 'अजीब ज़ख्म, न्युल निशान, दाना या ज़र्द रंगत।',
    pathwayEyeTitle: 'अछ ते पर्दा जाँच (Retina Check)',
    pathwayEyeDesc: 'शुगर मरीज़न मंज़ रेटिना जाँच (फंडस लेंस छु ज़रूर)।',
    pathwayChestTitle: 'सीने ते टीबी जाँच (Chest / TB)',
    pathwayChestDesc: 'डिजिटल एक्स-रे या २ हफ्तन हुंद खोख प्रोटोकाल।',
    pathwayBloodTitle: 'खून जाँच (CBC Cancer Funnel)',
    pathwayBloodDesc: 'सीबीसी मान, प्लेटलेट्स ते माइक्रोस्कोप स्लाइड जायज़ा।',
    emergencyAlertBanner: 'दम तुह्युक सख़्त तक्लीफ़ या बेहोशी छे? १०८ हंगामी मदद यतेत वुछिव।',

    step1Of3: 'कदम १/३: जाँचेच क़िसम चुनिव',
    step2Of3: 'कदम २/३: फोटो ते मयार तस्दीक़',
    step3Of3: 'कदम ३/३: नतीजा ते ब्रोंठिम कदम',
    cameraDistanceGuide: 'क़ुदरती गाहस मंज़ १५ सेमी दूर थाविव',
    cameraLightingGuide: 'Blur > 110 • अथ स्थिर थावित्ह फोटो तुलिव',
    qualityValidated: 'फोटो मयार दुरुस्त (Sharp & Clear)',
    captureImage: 'फोटो तुलिव ते जाँचिव (Capture)',
    reviewResult: 'जाँचुक नतीजा वुछिव (Review Result)',

    resultGreenTitle: 'यथ जाँचस मंज़ कंह ति ख़तरनाक अलामत आव न लबने।',
    resultGreenDesc: 'यथ जाँचस मंज़ कंह फिक्रिच कथ छे न। आम देखभाल जारी थाविव ते पनेनि आशा दीदीयि हुंद मशवरा मानिव।',
    resultAmberTitle: 'केंह अलामतेन खातिर छे डाक्टरस निश जाँच ज़रूरी।',
    resultAmberDesc: 'अक लटिफ डाक्टरस निश जाँच करावुन मददगार साबित गछ़ि। तुहंज़ आशा मददगार करेन रहनुमाई।',
    resultRedTitle: 'फौरन डाक्टरस निश जाँच करावनि हुंद मशवरा छु दिनवान।',
    resultRedDesc: 'यथ जाँच निश छु मालूम गछ़ान ज़े डाक्टरस निश गछुन छु ज़रूरी। आशा दीदी करि हस्पताल रेफरलस मंज़ मदद।',
    resultDisclaimer: 'क्लिनिकल हदबंदी: यिह जाँच छे न कंह आखरी तशख़ीस। सबज़ नतीजा ति छु न बमारी न आसनेच सनद।',
    createReferral: 'हस्पताल रेफरल बनाविव (Create Referral)',
    returnHome: 'आशा होमस प्यठ वापस पखिव (Return Home)',

    openReferralsHeader: 'चालू खुलिमित रेफरल (Open Follow-Through)',
    recordHospitalOutcome: 'हस्पताल नतीजा दर्ज करिव (Close Loop)',
    closeLoopSuccess: 'रेफरल मुकम्मल गोव ते क्लिनिकल लूप मुक्योव।',

    navHome: 'होम',
    navScreening: 'स्क्रीनिंग',
    navReferrals: 'रेफरल',
    navSettings: 'सेटिंग्स',

    audioGreeting: 'सलाम आशा दीदी। अज़ तुहंदिस इलाकेस मंज़ त्रन मरीज़न हुंद फालो-अप छु बाकी ते ज़ रेफरल हस्पताल रिपोर्टुक इंतज़ार करान छि।',
    audioSelectPathway: 'मेहरबानी करित्ह चुनिव जाँचेच तरीक़ा: चमड़ी, अछ, सीना या खूनुक रिपोर्ट।',
    audioCameraGuide: 'मरीज़स ब्यहाविव जान कुदरती गाहस मंज़। कैमरा थाविव स्थिर ते तुलिव फोटो।',
    audioResultGreen: 'यथ जाँचस मंज़ कंह फिक्रिच कथ छे न। आम देखभाल जारी थाविव।',
    audioResultAmber: 'केंह अलामतेन खातिर छु डाक्टरस निश जाँच ज़रूरी। आशा दीदी करि मदद।',
    audioResultRed: 'यथ जाँच निश छु पता लगान ज़े डाक्टरस फौरन वुछावुन छु ज़रूरी। हस्पताल रेफरल तय्यार छु।',

    audioGreetingPhonetic: 'Salaam ASHA didi. Az tuhundis ilakas manz tren mareezan hund follow-up chhu baaki te z referral hospital reportuk intezaar karaan chhi.',
    audioSelectPathwayPhonetic: 'Meherbani karith chuniv jaanchech tareeqa: chamdi, achh, seena ya khoonuk report.',
    audioCameraGuidePhonetic: 'Mareezas byahaviv jaan kudrati gaahas manz. Camera thaviv sthir te tuliv photo.',
    audioResultGreenPhonetic: 'Yath jaanchas manz kanh fikrich kath chhe na. Aam dekhbhal jaari thaviv.',
    audioResultAmberPhonetic: 'Kenh alaamten khatir chhu doctoras nish jaanch zaroori. ASHA didi kari madad.',
    audioResultRedPhonetic: 'Yath jaanch nish chhu pata lagaan ze doctoras fauran wuchhawun chhu zaroori. Hospital referral tayyar chhu.',
  },

  // 19. Konkani (कोंकणी - Goa / Coastal Karnataka / Maharashtra)
  kok: {
    appTitle: 'प्रोजेक्ट साथी',
    tagline: 'संभाळणीक मातशें लागीं। भलायके वटेन पयलें पावल।',
    demoBadge: 'प्रदर्शन मोड — क्लिनिकल उपेगा खातीर न्हय',
    homeTitle: 'आशा भलायकी सहाय्यक',
    registerTitle: 'दुयेंती नोंदणी',
    consentTitle: 'दुयेंती संमती पत्र',
    pathwaySelectTitle: 'तपासणेचो मार्ग वेंचून काढा',
    skinScreeningTitle: 'कात लक्षण तपासणी',
    eyeScreeningTitle: 'दोळे आनी पडदो तपासणी',
    chestScreeningTitle: 'छाती आनी क्षयरोग तपासणी',
    bloodScreeningTitle: 'रगत तपासणी (CBC फनल)',
    resultTitle: 'तपासणी निकाल',
    referralsTitle: 'उगते रेफरल',
    timelineTitle: 'दुयेंती भलायकी इतिहास',
    followupsTitle: 'परतून तपासणी आनी फालो-अप',
    settingsTitle: 'सेटिंग्स आनी सिंक',

    offlineStatusReady: 'ऑफलाइन चालू • ३ नोंदी सिंक खातीर तयार',
    todayTasksHeader: 'आयचीं मुखेल कामां (Today Tasks)',
    followupTaskCount: '३ जाणांची परतून तपासणी (Follow-up) उरल्या',
    followupTaskDesc: 'गांव: रामपूर • ७ दिसांची मुदत',
    openReferralsCount: '२ रेफरल हॉस्पिटलाचे निकालाचे प्रतीक्षेत आसात',
    openReferralsDesc: 'सीएचसी नाभा • फालो-थ्रू लूप चालू',
    pendingBadge: 'उरिल्लें',
    activeBadge: 'सक्रिय',

    startScreening: 'तपासणी सुरू करात (Start Screening)',
    registerPatient: 'नवो दुयेंती नोंद करात (Register)',
    patientTimeline: 'दुयेंती इतिहास',
    syncAndLanguage: 'सिंक आनी भास',

    villageLabel: 'गांवचें नांव (Village Name)',
    ageLabel: 'पिराय (वर्सांनी)',
    genderLabel: 'लिंग (Gender)',
    phoneLabel: 'कुटुंबाचो संपर्क फोन',
    genderFemale: 'बायलमनीस (Female)',
    genderMale: 'दादलो (Male)',
    genderOther: 'हेर (Other)',
    optionalPhotoNotice: 'गुप्तताय राखण: फोटो उपचारा खातीर सक्तीचो ना. सुरक्षीत कोड आपसूक तयार जातलो.',
    takeOptionalPhoto: 'ऐच्छिक वळख फोटो काढा',
    photoAttached: 'फोटो जोडला ✓',
    nextConsent: 'संमती आनी मुखार वचात (Next: Consent)',
    consentNotice: 'संमती दिली ना तरी दुयेंतीक दोतोराकडल्यान वा आणीबाणी सेवेपसून वंचित दवरूंक मेळचें ना.',
    consentCareTitle: '१. प्राथमिक भलायकी तपासणेक संमती',
    consentCareDesc: 'कात, दोळे वा लक्षणांची प्राथमिक स्क्रीनिंग।',
    consentReferralTitle: '२. हॉस्पिटल रेफरल समन्वय',
    consentReferralDesc: 'लक्षण दिसल्यार सीएचसी दोतोराकडल्यान रिपोर्ट वांटून घेवप.',
    consentSmsTitle: '३. कुटुंबाक संदेश (SMS)',
    consentSmsDesc: 'फक्त तारीख आनी वेळेचो संदेश (दुयेंसाचें नांव आसचें ना).',
    consentResearchTitle: '४. ऐच्छिक संशोधन वापर',
    consentResearchDesc: 'अनामिक संशोधन. उपचारा खातीर सक्तीचें ना.',
    saveConsentAndSelect: 'संमती सांबाळा आनी तपासणी वेंचा',

    pathwaySkinTitle: 'कात लक्षण तपासणी (Skin-Sign)',
    pathwaySkinDesc: 'असामान्य घावो, काळे-निळे दाग, पुरळ वा हळदुवेपण.',
    pathwayEyeTitle: 'दोळे आनी पडदो तपासणी (Retina Check)',
    pathwayEyeDesc: 'डायबिटीज आशिल्ल्या दुयेंतींक रेटिना तपासणी (फंडस लेन्स गरजेचो).',
    pathwayChestTitle: 'छाती आनी क्षयरोग तपासणी (Chest / TB)',
    pathwayChestDesc: 'डिजिटल एक्स-रे वा २ सप्तक खोकली लक्षण प्रोटोकॉल.',
    pathwayBloodTitle: 'रगत तपासणी (CBC Cancer Funnel)',
    pathwayBloodDesc: 'सीबीसी प्रमाण, प्लेटलेट्स आनी मायक्रोस्कोप स्लाइड समीक्षा.',
    emergencyAlertBanner: 'श्वास घेवपाक त्रास वा बेशुद्धावस्था आसा? १०८ आपत्कालीन मदत हांगा पळयात.',

    step1Of3: 'पायरी १/३: तपासणी प्रकार वेंचा',
    step2Of3: 'पायरी २/३: फोटो आनी दर्जो तपासणी',
    step3Of3: 'पायरी ३/३: निकाल आनी फुडलें पावल',
    cameraDistanceGuide: 'सैमीक उजवाडांत १५ सेंमी अंतर दवरात',
    cameraLightingGuide: 'Blur > 110 • हात स्थिर दवरून फोटो काढा',
    qualityValidated: 'फोटोचो दर्जो तपासून जालो (Sharp & Clear)',
    captureImage: 'फोटो काढा आनी तपासात (Capture)',
    reviewResult: 'तपासणी निकाल पळयात (Review Result)',

    resultGreenTitle: 'हे तपासणेंत काळजी करपासारकें लक्षण मेळ्ळें ना.',
    resultGreenDesc: 'ह्या तपासणेंत कसलीच भिरांत मेळिल्ली ना. सादारण जतनाय चालू दवरात आनी आपले आशा दीदीचो सल्लो पाळात.',
    resultAmberTitle: 'कांय लक्षणां खातीर दोतोराकडल्यान तपासणी गरजेची.',
    resultAmberDesc: 'आणिक एकदां दोतोराकडल्यान तपासून घेवप बरें पडटलें. तुमची आशा दीदी मार्गदर्शन करतली.',
    resultRedTitle: 'रोकडेंच दोतोराकडल्यान तपासणी करून घेवपाचो सल्लो दिला.',
    resultRedDesc: 'हे तपासणेवयल्यान समजता की दोतोराक मेळप गरजेचें आसा. आशा कार्यकर्ती हॉस्पिटल रेफरलांत मदत करतली.',
    resultDisclaimer: 'क्लिनिकल मर्यादा: ही तपासणी म्हळ्यार अंतिम निदान न्हय. पाचवो निकाल लेगीत दुयेंस ना हाचो पुरावे न्हय.',
    createReferral: 'हॉस्पिटल रेफरल तयार करात (Create Referral)',
    returnHome: 'आशा घरा परतात (Return Home)',

    openReferralsHeader: 'सक्रिय उगते रेफरल (Open Follow-Through)',
    recordHospitalOutcome: 'हॉस्पिटल निकाल नोंद करात (Close Loop)',
    closeLoopSuccess: 'रेफरल पुराय जालो आनी क्लिनिकल लूप सोंपलो.',

    navHome: 'घर',
    navScreening: 'तपासणी',
    navReferrals: 'रेफरल',
    navSettings: 'सेटिंग्स',

    audioGreeting: 'नमस्कार आशा दीदी. आयज तुमच्या वाठारांत तीन जाणांचो फालो-अप उरला आनी दोन रेफरल हॉस्पिटलाचे निकालाचे प्रतीक्षेत आसात.',
    audioSelectPathway: 'उपकार करून तपासणेचो मार्ग वेंचा: कात, दोळे, छाती वा रगताची रिपोर्ट.',
    audioCameraGuide: 'दुयेंतीक बऱ्या सैमीक उजवाडांत बस्वायात. कॅमेरा स्थिर दवरून फोटो काढा.',
    audioResultGreen: 'ह्या तपासणेंत कसलीच काळजी करपाची गजाल मेळिल्ली ना. सादारण जतनाय चालू दवरात.',
    audioResultAmber: 'कांय लक्षणां खातीर दोतोराची तपासणी गरजेची आसा. आशा दीदी मार्गदर्शन करतली.',
    audioResultRed: 'हे तपासणेवयल्यान समजता की रोकडेंच दोतोराक मेळप गरजेचें. हॉस्पिटल रेफरल तयार आसा.',

    audioGreetingPhonetic: 'Namaskar ASHA didi. Aayaj tumchya vaatharant teen jaanacho follow-up urla aani don referral hospital nikalaache pratikashent aasaat.',
    audioSelectPathwayPhonetic: 'Upkaar karun tapasanecho maarg vencha: kaat, dole, chhati vaa ragtaachi report.',
    audioCameraGuidePhonetic: 'Duyentik barya saimik ujvaadaant basvaayat. Camera sthir davrun photo kaadha.',
    audioResultGreenPhonetic: 'Hyaa tapasaneent kaslich kaalji karpaachi gajaal mellili naa. Saadaaran jatnaay chaalu davraat.',
    audioResultAmberPhonetic: 'Kaany lakshanaan khaatir dotoraachi tapaasani garjechi aasa. ASHA didi maargadarshan kartali.',
    audioResultRedPhonetic: 'He tapasanevaylyaan samajtaa ki rokdench dotoraak mellap garjeche. Hospital referral tayar aasa.',
  },

  // 20. Manipuri (মৈতৈলোন্ - Manipur)
  mni: {
    appTitle: 'প্রজেক্ট সাথী',
    tagline: 'য়েংশিনবগী নক্নবা। হকশেলগী মায়কৈদা অহানবা খোঙথাং।',
    demoBadge: 'উৎপগী মওং — লায়েংবগীদমক নত্তে',
    homeTitle: 'আশা হকশেল মতেংপাঙবী',
    registerTitle: 'অনাবা মীওই মিং চনবা',
    consentTitle: 'অনাবগী য়ানবা চে',
    pathwaySelectTitle: 'য়েংশিনবগী লম্বী খনবীয়ু',
    skinScreeningTitle: 'উনশাগী মশক য়েংশিনবা',
    eyeScreeningTitle: 'মিত অমসুং মিতপন য়েংশিনবা',
    chestScreeningTitle: 'থৌ অমসুং টিবি য়েংশিনবা',
    bloodScreeningTitle: 'ঈ য়েংশিনবা (CBC Funnel)',
    resultTitle: 'য়েংশিনবগী ফল',
    referralsTitle: 'হাংদনা লৈরিবা রিফরেল',
    timelineTitle: 'অনাবগী হকশেল পুৱারী',
    followupsTitle: 'অমুক হন্না য়েংশিনবা অমসুং ফলো-অপ',
    settingsTitle: 'সেটিংস অমসুং সিঙ্ক',

    offlineStatusReady: 'ওফলাইন চল্লাইরি • ৩ রেকোর্দ সিঙ্ক তৌনবা শেম-শারে',
    todayTasksHeader: 'ঙসীগী মরুওইবা থবকশিং (Today Tasks)',
    followupTaskCount: 'অনাবা ৩ অমুক হন্না য়েংশিনবা (Follow-up) ৱাৎলি',
    followupTaskDesc: 'খুঙ্গং: রামপুর • নুমিৎ ৭কী মতম',
    openReferralsCount: 'রিফরেল ২ হাস্পাতালগী ফল ঙাইরি',
    openReferralsDesc: 'CHC নাভা • ফলো-থ্রু লুপ চল্লাইরি',
    pendingBadge: 'ঙাইরিবা',
    activeBadge: 'চল্লাইরিবা',

    startScreening: 'য়েংশিনবা হৌবীয়ু (Start Screening)',
    registerPatient: 'অনৌবা অনাবা রেজিস্তর তৌবীয়ু (Register)',
    patientTimeline: 'অনাবগী পুৱারী',
    syncAndLanguage: 'সিঙ্ক অমসুং লোন',

    villageLabel: 'খুঙ্গংগী মিং (Village Name)',
    ageLabel: 'চহী (চহীদা)',
    genderLabel: 'নুপা/নুপী (Gender)',
    phoneLabel: 'ইমুংগী পাউ ফাওনবা ফোন',
    genderFemale: 'নুপী (Female)',
    genderMale: 'নুপা (Male)',
    genderOther: 'অতোপ্পা (Other)',
    optionalPhotoNotice: 'লোন্নবা ঙাকশেন: ফোতো লায়েংবদা চঙদে। শাফবা কোদ অমা পীগনি।',
    takeOptionalPhoto: 'শকখঙনবা ফোতো লৌবীয়ু',
    photoAttached: 'ফোতো য়াওরে ✓',
    nextConsent: 'য়ানবা অমসুং মাংলোইনা চংশিল্লু (Next: Consent)',
    consentNotice: 'য়ানবা পীদ্রবসু অনাবদা ডাক্তর নত্রগা অথুবা মতেং ফংহন্দবা য়াদরোই।',
    consentCareTitle: '১. অহানবা হকশেল য়েংশিনবগী য়ানবা',
    consentCareDesc: 'উনশা, মিত নত্রগা মশকশিংগী অহানবা স্ক্রীনিং।',
    consentReferralTitle: '२. হাস্পাতাল রিফরেল মতেং',
    consentReferralDesc: 'মশক উরবদি CHC ডাক্তরদা রিপোর্ত সেয়র তৌবা।',
    consentSmsTitle: '৩. ইমুংদা পাউতাক পাউজেল (SMS)',
    consentSmsDesc: 'নুমিৎ অমসুং মতমগী ওইবা পাউজেলখক (লাইনাগী মিং য়াওদে)।',
    consentResearchTitle: '४. অপাম্বগী মতুংইন্না রিসার্সতা শিজিন্নবা',
    consentResearchDesc: 'মিং য়াওদবা রিসার্স। লায়েংবদা চঙদে।',
    saveConsentAndSelect: 'য়ানবা থম্লগা লম্বী খনবীয়ু',

    pathwaySkinTitle: 'উনশাগী মশক য়েংশিনবা (Skin-Sign)',
    pathwaySkinDesc: 'তোপ-তোপ্পা অশোক-অপন, নীলা মচু চারবা, ফুম্বা নত্রগা য়াইখৎপা।',
    pathwayEyeTitle: 'মিত অমসুং মিতপন য়েংশিনবা (Retina Check)',
    pathwayEyeDesc: 'চিনিরোগ অনাবগী মিতপন য়েংশিনবা (ফন্দস লেন্স চঙই)।',
    pathwayChestTitle: 'থৌ অমসুং টিবি য়েংশিনবা (Chest / TB)',
    pathwayChestDesc: 'দিজিতেল এক্স-রে নত্রগা চয়োল ২গী খুমনবা প্রোটোকল।',
    pathwayBloodTitle: 'ঈ য়েংশিনবা (CBC Cancer Funnel)',
    pathwayBloodDesc: 'CBC ভেল্যু, প্লেতলেত অমসুং মাইক্রোস্কোপ স্লাইদ য়েংশিনবা।',
    emergencyAlertBanner: 'শা শাফবা ৱাবা নত্রগা খোঙহাম্বা লৈব্রা? ১০৮ অথুবা মতেং মফমসিদা য়েংবীয়ু।',

    step1Of3: 'খোঙথাং ১/৩: স্ক্রীনিং মখল খনবীয়ু',
    step2Of3: 'খোঙথাং ২/৩: ফোতো অমসুং গুন য়েংশিনবা',
    step3Of3: 'খোঙথাং ৩/৩: ফল অমসুং তুংগী খোঙথাং',
    cameraDistanceGuide: 'মহৌশাগী মঙালদা ১৫ সেমি লাপ্না থম্মু',
    cameraLightingGuide: 'Blur > 110 • খুৎ লেংহন্দना ফোতো কাপ্পীয়ু',
    qualityValidated: 'ফোতোগী গুন চুম্লে (Sharp & Clear)',
    captureImage: 'ফোতো কাপ্পু অমসুং য়েংশিল্লু (Capture)',
    reviewResult: 'য়েংশিনবগী ফল য়েংবীয়ু (Review Result)',

    resultGreenTitle: 'হায়রিবা য়েংশিনবাসিদা অৱাবা মশক অমত্তা থেংনদে।',
    resultGreenDesc: 'হায়রিবা য়েংশিনবাসিদা অকিবগী মশক অমত্তা থেংনদে। তোয়না য়েংশিনবা চত্থবীরু অমসুং আশা ইচেনগী পাউতাক ইনবীয়ু।',
    resultAmberTitle: 'খরা মশকশিং ডাক্তরনা অমুক হন্না য়েংশিনবা মথৌ তাই।',
    resultAmberDesc: 'অমুক হন্না ডাক্তরদা য়েংহনবা কান্নগনি। নহাক্কী আশা কর্মীনা লম্বী তাক্কনি।',
    resultRedTitle: 'অথুবদা ডাক্তরদা য়েংহনবগী পাউতাক পীরি।',
    resultRedDesc: 'হায়রিবা য়েংশিনবাসিনা ডাক্তরগা উনবা মথৌ তাই হায়বা তাক্লি। আশা কর্মীনা হাস্পাতালদা পুথোকপদা মতেং পাংকনি।',
    resultDisclaimer: 'ক্লিনিকেল ৱাফম: য়েংশিনবাসি অরোইবা লাইনা খঙদোকপা নত্তে। আশংবা ফলনা লাইনা লৈতবগী মপুংফাবা প্রমাণসু নত্তে।',
    createReferral: 'হাস্পাতাল রিফরেল শেম্বীয়ু (Create Referral)',
    returnHome: 'আশা হোমদা হল্লকউ (Return Home)',

    openReferralsHeader: 'হাংদনা লৈরিবা রিফরেল (Open Follow-Through)',
    recordHospitalOutcome: 'হাস্পাতালগী ফল ইশিল্লু (Close Loop)',
    closeLoopSuccess: 'রিফরেল লোইরে অমসুং ক্লিনিকেল লুপ থিংজিনখ্রে।',

    navHome: 'য়ুম',
    navScreening: 'স্ক্রীনিং',
    navReferrals: 'রিফরেল',
    navSettings: 'সেটিংস',

    audioGreeting: 'খুরুমজরি আশা ইচে। ঙসী নহাক্কী মফমদা অনাবা অহুমগী ফলো-অপ লৈরি অমসুং হাস্পাতাল রিফরেল অনি রিপোর্ত ঙাইদুনা লৈরি।',
    audioSelectPathway: 'চানবীদুনা য়েংশিনবগী লম্বী খনবীয়ু: উনশা, মিত, থৌ নত্রগা ঈগী রিপোর্ত।',
    audioCameraGuide: 'অনাববু মহৌশাগী মঙাল ফবদা ফমহল্লু। কেমেরা লেংহন্দনা ফোতো কাপ্পীয়ু।',
    audioResultGreen: 'হায়রিবা য়েংশিনবাসিদা অৱাবা মশক অমত্তা থেংনদে। মতম চানা য়েংশিনবা চত্থবীরু।',
    audioResultAmber: 'মশক খরগীদমক ডাক্তরগী য়েংশিনবা মথৌ তাই। আশা ইচেনা মতেং পাংকনি।',
    audioResultRed: 'হায়রিবা য়েংশিনবাসিনা অথুবদা হাস্পাতালগী ডাক্তর উনবা মথৌ তাই হায়বা তাক্লি।',

    audioGreetingPhonetic: 'Khurumjari ASHA iche. Ngasi nahakki mafamda anaba ahumgi follow-up leiri amasung hospital referral ani report ngaaiduna leiri.',
    audioSelectPathwayPhonetic: 'Chaanbiduna yengshinbagi lambi khanbiyu: unsha, mit, thou natraga eegi report.',
    audioCameraGuidePhonetic: 'Anababu mahoushagi mangal fabada famhallu. Camera lenghandana photo kappiyu.',
    audioResultGreenPhonetic: 'Haairiba yengshinbasida awaba mashak amatta thengnade. Matam chaana yengshinba chatthabeeru.',
    audioResultAmberPhonetic: 'Mashak kharageedamak doctorgi yengshinba mathou taai. ASHA ichena mateng paangkani.',
    audioResultRedPhonetic: 'Haairiba yengshinbasina athubada hospitalgi doctor unba mathou taai haaiba taakli.',
  },

  // 21. Sanskrit (संस्कृतम् - Pan-India Classical)
  sa: {
    appTitle: 'प्रोजेक्ट साथी',
    tagline: 'उपचारस्य समीपं। स्वास्थ्यं प्रति प्रथमं पदम्।',
    demoBadge: 'प्रदर्शन मोड — क्लिनिकल उपयोगाय न',
    homeTitle: 'आशा स्वास्थ्य सहायिका',
    registerTitle: 'रोगी पञ्जीकरणम्',
    consentTitle: 'रोगी संमति पत्रम्',
    pathwaySelectTitle: 'परीक्षण मार्गं चिनुत',
    skinScreeningTitle: 'त्वचा लक्षण परीक्षणम्',
    eyeScreeningTitle: 'नेत्र तथा पटल परीक्षणम्',
    chestScreeningTitle: 'वक्षः यक्ष्मा च परीक्षणम्',
    bloodScreeningTitle: 'रक्त परीक्षणम् (CBC Funnel)',
    resultTitle: 'परीक्षण परिणामः',
    referralsTitle: 'सक्रिय प्रेषणानि (Referrals)',
    timelineTitle: 'रोगी स्वास्थ्येतिहासः',
    followupsTitle: 'पुनः परीक्षणम् अनुवर्तनं च',
    settingsTitle: 'व्यवस्थापनं समकालनं च',

    offlineStatusReady: 'ऑफलाइन सक्रियम् • ३ लेखाः समकालनाय सिद्धाः',
    todayTasksHeader: 'अद्यतनानि मुख्यानि कार्याणि (Today Tasks)',
    followupTaskCount: '३ रुग्णानां पुनः परीक्षणम् (Follow-up) अवशिष्टम्',
    followupTaskDesc: 'ग्रामः: रामपूरम् • ७ दिनानां कालावधिः',
    openReferralsCount: '२ प्रेषणानि चिकित्सालय परिणामं प्रतीक्षन्ते',
    openReferralsDesc: 'सीएचसी नाभा • अनुवर्तन चक्रं सक्रियम्',
    pendingBadge: 'लम्बितम्',
    activeBadge: 'सक्रियम्',

    startScreening: 'परीक्षणम् आरभताम् (Start Screening)',
    registerPatient: 'नवीनं रोगिणं पञ्जीकरोतु (Register)',
    patientTimeline: 'रोगिणः इतिहासः',
    syncAndLanguage: 'समकालनं भाषा च',

    villageLabel: 'ग्रामस्य नाम (Village Name)',
    ageLabel: 'आयुः (वर्षेषु)',
    genderLabel: 'लिङ्गम् (Gender)',
    phoneLabel: 'पारिवारिक सम्पर्क दूरवाणी',
    genderFemale: 'स्त्री (Female)',
    genderMale: 'पुरुषः (Male)',
    genderOther: 'अन्यत् (Other)',
    optionalPhotoNotice: 'गोपनीयता रक्षणम्: छायाचित्रम् उपचाराय अनिवार्यं नास्ति। सुरक्षितः कूटः स्वतः निर्गमिष्यति।',
    takeOptionalPhoto: 'ऐच्छिकं परिचय छायाचित्रं स्वीकरोतु',
    photoAttached: 'छायाचित्रं संलग्नम् ✓',
    nextConsent: 'संमतिः अग्रिमं च (Next: Consent)',
    consentNotice: 'संमतेः अभावेऽपि रोगी वैद्यकीय साहाय्यात् आपत्कालीन सेवाभ्यः च वञ्चितः न भविष्यति।',
    consentCareTitle: '१. प्राथमिक स्वास्थ्य परीक्षणाय संमतिः',
    consentCareDesc: 'त्वचा, नेत्रं अथवा लक्षणानां प्राथमिकं परीक्षणम्।',
    consentReferralTitle: '२. चिकित्सालय प्रेषण समन्वयः',
    consentReferralDesc: 'लक्षणेषु दृष्टेषु सीएचसी वैद्यैः सह विवरण साझाकरणम्।',
    consentSmsTitle: '३. परिवाराय सूचना सन्देशः (SMS)',
    consentSmsDesc: 'केवलं समयस्य दिनाङ्कस्य च तटस्थः सन्देशः (रोगस्य नाम न भवति)।',
    consentResearchTitle: '४. ऐच्छिकम् अनुसन्धान उपयोगः',
    consentResearchDesc: 'अनाम अनुसन्धानम्। उपचाराय अनिवार्यं नास्ति।',
    saveConsentAndSelect: 'संमतिं संरक्ष्य मार्गं चिनुत',

    pathwaySkinTitle: 'त्वचा लक्षण परीक्षणम् (Skin-Sign)',
    pathwaySkinDesc: 'असामान्यः व्रणः, नीलवर्णाः चिह्नानि, पिड़का अथवा पाण्डुता।',
    pathwayEyeTitle: 'नेत्र तथा पटल परीक्षणम् (Retina Check)',
    pathwayEyeDesc: 'मधुमेह रोगिषु दृष्टि पटल परीक्षणम् (फण्डस लेन्स आवश्यकम्)।',
    pathwayChestTitle: 'वक्षः यक्ष्मा च परीक्षणम् (Chest / TB)',
    pathwayChestDesc: 'डिजिटल क्ष-किरणं अथवा सप्ताहद्वय कास लक्षण नियमावली।',
    pathwayBloodTitle: 'रक्त परीक्षणम् (CBC Cancer Funnel)',
    pathwayBloodDesc: 'सीबीसी मानम्, पट्टिकाः सूक्ष्मदर्शक समीक्षा च।',
    emergencyAlertBanner: 'श्वासे तीव्र कष्टं मूर्च्छा वा अस्ति? १०८ आपत्कालीन साहाय्यम् अत्र पश्यतु।',

    step1Of3: 'चरणम् १/३: परीक्षण प्रकारं चिनुत',
    step2Of3: 'चरणम् २/३: छायाचित्रं गुणवत्ता सत्यापनं च',
    step3Of3: 'चरणम् ३/३: परिणामः अग्रिमाणि पदानि च',
    cameraDistanceGuide: 'प्राकृतिक प्रकाशे १५ सेमी दूरं स्थापयतु',
    cameraLightingGuide: 'Blur > 110 • हस्तं स्थिरं कृत्वा चित्रं गृह्णातु',
    qualityValidated: 'चित्र गुणवत्ता सत्यापिता (Sharp & Clear)',
    captureImage: 'चित्रं गृह्णातु परीक्षताम् च (Capture)',
    reviewResult: 'परीक्षण परिणामं पश्यतु (Review Result)',

    resultGreenTitle: 'अस्मिन् परीक्षणे कोऽपि चिन्ताजनकः लक्षणः न दृष्टः।',
    resultGreenDesc: 'अस्मिन् परीक्षणे काऽपि भीतिः न दृष्टा। सामान्य परिचर्यां निरन्तरं करोतु आशा भगिन्याः परामर्शं च पालयतु।',
    resultAmberTitle: 'केषाञ्चन लक्षणानां कृते वैद्यकीय परीक्षणम् आवश्यकम्।',
    resultAmberDesc: 'पुनरेकवारं वैद्येन सह परीक्षणम् उपकारकं भवेत्। भवतः आशा सहायिका मार्गदर्शनं करिष्यति।',
    resultRedTitle: 'शीघ्रमेव वैद्यकीय परीक्षणं कर्तुं परामर्शः दीयते।',
    resultRedDesc: 'अनेन परीक्षणेन ज्ञायते यत् शीघ्रं चिकित्सालयं गन्तव्यम्। आशा कार्यकर्ता प्रेषणे साहाय्यं करिष्यति।',
    resultDisclaimer: 'नैदानिक सीमा: इदं परीक्षणं न अन्तिमं निदानम्। हरित परिणामोऽपि रोगस्य सर्वथा अभावं न प्रमाणीकरोति।',
    createReferral: 'चिकित्सालय प्रेषणं सृजतु (Create Referral)',
    returnHome: 'आशा गृहं प्रति आगच्छतु (Return Home)',

    openReferralsHeader: 'सक्रिय प्रेषणानि (Open Follow-Through)',
    recordHospitalOutcome: 'चिकित्सालय परिणामं लिखतु (Close Loop)',
    closeLoopSuccess: 'प्रेषणं सम्पूर्णं जातं चक्रं च समाप्तम्।',

    navHome: 'गृहम्',
    navScreening: 'परीक्षणम्',
    navReferrals: 'प्रेषणम्',
    navSettings: 'व्यवस्था',

    audioGreeting: 'नमो नमः आशा भगिनि। अद्य भवत्याः क्षेत्रे त्रयाणां रुग्णानाम् अनुवर्तनम् अवशिष्टम् अस्ति द्वे प्रेषणे च चिकित्सालय परिणामं प्रतीक्षन्ते।',
    audioSelectPathway: 'कृपया परीक्षण विधिं चिनुत: त्वचा, नेत्रं, वक्षः अथवा रक्त प्रतिवेदनम्।',
    audioCameraGuide: 'रोगिणं सम्यक् प्राकृतिक प्रकाशे उपवेशयतु। यन्त्रं स्थिरं धृत्वा चित्रं स्वीकरोतु।',
    audioResultGreen: 'अस्मिन् परीक्षणे काऽपि चिन्ता न दृष्टा। सामान्य परिचर्यां पालयतु।',
    audioResultAmber: 'केषाञ्चन लक्षणानां कृते वैद्यकीय परीक्षणम् आवश्यकम्। आशा भगिनी मार्गदर्शनं करिष्यति।',
    audioResultRed: 'अनेन ज्ञायते यत् शीघ्रमेव चिकित्सालयस्य वैद्यं द्रष्टव्यम्। चिकित्सालय प्रेषणं क्रियते।',

    audioGreetingPhonetic: 'Namo namah ASHA bhagini. Adya bhavatyah kshetre trayaanaam rugnaanaam anuvartanam avashishtam asti dve preshane cha hospital parinaamam prateekshante.',
    audioSelectPathwayPhonetic: 'Kripaya parikshana vidhim chinuta: twacha, netram, vakshah athava rakta prativedanam.',
    audioCameraGuidePhonetic: 'Rugnam samyak prakritik prakaashe upaveshayatu. Yantram sthiram dhritwa chitram sweekarotu.',
    audioResultGreenPhonetic: 'Asmin parikshane kaapi chinta na drishta. Saamaanya paricharyaam paalayatu.',
    audioResultAmberPhonetic: 'Keshaanchana lakshanaanaam krite vaidyakeeya parikshanam aavashyakam. ASHA bhagini maargadarshanam karishyati.',
    audioResultRedPhonetic: 'Anena jnaayate yat sheeghrameva hospitalasya vaidyam drashtavyam. Hospital referral kriyate.',
  },

  // 22. Santali (ᱥᱟᱱᱛᱟᱲᱤ - Jharkhand / Odisha / WB)
  sat: {
    appTitle: 'ᱯᱨᱚᱡᱮᱠᱴ ᱥᱟᱛᱷᱤ (प्रोजेक्ट साथी)',
    tagline: 'ᱡᱚᱛᱚᱱ ᱥᱩᱨ ᱛᱮ᱾ ᱦᱚᱲᱢᱚ ᱥᱟᱶᱟᱨ ᱥᱮᱫ ᱯᱩᱭᱞᱩ ᱛᱟᱲᱟᱢ।',
    demoBadge: 'ᱩᱫᱩᱜ ᱢᱚᱰ — ᱨᱟᱱ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱝ ᱠᱟᱱᱟ',
    homeTitle: 'ᱟᱥᱟ ᱦᱚᱲᱢᱚ ᱥᱟᱶᱟᱨ ᱜᱚᱲᱚᱭᱤᱡ',
    registerTitle: 'ᱨᱩᱜᱤ ᱧᱩᱛᱩᱢ ᱚᱞ (Register)',
    consentTitle: 'ᱨᱩᱜᱤ ᱦᱮᱸᱥᱟᱹᱨᱤ ᱥᱟᱠᱟᱢ (Consent)',
    pathwaySelectTitle: 'ᱯᱟᱨᱠᱷᱟᱣ ᱦᱚᱨ ᱵᱟᱪᱷᱟᱣ',
    skinScreeningTitle: 'ᱦᱟᱨᱛᱟ ᱪᱤᱱᱦᱟᱹ ᱯᱟᱨᱠᱷᱟᱣ',
    eyeScreeningTitle: 'ᱢᱮᱫ ᱟᱨ ᱯᱚᱨᱫᱟ ᱯᱟᱨᱠᱷᱟᱣ',
    chestScreeningTitle: 'ᱠᱚᱲᱟᱢ ᱟᱨ ᱴᱤᱵᱤ ᱯᱟᱨᱠᱷᱟᱣ',
    bloodScreeningTitle: 'ᱢᱟᱭᱟᱢ ᱯᱟᱨᱠᱷᱟᱣ (CBC Funnel)',
    resultTitle: 'ᱯᱟᱨᱠᱷᱟᱣ ᱚᱨᱡᱚ (Result)',
    referralsTitle: 'ᱡᱷᱤᱡ ᱨᱮᱯᱷᱟᱨᱟᱞ',
    timelineTitle: 'ᱨᱩᱜᱤ ᱱᱟᱜᱟᱢ',
    followupsTitle: 'ᱫᱚᱦᱲᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱟᱨ ᱯᱷᱚᱞᱳ-ᱟᱯ',
    settingsTitle: 'ᱥᱟᱡᱟᱣ ᱟᱨ ᱥᱤᱝᱠ',

    offlineStatusReady: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱪᱟᱹᱞᱩ • ३ ᱨᱮᱠᱚᱨᱰ ᱥᱤᱝᱠ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱯᱲᱟᱣ',
    todayTasksHeader: 'ᱛᱮᱦᱮᱧᱟᱜ ᱢᱩᱬ ᱠᱟᱹᱢᱤ (Today Tasks)',
    followupTaskCount: '३ ᱦᱚᱲᱟᱜ ᱫᱚᱦᱲᱟ ᱯᱟᱨᱠᱷᱟᱣ (Follow-up) ᱥᱟᱨᱮᱡ ᱢᱮᱱᱟᱜ-ᱟ',
    followupTaskDesc: 'ᱟᱹᱛᱩ: ᱨᱟᱢᱯᱩᱨ • ७ ᱢᱟᱦᱟᱸ ᱚᱠᱛᱚ',
    openReferralsCount: '२ ᱨᱮᱯᱷᱟᱨᱟᱞ ᱦᱟᱥᱯᱟᱛᱟᱞ ᱚᱨᱡᱚ ᱛᱟᱺᱜᱤ ᱨᱮ ᱢᱮᱱᱟᱜ-ᱟ',
    openReferralsDesc: 'CHC ᱱᱟᱵᱷᱟ • ᱯᱷᱚᱞᱳ-ᱛᱷᱨᱩ ᱞᱩᱯ ᱪᱟᱹᱞᱩ',
    pendingBadge: 'ᱛᱟᱺᱜᱤ',
    activeBadge: 'ᱪᱟᱹᱞᱩ',

    startScreening: 'ᱯᱟᱨᱠᱷᱟᱣ ᱮᱦᱚᱵ (Start Screening)',
    registerPatient: 'ᱱᱟᱣᱟ ᱨᱩᱜᱤ ᱚᱞ (Register)',
    patientTimeline: 'ᱨᱩᱜᱤ ᱱᱟᱜᱟᱢ',
    syncAndLanguage: 'ᱥᱤᱝᱠ ᱟᱨ ᱯᱟᱹᱨᱥᱤ',

    villageLabel: 'ᱟᱹᱛᱩ ᱧᱩᱛᱩᱢ (Village Name)',
    ageLabel: 'ᱩᱢᱮᱨ (ᱥᱮᱨᱢᱟ ᱨᱮ)',
    genderLabel: 'ᱡᱟᱱᱟᱝ (Gender)',
    phoneLabel: 'ᱜᱷᱟᱨᱚᱸᱡᱽ ᱡᱚᱯᱚᱲᱟᱣ ᱯᱷᱳᱱ',
    genderFemale: 'ᱛᱤᱨᱞᱟᱹ (Female)',
    genderMale: 'ᱠᱚᱲᱟ (Male)',
    genderOther: 'ᱮᱴᱟᱜ (Other)',
    optionalPhotoNotice: 'ᱩᱠᱩ ᱫᱚᱦᱚ: ᱪᱤᱛᱟᱹᱨ ᱨᱟᱱ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱭ ᱵᱟᱫᱷᱭᱚᱣᱟ᱾ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱠᱳᱰ ᱧᱟᱢᱚᱜ-ᱟ᱾',
    takeOptionalPhoto: 'ᱪᱤᱱᱦᱟᱹᱣ ᱪᱤᱛᱟᱹᱨ ᱛᱩᱞᱟᱹᱣ',
    photoAttached: 'ᱪᱤᱛᱟᱹᱨ ᱡᱚᱲᱟᱣ ᱮᱱᱟ ✓',
    nextConsent: 'ᱦᱮᱸᱥᱟᱹᱨᱤ ᱟᱨ ᱞᱟᱦᱟ (Next: Consent)',
    consentNotice: 'ᱦᱮᱸᱥᱟᱹᱨᱤ ᱵᱟᱝ ᱨᱮᱦᱚᱸ ᱨᱩᱜᱤ ᱰᱟᱠᱛᱚᱨ ᱟᱨ ᱟᱹᱛᱩ ᱜᱚᱲᱚ ᱠᱷᱚᱱ ᱵᱟᱭ ᱵᱟᱧᱪᱟᱣᱜ-ᱟ᱾',
    consentCareTitle: '१. ᱯᱩᱭᱞᱩ ᱦᱚᱲᱢᱚ ᱯᱟᱨᱠᱷᱟᱣ ᱦᱮᱸᱥᱟᱹᱨᱤ',
    consentCareDesc: 'ᱦᱟᱨᱛᱟ, ᱢᱮᱫ ᱟᱨ ᱪᱤᱱᱦᱟᱹ ᱠᱚ ᱯᱟᱨᱠᱷᱟᱣ᱾',
    consentReferralTitle: '२. ᱦᱟᱥᱯᱟᱛᱟᱞ ᱨᱮᱯᱷᱟᱨᱟᱞ ᱜᱚᱲᱚ',
    consentReferralDesc: 'ᱪᱤᱱᱦᱟᱹ ᱧᱮᱞ ᱞᱮᱱᱠᱷᱟᱱ CHC ᱰᱟᱠᱛᱚᱨ ᱥᱟᱶ ᱨᱤᱯᱳᱨᱴ ᱦᱟᱹᱴᱤᱧ᱾',
    consentSmsTitle: '३. ᱜᱷᱟᱨᱚᱸᱡᱽ ᱠᱷᱚᱵᱚᱨ ᱥᱟᱸᱫᱮᱥ (SMS)',
    consentSmsDesc: 'ᱥᱩᱢᱩᱝ ᱢᱟᱦᱟᱸ ᱟᱨ ᱚᱠᱛᱚ (ᱨᱩᱣᱟᱹ ᱧᱩᱛᱩᱢ ᱵᱟᱝ)᱾',
    consentResearchTitle: '४. ᱨᱤᱥᱟᱨᱪ ᱵᱮᱵᱷᱟᱨ',
    consentResearchDesc: 'ᱧᱩᱛᱩᱢ ᱵᱮᱜᱚᱨ ᱥᱩᱫᱷᱟᱹᱨ᱾ ᱨᱟᱱ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱭ ᱵᱟᱫᱷᱭᱚᱣᱟ᱾',
    saveConsentAndSelect: 'ᱦᱮᱸᱥᱟᱹᱨᱤ ᱥᱟᱧᱪᱟᱣ ᱟᱨ ᱦᱚᱨ ᱵᱟᱪᱷᱟᱣ',

    pathwaySkinTitle: 'ᱦᱟᱨᱛᱟ ᱪᱤᱱᱦᱟᱹ ᱯᱟᱨᱠᱷᱟᱣ (Skin-Sign)',
    pathwaySkinDesc: 'ᱵᱟᱝ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱜᱷᱟᱣ, ᱞᱤᱞ ᱫᱟᱜ, ᱯᱩᱴᱷᱤ ᱟᱨᱵᱟᱝ ᱥᱟᱥᱟᱝᱜᱚᱜ᱾',
    pathwayEyeTitle: 'ᱢᱮᱫ ᱟᱨ ᱯᱚᱨᱫᱟ ᱯᱟᱨᱠᱷᱟᱣ (Retina Check)',
    pathwayEyeDesc: 'ᱪᱤᱱᱤ ᱨᱩᱣᱟᱹ ᱨᱩᱜᱤᱭᱟᱜ ᱢᱮᱫ ᱯᱟᱨᱠᱷᱟᱣ (ᱯᱷᱟᱱᱰᱟᱥ ᱞᱮᱱᱥ ᱞᱟᱹᱠᱛᱤ)᱾',
    pathwayChestTitle: 'ᱠᱚᱲᱟᱢ ᱟᱨ ᱴᱤᱵᱤ ᱯᱟᱨᱠᱷᱟᱣ (Chest / TB)',
    pathwayChestDesc: 'ᱰᱤᱡᱤᱴᱟᱞ ᱮᱠᱥ-ᱨᱮ ᱟᱨᱵᱟᱝ २ ᱦᱟᱯᱛᱟ ᱠᱷᱚᱜ ᱪᱤᱱᱦᱟᱹ ᱱᱤᱭᱚᱢ᱾',
    pathwayBloodTitle: 'ᱢᱟᱭᱟᱢ ᱯᱟᱨᱠᱷᱟᱣ (CBC Cancer Funnel)',
    pathwayBloodDesc: 'CBC ᱦᱤᱥᱟᱹᱵᱽ, ᱯᱞᱮᱴᱞᱮᱴᱥ ᱟᱨ ᱢᱟᱭᱠᱨᱳᱥᱠᱳᱯ ᱧᱮᱞ᱾',
    emergencyAlertBanner: 'ᱥᱟᱦᱮᱫ ᱦᱟᱛᱟᱣ ᱠᱚᱥᱴᱚ ᱟᱨᱵᱟᱝ ᱵᱮᱦᱚᱸᱥ? १०८ ᱞᱚᱜᱚᱱ ᱜᱚᱲᱚ ᱱᱚᱸᱰᱮ ᱧᱮᱞᱢᱮ᱾',

    step1Of3: 'ᱛᱷᱟᱯ १/३: ᱯᱟᱨᱠᱷᱟᱣ ᱞᱮᱠᱟᱱ ᱵᱟᱪᱷᱟᱣ',
    step2Of3: 'ᱛᱷᱟᱯ २/३: ᱪᱤᱛᱟᱹᱨ ᱟᱨ ᱜᱩᱱ ᱯᱟᱨᱠᱷᱟᱣ',
    step3Of3: 'ᱛᱷᱟᱯ ३/३: ᱚᱨᱡᱚ ᱟᱨ ᱞᱟᱦᱟ ᱛᱟᱲᱟᱢ',
    cameraDistanceGuide: 'ᱥᱟᱪᱟᱨᱦᱮ ᱢᱟᱨᱥᱟᱞ ᱨᱮ १५ ᱥᱮᱢᱤ ᱯᱷᱟᱨᱟᱠ ᱫᱚᱦᱚᱭᱢᱮ',
    cameraLightingGuide: 'Blur > 110 • ᱛᱤ ᱛᱷᱤᱨ ᱠᱟᱛᱮ ᱪᱤᱛᱟᱹᱨ ᱛᱩᱞᱟᱹᱣᱢᱮ',
    qualityValidated: 'ᱪᱤᱛᱟᱹᱨ ᱜᱩᱱ ᱴᱷᱤᱠ ᱮᱱᱟ (Sharp & Clear)',
    captureImage: 'ᱪᱤᱛᱟᱹᱨ ᱛᱩᱞᱟᱹᱣ ᱟᱨ ᱯᱟᱨᱠᱷᱟᱣ (Capture)',
    reviewResult: 'ᱯᱟᱨᱠᱷᱟᱣ ᱚᱨᱡᱚ ᱧᱮᱞ (Review Result)',

    resultGreenTitle: 'ᱱᱚᱣᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱨᱮ ᱪᱤᱱᱛᱟᱹ ᱪᱤᱱᱦᱟᱹ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ᱾',
    resultGreenDesc: 'ᱱᱚᱣᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱨᱮ ᱪᱮᱫ ᱦᱚᱸ ᱵᱚᱛᱚᱨ ᱵᱟᱹᱱᱩᱜ-ᱟ᱾ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱡᱚᱛᱚᱱ ᱪᱟᱞᱟᱣ ᱢᱮ ᱟᱨ ᱟᱥᱟ ᱫᱤᱫᱤᱭᱟᱜ ᱠᱟᱛᱷᱟ ᱟᱸᱡᱚᱢ ᱢᱮ᱾',
    resultAmberTitle: 'ᱛᱤᱢᱤᱱ ᱪᱤᱱᱦᱟᱹ ᱰᱟᱠᱛᱚᱨ ᱦᱚᱛᱮᱛᱮ ᱯᱟᱨᱠᱷᱟᱣ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾',
    resultAmberDesc: 'ᱢᱤᱫᱫᱷᱟᱣ ᱰᱟᱠᱛᱚᱨ ᱴᱷᱮᱱ ᱯᱟᱨᱠᱷᱟᱣ ᱦᱚᱪᱚ ᱱᱟᱯᱟᱭᱚᱜ-ᱟ᱾ ᱟᱢᱤᱡ ᱟᱥᱟ ᱫᱤᱫᱤ ᱫᱤᱥᱟᱹ ᱮᱢᱟᱢᱟᱭ᱾',
    resultRedTitle: 'ᱞᱚᱜᱚᱱ ᱰᱟᱠᱛᱚᱨ ᱴᱷᱮᱱ ᱯᱟᱨᱠᱷᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱞᱟᱦ ᱮᱢᱚᱜ ᱠᱟᱱᱟ᱾',
    resultRedDesc: 'ᱱᱚᱣᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱠᱷᱚᱱ ᱵᱟᱰᱟᱭᱚᱜ ᱠᱟᱱᱟ ᱡᱮ ᱰᱟᱠᱛᱚᱨ ᱧᱟᱯᱟᱢ ᱞᱟᱹᱠᱛᱤ ᱜᱮᱭᱟ᱾ ᱟᱥᱟ ᱫᱤᱫᱤ ᱦᱟᱥᱯᱟᱛᱟᱞ ᱨᱮᱯᱷᱟᱨ ᱨᱮ ᱜᱚᱲᱚᱣᱟᱢᱟᱭ᱾',
    resultDisclaimer: 'ᱠᱞᱤᱱᱤᱠᱟᱞ ᱥᱤᱢᱟᱹ: ᱱᱚᱣᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱫᱚ ᱢᱩᱪᱟᱹᱫ ᱨᱟᱱ ᱫᱚ ᱵᱟᱝ ᱠᱟᱱᱟ᱾ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ ᱚᱨᱡᱚ ᱦᱚᱸ ᱨᱩᱣᱟᱹ ᱵᱟᱹᱱᱩᱜ ᱨᱮᱭᱟᱜ ᱯᱩᱨᱟᱹ ᱯᱨᱚᱢᱟᱱ ᱵᱟᱝ ᱠᱟᱱᱟ᱾',
    createReferral: 'ᱦᱟᱥᱯᱟᱛᱟᱞ ᱨᱮᱯᱷᱟᱨᱟᱞ ᱵᱮᱱᱟᱣ (Create Referral)',
    returnHome: 'ᱟᱥᱟ ᱚᱲᱟᱜ ᱨᱩᱣᱟᱹᱲ (Return Home)',

    openReferralsHeader: 'ᱪᱟᱹᱞᱩ ᱡᱷᱤᱡ ᱨᱮᱯᱷᱟᱨᱟᱞ (Open Follow-Through)',
    recordHospitalOutcome: 'ᱦᱟᱥᱯᱟᱛᱟᱞ ᱚᱨᱡᱚ ᱚᱞ (Close Loop)',
    closeLoopSuccess: 'ᱨᱮᱯᱷᱟᱨᱟᱞ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ ᱟᱨ ᱞᱩᱯ ᱵᱚᱸᱫᱽ ᱮᱱᱟ᱾',

    navHome: 'ᱚᱲᱟᱜ',
    navScreening: 'ᱯᱟᱨᱠᱷᱟᱣ',
    navReferrals: 'ᱨᱮᱯᱷᱟᱨᱟᱞ',
    navSettings: 'ᱥᱟᱡᱟᱣ',

    audioGreeting: 'ᱡᱚᱦᱟᱨ ᱟᱥᱟ ᱫᱤᱫᱤ᱾ ᱛᱮᱦᱮᱧ ᱟᱢᱟᱜ ᱮᱞᱟᱠᱟ ᱨᱮ ᱯᱮ ᱦᱚᱲᱟᱜ ᱯᱷᱚᱞᱳ-ᱟᱯ ᱥᱟᱨᱮᱡ ᱢᱮᱱᱟᱜ-ᱟ ᱟᱨ ᱵᱟᱨᱭᱟ ᱨᱮᱯᱷᱟᱨᱟᱞ ᱦᱟᱥᱯᱟᱛᱟᱞ ᱨᱤᱯᱳᱨᱴ ᱛᱟᱺᱜᱤ ᱨᱮ ᱢᱮᱱᱟᱜ-ᱟ᱾',
    audioSelectPathway: 'ᱫᱟᱭᱟᱠᱟᱛᱮ ᱯᱟᱨᱠᱷᱟᱣ ᱦᱚᱨ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: ᱦᱟᱨᱛᱟ, ᱢᱮᱫ, ᱠᱚᱲᱟᱢ ᱟᱨᱵᱟᱝ ᱢᱟᱭᱟᱢ ᱨᱤᱯᱳᱨᱴ᱾',
    audioCameraGuide: 'ᱨᱩᱜᱤ ᱱᱟᱯᱟᱭ ᱥᱟᱪᱟᱨᱦᱮ ᱢᱟᱨᱥᱟᱞ ᱨᱮ ᱫᱩᱲᱩᱵ ᱮᱢᱮ᱾ ᱠᱮᱢᱮᱨᱟ ᱛᱷᱤᱨ ᱫᱚᱦᱚ ᱠᱟᱛᱮ ᱪᱤᱛᱟᱹᱨ ᱛᱩᱞᱟᱹᱣ ᱢᱮ᱾',
    audioResultGreen: 'ᱱᱚᱣᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱨᱮ ᱪᱮᱫ ᱦᱚᱸ ᱪᱤᱱᱛᱟᱹ ᱵᱟᱹᱱᱩᱜ-ᱟ᱾ ᱥᱟᱫᱷᱟᱨᱚᱱ ᱡᱚᱛᱚᱱ ᱪᱟᱞᱟᱣ ᱢᱮ᱾',
    audioResultAmber: 'ᱛᱤᱢᱤᱱ ᱪᱤᱱᱦᱟᱹ ᱞᱟᱹᱜᱤᱫ ᱰᱟᱠᱛᱚᱨ ᱴᱷᱮᱱ ᱯᱟᱨᱠᱷᱟᱣ ᱞᱟᱹᱠᱛᱤᱭᱟ᱾ ᱟᱥᱟ ᱫᱤᱫᱤ ᱜᱚᱲᱚᱣᱟᱢᱟᱭ᱾',
    audioResultRed: 'ᱱᱚᱣᱟ ᱯᱟᱨᱠᱷᱟᱣ ᱠᱷᱚᱱ ᱵᱟᱰᱟᱭᱚᱜ ᱠᱟᱱᱟ ᱡᱮ ᱞᱚᱜᱚᱱ ᱰᱟᱠᱛᱚᱨ ᱧᱮᱞ ᱞᱟᱹᱠᱛᱤ ᱠᱟᱱᱟ᱾ ᱦᱟᱥᱯᱟᱛᱟᱞ ᱨᱮᱯᱷᱟᱨ ᱵᱮᱱᱟᱣᱜ ᱠᱟᱱᱟ᱾',

    audioGreetingPhonetic: 'Johar ASHA didi. Tehenj aamag elaka re pe hodag follow-up sarej menaga aar barya referral hospital report taangi re menaga.',
    audioSelectPathwayPhonetic: 'Dayakate parkhaw hor bachhaw me: harta, med, kodam arbang mayam report.',
    audioCameraGuidePhonetic: 'Rugi napay sacharhe marsal re dudub eme. Camera thir doho kate chitar tulaw me.',
    audioResultGreenPhonetic: 'Nowa parkhaw re ched hon chinta banuga. Sadharon joton chalaw me.',
    audioResultAmberPhonetic: 'Timin chinha lagid doctor then parkhaw laktiya. ASHA didi godowamay.',
    audioResultRedPhonetic: 'Nowa parkhaw khon badayog kana je logon doctor nel lakti kana. Hospital referral benawog kana.',
  },

  // 23. Sindhi (सिंधी - Gujarat / Rajasthan / Pan-India)
  sd: {
    appTitle: 'प्रोजेक्ट साथी',
    tagline: 'संभाळ जे वधीक वेझो। सेहत जे पासे पहिरियों कदम।',
    demoBadge: 'प्रदर्शन मोड — क्लिनिकल उपेग लाइ न',
    homeTitle: 'आशा सेहत सहायिका',
    registerTitle: 'मरीज़ पञ्जीकरण',
    consentTitle: 'मरीज़ रज़ामंदी पत्र',
    pathwaySelectTitle: 'तपास जो तरीक़ो चुंडियो',
    skinScreeningTitle: 'चमड़ी लक्षण तपास',
    eyeScreeningTitle: 'अखियूं ऐं पडदो तपास',
    chestScreeningTitle: 'छाती ऐं टीबी तपास',
    bloodScreeningTitle: 'रटु तपास (CBC फनल)',
    resultTitle: 'तपास नतीजा',
    referralsTitle: 'खुलियल रेफरल',
    timelineTitle: 'मरीज़ सेहत तारीख',
    followupsTitle: 'वरि तपास ऐं फालो-अप',
    settingsTitle: 'सेटिंग्स ऐं सिंक',

    offlineStatusReady: 'ऑफलाइन चालू • ३ रिकार्ड सिंक लाइ तैयार',
    todayTasksHeader: 'अजु जा मुख्य कम्म (Today Tasks)',
    followupTaskCount: '३ मरीज़नि जो वरि तपास (Follow-up) बाकी आहि',
    followupTaskDesc: 'गोठ: रामपूर • ७ डिन्हनि जी मुद्दत',
    openReferralsCount: '२ रेफरल हस्पताल नतीजे जी इन्तज़ार में आहिन',
    openReferralsDesc: 'सीएचसी नाभा • फालो-थ्रू लूप चालू',
    pendingBadge: 'बाकी',
    activeBadge: 'चालू',

    startScreening: 'तपास शुरू करियो (Start Screening)',
    registerPatient: 'नओं मरीज़ दर्ज करियो (Register)',
    patientTimeline: 'मरीज़ तारीख',
    syncAndLanguage: 'सिंक ऐं बोली',

    villageLabel: 'गोठ जो नालो (Village Name)',
    ageLabel: 'उमिर (सालनि में)',
    genderLabel: 'जिंस (Gender)',
    phoneLabel: 'कुटुंब जो राबतो फोन',
    genderFemale: 'ज़ाल (Female)',
    genderMale: 'मर्द (Male)',
    genderOther: 'बियो (Other)',
    optionalPhotoNotice: 'राज़दारी हिफाज़त: फोटो इलाज लाइ लाज़मी कोन्हे। महफूज़ कोड पहिंजो-पाण जारी थींदो।',
    takeOptionalPhoto: 'इख्तियारी पछ्याण फोटो वठो',
    photoAttached: 'फोटो जोड़े छड्यो ✓',
    nextConsent: 'रज़ामंदी ऐं अगिते वधो (Next: Consent)',
    consentNotice: 'रज़ामंदी न डिअण ते वि मरीज़ खे डाक्टर या हंगामी मदद खां महरूम न कयो वींदो।',
    consentCareTitle: '१. पहिरीं सेहत तपास जी रज़ामंदी',
    consentCareDesc: 'चमड़ी, अखियूं या लक्षणनि जी बुनियादी स्क्रीनिंग।',
    consentReferralTitle: '२. हस्पताल रेफरल तालमेल',
    consentReferralDesc: 'लक्षण दिसण ते सीएचसी डाक्टर सां रिपोर्ट साझा करण।',
    consentSmsTitle: '३. कुटुंब खे निहोरो (SMS)',
    consentSmsDesc: 'सिर्फ तारीख ऐं वक़्त जो संदेश (बीमारी जो नालो न थींदो)।',
    consentResearchTitle: '४. गैर-लाज़मी खोज बरतारा',
    consentResearchDesc: 'अनाम खोज बरतारा। इलाज लाइ बिल्कुल लाज़मी कोन्हे।',
    saveConsentAndSelect: 'रज़ामंदी सांभी तपास चुंडियो',

    pathwaySkinTitle: 'चमड़ी लक्षण तपास (Skin-Sign)',
    pathwaySkinDesc: 'अजीब घाव, नीरा निशान, दाणा या पीलाण।',
    pathwayEyeTitle: 'अखियूं ऐं पडदो तपास (Retina Check)',
    pathwayEyeDesc: 'शुगर वारनि मरीज़नि में रेटिना तपास (फंडस लेंस ज़रूरी)।',
    pathwayChestTitle: 'छाती ऐं टीबी तपास (Chest / TB)',
    pathwayChestDesc: 'डिजिटल एक्स-रे या २ हफ्ता खोघ प्रोटोकॉल।',
    pathwayBloodTitle: 'रटु तपास (CBC Cancer Funnel)',
    pathwayBloodDesc: 'सीबीसी मान, प्लेटलेट्स ऐं माइक्रोस्कोप स्लाइड जाइज़ो।',
    emergencyAlertBanner: 'साह खणण में सख़्त तकलीफ़ या बेहोशी आहि? १०८ हंगामी मदद हाणे डिधो।',

    step1Of3: 'कदम १/३: तपास जो प्रकार चुंडियो',
    step2Of3: 'कदम २/३: फोटो ऐं मयार तस्दीक़',
    step3Of3: 'कदम ३/३: नतीजा ऐं अगियां कदम',
    cameraDistanceGuide: 'कुदरती रोशनी में १५ सेमी जी विछोट रखियो',
    cameraLightingGuide: 'Blur > 110 • हत्थ थिर रखी फोटो खिंचियो',
    qualityValidated: 'फोटो जो मयार सही आहि (Sharp & Clear)',
    captureImage: 'फोटो खिंचियो ऐं परखो (Capture)',
    reviewResult: 'तपास नतीजा डिधो (Review Result)',

    resultGreenTitle: 'हिन तपास में का वि चिंता वारी गालिह न मिली।',
    resultGreenDesc: 'हिन तपास में का वि खतरे जी गालिह न मिली। आम संभाल जारी रखियो ऐं पहिंजे आशा दीदी जी सलाह मंनियो।',
    resultAmberTitle: 'किन्हीं लक्षणनि लाइ डाक्टर वटि तपास ज़रूरी आहि।',
    resultAmberDesc: 'हिक वारि डाक्टर खे डिेखारण फायदामंद थींदो। तुहांजी आशा दीदी अगिते रहनुमाई कंदी।',
    resultRedTitle: 'झटपट डाक्टर वटि वञी तपास करण जी सलाह डिनी वञे थी।',
    resultRedDesc: 'हिन तपास मां मालूम थिये थो त डाक्टर खे डिेखारण ज़रूरी आहि। आशा दीदी हस्पताल रेफरल में मदद कंदी।',
    resultDisclaimer: 'क्लिनिकल हद: हीअ तपास को पक्को निदान कोन्हे। सावों नतीजो वि बीमारी न हुअण जी पक्की सनद न आहि।',
    createReferral: 'हस्पताल रेफरल ठाहियो (Create Referral)',
    returnHome: 'आशा होम ते वरियो (Return Home)',

    openReferralsHeader: 'सक्रिय खुलियल रेफरल (Open Follow-Through)',
    recordHospitalOutcome: 'हस्पताल नतीजो दर्ज करियो (Close Loop)',
    closeLoopSuccess: 'रेफरल पूरो थियो ऐं क्लिनिकल लूप खत्म थियो।',

    navHome: 'होम',
    navScreening: 'तपास',
    navReferrals: 'रेफरल',
    navSettings: 'सेटिंग्स',

    audioGreeting: 'नमस्ते आशा दीदी। अजु तुहांजे इलाके में त्रिन मरीज़नि जो फालो-अप बाकी आहि ऐं ब रेफरल हस्पताल रिपोर्ट जे इन्तज़ार में आहिन।',
    audioSelectPathway: 'किरपा करे तपास जो तरीक़ो चुंडियो: चमड़ी, अखियूं, छाती या रट जी रिपोर्ट।',
    audioCameraGuide: 'मरीज़ खे सुठी कुदरती रोशनी में बिहारियो। कैमरो थिर रखी फोटो वठो।',
    audioResultGreen: 'हिन तपास में का वि चिंता जी गालिह कोन्हे। आम देखभाल जारी रखियो।',
    audioResultAmber: 'किन्हीं लक्षणनि लाइ डाक्टर जी तपास ज़रूरी आहि। आशा दीदी मदद कंदी।',
    audioResultRed: 'हिन तपास मां पता पवे थो त डाक्टर खे झटपट डिेखारण ज़रूरी आहि। हस्पताल रेफरल ठहे थो।',

    audioGreetingPhonetic: 'Namaste ASHA didi. Aju tuhanje ilaake mein trin mareezani jo follow-up baaki aahi ain ba referral hospital report je intezaar mein aahin.',
    audioSelectPathwayPhonetic: 'Kirpa kare tapaas jo tareeqo chundiyo: chamdi, akkhiyoon, chhati ya rat ji report.',
    audioCameraGuidePhonetic: 'Mareez khe suthi kudrati roshni mein bihaariyo. Camera thir rakhi photo vatho.',
    audioResultGreenPhonetic: 'Hin tapaas mein kaa vi chinta ji gaalih konhe. Aam dekhbhaal jaari rakhiyo.',
    audioResultAmberPhonetic: 'Kinheen lakshanani laai doctor ji tapaas zaroori aahi. ASHA didi madad kandi.',
    audioResultRedPhonetic: 'Hin tapaas maan pata pave tho ta doctor khe jhatpat dekhaaran zaroori aahi. Hospital referral thahe tho.',
  },

};

/**
 * Returns translated strings for a given language code.
 * Falls back to Hindi if language is not fully defined, or English as second fallback.
 */
export function getTranslation(langCode: string): AppTranslationStrings {
  if (translations[langCode]) {
    return translations[langCode];
  }
  // For remaining constitutional languages that use regional scripts (Maithili, Dogri, Kashmiri, Bodo, Nepali, Sanskrit, etc.),
  // provide intelligent regional fallback to Hindi (Devanagari script) or Bengali (Eastern scripts)
  const fallbackKey = ['mai', 'doi', 'brx', 'kok', 'sa', 'sd'].includes(langCode)
    ? 'hi'
    : ['mni', 'as'].includes(langCode)
    ? 'bn'
    : 'hi';

  return translations[fallbackKey] || translations['hi'] || translations['en'];
}

/**
 * Returns the BCP-47 speech synthesis locale for a given language code.
 */
export function getBcp47Tag(langCode: string): string {
  const meta = CONSTITUTIONAL_LANGUAGES.find(l => l.code === langCode);
  return meta?.bcp47 || 'hi-IN';
}

export interface DynamicAudioGreeting {
  text: string;
  phonetic: string;
}

/**
 * Generates dynamic audio guidance prompts reflecting real-time counts
 * of pending follow-ups and active hospital referrals.
 * Eliminates static/hardcoded "3 follow-ups and 2 referrals" prompts.
 */
export function getDynamicAudioGreeting(
  langCode: string,
  followupCount: number,
  referralCount: number
): DynamicAudioGreeting {
  const f = Math.max(0, followupCount);
  const r = Math.max(0, referralCount);

  // Normalize language key to available dictionary or fallback
  const code = translations[langCode]
    ? langCode
    : ['mai', 'doi', 'brx', 'kok', 'sa', 'sd'].includes(langCode)
    ? 'hi'
    : ['mni', 'as'].includes(langCode)
    ? 'bn'
    : 'hi';

  switch (code) {
    case 'en': {
      if (f === 0 && r === 0) {
        const text = 'Welcome ASHA worker. Today 0 follow-ups are pending and 0 referrals are waiting for clinical outcome. All scheduled tasks are complete.';
        return { text, phonetic: text };
      }
      if (f > 0 && r === 0) {
        const text = `Welcome ASHA worker. Today ${f} follow-up${f > 1 ? 's are' : ' is'} due, and all referrals are closed.`;
        return { text, phonetic: text };
      }
      if (f === 0 && r > 0) {
        const text = `Welcome ASHA worker. All follow-ups are completed, and ${r} referral${r > 1 ? 's are' : ' is'} waiting for clinical outcome.`;
        return { text, phonetic: text };
      }
      const text = `Welcome ASHA worker. Today ${f} follow-up${f > 1 ? 's are' : ' is'} due and ${r} referral${r > 1 ? 's are' : ' is'} waiting for clinical outcome.`;
      return { text, phonetic: text };
    }

    case 'hi': {
      if (f === 0 && r === 0) {
        return {
          text: 'नमस्ते आशा दीदी। आज आपकी कार्य सूची में 0 फॉलो-अप और 0 अस्पताल रेफरल लंबित हैं। आपके सभी कार्य पूरे हैं। नया मरीज़ जाँचने के लिए नीचे जाँच शुरू करें बटन दबाएं।',
          phonetic: 'Namaste ASHA didi. Aaj aapki karya soochi mein zero follow-up aur zero hospital referral lambit hain. Aapke sabhi karya poore hain. Naya mareez jaanchne ke liye neeche jaanch shuru karein button dabayein.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `नमस्ते आशा दीदी। आज आपकी कार्य सूची में ${f} मरीज़ों का फॉलो-अप पुनः जाँच बाकी है, और 0 अस्पताल रेफरल लंबित हैं। कृपया कार्य सूची देखें।`,
          phonetic: `Namaste ASHA didi. Aaj aapki karya soochi mein ${f} mareezon ka follow-up punaah jaanch baaki hai, aur zero hospital referral lambit hain. Kripya karya soochi dekhein.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `नमस्ते आशा दीदी। आज 0 फॉलो-अप बाकी हैं, और ${r} अस्पताल रेफरल डॉक्टर की रिपोर्ट की प्रतीक्षा में हैं। कृपया रेफरल सूची देखें।`,
          phonetic: `Namaste ASHA didi. Aaj zero follow-up baaki hain, aur ${r} hospital referral doctor ki report ki pratiksha mein hain. Kripya referral soochi dekhein.`,
        };
      }
      return {
        text: `नमस्ते आशा दीदी। आज आपकी कार्य सूची में ${f} मरीज़ों का फॉलो-अप पुनः जाँच बाकी है, और ${r} अस्पताल रेफरल डॉक्टर की रिपोर्ट की प्रतीक्षा में हैं। कृपया कार्य सूची देखें।`,
        phonetic: `Namaste ASHA didi. Aaj aapki karya soochi mein ${f} mareezon ka follow-up punaah jaanch baaki hai, aur ${r} hospital referral doctor ki report ki pratiksha mein hain. Kripya karya soochi dekhein.`,
      };
    }

    case 'pa': {
      if (f === 0 && r === 0) {
        return {
          text: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਆਸ਼ਾ ਦੀਦੀ। ਅੱਜ ਕੋਈ ਫਾਲੋ-ਅੱਪ ਅਤੇ ਕੋਈ ਰੈਫਰਲ ਬਾਕੀ ਨਹੀਂ ਹੈ। ਤੁਹਾਡੇ ਸਾਰੇ ਕਾਰਜ ਮੁਕੰਮਲ ਹਨ।',
          phonetic: 'Sat Sri Akaal ASHA didi. Ajj koi follow-up te koi referral baaki nahi hai. Tuhaade saare kaaraj mukammal han.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਆਸ਼ਾ ਦੀਦੀ। ਅੱਜ ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ${f} ਮਰੀਜ਼ਾਂ ਦਾ ਫਾਲੋ-ਅੱਪ ਬਾਕੀ ਹੈ ਅਤੇ ਕੋਈ ਰੈਫਰਲ ਬਾਕੀ ਨਹੀਂ ਹੈ।`,
          phonetic: `Sat Sri Akaal ASHA didi. Ajj tuhaade kshetar vich ${f} mareezaan da follow-up baaki hai te koi referral baaki nahi hai.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਆਸ਼ਾ ਦੀਦੀ। ਅੱਜ ਸਾਰੇ ਫਾਲੋ-ਅੱਪ ਮੁਕੰਮਲ ਹਨ, ਅਤੇ ${r} ਰੈਫਰਲ ਹਸਪਤਾਲ ਰਿਪੋਰਟ ਦੀ ਉਡੀਕ ਵਿੱਚ ਹਨ।`,
          phonetic: `Sat Sri Akaal ASHA didi. Ajj saare follow-up mukammal han, te ${r} referral hospital report di udeek vich han.`,
        };
      }
      return {
        text: `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਆਸ਼ਾ ਦੀਦੀ। ਅੱਜ ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ${f} ਮਰੀਜ਼ਾਂ ਦਾ ਫਾਲੋ-ਅੱਪ ਬਾਕੀ ਹੈ ਅਤੇ ${r} ਰੈਫਰਲ ਹਸਪਤਾਲ ਰਿਪੋਰਟ ਦੀ ਉਡੀਕ ਵਿੱਚ ਹਨ।`,
        phonetic: `Sat Sri Akaal ASHA didi. Ajj tuhaade kshetar vich ${f} mareezaan da follow-up baaki hai te ${r} referral hospital report di udeek vich han.`,
      };
    }

    case 'bn': {
      if (f === 0 && r === 0) {
        return {
          text: 'নমস্কার আশা দিদি। আজ কোনো ফলো-আপ এবং কোনো রেফারেল বাকি নেই। আপনার সব কাজ সম্পন্ন হয়েছে।',
          phonetic: 'Nomoshkar ASHA didi. Aaj kono follow-up ebong kono referral baaki nei. Aapnar shob kaaj shompurno hoyechhe.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `নমস্কার আশা দিদি। আজ আপনার এলাকায় ${f} জনের ফলো-আপ বাকি আছে এবং কোনো রেফারেল বাকি নেই।`,
          phonetic: `Nomoshkar ASHA didi. Aaj aapnar elakay ${f} joner follow-up baaki aachhe ebong kono referral baaki nei.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `নমস্কার আশা দিদি। আজ সব ফলো-আপ সম্পন্ন হয়েছে, এবং ${r} টি রেফারেল হাসপাতালের রিপোর্টের অপেক্ষায় আছে।`,
          phonetic: `Nomoshkar ASHA didi. Aaj shob follow-up shompurno hoyechhe, ebong ${r} ti referral hospitaler reporter opekkhay aachhe.`,
        };
      }
      return {
        text: `নমস্কার আশা দিদি। আজ আপনার এলাকায় ${f} জনের ফলো-আপ বাকি আছে এবং ${r} টি রেফারেল হাসপাতালের রিপোর্টের অপেক্ষায় আছে।`,
        phonetic: `Nomoshkar ASHA didi. Aaj aapnar elakay ${f} joner follow-up baaki aachhe ebong ${r} ti referral hospitaler reporter opekkhay aachhe.`,
      };
    }

    case 'ta': {
      if (f === 0 && r === 0) {
        return {
          text: 'வணக்கம் ஆஷா பணியாளரே. இன்று எந்த மறுபரிசீலனையும் பரிந்துரையும் நிலுவையில் இல்லை. உங்கள் பணிகள் அனைத்தும் நிறைவடைந்துள்ளன.',
          phonetic: 'Vanakkam ASHA sagothari. Indru endha follow-upum referralum niluvaiyil illai. Ungal panigal anaithum niraivadaindhullana.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `வணக்கம் ஆஷா பணியாளரே. இன்று உங்கள் பகுதியில் ${f} பேருக்கு மறுபரிசீலனை உள்ளது மற்றும் பரிந்துரைகள் எதுவும் நிலுவையில் இல்லை.`,
          phonetic: `Vanakkam ASHA sagothari. Indru ungal pagudhiyil ${f} perukku follow-up ulladhu matrum referrals edhuvum niluvaiyil illai.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `வணக்கம் ஆஷா பணியாளரே. அனைத்து மறுபரிசீலனைகளும் முடிந்துவிட்டன, மற்றும் ${r} பரிந்துரைகள் மருத்துவமனை முடிவிற்காக காத்திருக்கின்றன.`,
          phonetic: `Vanakkam ASHA sagothari. Anaithu follow-upum mudindhuvittana, matrum ${r} maruthuvamanai referrals kaathirukkindrana.`,
        };
      }
      return {
        text: `வணக்கம் ஆஷா பணியாளரே. இன்று உங்கள் பகுதியில் ${f} பேருக்கு மறுபரிசீலனை உள்ளது மற்றும் ${r} பரிந்துரைகள் நிலுவையில் உள்ளன.`,
        phonetic: `Vanakkam ASHA sagothari. Indru ungal pagudhiyil ${f} perukku follow-up matrum ${r} maruthuvamanai referrals kaathirukkindrana.`,
      };
    }

    case 'te': {
      if (f === 0 && r === 0) {
        return {
          text: 'నమస్కారం ఆశా కార్యకర్త. నేడు ఎలాంటి ఫాలో-అప్ మరియు రెఫరల్స్ పెండింగ్‌లో లేవు. మీ అన్ని పనులు పూర్తయ్యాయి.',
          phonetic: 'Namaskaram ASHA karyakartha. Nedu elanti follow-up mariyu referrals pending lo levu. Mee anni panulu poorthi ayyayi.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `నమస్కారం ఆశా కార్యకర్త. నేడు మీ ప్రాంతంలో ${f} మందికి ఫాలో-అప్ అవసరం మరియు రెఫరల్స్ ఏవీ పెండింగ్‌లో లేవు.`,
          phonetic: `Namaskaram ASHA karyakartha. Nedu mee pranthamlo ${f} mandiki follow-up avasaram mariyu referrals eve pending lo levu.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `నమస్కారం ఆశా కార్యకర్త. అన్ని ఫాలో-అప్‌లు పూర్తయ్యాయి, మరియు ${r} రెఫరల్స్ ఆసుపత్రి నివేదిక కోసం వేచి ఉన్నాయి.`,
          phonetic: `Namaskaram ASHA karyakartha. Anni follow-up-lu poorthi ayyayi, mariyu ${r} referrals hospital report kosam vechi unnayi.`,
        };
      }
      return {
        text: `నమస్కారం ఆశా కార్యకర్త. నేడు మీ ప్రాంతంలో ${f} మందికి ఫాలో-అప్ అవసరం మరియు ${r} రెఫరల్స్ ఆసుపత్రి ఫలితం కోసం వేచి ఉన్నాయి.`,
        phonetic: `Namaskaram ASHA karyakartha. Nedu mee pranthamlo ${f} mandiki follow-up avasaram mariyu ${r} referrals hospital phalitham kosam vechi unnayi.`,
      };
    }

    case 'mr': {
      if (f === 0 && r === 0) {
        return {
          text: 'नमस्कार आशा ताई. आज कोणताही पाठपुरावा आणि कोणताही रेफरल प्रलंबित नाही. तुमची सर्व कामे पूर्ण झाली आहेत.',
          phonetic: 'Namaskar ASHA tai. Aaj kontahi follow-up aani kontahi referral pralambit nahi. Tumchi sarva kaame poorna zali ahet.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `नमस्कार आशा ताई. आज तुमच्या भागात ${f} जणांचा पाठपुरावा बाकी आहे आणि कोणताही रेफरल प्रलंबित नाही.`,
          phonetic: `Namaskar ASHA tai. Aaj tumchya bhaagaat ${f} janancha follow-up baaki ahe aani kontahi referral pralambit nahi.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `नमस्कार आशा ताई. सर्व पाठपुरावा पूर्ण झाला आहे, आणि ${r} रेफरल हॉस्पिटलच्या अहवालाच्या प्रतीक्षेत आहेत.`,
          phonetic: `Namaskar ASHA tai. Sarva follow-up poorna zala ahe, aani ${r} referral hospitalcha ahavalacha pratikashet ahet.`,
        };
      }
      return {
        text: `नमस्कार आशा ताई. आज तुमच्या भागात ${f} जणांचा पाठपुरावा बाकी आहे आणि ${r} रेफरल हॉस्पिटलच्या निकालाच्या प्रतीक्षेत आहेत.`,
        phonetic: `Namaskar ASHA tai. Aaj tumchya bhaagaat ${f} janancha follow-up baaki ahe aani ${r} referral hospital nikaalachi pratiksha karat ahet.`,
      };
    }

    case 'gu': {
      if (f === 0 && r === 0) {
        return {
          text: 'નમસ્તે આશા બહેન. આજે કોઈ ફોલો-અપ અને કોઈ રેફરલ બાકી નથી. તમારા બધા કાર્યો પૂર્ણ થયા છે.',
          phonetic: 'Namaste ASHA bahen. Aaje koi follow-up ane koi referral baaki nathi. Tamara badha kaaryo poorna thaya chhe.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `નમસ્તે આશા બહેન. આજે તમારા વિસ્તારમાં ${f} લોકોનું ફોલો-અપ બાકી છે અને કોઈ રેફਰલ બાકી નથી.`,
          phonetic: `Namaste ASHA bahen. Aaje tamara vistaarma ${f} lokonu follow-up baaki chhe ane koi referral baaki nathi.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `નમસ્તે આશા બહેન. બધા ફોલો-અપ પૂર્ણ થયા છે, અને ${r} રેફરલ હોસ્પિટલના રિપોર્ટની રાહ જોઈ રહ્યા છે.`,
          phonetic: `Namaste ASHA bahen. Badha follow-up poorna thaya chhe, ane ${r} referral hospitalna reportni raah joi rahya chhe.`,
        };
      }
      return {
        text: `નમસ્તે આશા બહેન. આજે તમારા વિસ્તારમાં ${f} લોકોનું ફોલો-અપ બાકી છે અને ${r} રેફરલ હોસ્પિટલ રિપોર્ટની રાહ જોઈ રહ્યા છે.`,
        phonetic: `Namaste ASHA bahen. Aaje tamara vistaarma ${f} lokonu follow-up baaki chhe ane ${r} referral hospital reportni raah joi rahya chhe.`,
      };
    }

    case 'kn': {
      if (f === 0 && r === 0) {
        return {
          text: 'ನಮಸ್ಕಾರ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ. ಇಂದು ಯಾವುದೇ ಫಾಲೋ-ಅಪ್ ಮತ್ತು ಯಾವುದೇ ರೆಫರಲ್ ಬಾಕಿ ಇಲ್ಲ. ನಿಮ್ಮ ಎಲ್ಲಾ ಕಾರ್ಯಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ.',
          phonetic: 'Namaskara ASHA karyakarthe. Indu yaavude follow-up matthu referral baaki illa. Nimma ella kaaryagalu pooranagondive.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `ನಮಸ್ಕಾರ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ. ಇಂದು ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ${f} ಜನರಿಗೆ ಫಾಲೋ-ಅಪ್ ಬಾಕಿ ಇದೆ ಮತ್ತು ಯಾವುದೇ ರೆಫರಲ್ ಬಾಕಿ ಇಲ್ಲ.`,
          phonetic: `Namaskara ASHA karyakarthe. Indu nimma pradeshadalli ${f} janarige follow-up baaki ide matthu yaavude referral baaki illa.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `ನಮಸ್ಕಾರ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ. ಎಲ್ಲಾ ಫಾಲೋ-ಅಪ್‌ಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ, ಮತ್ತು ${r} ರೆಫರಲ್‌ಗಳು ಆಸ್ಪತ್ರೆಯ ವರದಿಗಾಗಿ ಕಾಯುತ್ತಿವೆ.`,
          phonetic: `Namaskara ASHA karyakarthe. Ella follow-upgalu pooranagondive, matthu ${r} referralgalu aaspagre varadigaagi kaayuttive.`,
        };
      }
      return {
        text: `ನಮಸ್ಕಾರ ಆಶಾ ಕಾರ್ಯಕರ್ತೆ. ಇಂದು ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ${f} ಜನರಿಗೆ ಫಾಲೋ-ಅಪ್ ಬಾಕಿ ಇದೆ ಮತ್ತು ${r} ರೆಫರಲ್‌ಗಳು ಆಸ್ಪತ್ರೆಯ ವರದಿಗಾಗಿ ಕಾಯುತ್ತಿವೆ.`,
        phonetic: `Namaskara ASHA karyakarthe. Indu nimma pradeshadalli ${f} janarige follow-up baaki ide matthu ${r} referralgalu aaspagre report baaki ide.`,
      };
    }

    case 'ml': {
      if (f === 0 && r === 0) {
        return {
          text: 'നമസ്കാരം ആശ പ്രവർത്തകരെ. ഇന്ന് ഫോളോ-അപ്പുകളും റഫറലുകളും ഒന്നും ബാക്കിയില്ല. നിങ്ങളുടെ എല്ലാ ചുമതലകളും പൂർത്തിയായി.',
          phonetic: 'Namaskaram ASHA pravarthakare. Innu follow-upukalum referralukalum onnum baakiyilla. Ningalude ella chumathalakalum poorthiyaayi.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `നമസ്കാരം ആശ പ്രവർത്തകരെ. ഇന്ന് ${f} പേരുടെ ഫോളോ-അപ്പ് ബാക്കിയുണ്ട്, റഫറലുകൾ ഒന്നും ബാക്കിയില്ല.`,
          phonetic: `Namaskaram ASHA pravarthakare. Innu ${f} perude follow-up baakiyundu, referralukal onnum baakiyilla.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `നമസ്കാരം ആശ പ്രവർത്തകരെ. എല്ലാ ഫോളോ-അപ്പുകളും പൂർത്തിയായി, ${r} ആശുപത്രി റഫറലുകൾ കാത്തിരിക്കുന്നു.`,
          phonetic: `Namaskaram ASHA pravarthakare. Ella follow-upukalum poorthiyaayi, ${r} hospital referralukal kaathirikkunnu.`,
        };
      }
      return {
        text: `നമസ്കാരം ആശ പ്രവർത്തകരെ. ഇന്ന് ${f} പേരുടെ ഫോളോ-അപ്പും ${r} ആശുപത്രി റഫറലുകളും കാത്തിരിക്കുന്നു.`,
        phonetic: `Namaskaram ASHA pravarthakare. Innu ${f} perude follow-upum ${r} hospital referralukalum kaathirikkunnu.`,
      };
    }

    case 'or': {
      if (f === 0 && r === 0) {
        return {
          text: 'ନମସ୍କାର ଆଶା ଦିଦି। ଆଜି କୌଣସି ଫଲୋ-ଅପ୍ କିମ୍ବା ରେଫରାଲ୍ ବାକି ନାହିଁ। ଆପଣଙ୍କର ସମସ୍ତ କାର୍ଯ୍ୟ ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି।',
          phonetic: 'Namaskar ASHA didi. Aaji kounasi follow-up kimba referral baaki naahi. Aapanankara samasta kaaryya sampurna hoichhi.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `ନମସ୍କାର ଆଶା ଦିଦି। ଆଜି ଆପଣଙ୍କ ଅଞ୍ਚଳରେ ${f} ଜଣଙ୍କ ଫଲୋ-ଅପ୍ ବାକି ଅଛି ଏବଂ କୌଣସି ରେଫରାଲ୍ ବାକି ନାହିଁ।`,
          phonetic: `Namaskar ASHA didi. Aaji aapananka anchalare ${f} jananka follow-up baaki achhi ebong kounasi referral baaki naahi.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `ନମସ୍କାର ଆଶା ଦିଦି। ସମସ୍ତ ଫଲୋ-ଅପ୍ ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି, ଏବଂ ${r} ଟି ରେଫରାଲ୍ ହସ୍ପିଟାଲ୍ ରିପୋର୍ଟ ଅପେକ୍ଷାରେ ଅଛି।`,
          phonetic: `Namaskar ASHA didi. Samasta follow-up sampurna hoichhi, ebong ${r} ti referral hospital report apekshare achhi.`,
        };
      }
      return {
        text: `ନମସ୍କାର ଆଶା ଦିଦି। ଆଜି ଆପଣଙ୍କ ଅଞ୍ਚଳରେ ${f} ଜଣଙ୍କ ଫଲୋ-ଅପ୍ ଏବଂ ${r} ଟି ରେଫରାଲ୍ ବାକି ଅଛି।`,
        phonetic: `Namaskar ASHA didi. Aaji aapananka anchalare ${f} jananka follow-up ebong ${r} hospital referral baaki achhi.`,
      };
    }

    case 'ur': {
      if (f === 0 && r === 0) {
        return {
          text: 'آداب آشا دیدی۔ آج کوئی فالو اپ اور کوئی ریفرل باقی نہیں ہے۔ آپ کے تمام کام مکمل ہو चुके ہیں۔',
          phonetic: 'Aadaab ASHA didi. Aaj koi follow-up aur koi referral baaqi nahi hai. Aap ke tamaam kaam mukammal ho chuke hain.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `آداب آشا دیدی۔ آج ${f} افراد کا فالو اپ باقی ہے اور کوئی ریفرل نتائج کے منتظر نہیں ہے۔`,
          phonetic: `Aadaab ASHA didi. Aaj ${f} afraad ka follow-up baaqi hai aur koi referral nataaij ke muntazir nahi hai.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `آداب آشا دیدی۔ تمام فالو اپ مکمل ہو چکے ہیں، اور ${r} ریفرلز اسپتال کی رپورٹ کے منتظر ہیں۔`,
          phonetic: `Aadaab ASHA didi. Tamaam follow-up mukammal ho chuke hain, aur ${r} referrals hospital ki report ke muntazir hain.`,
        };
      }
      return {
        text: `آداب آشا دیدی। آج ${f} افراد کا فالو اپ اور ${r} اسپتال کے ریفرلز نتائج کے منتظر ہیں۔`,
        phonetic: `Aadaab ASHA didi. Aaj ${f} afraad ka follow-up aur ${r} hospital referrals baaqi hain.`,
      };
    }

    case 'as': {
      if (f === 0 && r === 0) {
        return {
          text: 'নমস্কাৰ আশা বাইদেউ। আজি কোনো ফলো-আপ আৰু ৰেফাৰেল বাকী নাই। আপোনাৰ সকলো কাম সম্পূৰ্ণ হৈছে।',
          phonetic: 'Nomoskar ASHA baideu. Aaji kono follow-up aaru referral baaki nai. Aaponar sokolo kaam sompurno hoise.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `নমস্কাৰ আশা বাইদেউ। আজি ${f} জনৰ ফলো-আপ বাকী আছে আৰু কোনো ৰেফাৰেল বাকੀ নাই।`,
          phonetic: `Nomoskar ASHA baideu. Aaji ${f} jonor follow-up baaki aase aaru kono referral baaki nai.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `নমস্কাৰ আশা বাইদেউ। সকলো ফলো-আপ সম্পূৰ্ণ হৈছে, আৰু ${r} টা চিকিৎসালয়ৰ ৰেফাৰেল বাকী আছে।`,
          phonetic: `Nomoskar ASHA baideu. Sokolo follow-up sompurno hoise, aaru ${r} duto hospital referral baaki aase.`,
        };
      }
      return {
        text: `নমস্কাৰ আশা বাইদেউ। আজি ${f} জনৰ ফলো-আপ আৰু ${r} টা চিকিৎসালয়ৰ ৰেফাৰেল বাকী আছে।`,
        phonetic: `Nomoskar ASHA baideu. Aaji ${f} jonor follow-up aaru ${r} duto hospital referral baaki aase.`,
      };
    }

    case 'sd': {
      if (f === 0 && r === 0) {
        return {
          text: 'अजु का फालो-अप ऐं का रेफरल बाकी न आहि। सभ कम्म पूरा थियला।',
          phonetic: 'Aju kaa follow-up ain kaa referral baaki na aahi. Sabh kamm poora thiyala.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `अजु तव्हांजे गोठ में ${f} मरीज़नि जो वरि तपास बाकी आहि ऐं का रेफरल बाकी न आहि।`,
          phonetic: `Aju tavhaanje goth mein ${f} mareezan jo vari tapaas baaki aahi ain kaa referral baaki na aahi.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `सभ फालो-अप पूरा आहिन, ऐं ${r} रेफरल हस्पताल नतीजे जी इन्तज़ार में आहिन।`,
          phonetic: `Sabh follow-up poora aahin, ain ${r} referral hospital nateeje jee intezaar mein aahin.`,
        };
      }
      return {
        text: `अजु ${f} मरीज़नि जो वरि तपास बाकी आहि ऐं ${r} रेफरल हस्पताल नतीजे जी इन्तज़ार में आहिन।`,
        phonetic: `Aju ${f} mareezan jo vari tapaas baaki aahi ain ${r} referral hospital nateeje jee intezaar mein aahin.`,
      };
    }

    case 'mai': {
      if (f === 0 && r === 0) {
        return {
          text: 'प्रणाम आशा दीदी। आइ कोनो फलो-अप आ कोनो रेफरल बाँकी नहि अछि। अहाँक सभटा काज पूर्ण भ गेल।',
          phonetic: 'Pranam ASHA didi. Aai kono follow-up aa kono referral baaki nahi achhi. Ahaank sabhta kaaj poorn bha gel.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `प्रणाम आशा दीदी। आइ अहाँक गाममे ${f} लोकनिक फलो-अप बाँकी अछि आ कोनो रेफरल बाँकी नहि अछि।`,
          phonetic: `Pranam ASHA didi. Aai ahaank gaamme ${f} lokanik follow-up baaki achhi aa kono referral baaki nahi achhi.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `सभटा फलो-अप पूर्ण अछि, आ ${r} टा रेफरल अस्पताल परिणामक प्रतीक्षा मे अछि।`,
          phonetic: `Sabhta follow-up poorn achhi, aa ${r} taa referral hospital parinaamak pratiksha me achhi.`,
        };
      }
      return {
        text: `आइ ${f} लोकनिक फलो-अप बाँकी अछि आ ${r} टा रेफरल अस्पताल परिणामक प्रतीक्षा मे अछि।`,
        phonetic: `Aai ${f} lokanik follow-up baaki achhi aa ${r} taa referral hospital parinaamak pratiksha me achhi.`,
      };
    }

    case 'brx': {
      if (f === 0 && r === 0) {
        return {
          text: 'गुलुमबाय आशा मावथि। दिनै जेबो फलो-आप आरो रेफारेल गैला। गासैबो खामानिया जाफुंबाय।',
          phonetic: 'Gulumby ASHA maothi. Dinwi jebo follow-up aaro referral gaila. Gasaibo khaamaniya jaafungbay.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `गुलुमबाय आशा मावथि। दिनै नोंथांनि गामियाव ${f} सायारिनि फलो-आप दं आरो जेबो रेफारेल गैला।`,
          phonetic: `Gulumby ASHA maothi. Dinwi nongthaangni gaamiyaov ${f} saayarini follow-up dong aaro jebo referral gaila.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `गासै फलो-आप जाफुंबाय, आरो ${r} ता रेफारेल देहा फाहामसालि फिथायनि नेनायाव दं।`,
          phonetic: `Gaasai follow-up jaafungbay, aaro ${r} taa referral deha phaahaamsaali phithaayni nenaayaov dong.`,
        };
      }
      return {
        text: `दिनै ${f} सायारिनि फलो-आप दं आरो ${r} ता रेफारेल देहा फाहामसालि फिथायनि नेनायाव दं।`,
        phonetic: `Dinwi ${f} saayarini follow-up dong aaro ${r} taa referral deha phaahaamsaali phithaayni nenaayaov dong.`,
      };
    }

    case 'sat': {
      if (f === 0 && r === 0) {
        return {
          text: 'ᱡᱚᱦᱟᱨ ᱟᱥᱟ ᱫᱤᱫᱤ᱾ ᱛᱮᱦᱮᱧ ᱪᱮᱫ ᱦᱚᱸ ᱯᱷᱚᱞᱳ-ᱟᱯ ᱟᱨ ᱨᱮᱯᱷᱟᱨᱮᱞ ᱵᱟᱹᱱᱩᱜ-ᱟ᱾ ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ᱾',
          phonetic: 'Johar ASHA didi. Tehenj ched hon follow-up aar referral banuga. Joto kami puraw ena.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `ᱡᱚᱦᱟᱨ ᱟᱥᱟ ᱫᱤᱫᱤ᱾ ᱛᱮᱦᱮᱧ ᱟᱢᱟᱜ ᱟᱹᱛᱩ ᱨᱮ ${f} ᱦᱚᱲᱟᱜ ᱯᱷᱚᱞᱳ-ᱟᱯ ᱥᱟᱨᱮᱡ ᱢᱮᱱᱟᱜ-ᱟ ᱟᱨ ᱪᱮᱫ ᱦᱚᱸ ᱨᱮᱯᱷᱟᱨᱮᱞ ᱵᱟᱹᱱᱩᱜ-ᱟ᱾`,
          phonetic: `Johar ASHA didi. Tehenj aamag aatu re ${f} hodag follow-up sarej menaga aar ched hon referral banuga.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `ᱡᱚᱛᱚ ᱯᱷᱚᱞᱳ-ᱟᱯ ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ, ᱟᱨ ${r} ᱨᱮᱯᱷᱟᱨᱮᱞ ᱦᱟᱥᱯᱟᱛᱟᱞ ᱨᱤᱯᱳᱨᱴ ᱛᱟᱺᱜᱤ ᱨᱮ ᱢᱮᱱᱟᱜ-ᱟ᱾`,
          phonetic: `Joto follow-up puraw ena, aar ${r} referral hospital report taangi re menaga.`,
        };
      }
      return {
        text: `ᱛᱮᱦᱮᱧ ${f} ᱦᱚᱲᱟᱜ ᱯᱷᱚᱞᱳ-ᱟᱯ ᱥᱟᱨᱮᱡ ᱢᱮᱱᱟᱜ-ᱟ ᱟᱨ ${r} ᱨᱮᱯᱷᱟᱨᱮᱞ ᱦᱟᱥᱯᱟᱛᱟᱞ ᱨᱤᱯᱳᱨᱴ ᱛᱟᱺᱜᱤ ᱨᱮ ᱢᱮᱱᱟᱜ-ᱟ᱾`,
        phonetic: `Tehenj ${f} hodag follow-up sarej menaga aar ${r} referral hospital report taangi re menaga.`,
      };
    }

    case 'ne': {
      if (f === 0 && r === 0) {
        return {
          text: 'नमस्ते आशा दिदी। आज कुनै फलो-अप र कुनै रेफरल बाँकी छैन। तपाईंका सबै काम सम्पन्न भएका छन्।',
          phonetic: 'Namaste ASHA didi. Aaja kunai follow-up ra kunai referral baaki chhaina. Tapaanko sabai kaam sampanna bhaeka chhan.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `नमस्ते आशा दिदी। आज तपाईंको क्षेत्रमा ${f} जनाको फलो-अप बाँकी छ र कुनै रेफरल छैन।`,
          phonetic: `Namaste ASHA didi. Aaja tapaanko kshetrama ${f} janako follow-up baaki chha ra kunai referral chhaina.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `नमस्ते आशा दिदी। सबै फलो-अप पूरा भए, र ${r} रेफरल अस्पताल रिपोर्टको पर्खाइमा छन्।`,
          phonetic: `Namaste ASHA didi. Sabai follow-up poora bhae, ra ${r} referral hospital reportko parkhaima chhan.`,
        };
      }
      return {
        text: `नमस्ते आशा दिदी। आज तपाईंको क्षेत्रमा ${f} जनाको फलो-अप बाँकी छ र ${r} रेफरल अस्पताल रिपोर्टको पर्खाइमा छन्।`,
        phonetic: `Namaste ASHA didi. Aaja tapaanko kshetrama ${f} janako follow-up baaki chha ra ${r} referral hospital reportko parkhaima chhan.`,
      };
    }

    case 'sa': {
      if (f === 0 && r === 0) {
        return {
          text: 'नमो नमः आशा भगिनि। अद्य किमपि अनुवर्तनं वा प्रेषणं नावशिष्टम्। सर्वाणि कार्याणि पूर्णाः जाताः।',
          phonetic: 'Namo namah ASHA bhagini. Adya kimapi anuvartanam vaa preshanam naavashishtam. Sarvaani kaaryaani poornaah jaataah.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `नमो नमः आशा भगिनि। अद्य भवती-क्षेत्रे ${f} रुग्णानाम् अनुवर्तनम् अवशिष्टम् अस्ति।`,
          phonetic: `Namo namah ASHA bhagini. Adya bhavatee-kshetre ${f} rugnaanaam anuvartanam avashishtam asti.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `सर्वाणि अनुवर्तनानि पूर्णाः, तथा च ${r} प्रेषणानि चिकित्सालय-परिणामं प्रतीक्षन्ते।`,
          phonetic: `Sarvaani anuvartanaani poornaah, tathaa cha ${r} preshanaani chikitsaalaya-parinaamam prateekshante.`,
        };
      }
      return {
        text: `अद्य ${f} रुग्णानाम् अनुवर्तनम् अवशिष्टम् अस्ति तथा च ${r} प्रेषणानि चिकित्सालय-परिणामं प्रतीक्षन्ते।`,
        phonetic: `Adya ${f} rugnaanaam anuvartanam avashishtam asti tathaa cha ${r} preshanaani chikitsaalaya-parinaamam prateekshante.`,
      };
    }

    case 'doi': {
      if (f === 0 && r === 0) {
        return {
          text: 'नमस्ते आशा दीदी। अज्ज कोई फालो-अप ते कोई रेफरल बाकी नेईं ऐ। तुहांदे सारे कम्म पूरे होई गे न।',
          phonetic: 'Namaste ASHA didi. Ajj koi follow-up te koi referral baaki neeen ai. Tuhande saare kamm poore hoi ge nan.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `नमस्ते आशा दीदी। अज्ज तुहांदे इलाके च ${f} मरीज़ें दा फालो-अप बाकी ऐ।`,
          phonetic: `Namaste ASHA didi. Ajj tuhande ilaake ch ${f} mareezen da follow-up baaki ai.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `सारे फालो-अप पूरे होई गे, ते ${r} रेफरल हस्पताल रिपोर्ट दी उडीक च न।`,
          phonetic: `Saare follow-up poore hoi ge, te ${r} referral hospital report di udeek ch nan.`
        };
      }
      return {
        text: `अज्ज ${f} मरीज़ें दा फालो-अप बाकी ऐ ते ${r} रेफरल हस्पताल रिपोर्ट दी उडीक च न।`,
        phonetic: `Ajj ${f} mareezen da follow-up baaki ai te ${r} referral hospital report di udeek ch nan.`
      };
    }

    case 'ks': {
      if (f === 0 && r === 0) {
        return {
          text: 'सलाम आशा दीदी। अज़ छु न कांह फालो-अप न कांह रेफरल बाकी। तुहंद सारुय काम मुकम्मल गोव।',
          phonetic: 'Salaam ASHA didi. Az chhu na kaanh follow-up na kaanh referral baaki. Tuhund saaruy kaam mukammal gov.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `सलाम आशा दीदी। अज़ छु तुहुंदिस इलाकस मंज़ ${f} मरीज़न हुंद फालो-अप बाकी।`,
          phonetic: `Salaam ASHA didi. Az chhu tuhundis ilakas manz ${f} mareezan hund follow-up baaki.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `सारिय फालो-अप गए मुकम्मल, ते ${r} रेफरल हस्पताल रिपोर्टुक इंतेज़ार करान छि।`,
          phonetic: `Saariy follow-up gaye mukammal, te ${r} referral hospital reportuk intezaar karaan chhi.`
        };
      }
      return {
        text: `अज़ छु ${f} मरीज़न हुंद फालो-अप बाकी ते ${r} रेफरल हस्पताल रिपोर्टुक इंतेज़ार करान छि।`,
        phonetic: `Az chhu ${f} mareezan hund follow-up baaki te ${r} referral hospital reportuk intezaar karaan chhi.`
      };
    }

    case 'kok': {
      if (f === 0 && r === 0) {
        return {
          text: 'नमस्कार आशा दीदी। आयज खंयचोच फॉलो-अप आनी रेफरल उरिल्लो ना। तुमचे सगळे काम पुराय जाल्यात।',
          phonetic: 'Namaskar ASHA didi. Aayaj khaynchoch follow-up aani referral urillo naa. Tumche sagle kaam puraay jaalyaat.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `नमस्कार आशा दीदी। आयज तुमच्या वाठारांत ${f} जाणांचो फॉलो-अप उरला।`,
          phonetic: `Namaskar ASHA didi. Aayaj tumchya vaatharant ${f} jaanacho follow-up urla.`
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `सगळे फॉलो-अप पुराय जाले, आनी ${r} रेफरल हॉस्पिटलाच्या निकालाची वाट पळयतात।`,
          phonetic: `Sagle follow-up puraay jaale, aani ${r} referral hospitalachya nikalaachi vaat palaytata.`
        };
      }
      return {
        text: `आयज ${f} जाणांचो फॉलो-अप उरला आनी ${r} रेफरल हॉस्पिटलाच्या निकालाची वाट पळयतात।`,
        phonetic: `Aayaj ${f} jaanacho follow-up urla aani ${r} referral hospitalachya nikalaachi vaat palaytata.`
      };
    }

    case 'mni': {
      if (f === 0 && r === 0) {
        return {
          text: 'খুরুমজরি আশা ইচে। ঙসি অমত্তা ফলো-অপ অমসুং রেফারেল লৈত্রে। নহাক্কী থবক পুম্নমক লোইশিনখ্রে।',
          phonetic: 'Khurumjari ASHA iche. Ngasi amatta follow-up amasung referral leitre. Nahakki thabak pumnamak loishinkhre.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `খুরুমজরি আশা ইচে। ঙসি নহাক্কী মফমদা অনাবা ${f}গী ফলো-অপ লৈরি।`,
          phonetic: `Khurumjari ASHA iche. Ngasi nahakki mafamda anaba ${f}gi follow-up leiri.`
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `ফলো-অপ পুম্নমক লোইশিনখ্রে, অমসুং ${r} রেফারেল হোস্পিতাল রিপোর্ত ঙাইদুনা লৈরি।`,
          phonetic: `Follow-up pumnamak loishinkhre, amasung ${r} referral hospital report ngaaiduna leiri.`
        };
      }
      return {
        text: `ঙসি অনাবা ${f}গী ফলো-অপ লৈরি অমসুং ${r} রেফারেল হোস্পিতাল রিপোর্ত ঙাইদুনা লৈরি।`,
        phonetic: `Ngasi anaba ${f}gi follow-up leiri amasung ${r} referral hospital report ngaaiduna leiri.`
      };
    }

    default: {
      // Fallback to Hindi
      if (f === 0 && r === 0) {
        return {
          text: 'नमस्ते आशा दीदी। आज कोई फॉलो-अप और कोई रेफरल लंबित नहीं है। आपके सभी कार्य पूरे हो चुके हैं।',
          phonetic: 'Namaste ASHA didi. Aaj koi follow-up aur koi referral lambit nahi hai. Aapke sabhi karya poore ho chuke hain.',
        };
      }
      if (f > 0 && r === 0) {
        return {
          text: `नमस्ते आशा दीदी। आज आपके क्षेत्र में ${f} लोगों का फॉलो-अप बाकी है और कोई रेफरल लंबित नहीं है।`,
          phonetic: `Namaste ASHA didi. Aaj aapke kshetra mein ${f} logon ka follow-up baaki hai aur koi referral lambit nahi hai.`,
        };
      }
      if (f === 0 && r > 0) {
        return {
          text: `नमस्ते आशा दीदी। आज सभी फॉलो-अप पूरे हैं, और ${r} रेफरल अस्पताल रिपोर्ट की प्रतीक्षा में हैं।`,
          phonetic: `Namaste ASHA didi. Aaj sabhi follow-up poore hain, aur ${r} referral hospital report ki pratiksha mein hain.`,
        };
      }
      return {
        text: `नमस्ते आशा दीदी। आज आपके क्षेत्र में ${f} लोगों का फॉलो-अप बाकी है और ${r} रेफरल अस्पताल रिपोर्ट की प्रतीक्षा में हैं।`,
        phonetic: `Namaste ASHA didi. Aaj aapke kshetra mein ${f} logon ka follow-up baaki hai aur ${r} referral hospital report ki pratiksha mein hain.`,
      };
    }
  }
}

