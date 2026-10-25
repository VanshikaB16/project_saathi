import React, { useState } from 'react';
import {
  Users,
  Stethoscope,
  HeartPulse,
  Building2,
  ShieldCheck,
  CreditCard,
  Phone,
  User,
  ArrowRight,
  Sparkles,
  Languages,
  CheckCircle2,
  AlertCircle,
  Hash,
} from 'lucide-react';
import { AudioGuidanceButton } from '../../components/AudioGuidanceButton';
import { speechTts } from '../../services/speechTts';
import { CONSTITUTIONAL_LANGUAGES } from '../../services/localization';
import { getRoleLoginTexts } from '../../services/uiLocalization';

export type AppUserRole = 'ASHA' | 'DOCTOR';

export interface AshaUserProfile {
  role: 'ASHA';
  name: string;
  aadhaar: string;
  ashaId: string;
  phone: string;
}

export interface DoctorUserProfile {
  role: 'DOCTOR';
  name: string;
  hospitalName: string;
  nmrId: string;
  phone: string;
}

export type MobileUserProfile = AshaUserProfile | DoctorUserProfile;

interface RoleLoginScreenProps {
  onLogin: (profile: MobileUserProfile) => void;
  activeLanguage: string;
  onLanguageChange: (lang: string) => void;
  onOpenLangPicker: () => void;
}

export const RoleLoginScreen: React.FC<RoleLoginScreenProps> = ({
  onLogin,
  activeLanguage,
  onOpenLangPicker,
}) => {
  const isEn = activeLanguage === 'en';
  const lt = getRoleLoginTexts(activeLanguage);
  const [selectedRole, setSelectedRole] = useState<AppUserRole>('ASHA');

  // ASHA Form Fields
  const [ashaName, setAshaName] = useState('सुनीता देवी (Sunita Devi)');
  const [ashaAadhaar, setAshaAadhaar] = useState('4829 8812 3041');
  const [ashaId, setAshaId] = useState('ASHA-PB-2041');
  const [ashaPhone, setAshaPhone] = useState('9876543210');

  // Doctor Form Fields
  const [doctorName, setDoctorName] = useState('डॉ. राजीव वर्मा (Dr. Rajiv Verma)');
  const [doctorHospital, setDoctorHospital] = useState('नाभा सीएचसी (Nabha CHC)');
  const [doctorNmrId, setDoctorNmrId] = useState('NMR-PB-49102');
  const [doctorPhone, setDoctorPhone] = useState('9812345678');

  // Form Validation & Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Aadhaar format helper (XXXX XXXX XXXX)
  const formatAadhaar = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 12);
    const parts = digitsOnly.match(/.{1,4}/g);
    return parts ? parts.join(' ') : digitsOnly;
  };

  const handleQuickFillAsha = () => {
    setAshaName(
      isEn
        ? 'Sunita Devi'
        : activeLanguage === 'pa'
        ? 'ਸੁਨੀਤਾ ਦੇਵੀ'
        : activeLanguage === 'te'
        ? 'సునీతా దేవి'
        : activeLanguage === 'bn'
        ? 'সুনীতা দেবী'
        : 'सुनीता देवी (Sunita Devi)'
    );
    setAshaAadhaar('4829 8812 3041');
    setAshaId('ASHA-PB-2041');
    setAshaPhone('9876543210');
    setErrorMessage(null);
  };

  const handleQuickFillDoctor = () => {
    setDoctorName(
      isEn
        ? 'Dr. Rajiv Verma (MO CHC)'
        : activeLanguage === 'pa'
        ? 'ਡਾ. ਰਾਜੀਵ ਵਰਮਾ'
        : activeLanguage === 'te'
        ? 'డా. రాజీవ్ వర్మ'
        : activeLanguage === 'bn'
        ? 'ডাঃ রাজীব বর্মা'
        : 'डॉ. राजीव वर्मा (Dr. Rajiv Verma)'
    );
    setDoctorHospital(
      isEn
        ? 'Nabha Community Health Centre (CHC)'
        : activeLanguage === 'pa'
        ? 'ਨਾਭਾ ਸੀ.ਐਚ.ਸੀ'
        : activeLanguage === 'te'
        ? 'నాభా సి.హెచ్.సి'
        : activeLanguage === 'bn'
        ? 'নাভা সিএইচসি'
        : 'नाभा सामुदायिक स्वास्थ्य केंद्र (Nabha CHC)'
    );
    setDoctorNmrId('NMR-PB-49102');
    setDoctorPhone('9812345678');
    setErrorMessage(null);
  };

  const handleAshaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ashaName.trim()) {
      setErrorMessage(lt.validationNameReq);
      return;
    }
    const cleanAadhaar = ashaAadhaar.replace(/\s+/g, '');
    if (cleanAadhaar.length < 12) {
      setErrorMessage(lt.validationAadhaarReq);
      return;
    }
    if (!ashaId.trim()) {
      setErrorMessage(lt.validationAshaIdReq);
      return;
    }
    if (ashaPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage(lt.validationPhoneReq);
      return;
    }

    setErrorMessage(null);
    speechTts.speak(
      isEn
        ? `Welcome ASHA didi ${ashaName}. Logged into Saathi screening assistant.`
        : `${lt.roleAshaTitle} ${ashaName}। ${lt.appTitle}।`,
      activeLanguage
    );

    onLogin({
      role: 'ASHA',
      name: ashaName.trim(),
      aadhaar: ashaAadhaar.trim(),
      ashaId: ashaId.trim(),
      phone: ashaPhone.trim(),
    });
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim()) {
      setErrorMessage(lt.validationDoctorNameReq);
      return;
    }
    if (!doctorHospital.trim()) {
      setErrorMessage(lt.validationHospitalReq);
      return;
    }
    if (!doctorNmrId.trim()) {
      setErrorMessage(lt.validationNmrReq);
      return;
    }
    if (doctorPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage(lt.validationPhoneReq);
      return;
    }

    setErrorMessage(null);
    speechTts.speak(
      isEn
        ? `Welcome ${doctorName}. Logged into Clinician Referral Portal.`
        : `${lt.roleDoctorTitle} ${doctorName}। ${lt.appTitle}।`,
      activeLanguage
    );

    onLogin({
      role: 'DOCTOR',
      name: doctorName.trim(),
      hospitalName: doctorHospital.trim(),
      nmrId: doctorNmrId.trim(),
      phone: doctorPhone.trim(),
    });
  };

  const activeLangMeta = CONSTITUTIONAL_LANGUAGES.find((l) => l.code === activeLanguage) || {
    name: 'Hindi',
    nativeName: 'हिन्दी',
  };

  return (
    <div className="space-y-4 animate-fade-in text-saathi-textPrimary pb-6">
      {/* Brand Header */}
      <div className="bg-gradient-to-br from-saathi-navy via-slate-900 to-saathi-deepNavy p-4 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-sm flex items-center justify-center shrink-0">
              <img src="/sathi-logo.png" alt="Saathi Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white">{lt.appTitle}</h2>
              <p className="text-[10px] text-saathi-softMint font-medium">
                {lt.tagline}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenLangPicker}
            className="text-[11px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg font-bold text-white flex items-center gap-1 border border-white/15 transition-saathi shrink-0"
            title="भाषा बदलें (Select Language)"
          >
            <Languages className="w-3 h-3 text-saathi-softMint" />
            <span className="max-w-[65px] truncate">{activeLangMeta.nativeName}</span>
          </button>
        </div>

        <div className="pt-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-300 font-semibold">
            {lt.step1Title}
          </span>
          <AudioGuidanceButton
            spokenText={lt.audioPrompt}
            phoneticText={lt.audioPromptPhonetic}
            langCode={activeLanguage}
          />
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* ASHA Card */}
        <button
          type="button"
          onClick={() => {
            setSelectedRole('ASHA');
            setErrorMessage(null);
            speechTts.speak(`${lt.roleAshaTitle}. ${lt.ashaCredentialsHeader}`, activeLanguage);
          }}
          className={`p-3.5 rounded-2xl border-2 text-left transition-saathi flex flex-col justify-between relative ${
            selectedRole === 'ASHA'
              ? 'bg-emerald-50/80 border-saathi-teal shadow-md text-emerald-950 ring-2 ring-saathi-teal/30'
              : 'bg-white border-saathi-border text-slate-700 hover:border-saathi-teal/40'
          }`}
        >
          {selectedRole === 'ASHA' && (
            <div className="absolute top-2 right-2 bg-saathi-teal text-white p-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`p-2 rounded-xl ${
                selectedRole === 'ASHA' ? 'bg-saathi-teal text-white shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-saathi-teal">
              {lt.communityHealthBadge}
            </span>
          </div>

          <div>
            <h3 className="font-black text-sm text-saathi-navy">
              {lt.roleAshaTitle}
            </h3>
            <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">
              {lt.roleAshaSubtitle}
            </p>
          </div>
        </button>

        {/* Doctor Card */}
        <button
          type="button"
          onClick={() => {
            setSelectedRole('DOCTOR');
            setErrorMessage(null);
            speechTts.speak(`${lt.roleDoctorTitle}. ${lt.doctorCredentialsHeader}`, activeLanguage);
          }}
          className={`p-3.5 rounded-2xl border-2 text-left transition-saathi flex flex-col justify-between relative ${
            selectedRole === 'DOCTOR'
              ? 'bg-indigo-50/80 border-indigo-600 shadow-md text-indigo-950 ring-2 ring-indigo-500/30'
              : 'bg-white border-saathi-border text-slate-700 hover:border-indigo-400'
          }`}
        >
          {selectedRole === 'DOCTOR' && (
            <div className="absolute top-2 right-2 bg-indigo-600 text-white p-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`p-2 rounded-xl ${
                selectedRole === 'DOCTOR' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
              {lt.clinicalOfficerBadge}
            </span>
          </div>

          <div>
            <h3 className="font-black text-sm text-saathi-navy">
              {lt.roleDoctorTitle}
            </h3>
            <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">
              {lt.roleDoctorSubtitle}
            </p>
          </div>
        </button>
      </div>

      {/* Error alert if validation fails */}
      {errorMessage && (
        <div className="p-2.5 bg-red-50 rounded-xl border border-red-300 text-red-900 text-xs font-semibold flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FORM A: ASHA Worker Login */}
      {selectedRole === 'ASHA' && (
        <form onSubmit={handleAshaSubmit} className="bg-white p-4 rounded-3xl border border-saathi-border shadow-sm space-y-3.5 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5 text-saathi-teal">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-saathi-navy">
                {lt.ashaCredentialsHeader}
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickFillAsha}
              className="text-[10px] font-bold text-saathi-teal hover:text-teal-700 flex items-center gap-1 bg-saathi-paleMint px-2 py-0.5 rounded-lg border border-saathi-teal/30"
              title="Auto-fill verified demo ASHA profile"
            >
              <Sparkles className="w-3 h-3" />
              <span>{lt.demoFillBtn}</span>
            </button>
          </div>

          {/* 1. Name */}
          <div>
            <label className="block text-xs font-bold text-saathi-navy mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-saathi-teal" />
              <span>{lt.ashaFullNameLabel}</span>
            </label>
            <input
              type="text"
              required
              value={ashaName}
              onChange={(e) => setAshaName(e.target.value)}
              placeholder={lt.ashaNamePlaceholder}
              className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-sm font-semibold focus:bg-white focus:border-saathi-teal outline-none transition-saathi"
            />
          </div>

          {/* 2. Aadhaar Number */}
          <div>
            <label className="block text-xs font-bold text-saathi-navy mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-saathi-teal" />
                <span>{lt.ashaAadhaarLabel}</span>
              </span>
              <span className="text-[10px] text-gray-400 font-normal">
                {lt.localVerificationOnly}
              </span>
            </label>
            <input
              type="text"
              required
              maxLength={14}
              value={ashaAadhaar}
              onChange={(e) => setAshaAadhaar(formatAadhaar(e.target.value))}
              placeholder="1234 5678 9012"
              className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-sm font-mono font-bold tracking-wider focus:bg-white focus:border-saathi-teal outline-none transition-saathi"
            />
            <span className="text-[10px] text-slate-500 mt-1 block flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              {lt.dpdpNotice}
            </span>
          </div>

          {/* 3. Unique ASHA ID */}
          <div>
            <label className="block text-xs font-bold text-saathi-navy mb-1 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-saathi-teal" />
              <span>{lt.ashaUniqueIdLabel}</span>
            </label>
            <input
              type="text"
              required
              value={ashaId}
              onChange={(e) => setAshaId(e.target.value.toUpperCase())}
              placeholder={lt.ashaIdPlaceholder}
              className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-sm font-mono font-bold focus:bg-white focus:border-saathi-teal outline-none transition-saathi"
            />
          </div>

          {/* 4. Phone Number */}
          <div>
            <label className="block text-xs font-bold text-saathi-navy mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-saathi-teal" />
              <span>{lt.ashaPhoneLabel}</span>
            </label>
            <input
              type="tel"
              required
              maxLength={12}
              value={ashaPhone}
              onChange={(e) => setAshaPhone(e.target.value)}
              placeholder={lt.ashaPhonePlaceholder}
              className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-sm font-semibold focus:bg-white focus:border-saathi-teal outline-none transition-saathi"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-saathi-teal hover:bg-teal-600 active:scale-98 text-white font-bold rounded-2xl text-sm shadow-md transition-saathi flex items-center justify-center gap-2 pt-3"
          >
            <span>{lt.loginAshaBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* FORM B: Doctor / Medical Officer Login */}
      {selectedRole === 'DOCTOR' && (
        <form onSubmit={handleDoctorSubmit} className="bg-white p-4 rounded-3xl border border-indigo-200 shadow-sm space-y-3.5 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5 text-indigo-700">
              <Stethoscope className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-saathi-navy">
                {lt.doctorCredentialsHeader}
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickFillDoctor}
              className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200"
              title="Auto-fill verified demo Doctor profile"
            >
              <Sparkles className="w-3 h-3" />
              <span>{lt.demoFillBtn}</span>
            </button>
          </div>

          {/* 1. Name */}
          <div>
            <label className="block text-xs font-bold text-saathi-navy mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lt.doctorFullNameLabel}</span>
            </label>
            <input
              type="text"
              required
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder={lt.doctorNamePlaceholder}
              className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-saathi"
            />
          </div>

          {/* 2. Hospital Name */}
          <div>
            <label className="block text-xs font-bold text-saathi-navy mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lt.doctorHospitalLabel}</span>
            </label>
            <input
              type="text"
              required
              value={doctorHospital}
              onChange={(e) => setDoctorHospital(e.target.value)}
              placeholder={lt.doctorHospitalPlaceholder}
              className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-saathi"
            />
          </div>

          {/* 3. NMR ID */}
          <div>
            <label className="block text-xs font-bold text-saathi-navy mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-indigo-600" />
                <span>{lt.doctorNmrLabel}</span>
              </span>
              <span className="text-[10px] text-gray-400 font-normal">
                {lt.nmcAuthorized}
              </span>
            </label>
            <input
              type="text"
              required
              value={doctorNmrId}
              onChange={(e) => setDoctorNmrId(e.target.value.toUpperCase())}
              placeholder={lt.doctorNmrPlaceholder}
              className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-sm font-mono font-bold focus:bg-white focus:border-indigo-600 outline-none transition-saathi"
            />
          </div>

          {/* 4. Phone Number */}
          <div>
            <label className="block text-xs font-bold text-saathi-navy mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lt.doctorPhoneLabel}</span>
            </label>
            <input
              type="tel"
              required
              maxLength={12}
              value={doctorPhone}
              onChange={(e) => setDoctorPhone(e.target.value)}
              placeholder={lt.doctorPhonePlaceholder}
              className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-600 outline-none transition-saathi"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold rounded-2xl text-sm shadow-md transition-saathi flex items-center justify-center gap-2 pt-3"
          >
            <span>{lt.loginDoctorBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Trust & DPDP Privacy Footer */}
      <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-saathi-teal" />
          <span>{lt.governanceTitle}</span>
        </div>
        <p className="text-[10px] leading-relaxed">
          {lt.governanceDesc}
        </p>
      </div>
    </div>
  );
};
