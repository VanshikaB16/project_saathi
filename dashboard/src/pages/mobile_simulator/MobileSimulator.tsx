import React, { useState } from 'react';
import {
  Smartphone,
  Volume2,
  VolumeX,
  ArrowLeft,
  HeartPulse,
  Camera,
  Activity,
  UserPlus,
  GitPullRequest,
  History,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  FileSpreadsheet,
  Layers,
  Settings,
  Shield,
  Phone,
  RefreshCw,
  Info,
  Languages,
  X,
  Search,
  Check,
  RotateCcw,
  Trash2,
  Sparkles,
  Plus,
  Calendar,
  Stethoscope,
  MessageSquare,
  FileCheck,
  UserCheck,
  Bot,
  Globe,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { speechTts } from '../../services/speechTts';
import { offlineStore, StoredPatient, StoredReferral, StoredFollowup } from '../../services/offlineStore';
import { ClientCbcRulesEngine } from '../../services/cbcEngine';
import { AudioGuidanceButton } from '../../components/AudioGuidanceButton';
import { CONSTITUTIONAL_LANGUAGES, getTranslation, getBcp47Tag, getDynamicAudioGreeting } from '../../services/localization';
import { AccessibleCamera } from '../../components/AccessibleCamera';
import { QualityMetricsResult, ClinicalSkinAnalysis, analyzeSkinLesionCanvas, validateRetinaFundusImage, FundusValidationResult, DiseasePossibility } from '../../services/imageQuality';
import { geminiVisionService, GeminiTriageResult } from '../../services/geminiVision';
import { elevenLabsService, ELEVENLABS_PRESETS } from '../../services/elevenLabsService';
import { RoleLoginScreen, MobileUserProfile } from './RoleLoginScreen';
import { DoctorMobileView } from './DoctorMobileView';
import { getTaskTexts, getRoleLoginTexts, getDoctorMobileTexts } from '../../services/uiLocalization';
import { browserUseService } from '../../services/browserUseService';

export type MobileScreenId =
  | 'welcome'
  | 'home'
  | 'register'
  | 'consent'
  | 'pathway_select'
  | 'skin_screening'
  | 'eye_screening'
  | 'chest_screening'
  | 'blood_screening'
  | 'result'
  | 'referrals'
  | 'timeline'
  | 'followups'
  | 'settings';

export interface MobileSimulatorProps {
  initialRole?: 'ASHA' | 'DOCTOR';
  standalone?: boolean;
  onNavigatePortal?: (route: 'ADMIN' | 'MOBILE' | 'DOCTOR') => void;
  startAtLogin?: boolean;
}

const DEFAULT_ASHA_PROFILE: MobileUserProfile = {
  role: 'ASHA',
  name: 'सुनीता देवी (Sunita Devi)',
  aadhaar: '4829 8812 3041',
  ashaId: 'ASHA-PB-2041',
  phone: '9876543210',
};

const DEFAULT_DOCTOR_PROFILE: MobileUserProfile = {
  role: 'DOCTOR',
  name: 'डॉ. राजीव वर्मा (Dr. Rajiv Verma)',
  hospitalName: 'नाभा सीएचसी (Nabha CHC)',
  nmrId: 'NMR-PB-49102',
  phone: '9812345678',
};

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  initialRole,
  standalone = false,
  onNavigatePortal,
  startAtLogin = false,
}) => {
  // Mobile User Role Profile (ASHA vs Doctor)
  const [currentUserProfile, setCurrentUserProfile] = useState<MobileUserProfile | null>(() => {
    if (startAtLogin) {
      return null;
    }
    if (initialRole === 'DOCTOR') {
      return DEFAULT_DOCTOR_PROFILE;
    }
    if (initialRole === 'ASHA') {
      return DEFAULT_ASHA_PROFILE;
    }
    return null;
  });

  // Automatically update role when initialRole changes
  React.useEffect(() => {
    if (initialRole === 'DOCTOR') {
      setCurrentUserProfile(DEFAULT_DOCTOR_PROFILE);
    } else if (initialRole === 'ASHA') {
      setCurrentUserProfile(DEFAULT_ASHA_PROFILE);
    }
  }, [initialRole]);

  const handleLogin = (profile: MobileUserProfile) => {
    setCurrentUserProfile(profile);
    try {
      localStorage.setItem('saathi_mobile_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not save user profile', e);
    }
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setCurrentUserProfile(null);
    try {
      localStorage.removeItem('saathi_mobile_user_profile');
    } catch (e) {
      console.warn('Could not remove user profile', e);
    }
    setCurrentScreen('welcome');
  };

  const [currentScreen, setCurrentScreen] = useState<MobileScreenId>('home');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hi');
  const [isLangPickerOpen, setIsLangPickerOpen] = useState<boolean>(false);
  const [langSearch, setLangSearch] = useState<string>('');

  // Active translation dictionary
  const t = getTranslation(selectedLanguage);
  const taskTexts = getTaskTexts(selectedLanguage);
  const isEn = selectedLanguage === 'en';
  const activeLangMeta = CONSTITUTIONAL_LANGUAGES.find((l) => l.code === selectedLanguage) || CONSTITUTIONAL_LANGUAGES[0];

  // Shared Patient / Screening States
  const [activePatient, setActivePatient] = useState<StoredPatient | null>(null);
  const [resultFlag, setResultFlag] = useState<'GREEN' | 'AMBER' | 'RED'>('AMBER');
  const [resultPathway, setResultPathway] = useState<string>('SKIN');
  const [resultReason, setResultReason] = useState<string>('त्वचा स्क्रीनिंग में संभावित लक्षण पाए गए।');
  const [resultDifferentials, setResultDifferentials] = useState<DiseasePossibility[]>([]);
  const [resultNearestCondition, setResultNearestCondition] = useState<string>('');

  // Form states
  const [regName, setRegName] = useState('');
  const [regVillage, setRegVillage] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState('FEMALE');
  const [regPhone, setRegPhone] = useState('');
  const [regPhotoAttached, setRegPhotoAttached] = useState(false);
  const [regPhotoUri, setRegPhotoUri] = useState<string | null>(null);
  const [showRegCamera, setShowRegCamera] = useState<boolean>(false);

  // Consent states
  const [consentCare, setConsentCare] = useState(true);
  const [consentReferral, setConsentReferral] = useState(true);
  const [consentSms, setConsentSms] = useState(true);
  const [consentResearch, setConsentResearch] = useState(false); // Unbundled!

  // Skin Screening Viewport State
  const [skinCaptured, setSkinCaptured] = useState(false);
  const [skinAnalyzing, setSkinAnalyzing] = useState(false);
  const [skinCapturedImage, setSkinCapturedImage] = useState<string | null>(null);
  const [skinQualityResult, setSkinQualityResult] = useState<QualityMetricsResult | null>(null);
  const [skinAnalysisResult, setSkinAnalysisResult] = useState<ClinicalSkinAnalysis | null>(null);
  const [geminiResult, setGeminiResult] = useState<GeminiTriageResult | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [skinSignType, setSkinSignType] = useState('HEALTHY_ROUTINE');

  // Eye Screening State
  const [hasFundusLens, setHasFundusLens] = useState(false);
  const [eyeDiabetes, setEyeDiabetes] = useState(true);
  const [eyeBlurryVision, setEyeBlurryVision] = useState(false);
  const [eyeCapturedImage, setEyeCapturedImage] = useState<string | null>(null);
  const [eyeValidationResult, setEyeValidationResult] = useState<FundusValidationResult | null>(null);
  const [eyeGeminiResult, setEyeGeminiResult] = useState<GeminiTriageResult | null>(null);
  const [isEyeAnalyzing, setIsEyeAnalyzing] = useState(false);

  // Chest Screening State
  const [chestCough2Weeks, setChestCough2Weeks] = useState(false);
  const [chestHemoptysis, setChestHemoptysis] = useState(false);
  const [chestNightSweats, setChestNightSweats] = useState(false);

  // Blood Screening State
  const [hbValue, setHbValue] = useState('8.4');
  const [wbcValue, setWbcValue] = useState('2800');
  const [pltValue, setPltValue] = useState('45000');
  const [smearReviewed, setSmearReviewed] = useState(false);

  // ElevenLabs Mobile Assistant State
  const [mobileElevenKey, setMobileElevenKey] = useState(() => elevenLabsService.getApiKey());
  const [mobileElevenVoice, setMobileElevenVoice] = useState(() => elevenLabsService.getVoiceId());
  const [isMobileTestingVoice, setIsMobileTestingVoice] = useState(false);
  const [showMobileKey, setShowMobileKey] = useState(false);

  // Dynamic Live Store States (synced with actual offline storage)
  const [referrals, setReferrals] = useState<StoredReferral[]>(() => offlineStore.getReferrals());
  const [followups, setFollowups] = useState<StoredFollowup[]>(() => offlineStore.getFollowups());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() => offlineStore.getPendingSyncCount());

  // Follow-up Creation Modal States
  const [isAddFollowupOpen, setIsAddFollowupOpen] = useState(false);
  const [newFollowupName, setNewFollowupName] = useState('');
  const [newFollowupAge, setNewFollowupAge] = useState('45');
  const [newFollowupVillage, setNewFollowupVillage] = useState('रामपूर (Rampur)');
  const [newFollowupTask, setNewFollowupTask] = useState('त्वचा पुनः जाँच (Skin Recheck)');
  const [newFollowupDue, setNewFollowupDue] = useState('Due Tomorrow');

  // ASHA Visit Observation Recording Modal State
  const [visitingFollowup, setVisitingFollowup] = useState<StoredFollowup | null>(null);
  const [visitNotesText, setVisitNotesText] = useState<string>('');

  // Doctor Post-Followup Review Modal State
  const [doctorReviewingFollowup, setDoctorReviewingFollowup] = useState<StoredFollowup | null>(null);
  const [doctorCommentInput, setDoctorCommentInput] = useState<string>('');
  const [doctorReviewName, setDoctorReviewName] = useState<string>('डॉ. राजीव वर्मा (Dr. Rajiv Verma, MO CHC)');

  const refreshStoreState = () => {
    setReferrals([...offlineStore.getReferrals()]);
    setFollowups([...offlineStore.getFollowups()]);
    setPendingSyncCount(offlineStore.getPendingSyncCount());
  };

  const openReferrals = referrals.filter((r) => r.status !== 'COMPLETED');
  const pendingFollowups = followups.filter((f) => f.status === 'PENDING');
  const openReferralsCount = openReferrals.length;
  const pendingFollowupsCount = pendingFollowups.length;

  const dynamicGreeting = getDynamicAudioGreeting(
    selectedLanguage,
    pendingFollowupsCount,
    openReferralsCount
  );

  const getVillageSafePrefix = (vName: string): string => {
    if (!vName) return 'VIL';
    const match = vName.match(/\(([^)]+)\)/);
    const target = match && match[1] ? match[1] : vName;
    const clean = target.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (clean.length >= 3) return clean.slice(0, 3);
    return 'VIL';
  };

  const handleAddFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowupName.trim()) return;
    const seq = Math.floor(1000 + Math.random() * 9000);
    const prefix = getVillageSafePrefix(newFollowupVillage);
    const newFoll: StoredFollowup = {
      id: `foll-${Date.now()}`,
      patientSafeId: `SAA-${prefix}-2026-${seq}`,
      patientName: newFollowupName.trim(),
      patientAge: parseInt(newFollowupAge, 10) || 45,
      villageName: newFollowupVillage.trim() || 'रामपूर (Rampur)',
      taskTitle: newFollowupTask.trim() || 'पुनः जाँच (Recheck)',
      dueLabel: newFollowupDue,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    offlineStore.saveFollowup(newFoll);
    refreshStoreState();
    setIsAddFollowupOpen(false);
    setNewFollowupName('');
    speakText(isEn ? 'New follow-up task added' : 'नया फॉलो-अप कार्य जोड़ा गया');
  };

  const handleConfirmVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitingFollowup) return;
    offlineStore.markFollowupVisited(visitingFollowup.id, visitNotesText.trim());
    refreshStoreState();
    setVisitingFollowup(null);
    setVisitNotesText('');
    speakText(isEn ? 'Home visit observations recorded' : 'गृह भेंट की रिपोर्ट दर्ज की गई');
  };

  const handleDoctorSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorReviewingFollowup || !doctorCommentInput.trim()) return;
    offlineStore.addDoctorFollowupComment(
      doctorReviewingFollowup.id,
      doctorCommentInput.trim(),
      doctorReviewName.trim(),
      true
    );
    refreshStoreState();
    setDoctorReviewingFollowup(null);
    setDoctorCommentInput('');
    speakText(isEn ? "Doctor's clinical review saved" : 'डॉक्टर की अग्रिम क्लिनिकल समीक्षा दर्ज की गई');
  };

  const resetScreeningSession = () => {
    // Reset skin screening
    setSkinCaptured(false);
    setSkinAnalyzing(false);
    setSkinCapturedImage(null);
    setSkinQualityResult(null);
    setSkinAnalysisResult(null);
    setGeminiResult(null);
    setIsAiAnalyzing(false);
    setSkinSignType('HEALTHY_ROUTINE');

    // Reset eye screening
    setEyeCapturedImage(null);
    setEyeValidationResult(null);
    setEyeGeminiResult(null);
    setIsEyeAnalyzing(false);
    setEyeBlurryVision(false);

    // Reset chest screening
    setChestCough2Weeks(false);
    setChestHemoptysis(false);
    setChestNightSweats(false);

    // Reset blood screening
    setHbValue('8.4');
    setWbcValue('2800');
    setPltValue('45000');
    setSmearReviewed(false);

    // Reset result state
    setResultFlag('AMBER');
    setResultReason('');
    setResultDifferentials([]);
    setResultNearestCondition('');
  };

  const handleReScreenFromFollowup = (f: StoredFollowup) => {
    // Locate existing patient or construct one from follow-up records
    const existingPatient = offlineStore.getPatients().find((p) => p.safeIdentifier === f.patientSafeId);
    const pat: StoredPatient = existingPatient || {
      id: `pat-${Date.now()}`,
      safeIdentifier: f.patientSafeId,
      name: f.patientName,
      villageName: f.villageName,
      ageYears: f.patientAge,
      gender: 'FEMALE',
      emergencyContact: '',
      createdAt: new Date().toISOString(),
    };
    setActivePatient(pat);
    resetScreeningSession();
    setVisitingFollowup(null);
    setCurrentScreen('pathway_select');
    speakText(
      isEn
        ? `Re-screening initiated for ${pat.name || pat.safeIdentifier}. Choose screening pathway.`
        : `${pat.name || pat.safeIdentifier} हेतु पुनः स्क्रीनिंग। जाँच का चयन करें।`
    );
  };

  // Cloud Browser Use OPD Pre-Booking State
  const [bookingAgentRefId, setBookingAgentRefId] = useState<string | null>(null);
  const [bookedTokensMap, setBookedTokensMap] = useState<Record<string, { token: string; date: string; url?: string }>>({});

  const handleBookHospitalOPDForReferral = async (ref: StoredReferral) => {
    setBookingAgentRefId(ref.id);
    try {
      const spec = ref.pathway === 'SKIN' ? 'Dermatology' : ref.pathway === 'EYE' ? 'Ophthalmology' : 'General Medicine';
      const res = await browserUseService.bookDistrictHospitalReferral({
        patientName: ref.patientSafeId,
        age: 45,
        safeId: ref.safeReferenceCode,
        specialty: spec,
        facilityName: ref.facilityName || 'Nabha Civil Hospital (SDH)',
        reason: ref.reasonSummary,
      });

      setBookedTokensMap((prev) => ({
        ...prev,
        [ref.id]: {
          token: res.tokenNumber,
          date: res.appointmentDate,
          url: res.sessionUrl,
        },
      }));

      offlineStore.updateReferralOutcome(
        ref.id,
        `[Pre-booked OPD Token: ${res.tokenNumber} for ${res.appointmentDate} via Cloud Browser Agent]`,
        'REFERRED'
      );
      refreshStoreState();
      speakText(`Hospital OPD Token ${res.tokenNumber} pre-booked`);
    } finally {
      setBookingAgentRefId(null);
    }
  };

  const handleGenerateFollowupSlip = (referralCode: string) => {
    const newFoll = offlineStore.generateFollowupFromReferral(referralCode);
    refreshStoreState();
    if (newFoll) {
      speakText(isEn ? 'Follow-up slip generated for referral' : 'रेफरल हेतु फॉलो-अप पर्ची तैयार की गई');
      setCurrentScreen('followups');
    }
  };

  // Helper speech in active language with phonetic fallback
  const speakText = (text: string, phoneticFallback?: string) => {
    speechTts.speak(text, selectedLanguage, phoneticFallback);
  };

  const handleSelectLanguage = (langCode: string) => {
    setSelectedLanguage(langCode);
    speechTts.setLanguage(langCode);
    setIsLangPickerOpen(false);

    // CRITICAL: Before logging in as ASHA worker, NEVER speak about pending follow-ups & referrals!
    if (!currentUserProfile) {
      const loginTexts = getRoleLoginTexts(langCode);
      speechTts.speak(loginTexts.audioPrompt, langCode, loginTexts.audioPromptPhonetic);
      return;
    }

    if (currentUserProfile.role === 'DOCTOR') {
      const docTexts = getDoctorMobileTexts(langCode);
      speechTts.speak(`${docTexts.medicalOfficerBadge}: ${currentUserProfile.name}`, langCode);
      return;
    }

    // Only speak dynamic pending follow-ups & referrals if verified and logged in as ASHA worker:
    const targetT = getTranslation(langCode);
    const targetGreeting = getDynamicAudioGreeting(langCode, pendingFollowupsCount, openReferralsCount);
    speechTts.speak(targetGreeting.text, langCode, targetGreeting.phonetic || targetT.audioGreetingPhonetic);
  };

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const seq = Math.floor(1000 + Math.random() * 9000);
    const prefix = getVillageSafePrefix(regVillage);
    const newPat: StoredPatient = {
      id: `pat-${Date.now()}`,
      safeIdentifier: `SAA-${prefix}-2026-${seq}`,
      name: regName.trim() || undefined,
      villageName: regVillage,
      ageYears: parseInt(regAge, 10) || 45,
      gender: regGender,
      emergencyContact: regPhone,
      photoUri: regPhotoUri || (regPhotoAttached ? 'simulated_photo.jpg' : undefined),
      createdAt: new Date().toISOString(),
    };
    offlineStore.savePatient(newPat);
    refreshStoreState();
    setActivePatient(newPat);
    resetScreeningSession();
    const spokenName = newPat.name ? newPat.name : (isEn ? 'Patient' : 'मरीज़');
    const spokenConfirmation = isEn
      ? `${spokenName} registered successfully. Proceeding to consent form.`
      : `${spokenName} का पंजीकरण संपन्न हुआ। सहमति पत्र प्रस्तुत है।`;
    speakText(spokenConfirmation);
    setCurrentScreen('consent');
  };

  const handleCaptureSkin = () => {
    setSkinAnalyzing(true);
    setTimeout(() => {
      setSkinAnalyzing(false);
      setSkinCaptured(true);
      speakText(t.qualityValidated);
    }, 600);
  };

  const navigateToResult = (
    flag: 'GREEN' | 'AMBER' | 'RED',
    pathway: string,
    reason: string,
    differentials?: DiseasePossibility[],
    nearestCondition?: string
  ) => {
    setResultFlag(flag);
    setResultPathway(pathway);
    setResultReason(reason);
    setResultDifferentials(differentials || []);
    setResultNearestCondition(
      nearestCondition ||
      (differentials && differentials.length > 0
        ? (isEn ? differentials[0].conditionEn : differentials[0].conditionHi)
        : '')
    );
    offlineStore.recordScreening({
      id: `scr-${Date.now()}`,
      patientSafeId: activePatient?.safeIdentifier || 'SAA-RAM-2026-4421',
      pathway: pathway,
      resultFlag: flag,
      timestamp: new Date().toISOString(),
    });
    refreshStoreState();
    setCurrentScreen('result');
    const spokenMsg =
      flag === 'GREEN' ? t.audioResultGreen : flag === 'AMBER' ? t.audioResultAmber : t.audioResultRed;
    const spokenPhonetic =
      flag === 'GREEN'
        ? t.audioResultGreenPhonetic
        : flag === 'AMBER'
        ? t.audioResultAmberPhonetic
        : t.audioResultRedPhonetic;
    speakText(spokenMsg, spokenPhonetic);
  };

  const handleCreateReferral = () => {
    const refNum = Math.floor(10000 + Math.random() * 90000);
    const newRef: StoredReferral = {
      id: `ref-${Date.now()}`,
      safeReferenceCode: `SAA-REF-${refNum}`,
      patientSafeId: activePatient?.safeIdentifier || 'SAA-RAM-2026-4421',
      villageName: activePatient?.villageName || 'रामपूर (Rampur)',
      pathway: resultPathway,
      urgencyTier: resultFlag === 'RED' ? 'PROMPT_ASSESSMENT' : 'SCHEDULED_CHECK',
      status: 'REFERRED',
      facilityName: 'Nabha Community Health Centre (CHC)',
      reasonSummary: resultReason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    offlineStore.saveReferral(newRef);
    refreshStoreState();
    resetScreeningSession();
    speakText(t.closeLoopSuccess);
    setCurrentScreen('referrals');
  };

  const filteredLanguages = CONSTITUTIONAL_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.region.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center py-2">
      {/* Dynamic Village Datalist for Autocomplete & Custom Suggestions */}
      <datalist id="village-suggestions">
        <option value="रामपूर (Rampur)" />
        <option value="कल्याणपुर (Kalyanpur)" />
        <option value="सुंदरनगर (Sundernagar)" />
        <option value="बिशनपुर (Bishanpur)" />
        <option value="शिवगढ़ (Shivgarh)" />
        <option value="नाभा (Nabha)" />
        <option value="बहादुरगढ़ (Bahadurgarh)" />
        <option value="राजपुरा (Rajpura)" />
        <option value="पटियाला (Patiala)" />
        {offlineStore.getLiveVillageAggregates().map((v) => (
          <option key={v.villageName} value={v.villageName} />
        ))}
      </datalist>

      {/* Simulator Device Frame */}
      <div className="relative w-full max-w-[420px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
        {/* Phone Speaker Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
          <div className="w-2 h-2 rounded-full bg-slate-800 ml-3"></div>
        </div>

        {/* Screen Viewport */}
        <div className="bg-saathi-offWhite rounded-[36px] overflow-hidden min-h-[740px] flex flex-col justify-between border border-slate-700/40 relative">
          {/* Top Status Bar (Battery, Wifi, Time) */}
          <div className="bg-saathi-primaryNavy text-white pt-5 pb-2 px-6 flex items-center justify-between text-xs select-none z-20">
            <span className="font-bold">09:41</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded">
                SQLite Edge
              </span>
              <span>100%</span>
            </div>
          </div>

          {/* Persistent In-App Demo Badge */}
          <div className="bg-saathi-amber text-white text-[11px] font-bold py-1 px-3 text-center uppercase tracking-wider z-20 shadow-sm">
            {t.demoBadge}
          </div>

          {/* Screen Header Bar with Back Button & Language Picker */}
          {currentUserProfile && currentUserProfile.role === 'ASHA' && currentScreen !== 'welcome' && (
            <>
              {/* Logged in ASHA Badge */}
              <div className="bg-emerald-900/90 text-white px-3 py-1.5 flex items-center justify-between text-[11px] border-b border-emerald-800 z-20">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
                  <span className="font-bold truncate">{taskTexts.ashaRolePrefix}: {currentUserProfile.name}</span>
                  <span className="text-emerald-300 font-mono text-[10px] shrink-0">({currentUserProfile.ashaId})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(taskTexts.switchRoleConfirm)) {
                      handleLogout();
                    }
                  }}
                  className="text-[10px] text-emerald-200 hover:text-white underline font-semibold shrink-0 ml-1"
                >
                  {taskTexts.switchRoleBtn}
                </button>
              </div>

              <div className="bg-saathi-navy text-white px-4 py-3 flex items-center justify-between border-b border-saathi-deepNavy z-20">
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                  {currentScreen !== 'home' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (currentScreen === 'skin_screening' || currentScreen === 'eye_screening' || currentScreen === 'chest_screening' || currentScreen === 'blood_screening') {
                          setCurrentScreen('pathway_select');
                        } else if (currentScreen === 'consent') {
                          setCurrentScreen('register');
                        } else {
                          setCurrentScreen('home');
                        }
                      }}
                      className="p-1 text-slate-300 hover:text-white rounded-lg shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-white p-0.5 shadow-sm flex items-center justify-center shrink-0">
                      <img
                        src="/sathi-logo.png"
                        alt="Saathi Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <span className="font-bold text-sm tracking-tight truncate">
                    {currentScreen === 'home' && t.homeTitle}
                    {currentScreen === 'register' && t.registerTitle}
                    {currentScreen === 'consent' && t.consentTitle}
                    {currentScreen === 'pathway_select' && t.pathwaySelectTitle}
                    {currentScreen === 'skin_screening' && t.skinScreeningTitle}
                    {currentScreen === 'eye_screening' && t.eyeScreeningTitle}
                    {currentScreen === 'chest_screening' && t.chestScreeningTitle}
                    {currentScreen === 'blood_screening' && t.bloodScreeningTitle}
                    {currentScreen === 'result' && t.resultTitle}
                    {currentScreen === 'referrals' && t.referralsTitle}
                    {currentScreen === 'timeline' && t.timelineTitle}
                    {currentScreen === 'followups' && t.followupsTitle}
                    {currentScreen === 'settings' && t.settingsTitle}
                  </span>
                </div>

                {/* Language Switcher Trigger: Opens 22 Constitutional Languages Modal */}
                <button
                  type="button"
                  onClick={() => setIsLangPickerOpen(true)}
                  className="text-xs bg-saathi-teal hover:bg-teal-600 px-2.5 py-1 rounded-lg font-bold text-white shadow-sm flex items-center gap-1.5 shrink-0 transition-saathi"
                  title="Change Language (22 Constitutional Languages + English)"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span className="max-w-[70px] truncate">{activeLangMeta.nativeName}</span>
                </button>
              </div>
            </>
          )}

          {/* Dynamic Scrollable Screen Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!currentUserProfile ? (
              <RoleLoginScreen
                onLogin={handleLogin}
                activeLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                onOpenLangPicker={() => setIsLangPickerOpen(true)}
              />
            ) : currentUserProfile.role === 'DOCTOR' ? (
              <DoctorMobileView
                doctorProfile={currentUserProfile}
                activeLanguage={selectedLanguage}
                onLogout={handleLogout}
                onOpenLangPicker={() => setIsLangPickerOpen(true)}
              />
            ) : (
              <>
                {/* 1. Welcome Screen */}
            {currentScreen === 'welcome' && (
              <div className="flex flex-col items-center justify-center min-h-[580px] text-center p-4 space-y-6">
                <div className="w-28 h-28 bg-white rounded-3xl border border-saathi-teal/30 shadow-xl p-3 flex items-center justify-center overflow-hidden">
                  <img
                    src="/sathi-logo.png"
                    alt="Project Saathi Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-saathi-navy">{t.appTitle}</h2>
                  <p className="text-xs text-saathi-textSecondary mt-1">{t.tagline}</p>
                </div>

                <div className="w-full space-y-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      speakText(dynamicGreeting.text, dynamicGreeting.phonetic || t.audioGreetingPhonetic);
                      setCurrentScreen('home');
                    }}
                    className="w-full py-4 bg-saathi-teal text-white font-bold rounded-2xl text-lg shadow-lg hover:bg-teal-600 active:scale-95 transition-saathi flex items-center justify-center gap-2"
                  >
                    <span>{t.startScreening}</span>
                  </button>

                  {/* Language switch button on welcome */}
                  <button
                    type="button"
                    onClick={() => setIsLangPickerOpen(true)}
                    className="w-full py-2.5 px-3 bg-white text-saathi-navy font-bold rounded-xl border border-saathi-border text-xs flex items-center justify-center gap-2 hover:border-saathi-teal"
                  >
                    <Languages className="w-4 h-4 text-saathi-teal" />
                    <span>
                      {activeLangMeta.nativeName} ({activeLangMeta.name}) • 22 भारतीय भाषाएं
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. ASHA Home Screen */}
            {currentScreen === 'home' && (
              <div className="space-y-4 animate-fade-in">
                {/* Voice Guidance Cue Banner */}
                <div className="bg-saathi-paleMint p-3 rounded-2xl border border-saathi-teal/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-saathi-navy text-xs font-bold">
                    <Activity className="w-4 h-4 text-saathi-teal shrink-0" />
                    <span className="leading-tight">
                      {pendingSyncCount === 0
                        ? taskTexts.allSyncedWithCloud
                        : taskTexts.offlineSyncQueued(pendingSyncCount)}
                    </span>
                  </div>
                  <AudioGuidanceButton
                    spokenText={dynamicGreeting.text}
                    phoneticText={dynamicGreeting.phonetic || t.audioGreetingPhonetic}
                    langCode={selectedLanguage}
                    label={
                      selectedLanguage === 'pa'
                        ? 'ਨਿਰਦੇਸ਼'
                        : selectedLanguage === 'ta'
                        ? 'வழிகாட்டல்'
                        : selectedLanguage === 'te'
                        ? 'సూచనలు'
                        : selectedLanguage === 'bn'
                        ? 'নির্দেশনা'
                        : selectedLanguage === 'mr'
                        ? 'मार्गदर्शन'
                        : selectedLanguage === 'gu'
                        ? 'માર્ગદર્શન'
                        : selectedLanguage === 'kn'
                        ? 'ಮಾರ್ಗದರ್ಶನ'
                        : selectedLanguage === 'ml'
                        ? 'മാർഗ്ഗനിർദ്ദേശം'
                        : selectedLanguage === 'or'
                        ? 'ମାର୍ଗଦର୍ଶନ'
                        : selectedLanguage === 'as'
                        ? 'নিৰ্দেশনা'
                        : selectedLanguage === 'ur'
                        ? 'ہدایات'
                        : selectedLanguage === 'hi'
                        ? 'निर्देश'
                        : 'Instructions'
                    }
                    size="sm"
                  />
                </div>

                {/* Daily Action Task Cards (Dynamically Synced with SQLite Edge Store) */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-saathi-textSecondary uppercase tracking-wider">
                    {t.todayTasksHeader}
                  </h4>

                  <button
                    type="button"
                    onClick={() => setCurrentScreen('followups')}
                    className="w-full p-3.5 bg-white rounded-2xl border border-saathi-border text-left shadow-sm flex items-center justify-between hover:border-saathi-teal transition-saathi"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${pendingFollowupsCount === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-saathi-amber'}`}>
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="text-sm text-saathi-navy block leading-snug">
                          {pendingFollowupsCount === 0
                            ? taskTexts.zeroFollowupsPending
                            : pendingFollowupsCount === 1
                            ? taskTexts.singleFollowupPending
                            : taskTexts.multipleFollowupsPending(pendingFollowupsCount)}
                        </strong>
                        <span className="text-xs text-saathi-textSecondary">
                          {pendingFollowupsCount === 0
                            ? taskTexts.allFollowupsCompleted
                            : pendingFollowups[0]
                            ? `${pendingFollowups[0].villageName} • ${pendingFollowups[0].taskTitle}`
                            : taskTexts.clinicalWindow7Days}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                        pendingFollowupsCount === 0
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-saathi-amber bg-amber-50'
                      }`}
                    >
                      {pendingFollowupsCount === 0
                        ? taskTexts.completedBadge
                        : `${t.pendingBadge} (${pendingFollowupsCount})`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentScreen('referrals')}
                    className="w-full p-3.5 bg-white rounded-2xl border border-saathi-border text-left shadow-sm flex items-center justify-between hover:border-saathi-teal transition-saathi"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${openReferralsCount === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-saathi-paleMint text-saathi-teal'}`}>
                        <GitPullRequest className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="text-sm text-saathi-navy block leading-snug">
                          {openReferralsCount === 0
                            ? taskTexts.zeroReferralsPending
                            : openReferralsCount === 1
                            ? taskTexts.singleReferralPending
                            : taskTexts.multipleReferralsPending(openReferralsCount)}
                        </strong>
                        <span className="text-xs text-saathi-textSecondary">
                          {openReferralsCount === 0
                            ? taskTexts.allReferralsClosed
                            : taskTexts.followThroughOpen(openReferrals[0]?.facilityName || 'Nabha CHC')}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                        openReferralsCount === 0
                          ? 'text-emerald-700 bg-emerald-50'
                          : 'text-saathi-teal bg-teal-50'
                      }`}
                    >
                      {openReferralsCount === 0
                        ? taskTexts.closedBadge
                        : `${t.activeBadge} (${openReferralsCount})`}
                    </span>
                  </button>
                </div>

                {/* Primary Large Touch Action Buttons */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetScreeningSession();
                      speakText(t.audioSelectPathway, t.audioSelectPathwayPhonetic);
                      setCurrentScreen('pathway_select');
                    }}
                    className="w-full py-4 bg-saathi-teal hover:bg-teal-600 text-white font-extrabold rounded-2xl text-lg shadow-md flex items-center justify-center gap-3 active:scale-95 transition-saathi"
                  >
                    <Activity className="w-6 h-6" />
                    <span>{t.startScreening}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      resetScreeningSession();
                      setRegName('');
                      setRegVillage('');
                      setRegAge('');
                      setRegPhone('');
                      setRegPhotoAttached(false);
                      setRegPhotoUri(null);
                      setCurrentScreen('register');
                    }}
                    className="w-full py-3.5 bg-saathi-navy hover:bg-saathi-deepNavy text-white font-bold rounded-2xl text-base shadow flex items-center justify-center gap-2 active:scale-95 transition-saathi"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>{t.registerPatient}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('timeline')}
                      className="p-3 bg-white border border-saathi-border rounded-xl text-xs font-bold text-saathi-navy flex items-center justify-center gap-2 hover:border-saathi-teal"
                    >
                      <History className="w-4 h-4 text-saathi-teal" />
                      <span>{t.patientTimeline}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('settings')}
                      className="p-3 bg-white border border-saathi-border rounded-xl text-xs font-bold text-saathi-navy flex items-center justify-center gap-2 hover:border-saathi-teal"
                    >
                      <Settings className="w-4 h-4 text-saathi-teal" />
                      <span>{t.syncAndLanguage}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Patient Registration Screen */}
            {currentScreen === 'register' && (
              <form onSubmit={handleRegisterPatient} className="space-y-4 animate-fade-in">
                <div className="bg-saathi-paleMint p-3 rounded-xl border border-saathi-teal/30 text-xs text-saathi-navy flex items-center justify-between">
                  <strong>{t.optionalPhotoNotice}</strong>
                  <button
                    type="button"
                    onClick={() => {
                      setRegName(isEn ? 'Kamla Devi' : 'कमला देवी');
                      setRegVillage(isEn ? 'Lolpur' : 'लोलपुर (Lolpur)');
                      setRegAge('54');
                      setRegPhone('+919876543210');
                    }}
                    className="text-[11px] font-semibold text-saathi-teal hover:underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    ⚡ {isEn ? 'Demo Sample' : 'डेमो डेटा'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-saathi-navy mb-1">
                    {isEn ? 'Patient Name / Local Identifier (Optional)' : 'मरीज़ का नाम / स्थानीय पहचान (वैकल्पिक)'}
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={isEn ? 'e.g. Kamla Devi (for ASHA roster verification)' : 'जैसे: कमला देवी (आशा रजिस्टर सत्यापन हेतु)'}
                    className="w-full p-3 border border-saathi-border rounded-xl text-sm"
                  />
                  <span className="text-[10px] text-gray-500 block mt-1">
                    {isEn
                      ? 'Encrypted on ASHA device for local roster tracking; anonymized on cloud analytics'
                      : 'आशा कार्यकर्ता के रजिस्टर मिलान हेतु फोन में सुरक्षित; क्लाउड रिपोर्ट में अनाम टोकन रहता है'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-saathi-navy mb-1">{t.villageLabel}</label>
                  <input
                    type="text"
                    required
                    list="village-suggestions"
                    value={regVillage}
                    onChange={(e) => setRegVillage(e.target.value)}
                    placeholder={isEn ? 'e.g. Rampur, Lolpur' : 'जैसे: रामपूर, लोलपुर'}
                    className="w-full p-3 border border-saathi-border rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-saathi-navy mb-1">{t.ageLabel}</label>
                    <input
                      type="number"
                      required
                      value={regAge}
                      onChange={(e) => setRegAge(e.target.value)}
                      placeholder="45"
                      className="w-full p-3 border border-saathi-border rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-saathi-navy mb-1">{t.genderLabel}</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="w-full p-3 border border-saathi-border rounded-xl text-sm"
                    >
                      <option value="FEMALE">{t.genderFemale}</option>
                      <option value="TRANS">{t.genderTrans || (isEn ? 'Trans' : 'ट्रांसजेंडर (Trans)')}</option>
                      <option value="OTHER">{t.genderOther}</option>
                      <option value="MALE">{t.genderMale}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-saathi-navy mb-1">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full p-3 border border-saathi-border rounded-xl text-sm"
                  />
                </div>

                <div className="pt-2">
                  <span className="block text-xs font-bold text-saathi-navy mb-1.5">{t.optionalPhotoNotice}</span>

                  {regPhotoUri ? (
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={regPhotoUri}
                          alt="Patient Reference"
                          className="w-12 h-12 rounded-xl object-cover border border-emerald-400 shadow-sm shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-emerald-900 block truncate">{t.photoAttached}</span>
                          <span className="text-[10px] text-emerald-700 block truncate">
                            {isEn ? 'Safe Anonymous Reference ID' : 'अनाम पहचान संदर्भ (Safe Reference)'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowRegCamera(true)}
                          className="p-1.5 bg-white text-slate-700 hover:text-saathi-navy rounded-lg border border-slate-200 text-xs font-semibold shadow-xs"
                          title={isEn ? 'Retake photo' : 'दोबारा फ़ोटो लें'}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRegPhotoUri(null);
                            setRegPhotoAttached(false);
                          }}
                          className="p-1.5 bg-white text-red-600 hover:bg-red-50 rounded-lg border border-red-200 text-xs font-semibold shadow-xs"
                          title={isEn ? 'Remove photo' : 'फ़ोटो हटाएं'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : showRegCamera ? (
                    <div className="space-y-2">
                      <AccessibleCamera
                        activeLanguage={selectedLanguage}
                        guideTitle={isEn ? 'Optional Patient Reference Photo' : 'रोगी की वैकल्पिक पहचान फ़ोटो'}
                        guideSubtitle={isEn ? 'Center face in indirect natural lighting' : 'प्राकृतिक रोशनी में चेहरा फ्रेम में रखें'}
                        reticleType="portrait"
                        initialFacingMode="user"
                        allowPresetSamples={false}
                        allowFileUpload={true}
                        onCapture={(img) => {
                          setRegPhotoUri(img);
                          setRegPhotoAttached(true);
                          setShowRegCamera(false);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegCamera(false)}
                        className="w-full py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold text-center"
                      >
                        {isEn ? 'Cancel' : 'रद्द करें (Cancel)'}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowRegCamera(true)}
                      className="w-full py-2.5 px-3 rounded-xl border border-saathi-border bg-white hover:bg-slate-50 text-gray-700 text-xs font-bold flex items-center justify-center gap-2 transition-saathi shadow-xs"
                    >
                      <Camera className="w-4 h-4 text-saathi-teal" />
                      <span>{t.takeOptionalPhoto}</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-saathi-teal text-white font-bold rounded-2xl text-base shadow-md mt-4"
                >
                  {t.nextConsent}
                </button>
              </form>
            )}

            {/* 4. Consent Screen */}
            {currentScreen === 'consent' && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-300 text-amber-900 font-medium flex items-center justify-between gap-2">
                  <span>{t.consentNotice}</span>
                  <AudioGuidanceButton
                    spokenText={t.consentNotice}
                    langCode={selectedLanguage}
                    size="sm"
                    label={isEn ? 'Listen' : 'सुनें'}
                  />
                </div>

                <div className="space-y-3 bg-white p-4 rounded-2xl border border-saathi-border shadow-sm">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentCare}
                      onChange={(e) => setConsentCare(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-saathi-teal rounded"
                    />
                    <div>
                      <strong className="text-saathi-navy text-sm block">{t.consentCareTitle}</strong>
                      <span className="text-saathi-textSecondary">{t.consentCareDesc}</span>
                    </div>
                  </label>
                  <hr className="border-gray-100" />

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentReferral}
                      onChange={(e) => setConsentReferral(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-saathi-teal rounded"
                    />
                    <div>
                      <strong className="text-saathi-navy text-sm block">{t.consentReferralTitle}</strong>
                      <span className="text-saathi-textSecondary">{t.consentReferralDesc}</span>
                    </div>
                  </label>
                  <hr className="border-gray-100" />

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentSms}
                      onChange={(e) => setConsentSms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-saathi-teal rounded"
                    />
                    <div>
                      <strong className="text-saathi-navy text-sm block">{t.consentSmsTitle}</strong>
                      <span className="text-saathi-textSecondary">{t.consentSmsDesc}</span>
                    </div>
                  </label>
                  <hr className="border-gray-100" />

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentResearch}
                      onChange={(e) => setConsentResearch(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-saathi-teal rounded"
                    />
                    <div>
                      <strong className="text-saathi-navy text-sm block">{t.consentResearchTitle}</strong>
                      <span className="text-saathi-textSecondary">{t.consentResearchDesc}</span>
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    resetScreeningSession();
                    speakText(t.audioSelectPathway, t.audioSelectPathwayPhonetic);
                    setCurrentScreen('pathway_select');
                  }}
                  className="w-full py-3.5 bg-saathi-teal text-white font-bold rounded-2xl text-base shadow-md transition-saathi active:scale-98"
                >
                  {t.saveConsentAndSelect}
                </button>
              </div>
            )}

            {/* 5. Pathway Selection */}
            {currentScreen === 'pathway_select' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <span className="text-xs font-bold text-saathi-textSecondary uppercase">
                      {t.step1Of3}
                    </span>
                    <h3 className="font-bold text-saathi-navy text-sm">
                      {isEn ? 'Select Screening Pathway' : 'जाँच का प्रकार चुनें'}
                    </h3>
                  </div>
                  <AudioGuidanceButton
                    spokenText={t.audioSelectPathway}
                    phoneticText={t.audioSelectPathwayPhonetic}
                    langCode={selectedLanguage}
                    size="sm"
                    label={isEn ? 'Listen' : 'सुनें'}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSkinCaptured(false);
                    setSkinCapturedImage(null);
                    setSkinQualityResult(null);
                    setSkinAnalysisResult(null);
                    setGeminiResult(null);
                    setIsAiAnalyzing(false);
                    speakText(isEn ? 'Opening skin lesion screening camera' : 'त्वचा जाँच कैमरा खोला जा रहा है');
                    setCurrentScreen('skin_screening');
                  }}
                  className="w-full p-4 bg-white rounded-2xl border border-saathi-border text-left shadow-sm flex items-center gap-3 hover:border-saathi-teal transition-saathi"
                >
                  <div className="p-3 bg-saathi-paleMint text-saathi-teal rounded-2xl">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-saathi-navy text-base">{t.pathwaySkinTitle}</h4>
                    <p className="text-xs text-saathi-textSecondary">{t.pathwaySkinDesc}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEyeCapturedImage(null);
                    setEyeValidationResult(null);
                    setEyeGeminiResult(null);
                    setIsEyeAnalyzing(false);
                    speakText(isEn ? 'Opening eye retinal screening' : 'आँख रेटिना जाँच खोली जा रही है');
                    setCurrentScreen('eye_screening');
                  }}
                  className="w-full p-4 bg-white rounded-2xl border border-saathi-border text-left shadow-sm flex items-center gap-3 hover:border-saathi-teal transition-saathi"
                >
                  <div className="p-3 bg-blue-50 text-saathi-navy rounded-2xl">
                    <Eye className="w-6 h-6 text-saathi-navy" />
                  </div>
                  <div>
                    <h4 className="font-bold text-saathi-navy text-base">{t.pathwayEyeTitle}</h4>
                    <p className="text-xs text-saathi-textSecondary">{t.pathwayEyeDesc}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setChestCough2Weeks(false);
                    setChestHemoptysis(false);
                    setChestNightSweats(false);
                    speakText(isEn ? 'Opening chest respiratory screening' : 'छाती व श्वसन जाँच खोली जा रही है');
                    setCurrentScreen('chest_screening');
                  }}
                  className="w-full p-4 bg-white rounded-2xl border border-saathi-border text-left shadow-sm flex items-center gap-3 hover:border-saathi-teal transition-saathi"
                >
                  <div className="p-3 bg-cyan-50 text-cyan-800 rounded-2xl">
                    <FileSpreadsheet className="w-6 h-6 text-cyan-800" />
                  </div>
                  <div>
                    <h4 className="font-bold text-saathi-navy text-base">{t.pathwayChestTitle}</h4>
                    <p className="text-xs text-saathi-textSecondary">{t.pathwayChestDesc}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHbValue('8.4');
                    setWbcValue('2800');
                    setPltValue('45000');
                    setSmearReviewed(false);
                    speakText(isEn ? 'Opening CBC blood report screening' : 'खून की जाँच सीबीसी खोली जा रही है');
                    setCurrentScreen('blood_screening');
                  }}
                  className="w-full p-4 bg-white rounded-2xl border border-saathi-border text-left shadow-sm flex items-center gap-3 hover:border-saathi-teal transition-saathi"
                >
                  <div className="p-3 bg-rose-50 text-rose-800 rounded-2xl">
                    <Layers className="w-6 h-6 text-rose-800" />
                  </div>
                  <div>
                    <h4 className="font-bold text-saathi-navy text-base">{t.pathwayBloodTitle}</h4>
                    <p className="text-xs text-saathi-textSecondary">{t.pathwayBloodDesc}</p>
                  </div>
                </button>
              </div>
            )}

            {/* 6. Skin Screening Screen */}
            {currentScreen === 'skin_screening' && (
              <div className="space-y-4 animate-fade-in">
                <span className="text-xs font-bold text-saathi-textSecondary uppercase">
                  {t.step2Of3}
                </span>

                <label className="block text-xs font-bold text-saathi-navy mb-1">
                  {isEn ? 'Screening Context:' : 'जाँच का प्रकार (Screening Context):'}
                </label>
                <select
                  value={skinSignType}
                  onChange={(e) => setSkinSignType(e.target.value)}
                  className="w-full p-3 border border-saathi-border rounded-xl text-xs font-bold bg-white"
                >
                  <option value="HEALTHY_ROUTINE">
                    {isEn ? '✅ Routine Healthy Skin Check (Normal - Green)' : '✅ सामान्य / स्वस्थ त्वचा जाँच (Routine Healthy Check - Green)'}
                  </option>
                  <option value="UNUSUAL_LESION">
                    {isEn ? '⚠️ Unusual Lesion or Growing Mole (Amber)' : '⚠️ असामान्य घाव या बढ़ता तिल (Unusual Lesion - Amber)'}
                  </option>
                  <option value="UNEXPLAINED_BRUISING">
                    {isEn ? '⚠️ Unexplained Bruising (Amber)' : '⚠️ बिना चोट के नीले निशान (Bruising - Amber)'}
                  </option>
                  <option value="PETECHIAE">
                    {isEn ? '🚨 Petechiae / Purpuric Red-Purple Spots (Red Alert)' : '🚨 बारीक लाल-बैंगनी दाने (Petechiae - Red Alert)'}
                  </option>
                </select>

                {/* Accessible Live Camera Viewport with Real Stream, Quality Checker, and Upload */}
                {!skinCaptured ? (
                  <AccessibleCamera
                    activeLanguage={selectedLanguage}
                    guideTitle={t.cameraDistanceGuide}
                    guideSubtitle={t.cameraLightingGuide}
                    reticleType="lesion"
                    allowFileUpload={true}
                    allowPresetSamples={true}
                    onCapture={(imageDataUrl, quality) => {
                      setSkinCapturedImage(imageDataUrl);
                      setSkinQualityResult(quality);
                      setSkinCaptured(true);
                      setSkinAnalysisResult(null);
                      setGeminiResult(null);
                      setIsAiAnalyzing(true);

                      // Real-time Computer Vision pixel analytics on captured image
                      const img = new Image();
                      img.src = imageDataUrl;
                      img.onload = () => {
                        const c = document.createElement('canvas');
                        c.width = img.width || 400;
                        c.height = img.height || 400;
                        const ctx = c.getContext('2d');
                        if (ctx) {
                          ctx.drawImage(img, 0, 0);
                          const analysis = analyzeSkinLesionCanvas(c, skinSignType);

                          // Query Gemini Health Vision AI with screening context
                          geminiVisionService
                            .analyzeClinicalImage(imageDataUrl, analysis, skinSignType)
                            .then((gRes) => {
                              setGeminiResult(gRes);
                              setSkinAnalysisResult(analysis);
                              setIsAiAnalyzing(false);
                            })
                            .catch((err) => {
                              console.warn('Gemini vision analysis error, using edge CV:', err);
                              setSkinAnalysisResult(analysis);
                              setIsAiAnalyzing(false);
                            });
                        } else {
                          setIsAiAnalyzing(false);
                        }
                      };
                      img.onerror = () => {
                        setIsAiAnalyzing(false);
                      };
                    }}
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg bg-black">
                      <img
                        src={skinCapturedImage || ''}
                        alt="Captured Skin Sign"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t.qualityValidated}
                        </span>
                        <span className="font-mono text-[10px] text-slate-300">
                          Blur: {skinQualityResult?.blurVariance ?? '145'} • Lum: {skinQualityResult?.meanLuminance ?? '120'}
                        </span>
                      </div>
                    </div>

                    {/* Gemini Vision AI Loading Progress Card */}
                    {isAiAnalyzing ? (
                      <div className="p-4 bg-sky-50/90 border border-sky-300 rounded-2xl text-xs space-y-3 animate-fade-in shadow-xs">
                        <div className="flex items-center gap-2.5 text-sky-950 font-bold">
                          <RefreshCw className="w-4 h-4 animate-spin text-sky-600 shrink-0" />
                          <span className="text-sm">
                            {isEn
                              ? 'Analyzing Clinical Image with Google Gemini...'
                              : 'Google Gemini Flash Vision द्वारा तस्वीर का विश्लेषण जारी है...'}
                          </span>
                        </div>
                        <p className="text-[11px] text-sky-800 leading-relaxed">
                          {isEn
                            ? 'Evaluating lesion morphology, margin irregularity, erythema index, and dermatological differential matches...'
                            : 'घाव के आकार, पिगमेंटेशन, किनारों की बनावट व संभावित नैदानिक लक्षणों का विश्लेषण किया जा रहा है...'}
                        </p>
                        <div className="space-y-1.5 pt-1">
                          <div className="h-2 w-full bg-sky-200/60 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-sky-500 to-saathi-teal rounded-full animate-pulse w-3/4"></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-sky-700 font-medium">
                            <span>{isEn ? 'Multimodal Clinical AI active' : 'मल्टीमॉडल क्लिनिकल AI सक्रिय'}</span>
                            <span>{isEn ? 'Please wait...' : 'कृपया प्रतीक्षा करें...'}</span>
                          </div>
                        </div>
                      </div>
                    ) : geminiResult ? (
                      <div className={`p-3 rounded-2xl border text-xs space-y-2.5 shadow-sm animate-fade-in ${
                        geminiResult.flag === 'RED'
                          ? 'bg-rose-50 border-rose-300 text-rose-950'
                          : geminiResult.flag === 'AMBER'
                          ? 'bg-amber-50 border-amber-300 text-amber-950'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5 text-sm">
                            <Sparkles className="w-4 h-4 text-saathi-teal" />
                            <span>{geminiResult.modelUsed}:</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                            geminiResult.flag === 'RED'
                              ? 'bg-rose-600 text-white'
                              : geminiResult.flag === 'AMBER'
                              ? 'bg-amber-500 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {geminiResult.flag === 'RED'
                              ? (isEn ? 'RED (Prompt Doctor Review)' : 'लाल (RED - त्वरित डॉक्टर)')
                              : geminiResult.flag === 'AMBER'
                              ? (isEn ? 'AMBER (Scheduled Review)' : 'पीला (AMBER - अनुशंसित जाँच)')
                              : (isEn ? 'GREEN (Normal)' : 'हरा (GREEN - सामान्य)')}
                          </span>
                        </div>

                        {/* Nearest Predicted Clinical Match */}
                        <div className="bg-white/95 rounded-xl p-2.5 border border-saathi-teal/40 text-left space-y-1 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-saathi-teal flex items-center gap-1">
                              <Stethoscope className="w-3.5 h-3.5 text-saathi-teal" />
                              {isEn ? 'Nearest Clinical Match:' : 'निकटतम संभावित रोग (Primary Match):'}
                            </span>
                            <span className="text-[9px] font-black bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.5 rounded">
                              {isEn ? 'HIGH ALIGNMENT' : 'उच्च समानता'}
                            </span>
                          </div>
                          <span className="text-xs font-black text-slate-900 block">
                            {isEn
                              ? (geminiResult.nearestConditionEn || geminiResult.diseasePossibilities?.[0]?.conditionEn || 'Alopecia (Alopecia Areata / Cicatricial Alopecia)')
                              : (geminiResult.nearestConditionHi || geminiResult.diseasePossibilities?.[0]?.conditionHi || 'एलोपेसिया (चकत्तेदार बालों का झड़ना)')}
                          </span>
                        </div>

                        <p className="text-[11px] font-medium leading-relaxed">
                          {isEn
                            ? (geminiResult.primaryFindingEn || geminiResult.clinicalRationaleEn)
                            : (geminiResult.primaryFindingHi || geminiResult.clinicalRationaleHi)}
                        </p>

                        {/* Differential Disease Considerations */}
                        {((geminiResult.diseasePossibilities && geminiResult.diseasePossibilities.length > 0) ||
                          (skinAnalysisResult?.diseasePossibilities && skinAnalysisResult.diseasePossibilities.length > 0)) && (
                          <div className="bg-white/85 rounded-xl p-2.5 border border-black/10 space-y-1.5 text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1">
                                <Stethoscope className="w-3 h-3 text-saathi-teal" />
                                {isEn ? 'Differential Disease Possibilities:' : 'संभावित रोग / कारण (Differentials):'}
                              </span>
                              <span className="text-[9px] text-slate-500 font-semibold">
                                {isEn ? 'Doctor Review' : 'डॉक्टर समीक्षा'}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {(geminiResult.diseasePossibilities || skinAnalysisResult?.diseasePossibilities || []).map((dp, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start justify-between gap-1.5 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg border border-slate-200/80 text-[10px]"
                                >
                                  <div className="min-w-0 flex-1">
                                    <span className="font-bold text-slate-900 block truncate">
                                      {isEn ? dp.conditionEn : dp.conditionHi}
                                    </span>
                                    <span className="text-[9px] text-slate-600 line-clamp-1">
                                      {isEn ? dp.descriptionEn : dp.descriptionHi}
                                    </span>
                                  </div>
                                  <span
                                    className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black ${
                                      dp.likelihood === 'HIGH'
                                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                        : dp.likelihood === 'MODERATE'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    }`}
                                  >
                                    {dp.likelihood === 'HIGH'
                                      ? (isEn ? 'HIGH' : 'अधिक')
                                      : dp.likelihood === 'MODERATE'
                                      ? (isEn ? 'MODERATE' : 'संभावित')
                                      : (isEn ? 'LOW' : 'कम')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : skinAnalysisResult ? (
                      <div className={`p-3 rounded-2xl border text-xs space-y-2.5 shadow-sm animate-fade-in ${
                        skinAnalysisResult.flag === 'RED'
                          ? 'bg-rose-50 border-rose-300 text-rose-950'
                          : skinAnalysisResult.flag === 'AMBER'
                          ? 'bg-amber-50 border-amber-300 text-amber-950'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5 text-sm">
                            <Sparkles className="w-4 h-4 text-saathi-teal" />
                            <span>{isEn ? 'Computer Vision Analysis:' : 'कम्प्यूटर विज़न विश्लेषण:'}</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                            skinAnalysisResult.flag === 'RED'
                              ? 'bg-rose-600 text-white'
                              : skinAnalysisResult.flag === 'AMBER'
                              ? 'bg-amber-500 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {skinAnalysisResult.flag === 'RED'
                              ? (isEn ? 'RED' : 'लाल (RED)')
                              : skinAnalysisResult.flag === 'AMBER'
                              ? (isEn ? 'AMBER' : 'पीला (AMBER)')
                              : (isEn ? 'GREEN' : 'हरा (GREEN)')}
                          </span>
                        </div>

                        {/* Nearest Predicted Clinical Match */}
                        <div className="bg-white/95 rounded-xl p-2.5 border border-saathi-teal/40 text-left space-y-1 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-saathi-teal flex items-center gap-1">
                              <Stethoscope className="w-3.5 h-3.5 text-saathi-teal" />
                              {isEn ? 'Nearest Clinical Match:' : 'निकटतम संभावित रोग (Primary Match):'}
                            </span>
                            <span className="text-[9px] font-black bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.5 rounded">
                              {isEn ? 'HIGH ALIGNMENT' : 'उच्च समानता'}
                            </span>
                          </div>
                          <span className="text-xs font-black text-slate-900 block">
                            {isEn
                              ? (skinAnalysisResult.nearestConditionEn || skinAnalysisResult.diseasePossibilities?.[0]?.conditionEn || 'Alopecia (Alopecia Areata / Cicatricial Alopecia)')
                              : (skinAnalysisResult.nearestConditionHi || skinAnalysisResult.diseasePossibilities?.[0]?.conditionHi || 'एलोपेसिया (चकत्तेदार बालों का झड़ना)')}
                          </span>
                        </div>

                        <p className="text-[11px] font-medium leading-relaxed">
                          {isEn
                            ? (skinAnalysisResult.findings[0] || skinAnalysisResult.clinicalRationaleEn)
                            : (skinAnalysisResult.findingsHi[0] || skinAnalysisResult.clinicalRationaleHi)}
                        </p>

                        {/* Differential Disease Considerations */}
                        {skinAnalysisResult.diseasePossibilities && skinAnalysisResult.diseasePossibilities.length > 0 && (
                          <div className="bg-white/85 rounded-xl p-2.5 border border-black/10 space-y-1.5 text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1">
                                <Stethoscope className="w-3 h-3 text-saathi-teal" />
                                {isEn ? 'Differential Disease Possibilities:' : 'संभावित रोग / कारण (Differentials):'}
                              </span>
                              <span className="text-[9px] text-slate-500 font-semibold">
                                {isEn ? 'Edge CV' : 'ऑन-डिवाइस'}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {skinAnalysisResult.diseasePossibilities.map((dp, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start justify-between gap-1.5 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg border border-slate-200/80 text-[10px]"
                                >
                                  <div className="min-w-0 flex-1">
                                    <span className="font-bold text-slate-900 block truncate">
                                      {isEn ? dp.conditionEn : dp.conditionHi}
                                    </span>
                                    <span className="text-[9px] text-slate-600 line-clamp-1">
                                      {isEn ? dp.descriptionEn : dp.descriptionHi}
                                    </span>
                                  </div>
                                  <span
                                    className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-black ${
                                      dp.likelihood === 'HIGH'
                                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                        : dp.likelihood === 'MODERATE'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    }`}
                                  >
                                    {dp.likelihood === 'HIGH'
                                      ? (isEn ? 'HIGH' : 'अधिक')
                                      : dp.likelihood === 'MODERATE'
                                      ? (isEn ? 'MODERATE' : 'संभावित')
                                      : (isEn ? 'LOW' : 'कम')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between">
                        <span className="font-bold">{isEn ? 'On-Device Model: saathi-skin-v1.0-q8' : 'ऑन-डिवाइस मॉडल: saathi-skin-v1.0-q8'}</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          INT8 Validated
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isAiAnalyzing}
                        onClick={() => {
                          setSkinCaptured(false);
                          setSkinCapturedImage(null);
                          setSkinQualityResult(null);
                          setSkinAnalysisResult(null);
                          setGeminiResult(null);
                        }}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-saathi flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>{isEn ? 'Retake Photo' : 'दोबारा फ़ोटो लें (Retake)'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isAiAnalyzing}
                        onClick={() => {
                          const flag =
                            geminiResult?.flag ||
                            skinAnalysisResult?.flag ||
                            (skinSignType === 'HEALTHY_ROUTINE' ? 'GREEN' : 'AMBER');
                          const reason =
                            (isEn ? geminiResult?.clinicalRationaleEn : geminiResult?.clinicalRationaleHi) ||
                            (isEn ? skinAnalysisResult?.clinicalRationaleEn : skinAnalysisResult?.clinicalRationaleHi) ||
                            (flag === 'GREEN'
                              ? (isEn ? 'No concerning signs detected. Continue routine care.' : 'इस जाँच में कोई चिंताजनक लक्षण नहीं दिखा। सामान्य देखभाल जारी रखें।')
                              : (isEn ? 'Visual signs noted. Medical consultation advised.' : 'जाँच में ध्यान देने योग्य लक्षण दिखे हैं। डॉक्टर से परामर्श अनुशंसित है।'));
                          const differentials =
                            geminiResult?.diseasePossibilities ||
                            skinAnalysisResult?.diseasePossibilities ||
                            [];
                          const nearest =
                            (isEn ? geminiResult?.nearestConditionEn : geminiResult?.nearestConditionHi) ||
                            (isEn ? skinAnalysisResult?.nearestConditionEn : skinAnalysisResult?.nearestConditionHi) ||
                            (isEn ? differentials[0]?.conditionEn : differentials[0]?.conditionHi) ||
                            '';
                          navigateToResult(flag, 'Skin Sign', reason, differentials, nearest);
                        }}
                        className={`flex-1 py-3 font-bold rounded-xl text-sm shadow-md transition-saathi flex items-center justify-center gap-1.5 ${
                          isAiAnalyzing
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : 'bg-saathi-teal hover:bg-teal-600 text-white'
                        }`}
                      >
                        {isAiAnalyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                            <span>{isEn ? 'Analyzing...' : 'विश्लेषण जारी है...'}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t.reviewResult}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 7. Eye Screening Screen */}
            {currentScreen === 'eye_screening' && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-300 text-amber-900 font-medium">
                  <strong>{isEn ? 'Hardware Requirement:' : 'हार्डवेयर प्रतिबंध:'}</strong>{' '}
                  {isEn
                    ? 'A standard smartphone camera cannot image the internal retina. A certified optical fundus lens attachment is required.'
                    : 'साधारण मोबाइल कैमरे से आंख के अंदर की जांच नहीं हो सकती। इसके लिए विशेष ऑप्टिकल फंडस लेंस अटैचमेंट आवश्यक है।'}
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-saathi-border space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-bold text-saathi-navy">
                      {isEn ? 'Optical fundus lens attachment connected?' : 'फंडस लेंस अटैचमेंट जुड़ा है?'}
                    </span>
                    <input
                      type="checkbox"
                      checked={hasFundusLens}
                      onChange={(e) => setHasFundusLens(e.target.checked)}
                      className="w-5 h-5 text-saathi-teal rounded"
                    />
                  </label>
                  <hr className="border-gray-100" />

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-saathi-navy">
                      {isEn ? 'Does the patient have diagnosed diabetes?' : 'क्या मरीज़ को मधुमेह (डायबिटीज) है?'}
                    </span>
                    <input
                      type="checkbox"
                      checked={eyeDiabetes}
                      onChange={(e) => setEyeDiabetes(e.target.checked)}
                      className="w-4 h-4 text-saathi-teal rounded"
                    />
                  </label>
                  <hr className="border-gray-100" />

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-saathi-navy">
                      {isEn ? 'Does the patient experience blurry or reduced vision?' : 'क्या दृष्टि में धुंधलापन महसूस होता है?'}
                    </span>
                    <input
                      type="checkbox"
                      checked={eyeBlurryVision}
                      onChange={(e) => setEyeBlurryVision(e.target.checked)}
                      className="w-4 h-4 text-saathi-teal rounded"
                    />
                  </label>
                </div>

                {hasFundusLens && (
                  <div className="space-y-2">
                    <span className="font-bold text-saathi-navy block text-xs">
                      {isEn ? 'Optical Fundus Lens Viewfinder:' : 'ऑप्टिकल फंडस लेंस व्यूफ़ाइंडर:'}
                    </span>
                    {!eyeCapturedImage ? (
                      <AccessibleCamera
                        activeLanguage={selectedLanguage}
                        guideTitle={isEn ? 'Retina Fundus Scan (Diabetic Retinopathy Check)' : 'रेटिना फंडस स्कैन (Retina Check)'}
                        guideSubtitle={isEn ? 'Align fundus lens directly in front of the eye' : 'फंडस लेंस को आंख के सामने संरेखित करें'}
                        reticleType="retina"
                        allowFileUpload={true}
                        allowPresetSamples={true}
                        onCapture={(img) => {
                          setEyeCapturedImage(img);
                          setEyeValidationResult(null);
                          setEyeGeminiResult(null);
                          setIsEyeAnalyzing(true);
                          const imageObj = new Image();
                          imageObj.src = img;
                          imageObj.onload = () => {
                            const c = document.createElement('canvas');
                            c.width = imageObj.width || 400;
                            c.height = imageObj.height || 400;
                            const ctx = c.getContext('2d');
                            if (ctx) {
                              ctx.drawImage(imageObj, 0, 0);
                              const opticalResult = validateRetinaFundusImage(c);

                              geminiVisionService
                                .analyzeEyeRetinaImage(img, eyeDiabetes, eyeBlurryVision)
                                .then((gRes) => {
                                  setEyeGeminiResult(gRes);
                                  setEyeValidationResult(opticalResult);
                                  setIsEyeAnalyzing(false);
                                })
                                .catch(() => {
                                  setEyeValidationResult(opticalResult);
                                  setIsEyeAnalyzing(false);
                                });
                            } else {
                              setIsEyeAnalyzing(false);
                            }
                          };
                          imageObj.onerror = () => {
                            setIsEyeAnalyzing(false);
                          };
                        }}
                      />
                    ) : (
                      <div className="space-y-3">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-amber-400 bg-black">
                          <img src={eyeCapturedImage} alt="Fundus Scan" className="w-full h-full object-cover" />
                          <div className="absolute bottom-2 left-2 right-2 bg-black/75 px-3 py-1.5 rounded-xl text-white text-xs flex items-center justify-between">
                            <span className="text-amber-300 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {isEn ? 'Photo Attached' : 'फ़ोटो संलग्न'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEyeCapturedImage(null);
                                setEyeValidationResult(null);
                                setEyeGeminiResult(null);
                              }}
                              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded-md text-[10px] font-bold text-slate-200 flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" /> {isEn ? 'Retake' : 'दोबारा लें'}
                            </button>
                          </div>
                        </div>

                        {/* Real-time Hardware Reality & Optical Validation Banner */}
                        {isEyeAnalyzing && (
                          <div className="bg-sky-50 border border-sky-300 p-2.5 rounded-xl text-sky-900 text-xs flex items-center gap-2 animate-pulse">
                            <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
                            <span>{isEn ? 'Analyzing optical physics & fundus requirements...' : 'ऑप्टिकल भौतिकी एवं फंडस लेंस आवश्यकताओं की जाँच जारी है...'}</span>
                          </div>
                        )}

                        {!isEyeAnalyzing && eyeValidationResult && (
                          <div
                            className={`p-3 rounded-2xl border text-xs space-y-2 shadow-sm animate-fade-in ${
                              eyeValidationResult.isExternalEye || !eyeValidationResult.isGenuineFundus
                                ? 'bg-rose-50 border-rose-300 text-rose-950'
                                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1.5 text-xs">
                                {eyeValidationResult.isExternalEye || !eyeValidationResult.isGenuineFundus ? (
                                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                                <span>
                                  {eyeValidationResult.isExternalEye
                                    ? (isEn ? 'Hardware Rejection: External Eye Detected' : 'हार्डवेयर अस्वीकृति: साधारण आँख की तस्वीर पाई गई')
                                    : !eyeValidationResult.isGenuineFundus
                                    ? (isEn ? 'Hardware Requirement Unmet: Fundus Missing' : 'हार्डवेयर कमी: फंडस लेंस अनुपस्थित')
                                    : (isEn ? 'Optical Physics Validated: Genuine Fundus Scan' : 'ऑप्टिकल भौतिकी सत्यापित: वैध फंडस स्कैन')}
                                </span>
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  eyeValidationResult.isExternalEye || !eyeValidationResult.isGenuineFundus
                                    ? 'bg-rose-200 text-rose-900'
                                    : 'bg-emerald-200 text-emerald-900'
                                }`}
                              >
                                {eyeValidationResult.isExternalEye || !eyeValidationResult.isGenuineFundus
                                  ? (isEn ? 'REJECTED' : 'अस्वीकृत')
                                  : (isEn ? 'VALID FUNDUS' : 'वैध फंडस')}
                              </span>
                            </div>

                            <p className="text-slate-700 leading-relaxed text-[11px]">
                              {isEn ? eyeValidationResult.feedbackTextEn : eyeValidationResult.feedbackTextHi}
                            </p>

                            {(eyeValidationResult.isExternalEye || !eyeValidationResult.isGenuineFundus) && (
                              <div className="flex items-center gap-2 text-[10px] font-semibold text-rose-800 bg-rose-100/70 p-2 rounded-xl">
                                <Shield className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                                <span>
                                  {isEn
                                    ? 'Clinical Directive: Standard cameras cannot image the retina. Technical/hardware failures NEVER default to green.'
                                    : 'नैदानिक निर्देश: साधारण कैमरा रेटिना नहीं देख सकता। हार्डवेयर असफलता पर कभी "स्वस्थ" घोषित नहीं किया जा सकता।'}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (hasFundusLens) {
                      if (!eyeCapturedImage) {
                        speakText(isEn ? 'Please capture or attach a fundus photo first' : 'कृपया पहले तस्वीर लें या संलग्न करें');
                        return;
                      }

                      const isExternalEyeDetected =
                        eyeValidationResult?.isExternalEye ||
                        !eyeValidationResult?.isGenuineFundus ||
                        Boolean(eyeGeminiResult?.primaryFindingEn?.includes('External')) ||
                        Boolean(eyeGeminiResult?.primaryFindingEn?.includes('Hardware'));

                      if (isExternalEyeDetected) {
                        // CRITICAL: NEVER DEFAULT TO GREEN ON HARDWARE FAILURE!
                        const isRed = eyeDiabetes && eyeBlurryVision;
                        navigateToResult(
                          isRed ? 'RED' : 'AMBER',
                          isEn ? 'Retina Check (Hardware Rejection)' : 'रेटिना जाँच (हार्डवेयर अस्वीकृति)',
                          isEn
                            ? 'Hardware Reality Rejection: Normal external photo of eyes was submitted instead of a genuine optical fundus scan. Optical physics prevents evaluating the internal retina without a certified non-mydriatic fundus adapter. Clinical ophthalmology referral recommended.'
                            : 'हार्डवेयर अस्वीकृति: साधारण मोबाइल कैमरे से ली गई बाहरी आँख की तस्वीर रेटिना जांच हेतु अस्वीकृत। आंतरिक रेटिना देखने के लिए फंडस लेंस अनिवार्य है। अस्पताल परामर्श अनुशंसित।',
                          eyeGeminiResult?.diseasePossibilities || [
                            {
                              conditionEn: 'Hardware Incompatibility (Optical Fundus Lens Required)',
                              conditionHi: 'हार्डवेयर असंगति (ऑप्टिकल फंडस लेंस आवश्यक)',
                              likelihood: 'HIGH',
                              descriptionEn: 'Cannot image or assess posterior retina without certified non-mydriatic optics.',
                              descriptionHi: 'प्रमाणित फंडस लेंस के बिना रेटिना के अंदरूनी भाग की जाँच संभव नहीं है।',
                            },
                            {
                              conditionEn: eyeDiabetes ? 'Diabetic Retinopathy (Unconfirmed Risk)' : 'Refractive / Visual Fatigue',
                              conditionHi: eyeDiabetes ? 'मधुमेह संबंधी रेटिना विकार (अपुष्ट)' : 'दृष्टि दोष / नेत्र तनाव',
                              likelihood: eyeDiabetes ? 'MODERATE' : 'LOW',
                              descriptionEn: eyeDiabetes ? 'In-person ophthalmoscopy required.' : 'Routine optometry check recommended.',
                              descriptionHi: eyeDiabetes ? 'नेत्र रोग विशेषज्ञ से व्यक्तिगत जांच आवश्यक।' : 'प्राथमिक स्वास्थ्य केंद्र में सामान्य नेत्र जाँच।',
                            },
                          ]
                        );
                      } else {
                        navigateToResult(
                          'GREEN',
                          isEn ? 'Retina Fundus Check' : 'रेटिना फंडस जाँच',
                          isEn
                            ? 'Optical fundus scan validated. No acute diabetic retinal lesions detected. Continue routine preventive diabetes care.'
                            : 'फंडस स्कैन सत्यापित। कोई गंभीर रेटिना असामान्यता नहीं पाई गई। नियमित मधुमेह देखभाल जारी रखें।',
                          eyeGeminiResult?.diseasePossibilities || [
                            {
                              conditionEn: 'Healthy Normal Retina',
                              conditionHi: 'सामान्य स्वस्थ रेटिना',
                              likelihood: 'HIGH',
                              descriptionEn: 'Clear optic disc, macula, and uniform vascular arcade.',
                              descriptionHi: 'स्पष्ट ऑप्टिक डिस्क व सामान्य रक्तवाहिकाएं।',
                            },
                          ]
                        );
                      }
                    } else {
                      navigateToResult(
                        eyeDiabetes && eyeBlurryVision ? 'RED' : 'AMBER',
                        isEn ? 'Retina Check (Questionnaire)' : 'रेटिना जाँच (प्रश्नावली)',
                        isEn
                          ? 'Fundus lens was not attached. Due to diabetes and blurry vision, ophthalmology referral recommended.'
                          : 'फंडस लेंस उपलब्ध नहीं था। मधुमेह एवं धुंधली दृष्टि के कारण नेत्र विशेषज्ञ रेफरल अनुशंसित।',
                        [
                          {
                            conditionEn: 'Symptomatic Diabetic Retinopathy Risk',
                            conditionHi: 'लक्षणयुक्त मधुमेह रेटिनोपैथी जोखिम',
                            likelihood: eyeDiabetes && eyeBlurryVision ? 'HIGH' : 'MODERATE',
                            descriptionEn: 'Patient reports diabetes with visual impairment.',
                            descriptionHi: 'रोगी को मधुमेह एवं दृष्टि में धुंधलापन है।',
                          },
                        ]
                      );
                    }
                  }}
                  disabled={isEyeAnalyzing}
                  className={`w-full py-3.5 font-bold rounded-2xl text-sm shadow-md transition-saathi flex items-center justify-center gap-2 ${
                    isEyeAnalyzing
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-saathi-teal text-white hover:bg-teal-600'
                  }`}
                >
                  {isEyeAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                      <span>{isEn ? 'Analyzing Fundus Scan...' : 'फंडस स्कैन का विश्लेषण जारी है...'}</span>
                    </>
                  ) : hasFundusLens ? (
                    isEn ? 'Evaluate Fundus Scan & Result' : 'फंडस स्कैन एवं परिणाम'
                  ) : (
                    isEn ? 'View Risk Assessment & Referral Result' : 'जोखिम अनुसार रेफरल परिणाम देखें'
                  )}
                </button>
              </div>
            )}

            {/* 8. Chest Screening Screen */}
            {currentScreen === 'chest_screening' && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-red-900 font-medium">
                  <strong>{isEn ? 'Clinical Protocol:' : 'नैदानिक नियम:'}</strong>{' '}
                  {isEn
                    ? 'External smartphone photos of chest skin cannot substitute for radiographs. Use authorized digital chest X-ray or NTEP symptom questionnaire.'
                    : 'छाती की बाहरी त्वचा की फोटो एक्स-रे का स्थान नहीं ले सकती। अधिकृत डिजिटल एक्स-रे या लक्षण प्रश्नावली का उपयोग करें।'}
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-saathi-border space-y-2.5">
                  <strong className="block text-saathi-navy text-sm">
                    {isEn ? 'National TB Elimination Program (NTEP) Symptoms:' : 'राष्ट्रीय टीबी उन्मूलन कार्यक्रम लक्षण:'}
                  </strong>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chestCough2Weeks}
                      onChange={(e) => setChestCough2Weeks(e.target.checked)}
                      className="w-4 h-4 text-saathi-teal rounded"
                    />
                    <span>{isEn ? 'Persistent cough for more than 2 weeks' : '2 सप्ताह से अधिक समय से खांसी'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-red-800">
                    <input
                      type="checkbox"
                      checked={chestHemoptysis}
                      onChange={(e) => setChestHemoptysis(e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span>{isEn ? 'Coughing up blood (Hemoptysis - Red Flag)' : 'खांसी में खून आना (Hemoptysis - Red Flag)'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chestNightSweats}
                      onChange={(e) => setChestNightSweats(e.target.checked)}
                      className="w-4 h-4 text-saathi-teal rounded"
                    />
                    <span>{isEn ? 'Evening fever or drenching night sweats' : 'शाम का बुखार या रात में पसीना'}</span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const isRed = chestHemoptysis;
                    const isAmber = chestCough2Weeks || chestNightSweats;
                    const reason = isEn
                      ? (isRed
                          ? 'Prompt hospital referral for sputum test (CBNAAT) due to hemoptysis.'
                          : isAmber
                          ? 'Medical assessment at PHC recommended for cough lasting >2 weeks.'
                          : 'No severe respiratory symptoms recorded.')
                      : (isRed
                          ? 'खांसी में खून आने के कारण तत्काल बलगम (CBNAAT) जाँच हेतु रेफरल।'
                          : isAmber
                          ? '2 सप्ताह से अधिक खांसी हेतु पीएचसी डॉक्टर से जांच अनुशंसित।'
                          : 'कोई गंभीर श्वसन लक्षण दर्ज नहीं।');
                    const chestDifferentials: DiseasePossibility[] = [];
                    if (chestHemoptysis) {
                      chestDifferentials.push(
                        {
                          conditionEn: 'Pulmonary Tuberculosis (NTEP Priority Pathway)',
                          conditionHi: 'फेफड़ों की टीबी (राष्ट्रीय टीबी उन्मूलन कार्यक्रम)',
                          likelihood: 'HIGH',
                          descriptionEn: 'Hemoptysis with cough strongly warrants urgent CBNAAT/TrueNat testing.',
                          descriptionHi: 'खांसी में खून आना, तत्काल सीबीनाट बलगम जाँच आवश्यक।',
                        },
                        {
                          conditionEn: 'Lower Respiratory Tract Infection / Bronchiectasis',
                          conditionHi: 'निचले श्वसन तंत्र का संक्रमण / ब्रोंकिइक्टेसिस',
                          likelihood: 'MODERATE',
                          descriptionEn: 'Bacterial lung infection requiring physician evaluation and chest radiography.',
                          descriptionHi: 'फेफड़ों में संक्रमण, एक्स-रे एवं डॉक्टर परामर्श आवश्यक।',
                        }
                      );
                    } else if (chestCough2Weeks || chestNightSweats) {
                      chestDifferentials.push({
                        conditionEn: 'Presumptive Pulmonary Tuberculosis',
                        conditionHi: 'संभावित टीबी (Presumptive TB)',
                        likelihood: 'MODERATE',
                        descriptionEn: 'Persistent subacute respiratory symptoms lasting over 2 weeks.',
                        descriptionHi: 'दो सप्ताह से अधिक खांसी, टीबी प्रोटोकॉल जाँच आवश्यक।',
                      });
                    }
                    navigateToResult(
                      isRed ? 'RED' : isAmber ? 'AMBER' : 'GREEN',
                      isEn ? 'Chest / Respiratory Check' : 'छाती एवं टीबी जाँच',
                      reason,
                      chestDifferentials
                    );
                  }}
                  className="w-full py-3.5 bg-saathi-teal text-white font-bold rounded-2xl text-sm shadow-md"
                >
                  {isEn ? 'Review Clinical Output' : 'समीक्षा करें (Review Clinical Output)'}
                </button>
              </div>
            )}

            {/* 9. Blood Screening (CBC Funnel) */}
            {currentScreen === 'blood_screening' && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="bg-saathi-paleMint p-3 rounded-xl border border-saathi-teal/30 text-saathi-navy">
                  <strong>{isEn ? '4-Stage Blood Funnel:' : '4-चरणीय रक्त फनल:'}</strong>{' '}
                  {isEn
                    ? 'Enter CBC laboratory values. Evaluation is performed deterministically by clinical rules engine.'
                    : 'सीबीसी मान दर्ज करें। क्लिनिकल नियम इंजन द्वारा मूल्यांकन होगा।'}
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-saathi-border space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-saathi-navy mb-1">
                        {isEn ? 'Hemoglobin (Hb g/dL)' : 'हीमोग्लोबिन (Hb g/dL)'}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={hbValue}
                        onChange={(e) => setHbValue(e.target.value)}
                        className="w-full p-2.5 border border-saathi-border rounded-xl text-sm font-bold"
                      />
                      <span className="text-[10px] text-gray-500">
                        {isEn ? 'Normal: 12.0 - 16.0' : 'सामान्य: 12.0 - 16.0'}
                      </span>
                    </div>
                    <div>
                      <label className="block font-bold text-saathi-navy mb-1">
                        {isEn ? 'Total WBC Count (/uL)' : 'WBC कुल संख्या (/uL)'}
                      </label>
                      <input
                        type="number"
                        value={wbcValue}
                        onChange={(e) => setWbcValue(e.target.value)}
                        className="w-full p-2.5 border border-saathi-border rounded-xl text-sm font-bold"
                      />
                      <span className="text-[10px] text-gray-500">
                        {isEn ? 'Normal: 4,000 - 11,000' : 'सामान्य: 4,000 - 11,000'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-saathi-navy mb-1">
                      {isEn ? 'Platelet Count (/uL)' : 'प्लेटलेट्स संख्या (/uL)'}
                    </label>
                    <input
                      type="number"
                      value={pltValue}
                      onChange={(e) => setPltValue(e.target.value)}
                      className="w-full p-2.5 border border-saathi-border rounded-xl text-sm font-bold"
                    />
                    <span className="text-[10px] text-gray-500">
                      {isEn ? 'Critical Low: < 50,000' : 'क्रिटिकल लो: < 50,000'}
                    </span>
                  </div>

                  <label className="flex items-center justify-between cursor-pointer pt-1">
                    <span className="text-saathi-navy font-semibold">
                      {isEn ? '100x Oil Immersion Microscope Smear Reviewed?' : '100x ऑयल विसर्जन माइक्रोस्कोप स्मीयर?'}
                    </span>
                    <input
                      type="checkbox"
                      checked={smearReviewed}
                      onChange={(e) => setSmearReviewed(e.target.checked)}
                      className="w-4 h-4 text-saathi-teal rounded"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const evalResult = ClientCbcRulesEngine.evaluate({
                      hemoglobin: parseFloat(hbValue),
                      totalWbc: parseFloat(wbcValue),
                      platelets: parseFloat(pltValue),
                      candidateBlastsPercent: smearReviewed ? 2.5 : 0.0,
                    });
                    const flag = evalResult.requiresUrgentMedicalCheck
                      ? 'RED'
                      : evalResult.requiresScheduledFollowup
                      ? 'AMBER'
                      : 'GREEN';
                    const rationale = isEn ? evalResult.recommendedActionEn : evalResult.recommendedActionHi;
                    const cbcDifferentials: DiseasePossibility[] = [];
                    if (parseFloat(pltValue) < 50000) {
                      cbcDifferentials.push({
                        conditionEn: 'Severe Thrombocytopenia (High Bleeding Risk)',
                        conditionHi: 'गंभीर प्लेटलेट कमी (थ्रोम्बोसाइटोपेनिया)',
                        likelihood: 'HIGH',
                        descriptionEn: 'Platelets < 50,000/μL. High capillary bleeding risk.',
                        descriptionHi: 'प्लेटलेट्स 50,000 से कम। आंतरिक रक्तस्राव का जोखिम।',
                      });
                    }
                    if (parseFloat(hbValue) < 9.0) {
                      cbcDifferentials.push({
                        conditionEn: 'Moderate-to-Severe Anemia',
                        conditionHi: 'गंभीर रक्ताल्पता (एनीमिया)',
                        likelihood: 'HIGH',
                        descriptionEn: 'Low hemoglobin requiring iron study or specialist assessment.',
                        descriptionHi: 'कम हीमोग्लोबिन, पोषण एवं रक्त जाँच आवश्यक।',
                      });
                    }
                    if (smearReviewed) {
                      cbcDifferentials.push({
                        conditionEn: 'Atypical Peripheral Blood Morphology (Blasts Present)',
                        conditionHi: 'असामान्य रक्त कोशिकाएं (ब्लास्ट्स उपस्थित)',
                        likelihood: 'HIGH',
                        descriptionEn: 'Peripheral smear review indicated for hematologic pathology.',
                        descriptionHi: 'रक्त विकार हेतु तत्काल CHC/अस्पताल जांच।',
                      });
                    }
                    navigateToResult(flag, isEn ? 'CBC Blood Funnel' : 'सीबीसी रक्त फनल', rationale, cbcDifferentials);
                  }}
                  className="w-full py-3.5 bg-saathi-teal text-white font-bold rounded-2xl text-sm shadow-md"
                >
                  {isEn ? 'Evaluate with Clinical Rules Engine' : 'क्लिनिकल नियमों द्वारा मूल्यांकन करें (Evaluate Rules)'}
                </button>
              </div>
            )}

            {/* 10. Screening Result Screen (Strict Clinical Wording) */}
            {currentScreen === 'result' && (
              <div className="space-y-4 animate-fade-in text-center">
                <span className="text-xs font-bold text-saathi-textSecondary uppercase block text-left">
                  {t.step3Of3}
                </span>

                {/* Display Captured Clinical Image with Quality Verification Stats */}
                {(skinCapturedImage || eyeCapturedImage) && (
                  <div className="bg-white p-3 rounded-2xl border border-saathi-border shadow-sm flex items-center gap-3 text-left animate-fade-in">
                    <img
                      src={(skinCapturedImage || eyeCapturedImage)!}
                      alt="Captured Subject"
                      className="w-16 h-16 rounded-xl object-cover border-2 border-saathi-teal/40 shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <span className="font-bold text-saathi-navy block truncate">
                        {skinCapturedImage
                          ? (isEn ? 'Verified Skin-Sign Photo' : 'सत्यापित त्वचा लक्षण फ़ोटो')
                          : (isEn ? 'Verified Fundus Scan Photo' : 'सत्यापित फंडस स्कैन फ़ोटो')}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {resultPathway} • {isEn ? 'On-Device INT8 Model' : 'ऑन-डिवाइस INT8 मॉडल'}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-600 font-mono">
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Sharp
                        </span>
                        {skinQualityResult && (
                          <>
                            <span>Blur: {skinQualityResult.blurVariance}</span>
                            <span>Lum: {skinQualityResult.meanLuminance}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Active Patient Identifier Header */}
                <div className="bg-white px-3 py-2 rounded-xl border border-saathi-border flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    {isEn ? 'Screened Person:' : 'स्क्रीनिंग प्राप्त व्यक्ति:'}
                  </span>
                  <span className="font-bold text-saathi-navy truncate max-w-[210px]">
                    {activePatient?.name ? `${activePatient.name} • ${activePatient.safeIdentifier}` : (activePatient?.safeIdentifier || 'SAA-RAM-2026-4421')}
                  </span>
                </div>

                {/* High Contrast Screening Result Card */}
                <div
                  className={`p-6 rounded-3xl border-3 shadow-lg ${
                    resultFlag === 'GREEN'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                      : resultFlag === 'AMBER'
                      ? 'bg-amber-50 border-amber-500 text-amber-950'
                      : 'bg-red-50 border-red-500 text-red-950'
                  }`}
                >
                  <div className="flex justify-center mb-3">
                    {resultFlag === 'GREEN' && <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce" />}
                    {resultFlag === 'AMBER' && <Clock className="w-16 h-16 text-amber-600 animate-pulse" />}
                    {resultFlag === 'RED' && <AlertTriangle className="w-16 h-16 text-red-600 animate-pulse" />}
                  </div>

                  <h3 className="text-xl font-black leading-snug">
                    {resultFlag === 'GREEN' && t.resultGreenTitle}
                    {resultFlag === 'AMBER' && t.resultAmberTitle}
                    {resultFlag === 'RED' && t.resultRedTitle}
                  </h3>

                  <p className="text-xs font-semibold mt-3 text-slate-700 leading-relaxed">
                    {resultFlag === 'GREEN' && t.resultGreenDesc}
                    {resultFlag === 'AMBER' && t.resultAmberDesc}
                    {resultFlag === 'RED' && t.resultRedDesc}
                  </p>

                  {/* Nearest Clinical Prediction Card */}
                  {resultNearestCondition && (
                    <div className="mt-3 p-3 bg-white/95 rounded-2xl border border-saathi-teal/40 text-left space-y-1 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-saathi-teal flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5 text-saathi-teal" />
                          {isEn ? 'Nearest Clinical Prediction' : 'निकटतम संभावित रोग (Primary Match)'}
                        </span>
                        <span className="text-[9px] font-black bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.5 rounded">
                          {isEn ? 'HIGH ALIGNMENT' : 'उच्च समानता'}
                        </span>
                      </div>
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {resultNearestCondition}
                      </span>
                    </div>
                  )}

                  {/* Specific Visual / Clinical Assessment Rationale */}
                  {resultReason && (
                    <div className="mt-3 p-2.5 rounded-xl bg-white/75 border border-black/10 text-left text-xs leading-relaxed">
                      <span className="font-bold text-slate-900 block mb-0.5">
                        {isEn ? 'Visual Assessment Rationale:' : 'क्लिनिकल मूल्यांकन आधार:'}
                      </span>
                      <p className="text-slate-800 font-medium">{resultReason}</p>
                    </div>
                  )}

                  {/* Differential Disease Considerations */}
                  {resultDifferentials.length > 0 && (
                    <div className="mt-3.5 p-3 bg-white/90 rounded-2xl border border-black/10 text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-saathi-teal" />
                          {isEn ? 'Differential Disease Considerations' : 'संभावित रोग / कारण (डॉक्टर समीक्षा हेतु)'}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                          {isEn ? 'Assistive Triage' : 'सहायक ट्राइएज'}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {resultDifferentials.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-slate-50 rounded-xl border border-slate-200/90 text-xs flex items-start justify-between gap-2"
                          >
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-slate-950 block">
                                {isEn ? item.conditionEn : item.conditionHi}
                              </span>
                              <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
                                {isEn ? item.descriptionEn : item.descriptionHi}
                              </span>
                            </div>
                            <span
                              className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black ${
                                item.likelihood === 'HIGH'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : item.likelihood === 'MODERATE'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {item.likelihood === 'HIGH'
                                ? (isEn ? 'HIGH' : 'अधिक संभावना')
                                : item.likelihood === 'MODERATE'
                                ? (isEn ? 'MODERATE' : 'मध्यम संभावना')
                                : (isEn ? 'LOW' : 'कम संभावना')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Engine Attribution (Clean, no redundant metrics) */}
                  {(geminiResult || skinAnalysisResult) && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-600">
                      <span className="px-2.5 py-1 bg-white/80 rounded-lg border border-black/10 font-bold text-saathi-navy flex items-center gap-1.5 shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-saathi-teal" />
                        {geminiResult ? geminiResult.modelUsed : 'On-Device Edge CV (Int8)'}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex justify-center">
                    <AudioGuidanceButton
                      spokenText={
                        resultFlag === 'GREEN'
                          ? t.audioResultGreen
                          : resultFlag === 'AMBER'
                          ? t.audioResultAmber
                          : t.audioResultRed
                      }
                      phoneticText={
                        resultFlag === 'GREEN'
                          ? t.audioResultGreenPhonetic
                          : resultFlag === 'AMBER'
                          ? t.audioResultAmberPhonetic
                          : t.audioResultRedPhonetic
                      }
                      langCode={selectedLanguage}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Strict Non-Diagnostic Clinical Disclaimer */}
                <div className="bg-white p-3 rounded-2xl border border-saathi-border text-left flex items-start gap-2">
                  <Info className="w-4 h-4 text-saathi-textMuted shrink-0 mt-0.5" />
                  <p className="text-[11px] text-saathi-textSecondary leading-normal">
                    {t.resultDisclaimer}
                  </p>
                </div>

                {/* Follow-Through Loop Action */}
                {resultFlag !== 'GREEN' ? (
                  <button
                    type="button"
                    onClick={handleCreateReferral}
                    className="w-full py-3.5 bg-saathi-teal hover:bg-teal-600 text-white font-bold rounded-2xl text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-saathi"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.createReferral}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      resetScreeningSession();
                      setCurrentScreen('home');
                    }}
                    className="w-full py-3.5 bg-saathi-navy text-white font-bold rounded-2xl text-sm shadow"
                  >
                    {t.returnHome}
                  </button>
                )}
              </div>
            )}

            {/* 11. Referrals List View */}
            {currentScreen === 'referrals' && (
              <div className="space-y-3 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <span className="font-bold text-saathi-navy text-sm block">{t.openReferralsHeader}</span>
                    <span className="text-[11px] text-gray-500">
                      {openReferralsCount === 0
                        ? (isEn ? '0 open referrals • All loops closed ✓' : '0 खुले रेफरल • सभी लूप बंद हैं ✓')
                        : (isEn
                            ? `${openReferralsCount} open referral${openReferralsCount > 1 ? 's' : ''} waiting for clinical outcome`
                            : `${openReferralsCount} रेफरल अस्पताल परिणाम हेतु खुले हैं`)}
                    </span>
                  </div>
                  <AudioGuidanceButton
                    spokenText={t.openReferralsHeader}
                    phoneticText={t.openReferralsDesc}
                    langCode={selectedLanguage}
                    label={selectedLanguage === 'pa' ? 'ਆਡੀਓ' : selectedLanguage === 'ta' ? 'ஆடியோ' : selectedLanguage === 'te' ? 'ఆడియో' : selectedLanguage === 'bn' ? 'অডিও' : 'Audio'}
                    size="sm"
                  />
                </div>

                {/* Quick Action to Close Open Referrals (Simulate Hospital Clinical Outcome) */}
                {openReferralsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      openReferrals.forEach((r) => {
                        offlineStore.updateReferralOutcome(
                          r.id,
                          isEn
                            ? 'Specialist review completed at Nabha CHC. Appropriate therapy initiated.'
                            : 'सीएचसी नाभा में विशेषज्ञ द्वारा परामर्श पूर्ण। उपचार शुरू किया गया।',
                          'COMPLETED'
                        );
                      });
                      refreshStoreState();
                      speakText(isEn ? 'All open referrals closed' : 'सभी रेफरल का क्लिनिकल परिणाम दर्ज किया गया');
                    }}
                    className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-saathi shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {isEn
                        ? `Close All ${openReferralsCount} Open Referral${openReferralsCount > 1 ? 's' : ''} (Loop Closed ✓)`
                        : `सभी ${openReferralsCount} खुले रेफरल का परिणाम दर्ज करें (Loop Closed)`}
                    </span>
                  </button>
                )}

                {referrals.length === 0 ? (
                  <div className="p-6 bg-white rounded-2xl border border-saathi-border text-center space-y-2">
                    <p className="text-gray-500 font-medium">
                      {isEn ? 'No referrals recorded yet.' : 'कोई रेफरल रिकॉर्ड नहीं मिला।'}
                    </p>
                  </div>
                ) : (
                  referrals.map((ref) => {
                    const isClosed = ref.status === 'COMPLETED';
                    const linkedFoll = followups.find((f) => f.referralCode === ref.safeReferenceCode);

                    return (
                      <div
                        key={ref.id}
                        className={`p-3.5 bg-white rounded-2xl border ${
                          isClosed ? 'border-gray-200' : 'border-saathi-teal/40 ring-1 ring-saathi-teal/20'
                        } shadow-sm space-y-2`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-saathi-teal">{ref.safeReferenceCode}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isClosed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isClosed ? (isEn ? 'COMPLETED ✓' : 'पूर्ण (COMPLETED)') : ref.status}
                          </span>
                        </div>
                        <p className="text-saathi-navy font-bold">
                          {ref.patientSafeId} ({ref.villageName})
                        </p>
                        <p className="text-gray-600">{ref.reasonSummary}</p>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {isEn ? 'Hospital:' : 'अस्पताल:'} {ref.facilityName}
                        </p>

                        {/* Doctor's Follow-up Order & ASHA Slip Integration */}
                        {(ref.doctorInitialAdvice || linkedFoll) && (
                          <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs space-y-1.5">
                            <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-[11px]">
                              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                              <span>{isEn ? "Doctor's Follow-up Order:" : "डॉक्टर का फॉलो-अप निर्देश:"}</span>
                            </div>
                            <p className="text-indigo-950 italic text-[11px]">
                              &quot;{ref.doctorInitialAdvice || linkedFoll?.doctorInitialAdvice}&quot;
                            </p>

                            {!linkedFoll ? (
                              <button
                                type="button"
                                onClick={() => handleGenerateFollowupSlip(ref.safeReferenceCode)}
                                className="w-full mt-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-xs transition-saathi flex items-center justify-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>{isEn ? 'Generate Follow-up Slip' : 'आशा फॉलो-अप पर्ची बनाएं (Slip)'}</span>
                              </button>
                            ) : (
                              <div className="pt-1 border-t border-indigo-200/60 space-y-1 text-[11px]">
                                <div className="flex items-center justify-between text-indigo-800">
                                  <span className="font-semibold">
                                    {isEn ? 'Follow-up Slip:' : 'फॉलो-अप पर्ची:'}
                                  </span>
                                  <span className="font-bold">
                                    {linkedFoll.status === 'VISITED'
                                      ? (isEn ? 'Visited ✓' : 'गृह भेंट पूर्ण ✓')
                                      : linkedFoll.dueLabel}
                                  </span>
                                </div>

                                {linkedFoll.ashaVisitNotes && (
                                  <p className="text-slate-700 bg-white/70 p-1.5 rounded text-[10px] italic">
                                    <strong>{isEn ? 'ASHA Report:' : 'आशा रिपोर्ट:'}</strong> &quot;{linkedFoll.ashaVisitNotes}&quot;
                                  </p>
                                )}

                                {linkedFoll.doctorPostFollowupComment && (
                                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-950 space-y-0.5">
                                    <strong className="block text-emerald-900 font-bold text-[10px] flex items-center gap-1">
                                      <Stethoscope className="w-3 h-3 text-emerald-700" />
                                      <span>{isEn ? "Doctor's Final Clinical Note:" : "डॉक्टर की अग्रिम क्लिनिकल टिप्पणी:"}</span>
                                    </strong>
                                    <p className="italic text-[10px]">&quot;{linkedFoll.doctorPostFollowupComment}&quot;</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Cloud Browser Agent OPD Pre-Booking Widget */}
                        <div className="pt-1.5 flex items-center justify-between border-t border-gray-100">
                          {bookedTokensMap[ref.id] || (ref.outcomeSummary && ref.outcomeSummary.includes('OPD Token')) ? (
                            <div className="flex items-center justify-between w-full text-[10px] bg-emerald-50 text-emerald-950 p-2 rounded-xl border border-emerald-200">
                              <span className="font-bold flex items-center gap-1 text-emerald-800">
                                🎟️ {bookedTokensMap[ref.id] ? `OPD टोकन: ${bookedTokensMap[ref.id].token} (${bookedTokensMap[ref.id].date})` : 'OPD टोकन प्री-बुक्ड ✓'}
                              </span>
                              {bookedTokensMap[ref.id]?.url && (
                                <a
                                  href={bookedTokensMap[ref.id].url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-cyan-700 font-bold hover:underline flex items-center gap-0.5"
                                >
                                  लाइव सत्र देखें
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={bookingAgentRefId === ref.id}
                              onClick={() => handleBookHospitalOPDForReferral(ref)}
                              className="text-[10px] font-bold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 px-2.5 py-1.5 rounded-xl border border-cyan-200 transition-saathi flex items-center gap-1.5 shadow-xs"
                            >
                              {bookingAgentRefId === ref.id ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin text-cyan-600" />
                                  <span>एजेंट OPD टोकन बुक कर रहा है...</span>
                                </>
                              ) : (
                                <>
                                  <Bot className="w-3 h-3 text-cyan-700" />
                                  <span>⚡ अस्पताल OPD टोकन बुक करें (Cloud Agent)</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {ref.outcomeSummary ? (
                          <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium border border-emerald-200/60">
                            <strong>{isEn ? 'Outcome Recorded:' : 'परिणाम दर्ज:'}</strong> {ref.outcomeSummary}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const outcome = prompt(
                                isEn ? 'Enter doctor clinical outcome summary:' : 'डॉक्टर का क्लिनिकल परिणाम दर्ज करें:'
                              );
                              if (outcome) {
                                offlineStore.updateReferralOutcome(ref.id, outcome, 'COMPLETED');
                                refreshStoreState();
                                speakText(t.closeLoopSuccess);
                              }
                            }}
                            className="w-full mt-2 py-1.5 bg-saathi-paleMint text-saathi-teal font-bold rounded-lg border border-saathi-teal/40 hover:bg-teal-100 transition-saathi flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.recordHospitalOutcome}</span>
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 12. Patient Timeline View */}
            {currentScreen === 'timeline' && (
              <div className="space-y-3 animate-fade-in text-xs">
                <span className="font-bold text-saathi-navy block pb-1">{t.timelineTitle}</span>

                <div className="space-y-2.5">
                  {/* Dynamic Doctor Post-Followup Review Note in Timeline */}
                  {followups.some((f) => f.doctorPostFollowupComment) && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        DOCTOR_POST_FOLLOWUP_REVIEW
                      </span>
                      <strong className="block text-emerald-950 mt-1 font-bold">
                        {isEn ? "Doctor's Clinical Review & Final Direction" : 'डॉक्टर की अग्रिम क्लिनिकल समीक्षा एवं निर्देश'}
                      </strong>
                      <p className="text-emerald-900 mt-0.5 italic">
                        &quot;{followups.find((f) => f.doctorPostFollowupComment)?.doctorPostFollowupComment}&quot;
                      </p>
                      <span className="text-[10px] text-emerald-700 block mt-1 font-semibold">
                        {followups.find((f) => f.doctorPostFollowupComment)?.doctorName || 'Dr. Rajiv Verma (MO CHC)'} • {isEn ? 'Referral Loop Closed ✓' : 'रेफरल लूप पूर्ण ✓'}
                      </span>
                    </div>
                  )}

                  {/* Dynamic ASHA Home Visit Record in Timeline */}
                  {followups.some((f) => f.status === 'VISITED') && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                        ASHA_HOME_VISIT_REPORT
                      </span>
                      <strong className="block text-blue-950 mt-1 font-bold">
                        {isEn ? 'ASHA Follow-up Visit Observations' : 'आशा कार्यकर्ता गृह पुनः जाँच रिपोर्ट'}
                      </strong>
                      <p className="text-blue-900 mt-0.5 italic">
                        &quot;{followups.find((f) => f.status === 'VISITED')?.ashaVisitNotes}&quot;
                      </p>
                      <span className="text-[10px] text-blue-700 block mt-1">
                        {isEn ? 'Village Recheck Recorded in SQLite' : 'गाँव में गृह भेंट सम्पन्न • SQLite में दर्ज'}
                      </span>
                    </div>
                  )}

                  <div className="p-3 bg-white rounded-xl border border-saathi-border">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      CLINICIAN_CONFIRMED
                    </span>
                    <strong className="block text-saathi-navy mt-1">
                      {isEn ? 'Hospital Clinical Consultation & Diagnosis' : 'अस्पताल क्लिनिकल परामर्श एवं निदान'}
                    </strong>
                    <p className="text-gray-600 mt-0.5">
                      {isEn ? 'CHC clinician review completed. Benign cyst confirmed.' : 'सीएचसी डॉक्टर द्वारा जांच संपन्न। सौम्य सिस्ट की पुष्टि।'}
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-1">
                      {isEn ? '14 Oct 2026 • Dr. Rajiv Verma' : '14 Oct 2026 • डॉ. राजीव वर्मा'}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-saathi-border">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      AI_SCREENING_OUTPUT
                    </span>
                    <strong className="block text-saathi-navy mt-1">
                      {isEn ? 'On-Device Skin Screening (Amber Flag)' : 'ऑन-डिवाइस त्वचा स्क्रीनिंग (Amber Flag)'}
                    </strong>
                    <p className="text-gray-600 mt-0.5">
                      {isEn ? 'Atypical lesion observed. Clinician review recommended.' : 'असामान्य घाव देखा गया। डॉक्टर से जांच कराने की सलाह।'}
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-1">12 Oct 2026 • saathi-skin-v1.0-q8</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-saathi-border">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      WORKER_ENTERED
                    </span>
                    <strong className="block text-saathi-navy mt-1">
                      {isEn ? 'Patient Registration & Consent Recorded' : 'मरीज़ पंजीकरण एवं सहमति रिकॉर्ड'}
                    </strong>
                    <p className="text-gray-600 mt-0.5">
                      {isEn ? '5-point informed consent granted. Photo quality 95% validated.' : '5-सूत्रीय सहमति प्राप्त। फोटो गुणवत्ता 95% स्पष्ट दर्ज।'}
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-1">
                      {isEn ? '12 Oct 2026 • ASHA Worker' : '12 Oct 2026 • आशा कार्यकर्ता'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 13. Followups View */}
            {currentScreen === 'followups' && (
              <div className="space-y-3 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <span className="font-bold text-saathi-navy text-sm block">{t.followupsTitle}</span>
                    <span className="text-[11px] text-gray-500">
                      {pendingFollowupsCount === 0
                        ? taskTexts.allFollowupsCompleted
                        : pendingFollowupsCount === 1
                        ? taskTexts.singleFollowupPending
                        : taskTexts.multipleFollowupsPending(pendingFollowupsCount)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddFollowupOpen(!isAddFollowupOpen)}
                    className="py-1 px-2.5 bg-saathi-teal hover:bg-teal-600 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs transition-saathi"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Add Follow-up' : 'नया फॉलो-अप'}</span>
                  </button>
                </div>

                {/* Add Follow-up Form / Modal */}
                {isAddFollowupOpen && (
                  <form
                    onSubmit={handleAddFollowup}
                    className="p-3.5 bg-white rounded-2xl border-2 border-saathi-teal/40 shadow-md space-y-2.5 animate-fade-in"
                  >
                    <div className="flex items-center justify-between border-b border-saathi-border pb-1.5">
                      <strong className="text-xs text-saathi-navy font-bold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-saathi-teal" />
                        <span>{isEn ? 'Schedule Follow-up Recheck' : 'नया फॉलो-अप निर्धारित करें'}</span>
                      </strong>
                      <button
                        type="button"
                        onClick={() => setIsAddFollowupOpen(false)}
                        className="text-gray-400 hover:text-gray-600 p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-saathi-navy block mb-0.5">
                        {isEn ? 'Patient Name:' : 'मरीज़ का नाम:'}
                      </label>
                      <input
                        type="text"
                        value={newFollowupName}
                        onChange={(e) => setNewFollowupName(e.target.value)}
                        placeholder={isEn ? 'e.g. Sunita Devi' : 'जैसे: सुनीता देवी'}
                        required
                        className="w-full p-2 bg-slate-50 border border-saathi-border rounded-lg text-xs focus:ring-1 focus:ring-saathi-teal outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-saathi-navy block mb-0.5">
                          {isEn ? 'Age (Years):' : 'उम्र (वर्ष):'}
                        </label>
                        <input
                          type="number"
                          value={newFollowupAge}
                          onChange={(e) => setNewFollowupAge(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-saathi-border rounded-lg text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-saathi-navy block mb-0.5">
                          {isEn ? 'Village:' : 'गाँव:'}
                        </label>
                        <input
                          type="text"
                          list="village-suggestions"
                          value={newFollowupVillage}
                          onChange={(e) => setNewFollowupVillage(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-saathi-border rounded-lg text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-saathi-navy block mb-0.5">
                        {isEn ? 'Recheck Task:' : 'पुनः जाँच कार्य:'}
                      </label>
                      <select
                        value={newFollowupTask}
                        onChange={(e) => setNewFollowupTask(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-saathi-border rounded-lg text-xs outline-none"
                      >
                        <option value="त्वचा पुनः जाँच (Skin Recheck)">त्वचा पुनः जाँच (Skin Recheck)</option>
                        <option value="नेत्र एवं रेटिना फॉलो-अप (Eye Check)">नेत्र एवं रेटिना फॉलो-अप (Eye Check)</option>
                        <option value="रक्त जांच समीक्षा (CBC Review)">रक्त जांच समीक्षा (CBC Review)</option>
                        <option value="छाती एवं लक्षण पुनः जाँच (Chest Symptom Recheck)">छाती एवं लक्षण पुनः जाँच (Chest Recheck)</option>
                        <option value="दवा अनुपालन गृह भेंट (Medication Adherence)">दवा अनुपालन गृह भेंट (Medication Adherence)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-saathi-navy block mb-0.5">
                        {isEn ? 'Due Timeline:' : 'समयसीमा (Due):'}
                      </label>
                      <select
                        value={newFollowupDue}
                        onChange={(e) => setNewFollowupDue(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-saathi-border rounded-lg text-xs outline-none"
                      >
                        <option value="Due Tomorrow">{isEn ? 'Due Tomorrow' : 'कल देय (Due Tomorrow)'}</option>
                        <option value="Due in 2 days">{isEn ? 'Due in 2 days' : '2 दिन में देय (Due in 2 days)'}</option>
                        <option value="Due in 3 days">{isEn ? 'Due in 3 days' : '3 दिन में देय (Due in 3 days)'}</option>
                        <option value="Due in 7 days">{isEn ? 'Due in 7 days' : '7 दिन में देय (Due in 7 days)'}</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddFollowupOpen(false)}
                        className="flex-1 py-1.5 bg-gray-100 text-gray-700 font-bold rounded-lg text-xs hover:bg-gray-200"
                      >
                        {isEn ? 'Cancel' : 'रद्द करें'}
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-1.5 bg-saathi-teal text-white font-bold rounded-lg text-xs hover:bg-teal-600 shadow-xs"
                      >
                        {isEn ? 'Save Follow-up' : 'सुरक्षित करें ✓'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Followups List */}
                {followups.length === 0 ? (
                  <div className="p-6 bg-white rounded-2xl border border-saathi-border text-center space-y-2">
                    <p className="text-gray-500 font-medium">
                      {isEn ? 'No follow-ups scheduled.' : 'कोई फॉलो-अप निर्धारित नहीं है।'}
                    </p>
                  </div>
                ) : (
                  followups.map((f) => {
                    const isVisited = f.status === 'VISITED';
                    const hasDoctorComment = !!f.doctorPostFollowupComment;

                    return (
                      <div
                        key={f.id}
                        className={`p-3.5 bg-white rounded-2xl border ${
                          hasDoctorComment
                            ? 'border-emerald-300 ring-1 ring-emerald-200'
                            : isVisited
                            ? 'border-indigo-200'
                            : 'border-saathi-border'
                        } space-y-2 shadow-sm`}
                      >
                        <div className="flex justify-between items-center font-bold text-saathi-navy">
                          <div>
                            <span className="text-sm block">
                              {f.patientName} ({isEn ? `Age ${f.patientAge}` : `उम्र ${f.patientAge}`})
                            </span>
                            {f.referralCode && (
                              <span className="font-mono text-[10px] text-saathi-teal font-bold">
                                {isEn ? 'Ref Code:' : 'रेफरल कोड:'} {f.referralCode}
                              </span>
                            )}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              hasDoctorComment
                                ? 'text-emerald-800 bg-emerald-100'
                                : isVisited
                                ? 'text-blue-800 bg-blue-100'
                                : 'text-amber-800 bg-amber-100'
                            }`}
                          >
                            {hasDoctorComment
                              ? (isEn ? 'Reviewed ✓' : 'समीक्षा पूर्ण ✓')
                              : isVisited
                              ? (isEn ? 'Visited ✓' : 'भेंट सम्पन्न ✓')
                              : f.dueLabel}
                          </span>
                        </div>

                        <p className="text-gray-600">
                          {isEn
                            ? `Village: ${f.villageName} • Task: ${f.taskTitle}`
                            : `गाँव: ${f.villageName} • कार्य: ${f.taskTitle}`}
                        </p>

                        {/* Doctor's Initial Instructions */}
                        {f.doctorInitialAdvice && (
                          <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-gray-700 border border-slate-200 space-y-0.5">
                            <span className="font-bold text-slate-800 block text-[10px]">
                              {isEn ? "Doctor's Order:" : "डॉक्टर का प्रारंभिक निर्देश:"}
                            </span>
                            <p className="italic">&quot;{f.doctorInitialAdvice}&quot;</p>
                          </div>
                        )}

                        {/* ASHA Home Visit Observations */}
                        {isVisited ? (
                          <div className="p-2 bg-blue-50/70 rounded-lg text-[11px] text-blue-900 border border-blue-200 space-y-0.5">
                            <div className="flex items-center justify-between text-[10px] text-blue-800 font-bold">
                              <span>{isEn ? "ASHA Home Visit Report:" : "आशा कार्यकर्ता गृह भेंट रिपोर्ट:"}</span>
                              <span>{new Date(f.visitedAt || f.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="italic">&quot;{f.ashaVisitNotes || (isEn ? 'Home visit completed. Healing satisfactorily.' : 'गृह भेंट पूर्ण की गई। स्थिति सामान्य पाई गई।')}&quot;</p>
                          </div>
                        ) : (
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setVisitingFollowup(f);
                                setVisitNotesText(
                                  isEn
                                    ? 'Lesion drying, no signs of infection. Patient is taking prescribed medications on time.'
                                    : 'घाव सूख रहा है, कोई संक्रमण नहीं है। मरीज़ नियमित रूप से दवाएं ले रहा है।'
                                );
                              }}
                              className="flex-1 py-2 bg-saathi-paleMint text-saathi-teal font-bold rounded-xl border border-saathi-teal/40 hover:bg-teal-100 transition-saathi flex items-center justify-center gap-1.5 shadow-xs text-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isEn ? 'Mark Visited' : 'गृह भेंट दर्ज करें'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReScreenFromFollowup(f)}
                              className="py-2 px-3 bg-white hover:bg-teal-50 text-saathi-navy font-bold rounded-xl border border-saathi-teal/40 transition-saathi flex items-center justify-center gap-1 shadow-xs text-xs"
                              title={isEn ? 'Re-Screen Patient' : 'पुनः जाँच करें'}
                            >
                              <Activity className="w-3.5 h-3.5 text-saathi-teal" />
                              <span>{isEn ? 'Re-Screen' : 'पुनः जाँच'}</span>
                            </button>
                          </div>
                        )}

                        {isVisited && (
                          <button
                            type="button"
                            onClick={() => handleReScreenFromFollowup(f)}
                            className="w-full mt-1.5 py-1.5 bg-slate-50 hover:bg-teal-50 text-saathi-navy font-semibold rounded-lg border border-saathi-border text-xs flex items-center justify-center gap-1.5 transition-saathi"
                          >
                            <Activity className="w-3.5 h-3.5 text-saathi-teal" />
                            <span>{isEn ? '🔬 Re-Screen Patient (पुनः जाँच / स्क्रीनिंग)' : '🔬 पुनः जाँच / स्क्रीनिंग करें (Re-Screen)'}</span>
                          </button>
                        )}

                        {/* Doctor Post-Followup Review Comment */}
                        {hasDoctorComment ? (
                          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-300 text-xs space-y-1 mt-1 shadow-xs">
                            <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-[11px]">
                              <Stethoscope className="w-4 h-4 text-emerald-700 shrink-0" />
                              <span>{isEn ? "Doctor's Clinical Review & Advice:" : "डॉक्टर की अग्रिम क्लिनिकल टिप्पणी:"}</span>
                            </div>
                            <p className="text-emerald-950 italic text-[11px] leading-relaxed">
                              &quot;{f.doctorPostFollowupComment}&quot;
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-emerald-700 pt-0.5">
                              <span className="font-bold">{f.doctorName || 'Dr. Rajiv Verma (MO CHC)'}</span>
                              <span>{new Date(f.doctorCommentedAt || f.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ) : isVisited ? (
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center justify-between p-1.5 bg-amber-50 rounded-lg border border-amber-200 text-[10px] text-amber-800">
                              <span>⏳ {isEn ? 'Awaiting Doctor Clinical Review' : 'डॉक्टर की क्लिनिकल समीक्षा प्रतीक्षित'}</span>
                              <span className="font-bold">{isEn ? 'Pending' : 'बाकी'}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setDoctorReviewingFollowup(f);
                                setDoctorCommentInput(
                                  isEn
                                    ? 'Reviewed ASHA report: Healing confirmed satisfactory. Discontinue antibiotic, continue zinc cream for 3 days. Case discharged.'
                                    : 'आशा की रिपोर्ट जाँची गई। घाव में सुधार संतोषजनक है। एंटीबायोटिक बंद करें, सामान्य ऑइंटमेंट 3 दिन जारी रखें। केस डिस्चार्ज।'
                                );
                              }}
                              className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200 text-xs flex items-center justify-center gap-1 transition-saathi"
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              <span>{isEn ? 'Add Doctor Comment (डॉक्टर टिप्पणी)' : 'डॉक्टर की अग्रिम टिप्पणी दर्ज करें'}</span>
                            </button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 14. Settings View */}
            {currentScreen === 'settings' && (
              <div className="space-y-4 animate-fade-in text-xs">
                {/* Language & Voice Settings */}
                <div className="bg-white p-4 rounded-2xl border border-saathi-border space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="block text-saathi-navy text-sm font-bold">
                        {t.syncAndLanguage}
                      </strong>
                      <span className="text-gray-500 text-[11px]">
                        {isEn
                          ? '22 Constitutional Languages + English (Voice TTS Active)'
                          : '22 संवैधानिक भाषाएं + अंग्रेज़ी (Voice TTS Active)'}
                      </span>
                    </div>
                    <span className="text-xs bg-saathi-paleMint text-saathi-teal px-2 py-1 rounded-lg font-bold">
                      {activeLangMeta.nativeName} ({activeLangMeta.code.toUpperCase()})
                    </span>
                  </div>

                  {/* Primary Language Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setIsLangPickerOpen(true)}
                    className="w-full py-2.5 px-3 bg-saathi-teal text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-teal-600 transition-saathi"
                  >
                    <Languages className="w-4 h-4" />
                    <span>{isEn ? 'Change Language (Select from 22 Languages)' : 'भाषा बदलें (Select from 22 Languages)'}</span>
                  </button>

                  {/* Quick-Access Top Indic Chips */}
                  <div className="pt-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">
                      {isEn ? 'Quick Select:' : 'त्वरित चयन (Quick Select):'}
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { code: 'hi', label: 'हिन्दी' },
                        { code: 'en', label: 'English' },
                        { code: 'pa', label: 'ਪੰਜਾਬੀ' },
                        { code: 'bn', label: 'বাংলা' },
                        { code: 'ta', label: 'தமிழ்' },
                        { code: 'te', label: 'తెలుగు' },
                        { code: 'mr', label: 'मराठी' },
                        { code: 'gu', label: 'ગુજરાતી' },
                        { code: 'kn', label: 'ಕನ್ನಡ' },
                        { code: 'ml', label: 'മലയാളം' },
                        { code: 'or', label: 'ଓଡ଼ିଆ' },
                        { code: 'ur', label: 'اردو' },
                        { code: 'ne', label: 'नेपाली' },
                      ].map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleSelectLanguage(item.code)}
                          className={`py-1.5 px-2 rounded-lg font-bold text-center border text-xs transition-saathi ${
                            selectedLanguage === item.code
                              ? 'bg-saathi-teal text-white border-saathi-teal shadow-xs'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ElevenLabs Multilingual Voice Assistant */}
                <div className="bg-white p-4 rounded-2xl border border-saathi-border space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="block text-saathi-navy text-sm font-bold flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-indigo-600" />
                        <span>{isEn ? 'ElevenLabs Voice AI' : 'इलेवनलैब्स प्राकृतिक आवाज़'}</span>
                      </strong>
                      <span className="text-[10px] text-gray-500">
                        {isEn ? 'Multilingual V2 Human Voice' : 'प्राकृतिक मानवीय स्वर (Hindi & Indic)'}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        mobileElevenKey && mobileElevenKey.length > 15
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {mobileElevenKey && mobileElevenKey.length > 15 ? 'Active' : 'Offline Fallback'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-saathi-navy">
                        ElevenLabs API Key:
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowMobileKey(!showMobileKey)}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        {showMobileKey ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <input
                      type={showMobileKey ? 'text' : 'password'}
                      value={mobileElevenKey}
                      onChange={(e) => {
                        setMobileElevenKey(e.target.value);
                        elevenLabsService.setApiKey(e.target.value);
                      }}
                      placeholder="sk_..."
                      className="w-full text-xs p-2 bg-slate-50 font-mono border border-saathi-border rounded-xl focus:border-indigo-600 outline-none"
                    />
                  </div>

                  {/* Voice Select */}
                  <div>
                    <label className="block text-[11px] font-bold text-saathi-navy mb-1">
                      {isEn ? 'Select Voice:' : 'आवाज़ मॉडल:'}
                    </label>
                    <select
                      value={mobileElevenVoice}
                      onChange={(e) => {
                        setMobileElevenVoice(e.target.value);
                        elevenLabsService.setVoiceId(e.target.value);
                      }}
                      className="w-full text-xs p-2 bg-slate-50 border border-saathi-border rounded-xl focus:border-indigo-600 outline-none font-medium"
                    >
                      {ELEVENLABS_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Test Voice Button */}
                  <button
                    type="button"
                    disabled={isMobileTestingVoice}
                    onClick={async () => {
                      setIsMobileTestingVoice(true);
                      elevenLabsService.setApiKey(mobileElevenKey);
                      elevenLabsService.setVoiceId(mobileElevenVoice);
                      const phrase = isEn
                        ? 'Namaste ASHA didi. Welcome to Project Saathi.'
                        : 'नमस्ते आशा दीदी। प्रोजेक्ट साथी में आपका स्वागत है।';
                      await speechTts.speak(phrase, selectedLanguage);
                      setTimeout(() => setIsMobileTestingVoice(false), 2500);
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-saathi shadow-xs"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isMobileTestingVoice ? 'animate-bounce' : ''}`} />
                    <span>{isMobileTestingVoice ? (isEn ? 'Playing...' : 'बोल रहे हैं...') : (isEn ? 'Test ElevenLabs Voice' : 'आवाज़ का परीक्षण करें')}</span>
                  </button>
                </div>

                {/* Offline Sync Management */}
                <div className="bg-white p-4 rounded-2xl border border-saathi-border space-y-2 shadow-sm">
                  <strong className="block text-saathi-navy text-sm font-bold">
                    {isEn ? 'Offline Sync Management' : 'ऑफ़लाइन सिंक प्रबंधन'}
                  </strong>
                  <p className="text-gray-600">
                    {isEn ? 'Pending records:' : 'लंबित रिकॉर्ड:'} <strong>{pendingSyncCount}</strong>
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await offlineStore.triggerSync();
                        refreshStoreState();
                        const remainingSync = offlineStore.getPendingSyncCount();
                        speakText(
                          remainingSync === 0
                            ? taskTexts.allSyncedWithCloud
                            : taskTexts.offlineSyncQueued(remainingSync)
                        );
                        alert(isEn ? 'Local records pushed to Cloud Firestore successfully.' : 'डेटा सफलतापूर्वक क्लाउड पर सिंक हो गया।');
                      }}
                      className="flex-1 py-2.5 bg-saathi-navy text-white font-bold rounded-xl shadow-sm hover:bg-saathi-deepNavy transition-saathi text-xs"
                    >
                      {isEn ? 'Push to Cloud' : 'क्लाउड पर भेजें (Push)'}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await offlineStore.pullFromCloud();
                        refreshStoreState();
                        alert(
                          isEn
                            ? `Retrieved from Cloud: ${res.patientCount} patients, ${res.referralCount} referrals loaded.`
                            : `क्लाउड से डेटा प्राप्त: ${res.patientCount} मरीज़, ${res.referralCount} रेफरल रिकॉर्ड्स लोड हुए।`
                        );
                      }}
                      className="flex-1 py-2.5 bg-saathi-teal text-white font-bold rounded-xl shadow-sm hover:bg-teal-600 transition-saathi text-xs flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Pull from Cloud' : 'क्लाउड से लाएं (Pull)'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
              </>
            )}
          </div>

          {/* Bottom Device Navigation Bar - Rendered only for ASHA Worker */}
          {currentUserProfile && currentUserProfile.role === 'ASHA' && (
            <div className="bg-white border-t border-saathi-border px-6 py-2.5 flex items-center justify-around z-20">
              <button
                type="button"
                onClick={() => setCurrentScreen('home')}
                className={`flex flex-col items-center gap-1 ${
                  currentScreen === 'home' ? 'text-saathi-teal font-bold' : 'text-gray-400'
                }`}
              >
                <HeartPulse className="w-5 h-5" />
                <span className="text-[10px]">{t.navHome}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  speakText(t.audioSelectPathway, t.audioSelectPathwayPhonetic);
                  setCurrentScreen('pathway_select');
                }}
                className={`flex flex-col items-center gap-1 ${
                  currentScreen === 'pathway_select' || currentScreen.includes('screening')
                    ? 'text-saathi-teal font-bold'
                    : 'text-gray-400'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span className="text-[10px]">{t.navScreening}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen('referrals')}
                className={`flex flex-col items-center gap-1 ${
                  currentScreen === 'referrals' ? 'text-saathi-teal font-bold' : 'text-gray-400'
                }`}
              >
                <GitPullRequest className="w-5 h-5" />
                <span className="text-[10px]">{t.navReferrals}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen('settings')}
                className={`flex flex-col items-center gap-1 ${
                  currentScreen === 'settings' ? 'text-saathi-teal font-bold' : 'text-gray-400'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="text-[10px]">{t.navSettings}</span>
              </button>
            </div>
          )}

          {/* Modal for ASHA to Record Home Visit Observations */}
          {visitingFollowup && (
            <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end backdrop-blur-xs animate-fade-in">
              <div className="bg-white rounded-t-[28px] p-5 shadow-2xl border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-saathi-paleMint text-saathi-teal rounded-lg">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-saathi-navy">
                        {isEn ? 'Record Home Visit Observations' : 'गृह भेंट रिपोर्ट दर्ज करें'}
                      </h3>
                      <p className="text-[10px] text-gray-500">
                        {visitingFollowup.patientName} ({visitingFollowup.villageName})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVisitingFollowup(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {visitingFollowup.doctorInitialAdvice && (
                  <div className="p-2 bg-indigo-50/70 rounded-xl text-[11px] text-indigo-900 border border-indigo-200">
                    <span className="font-bold block text-[10px]">
                      {isEn ? "Doctor's Advice to check:" : "डॉक्टर का निर्देश:"}
                    </span>
                    <p className="italic">&quot;{visitingFollowup.doctorInitialAdvice}&quot;</p>
                  </div>
                )}

                {/* Direct Pathway to Re-screen during Follow-up visit */}
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-amber-900 leading-tight">
                    <span className="font-bold block">{isEn ? 'Doctor advised re-screening or condition changed?' : 'डॉक्टर ने पुनः जाँच कही है या लक्षण बदले हैं?'}</span>
                    <span className="text-[10px] text-amber-700">{isEn ? 'Launch camera triage linked to this patient' : 'इस मरीज़ कोड के साथ तुरंत कैमरा जाँच शुरू करें'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReScreenFromFollowup(visitingFollowup)}
                    className="px-2.5 py-1.5 bg-saathi-teal text-white font-bold rounded-lg text-[11px] hover:bg-teal-600 shadow-xs shrink-0 flex items-center gap-1"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Re-Screen Now' : 'पुनः जाँच करें'}</span>
                  </button>
                </div>

                <form onSubmit={handleConfirmVisit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-saathi-navy mb-1">
                      {isEn ? 'ASHA Clinical Observation Notes *' : 'आशा कार्यकर्ता की गृह भेंट रिपोर्ट *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={visitNotesText}
                      onChange={(e) => setVisitNotesText(e.target.value)}
                      placeholder={
                        isEn
                          ? 'e.g. Lesion drying, no signs of infection. Patient is taking prescribed medications on time.'
                          : 'उदा. घाव सूख रहा है, कोई संक्रमण नहीं है। मरीज़ नियमित रूप से दवाएं ले रहा है।'
                      }
                      className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-saathi-teal outline-none"
                    />
                  </div>

                  {/* Quick-fill Observation Chips */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-bold block">
                      {isEn ? 'Quick observations:' : 'त्वरित निष्कर्ष:'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {[
                        isEn
                          ? 'Lesion drying, no erythema or fever.'
                          : 'घाव सूख रहा है, लाली व बुखार नहीं है।',
                        isEn
                          ? 'Condition stable, taking medication regularly.'
                          : 'स्थिति सामान्य है, दवाएं नियमित जारी हैं।',
                        isEn
                          ? 'Vision improving, eye redness resolved.'
                          : 'आंख की लाली ठीक हो गई, विज़न बेहतर है।',
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setVisitNotesText(chip)}
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setVisitingFollowup(null)}
                      className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200"
                    >
                      {isEn ? 'Cancel' : 'रद्द करें'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-saathi-teal hover:bg-teal-600 text-white font-bold rounded-xl text-xs shadow-md transition-saathi flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Save Visit ✓' : 'भेंट पूर्ण दर्ज करें ✓'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal for Doctor Review / Simulation */}
          {doctorReviewingFollowup && (
            <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end backdrop-blur-xs animate-fade-in">
              <div className="bg-white rounded-t-[28px] p-5 shadow-2xl border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-indigo-950">
                        {isEn ? 'Doctor Post-Followup Review' : 'डॉक्टर की अग्रिम क्लिनिकल समीक्षा'}
                      </h3>
                      <p className="text-[10px] text-gray-500">
                        {doctorReviewingFollowup.patientName} • {isEn ? 'Ref:' : 'रेफरल:'}{' '}
                        {doctorReviewingFollowup.referralCode || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDoctorReviewingFollowup(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* ASHA Report Preview */}
                <div className="p-2.5 bg-blue-50 rounded-xl text-[11px] text-blue-900 border border-blue-200 space-y-0.5">
                  <span className="font-bold block text-[10px] text-blue-800">
                    {isEn ? 'ASHA Reported Observations:' : 'आशा कार्यकर्ता की रिपोर्ट:'}
                  </span>
                  <p className="italic">
                    &quot;{doctorReviewingFollowup.ashaVisitNotes || (isEn ? 'Home visit completed. Condition stable.' : 'गृह भेंट पूर्ण की गई। स्थिति सामान्य पाई गई।')}&quot;
                  </p>
                </div>

                <form onSubmit={handleDoctorSubmitComment} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-saathi-navy mb-1">
                      {isEn ? "Doctor's Clinical Comment & Direction *" : "डॉक्टर की अग्रिम क्लिनिकल टिप्पणी *"}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={doctorCommentInput}
                      onChange={(e) => setDoctorCommentInput(e.target.value)}
                      placeholder={
                        isEn
                          ? 'e.g. Reviewed ASHA report: Healing confirmed satisfactory. Discontinue antibiotic, continue zinc cream for 3 days. Case discharged.'
                          : 'उदा. आशा की रिपोर्ट जाँची गई। घाव में सुधार संतोषजनक है। एंटीबायोटिक बंद करें, सामान्य ऑइंटमेंट 3 दिन जारी रखें। केस डिस्चार्ज।'
                      }
                      className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-indigo-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-saathi-navy mb-1">
                      {isEn ? 'Medical Officer Name:' : 'डॉक्टर का नाम:'}
                    </label>
                    <input
                      type="text"
                      value={doctorReviewName}
                      onChange={(e) => setDoctorReviewName(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 border border-gray-200 rounded-lg outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setDoctorReviewingFollowup(null)}
                      className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200"
                    >
                      {isEn ? 'Cancel' : 'रद्द करें'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-saathi flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Save Comment ✓' : 'टिप्पणी दर्ज करें ✓'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Full Screen Language Selection Modal / Bottom Sheet */}
          {isLangPickerOpen && (
            <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end backdrop-blur-xs animate-fade-in">
              <div className="bg-white rounded-t-[28px] max-h-[82%] flex flex-col overflow-hidden shadow-2xl border-t border-slate-200">
                {/* Modal Header */}
                <div className="p-4 bg-saathi-navy text-white flex items-center justify-between border-b border-saathi-deepNavy">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-saathi-teal rounded-lg">
                      <Languages className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm leading-tight">
                        {isEn ? 'Select Indian Language' : 'भारतीय भाषा चुनें (Select Language)'}
                      </h3>
                      <p className="text-[10px] text-teal-200">
                        {isEn
                          ? 'All 22 Languages recognized under Schedule 8 + English'
                          : 'संविधान की 8वीं अनुसूची की सभी 22 भाषाएँ + English'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLangPickerOpen(false)}
                    className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search / Filter Input */}
                <div className="p-3 bg-slate-50 border-b border-gray-200">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={isEn ? 'Search language, script, or region...' : 'भाषा खोजें / Search language, script, or region...'}
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-hidden focus:border-saathi-teal"
                    />
                  </div>
                </div>

                {/* Languages Scrollable Grid */}
                <div className="overflow-y-auto p-3 divide-y divide-gray-100 flex-1">
                  {filteredLanguages.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-xs">
                      {isEn ? `No language matching "${langSearch}"` : `कोई भाषा नहीं मिली (No language matching "${langSearch}")`}
                    </div>
                  ) : (
                    filteredLanguages.map((lang) => {
                      const isSelected = selectedLanguage === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSelectLanguage(lang.code)}
                          className={`w-full py-3 px-3 text-left flex items-center justify-between rounded-xl transition-saathi ${
                            isSelected
                              ? 'bg-saathi-paleMint text-saathi-navy font-bold'
                              : 'hover:bg-slate-50 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold font-mono">
                              {lang.code.toUpperCase()}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-base font-bold text-saathi-navy">
                                  {lang.nativeName}
                                </span>
                                <span className="text-xs text-gray-600 font-medium">
                                  ({lang.name})
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-gray-400">{lang.region}</span>
                                <span className="text-[9px] bg-slate-200 text-slate-700 px-1 rounded font-mono">
                                  {lang.bcp47}
                                </span>
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="p-1 bg-saathi-teal text-white rounded-full">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Modal Footer Note */}
                <div className="p-2.5 bg-slate-50 border-t border-gray-200 text-center text-[10px] text-gray-500">
                  {isEn
                    ? 'Both interface text and Voice TTS will automatically activate for the selected language.'
                    : 'चयनित भाषा में टेक्स्ट और बोली (Voice TTS) दोनों स्वतः सक्रिय होंगे'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
