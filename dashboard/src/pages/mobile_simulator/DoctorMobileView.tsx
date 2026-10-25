import React, { useState } from 'react';
import {
  Stethoscope,
  Building2,
  Phone,
  Hash,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  LogOut,
  Calendar,
  Send,
  MessageSquare,
  FileText,
  UserCheck,
  ChevronRight,
  Shield,
  X,
  Languages,
  Check,
  RotateCcw,
  Sparkles,
  HeartPulse,
  Bot,
  Globe,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { DoctorUserProfile } from './RoleLoginScreen';
import { offlineStore, StoredReferral, StoredFollowup } from '../../services/offlineStore';
import { AudioGuidanceButton } from '../../components/AudioGuidanceButton';
import { speechTts } from '../../services/speechTts';
import { CONSTITUTIONAL_LANGUAGES } from '../../services/localization';
import { getDoctorMobileTexts } from '../../services/uiLocalization';
import { browserUseService, HospitalTokenResult, JanAushadhiResult } from '../../services/browserUseService';

interface DoctorMobileViewProps {
  doctorProfile: DoctorUserProfile;
  activeLanguage: string;
  onLogout: () => void;
  onOpenLangPicker: () => void;
}

export const DoctorMobileView: React.FC<DoctorMobileViewProps> = ({
  doctorProfile,
  activeLanguage,
  onLogout,
  onOpenLangPicker,
}) => {
  const isEn = activeLanguage === 'en';
  const dmt = getDoctorMobileTexts(activeLanguage);
  const [activeTab, setActiveTab] = useState<'referrals' | 'followups' | 'emergencies'>('referrals');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'RED' | 'OPEN' | 'COMPLETED'>('ALL');

  // Live store data
  const [referrals, setReferrals] = useState<StoredReferral[]>(() => offlineStore.getReferrals());
  const [followups, setFollowups] = useState<StoredFollowup[]>(() => offlineStore.getFollowups());

  // Modal 1: Referral Clinical Examination & Outcome
  const [examiningReferral, setExaminingReferral] = useState<StoredReferral | null>(null);
  const [outcomeActionType, setOutcomeActionType] = useState<'COMPLETE' | 'FOLLOWUP'>('COMPLETE');
  const [clinicalDiagnosisText, setClinicalDiagnosisText] = useState('');
  const [followupDays, setFollowupDays] = useState(5);
  const [followupAdviceText, setFollowupAdviceText] = useState('');

  // Modal 2: Doctor Review of Visited Follow-up
  const [reviewingFollowup, setReviewingFollowup] = useState<StoredFollowup | null>(null);
  const [doctorCommentInput, setDoctorCommentInput] = useState('');
  const [closeReferralOnComment, setCloseReferralOnComment] = useState(true);

  // Cloud Browser Use Agent States
  const [bookingAgentRunning, setBookingAgentRunning] = useState(false);
  const [agentStepStatus, setAgentStepStatus] = useState<string | null>(null);
  const [bookedToken, setBookedToken] = useState<HospitalTokenResult | null>(null);
  const [janAushadhiLoading, setJanAushadhiLoading] = useState(false);
  const [janAushadhiData, setJanAushadhiData] = useState<JanAushadhiResult | null>(null);

  const handleAutoPrebookOPD = async () => {
    if (!examiningReferral) return;
    setBookingAgentRunning(true);
    setAgentStepStatus('Cloud stealth browser launching...');
    try {
      const spec = examiningReferral.pathway === 'SKIN' ? 'Dermatology' : examiningReferral.pathway === 'EYE' ? 'Ophthalmology' : 'General Medicine';
      const res = await browserUseService.bookDistrictHospitalReferral({
        patientName: examiningReferral.patientSafeId,
        age: 45,
        safeId: examiningReferral.safeReferenceCode,
        specialty: spec,
        facilityName: examiningReferral.facilityName || 'Nabha Civil Hospital (SDH)',
        reason: examiningReferral.reasonSummary,
        onProgress: (step) => setAgentStepStatus(step),
      });
      setBookedToken(res);
      setClinicalDiagnosisText((prev) => 
        prev ? `${prev}\n[Cloud Agent OPD Token: ${res.tokenNumber} for ${res.appointmentDate} at ${res.hospitalName}]`
             : `Pre-booked hospital OPD Token: ${res.tokenNumber} for ${res.appointmentDate}. Patient to report at ${res.hospitalName} ${res.department} counter.`
      );
    } catch (err: any) {
      setAgentStepStatus(`Error: ${err.message}`);
    } finally {
      setBookingAgentRunning(false);
    }
  };

  const handleCheckJanAushadhi = async () => {
    setJanAushadhiLoading(true);
    try {
      const query = clinicalDiagnosisText.trim() || 'Hydrocortisone';
      const res = await browserUseService.checkJanAushadhiPrices(query, '147201');
      setJanAushadhiData(res);
    } finally {
      setJanAushadhiLoading(false);
    }
  };

  const refreshData = () => {
    setReferrals([...offlineStore.getReferrals()]);
    setFollowups([...offlineStore.getFollowups()]);
  };

  // Filtered referrals
  const filteredReferrals = referrals.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.safeReferenceCode.toLowerCase().includes(q) ||
      r.patientSafeId.toLowerCase().includes(q) ||
      r.villageName.toLowerCase().includes(q) ||
      r.pathway.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'RED') return r.urgencyTier === 'CRITICAL' || r.reasonSummary.toLowerCase().includes('red') || r.reasonSummary.includes('लाल');
    if (statusFilter === 'OPEN') return ['REFERRED', 'APPOINTMENT_SCHEDULED', 'ATTENDED'].includes(r.status);
    if (statusFilter === 'COMPLETED') return r.status === 'COMPLETED';
    return true;
  });

  const visitedFollowupsAwaitingReview = followups.filter(
    (f) => f.status === 'VISITED' && !f.doctorPostFollowupComment
  );

  const urgentRedReferrals = referrals.filter(
    (r) => r.status !== 'COMPLETED' && (r.urgencyTier === 'CRITICAL' || r.reasonSummary.toLowerCase().includes('red') || r.reasonSummary.includes('लाल'))
  );

  // Submit direct clinical outcome
  const handleSaveDirectOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examiningReferral || !clinicalDiagnosisText.trim()) return;

    offlineStore.updateReferralOutcome(
      examiningReferral.id,
      `${clinicalDiagnosisText.trim()} (${doctorProfile.name})`,
      'COMPLETED'
    );
    refreshData();
    setExaminingReferral(null);
    setClinicalDiagnosisText('');
    speechTts.speak(dmt.toastOutcomeSaved, activeLanguage);
  };

  // Order ASHA home follow-up
  const handleOrderAshaFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examiningReferral || !followupAdviceText.trim()) return;

    offlineStore.requestReferralFollowup(
      examiningReferral.id,
      followupDays,
      followupAdviceText.trim(),
      doctorProfile.name
    );
    refreshData();
    setExaminingReferral(null);
    setFollowupAdviceText('');
    speechTts.speak(dmt.toastFollowupIssued(followupDays), activeLanguage);
  };

  // Submit post-visit review comment
  const handleSubmitFollowupComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingFollowup || !doctorCommentInput.trim()) return;

    offlineStore.addDoctorFollowupComment(
      reviewingFollowup.id,
      doctorCommentInput.trim(),
      doctorProfile.name,
      closeReferralOnComment
    );
    refreshData();
    setReviewingFollowup(null);
    setDoctorCommentInput('');
    speechTts.speak(dmt.toastReviewSaved, activeLanguage);
  };

  const activeLangMeta = CONSTITUTIONAL_LANGUAGES.find((l) => l.code === activeLanguage) || {
    name: 'Hindi',
    nativeName: 'हिन्दी',
  };

  return (
    <div className="space-y-3.5 animate-fade-in text-saathi-textPrimary pb-6">
      {/* 1. Doctor Profile Bar */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-saathi-navy p-3.5 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/90 text-white flex items-center justify-center font-bold shadow-sm shrink-0 border border-indigo-400/40">
              <Stethoscope className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/40 text-indigo-200 border border-indigo-400/30">
                  {dmt.medicalOfficerBadge}
                </span>
                <span className="text-[10px] text-slate-300 font-mono">ID: {doctorProfile.nmrId}</span>
              </div>
              <h3 className="text-sm font-black text-white truncate mt-0.5">{doctorProfile.name}</h3>
              <p className="text-[11px] text-indigo-200 truncate flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 shrink-0" />
                <span>{doctorProfile.hospitalName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onOpenLangPicker}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white border border-white/10 text-xs font-bold"
              title="भाषा बदलें"
            >
              <Languages className="w-3.5 h-3.5 text-saathi-softMint" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(dmt.switchRoleConfirm)) {
                  onLogout();
                }
              }}
              className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded-xl border border-rose-500/30 text-xs font-bold flex items-center gap-1"
              title={dmt.switchRoleBtn}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 text-center text-[10px]">
          <div className="bg-white/5 rounded-xl p-1.5 border border-white/10">
            <span className="text-slate-400 block">{dmt.openReferralsCountLabel}</span>
            <strong className="text-sm font-black text-white">
              {referrals.filter((r) => r.status !== 'COMPLETED').length}
            </strong>
          </div>
          <div className="bg-rose-950/40 rounded-xl p-1.5 border border-rose-500/30">
            <span className="text-rose-300 block">{dmt.redAlertsCountLabel}</span>
            <strong className="text-sm font-black text-rose-300">{urgentRedReferrals.length}</strong>
          </div>
          <div className="bg-amber-950/40 rounded-xl p-1.5 border border-amber-500/30">
            <span className="text-amber-300 block">{dmt.ashaVisitsCountLabel}</span>
            <strong className="text-sm font-black text-amber-300">
              {visitedFollowupsAwaitingReview.length}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Urgent Attention Banner (If any visited follow-up needs Doctor Review) */}
      {visitedFollowupsAwaitingReview.length > 0 && (
        <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-start justify-between gap-2 shadow-xs animate-fade-in">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="font-bold text-amber-900 block">
                {dmt.reviewPendingBanner(visitedFollowupsAwaitingReview.length)}
              </strong>
              <p className="text-[10px] text-amber-800 mt-0.5">
                {dmt.reviewPendingDesc}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('followups')}
            className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] shrink-0"
          >
            {dmt.reviewBtn}
          </button>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-saathi-border text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('referrals')}
          className={`flex-1 py-2 rounded-xl font-bold transition-saathi flex items-center justify-center gap-1 ${
            activeTab === 'referrals'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-saathi-textSecondary hover:text-saathi-navy'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{dmt.tabReferrals}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 text-white font-mono">
            {referrals.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('followups')}
          className={`flex-1 py-2 rounded-xl font-bold transition-saathi flex items-center justify-center gap-1 ${
            activeTab === 'followups'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-saathi-textSecondary hover:text-saathi-navy'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>{dmt.tabAshaVisits}</span>
          {visitedFollowupsAwaitingReview.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('emergencies')}
          className={`py-2 px-3 rounded-xl font-bold transition-saathi flex items-center justify-center gap-1 ${
            activeTab === 'emergencies'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-rose-700 hover:bg-rose-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{dmt.tabRedFlags}</span>
        </button>
      </div>

      {/* TAB 1: REFERRALS QUEUE */}
      {activeTab === 'referrals' && (
        <div className="space-y-3">
          {/* Search & Status Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dmt.searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 bg-white border border-saathi-border rounded-xl text-xs font-semibold focus:border-indigo-600 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[11px] pb-1">
              {[
                { id: 'ALL', label: dmt.filterAll },
                { id: 'RED', label: dmt.filterRed },
                { id: 'OPEN', label: dmt.filterOpen },
                { id: 'COMPLETED', label: dmt.filterCompleted },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-saathi ${
                    statusFilter === f.id
                      ? 'bg-indigo-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-saathi-border hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Referral Cards */}
          <div className="space-y-2.5">
            {filteredReferrals.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-saathi-border text-center text-xs text-gray-500 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-bold text-slate-700">
                  {dmt.noReferralsFound}
                </p>
                <p className="text-[10px]">
                  {dmt.noReferralsFoundDesc}
                </p>
              </div>
            ) : (
              filteredReferrals.map((r) => {
                const isClosed = r.status === 'COMPLETED';
                const isRed = r.urgencyTier === 'CRITICAL' || r.reasonSummary.toLowerCase().includes('red') || r.reasonSummary.includes('लाल');
                const linkedFoll = followups.find((f) => f.referralCode === r.safeReferenceCode);

                return (
                  <div
                    key={r.id}
                    className={`bg-white rounded-2xl p-3.5 border transition-saathi shadow-xs space-y-2 ${
                      isRed
                        ? 'border-rose-300 ring-1 ring-rose-200'
                        : isClosed
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-saathi-border hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            {r.safeReferenceCode}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isRed
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : isClosed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isClosed
                              ? dmt.closedBadge
                              : isRed
                              ? dmt.redAlertBadge
                              : dmt.openBadge}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-saathi-navy mt-1">
                          {r.patientSafeId} • <span className="font-normal text-slate-600">{r.villageName}</span>
                        </h4>
                      </div>

                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {r.pathway}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-relaxed">
                      <strong>{dmt.clinicalReasonLabel}</strong> {r.reasonSummary}
                    </p>

                    {/* Linked Follow-up or Outcome Note */}
                    {r.outcomeSummary && (
                      <div className="text-[10px] text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200 flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>{dmt.doctorConfirmedOutcomeLabel}</strong>{' '}
                          <span>{r.outcomeSummary}</span>
                        </div>
                      </div>
                    )}

                    {linkedFoll && !isClosed && (
                      <div className="text-[10px] text-indigo-800 bg-indigo-50 p-2 rounded-xl border border-indigo-200 flex items-start gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>{dmt.activeFollowupLabel}</strong>{' '}
                          <span>&quot;{linkedFoll.doctorInitialAdvice || 'Home visit scheduled'}&quot;</span>
                        </div>
                      </div>
                    )}

                    {/* Action Button for Doctor */}
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setExaminingReferral(r);
                          setClinicalDiagnosisText('');
                          setFollowupAdviceText('');
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-saathi shadow-xs ${
                          isClosed
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>{isClosed ? dmt.viewCaseBtn : dmt.clinicalActionBtn}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ASHA HOME VISITS REVIEW */}
      {activeTab === 'followups' && (
        <div className="space-y-3">
          <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">
                {dmt.ashaSurveillanceTitle}
              </strong>
              <p className="text-[10px] text-indigo-800 mt-0.5">
                {dmt.ashaSurveillanceDesc}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {followups.map((f) => {
              const isVisited = f.status === 'VISITED';
              const hasDocComment = !!f.doctorPostFollowupComment;

              return (
                <div
                  key={f.id}
                  className={`bg-white rounded-2xl p-3.5 border transition-saathi shadow-xs space-y-2 ${
                    hasDocComment
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : isVisited
                      ? 'border-amber-300 ring-1 ring-amber-200'
                      : 'border-saathi-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                        {f.referralCode || f.patientSafeId}
                      </span>
                      <h4 className="font-bold text-xs text-saathi-navy mt-1">
                        {f.patientName} ({f.patientAge}y) • {f.villageName}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasDocComment
                          ? 'bg-emerald-100 text-emerald-800'
                          : isVisited
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {hasDocComment
                        ? dmt.reviewCompleteBadge
                        : isVisited
                        ? dmt.visitDonePendingReviewBadge
                        : dmt.visitPendingBadge}
                    </span>
                  </div>

                  {/* Doctor's original instruction */}
                  {f.doctorInitialAdvice && (
                    <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
                      <strong>{dmt.ashaAdviceLabel}</strong> &quot;{f.doctorInitialAdvice}&quot;
                    </p>
                  )}

                  {/* ASHA's Observation Notes */}
                  {f.ashaVisitNotes ? (
                    <div className="text-[11px] text-slate-800 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 space-y-1">
                      <span className="text-[10px] font-bold text-amber-900 block flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                        {dmt.ashaReportObservationsLabel}
                      </span>
                      <p className="italic font-medium">&quot;{f.ashaVisitNotes}&quot;</p>
                      <span className="text-[9px] text-gray-500 block">
                        {f.visitedAt ? new Date(f.visitedAt).toLocaleDateString() : 'Visited'}
                      </span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 italic">
                      {dmt.awaitingAshaVisit}
                    </p>
                  )}

                  {/* Doctor's Final Comment if present */}
                  {f.doctorPostFollowupComment && (
                    <div className="text-[10px] text-emerald-900 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <strong>{dmt.doctorFinalReviewLabel}</strong>{' '}
                      <span>&quot;{f.doctorPostFollowupComment}&quot;</span>
                      <span className="block text-[9px] text-emerald-700 mt-0.5">
                        {f.doctorName || doctorProfile.name} • Loop Closed ✓
                      </span>
                    </div>
                  )}

                  {/* Action to submit doctor review comment */}
                  {!hasDocComment && (
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setReviewingFollowup(f);
                          setDoctorCommentInput(
                            isVisited
                              ? (isEn
                                  ? 'Reviewed ASHA home report. Lesion resolving; continue prescribed medication.'
                                  : 'आशा गृह भेंट रिपोर्ट की समीक्षा की गई। स्थिति सामान्य है, दवा जारी रखें।')
                              : ''
                          );
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{dmt.addDoctorReviewBtn}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: EMERGENCY RED FLAGS */}
      {activeTab === 'emergencies' && (
        <div className="space-y-3">
          <div className="bg-rose-50 p-3 rounded-2xl border-2 border-rose-300 text-xs text-rose-950 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-black text-rose-900 text-sm">
                {dmt.emergencyTitle}
              </strong>
              <p className="text-[10px] text-rose-800 mt-0.5">
                {dmt.emergencyDesc}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {urgentRedReferrals.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-saathi-border text-center text-xs text-emerald-700 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-bold">
                  {dmt.noEmergencies}
                </p>
              </div>
            ) : (
              urgentRedReferrals.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-3.5 border-2 border-rose-300 shadow-sm space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {r.safeReferenceCode}
                      </span>
                      <h4 className="font-bold text-xs text-saathi-navy mt-1">
                        {r.patientSafeId} • {r.villageName}
                      </h4>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                      CRITICAL RED
                    </span>
                  </div>

                  <p className="text-[11px] text-rose-900 bg-rose-50 p-2 rounded-xl font-medium border border-rose-200">
                    {r.reasonSummary}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <a
                      href="tel:108"
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{dmt.callAmbulanceBtn}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setExaminingReferral(r);
                        setClinicalDiagnosisText('');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>{dmt.examineTreatBtn}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: EXAMINE REFERRAL & TAKE ACTION */}
      {examiningReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-4 shadow-2xl border border-indigo-200 max-h-[90vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2 text-indigo-700">
                <Stethoscope className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-saathi-navy">
                  {dmt.clinicalExamModalTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setExaminingReferral(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Case Dossier Header */}
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between font-mono font-bold text-indigo-700">
                <span>{examiningReferral.safeReferenceCode}</span>
                <span>{examiningReferral.pathway}</span>
              </div>
              <p className="font-bold text-saathi-navy">
                {examiningReferral.patientSafeId} • {examiningReferral.villageName}
              </p>
              <p className="text-[11px] text-slate-600">{examiningReferral.reasonSummary}</p>
            </div>

            {/* Cloud Browser Agent Hospital Pre-Booking Widget */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded-2xl border border-cyan-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-cyan-950 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-cyan-700" />
                  Cloud Agent: अस्पताल ओपीडी प्री-बुकिंग
                </span>
                {bookedToken ? (
                  <span className="bg-emerald-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    टोकन: {bookedToken.tokenNumber} ✓
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={bookingAgentRunning}
                    onClick={handleAutoPrebookOPD}
                    className="bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-xs transition-saathi flex items-center gap-1"
                  >
                    {bookingAgentRunning ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>एजेंट बुकिंग कर रहा है...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3 h-3" />
                        <span>⚡ ऑटो-प्रीबुक OPD टोकन</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {agentStepStatus && (
                <p className="text-[10px] font-mono text-cyan-900 bg-white/80 p-1.5 rounded-lg border border-cyan-100 truncate">
                  › {agentStepStatus}
                </p>
              )}

              {bookedToken && (
                <div className="text-[10px] text-emerald-950 bg-white p-2 rounded-xl border border-emerald-200 flex items-center justify-between font-sans">
                  <span>दिनांक: {bookedToken.appointmentDate} • {bookedToken.hospitalName}</span>
                  {bookedToken.sessionUrl && (
                    <a
                      href={bookedToken.sessionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-700 hover:underline flex items-center gap-0.5 font-bold"
                    >
                      लाइव सत्र देखें
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Choose Action: Direct Outcome OR Order Follow-up */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setOutcomeActionType('COMPLETE')}
                className={`p-2 rounded-xl border text-center transition-saathi ${
                  outcomeActionType === 'COMPLETE'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-saathi-border'
                }`}
              >
                {dmt.actionOptionComplete}
              </button>
              <button
                type="button"
                onClick={() => setOutcomeActionType('FOLLOWUP')}
                className={`p-2 rounded-xl border text-center transition-saathi ${
                  outcomeActionType === 'FOLLOWUP'
                    ? 'bg-saathi-teal text-white border-saathi-teal shadow-xs'
                    : 'bg-white text-slate-700 border-saathi-border'
                }`}
              >
                {dmt.actionOptionFollowup}
              </button>
            </div>

            {/* FORM 1: DIRECT OUTCOME */}
            {outcomeActionType === 'COMPLETE' && (
              <form onSubmit={handleSaveDirectOutcome} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-saathi-navy mb-1">
                    {dmt.diagnosisPrescriptionLabel}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={clinicalDiagnosisText}
                    onChange={(e) => setClinicalDiagnosisText(e.target.value)}
                    placeholder={dmt.diagnosisPlaceholder}
                    className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                {/* Jan Aushadhi Generic Savings Checker */}
                <div className="space-y-1.5">
                  <button
                    type="button"
                    disabled={janAushadhiLoading}
                    onClick={handleCheckJanAushadhi}
                    className="w-full text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-xl border border-emerald-300 transition-saathi flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {janAushadhiLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        <span>एजेंट जन औषधि पोर्टल जांच रहा है...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>💰 जन औषधि जेनेरिक दर तुलना (Check PMBJP Savings)</span>
                      </>
                    )}
                  </button>

                  {janAushadhiData && (
                    <div className="p-2.5 bg-emerald-50/90 rounded-xl border border-emerald-300 text-xs text-emerald-950 space-y-1 animate-fade-in font-sans">
                      <div className="flex justify-between font-bold text-[11px]">
                        <span>{janAushadhiData.genericName}</span>
                        <span className="text-emerald-700 font-black">
                          {janAushadhiData.savingsPercentage}% बचत (Save ₹{janAushadhiData.brandPriceInr - janAushadhiData.janAushadhiPriceInr})
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-800">
                        ब्रांडेड दर: ₹{janAushadhiData.brandPriceInr} • जन औषधि दर: ₹{janAushadhiData.janAushadhiPriceInr}
                      </p>
                      <p className="text-[9px] text-emerald-700">
                        {janAushadhiData.nearestKendra}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setExaminingReferral(null)}
                    className="flex-1 py-2.5 border border-gray-300 font-bold rounded-xl text-xs text-gray-700 hover:bg-gray-50"
                  >
                    {dmt.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-saathi flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{dmt.closeLoopBtn}</span>
                  </button>
                </div>
              </form>
            )}

            {/* FORM 2: ORDER ASHA FOLLOW-UP */}
            {outcomeActionType === 'FOLLOWUP' && (
              <form onSubmit={handleOrderAshaFollowup} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-saathi-navy mb-1">
                    {dmt.followupDaysLabel}
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                    {[3, 5, 7, 14].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFollowupDays(d)}
                        className={`py-1.5 rounded-lg border transition-saathi ${
                          followupDays === d
                            ? 'bg-saathi-teal text-white border-saathi-teal'
                            : 'bg-white text-slate-700 border-saathi-border'
                        }`}
                      >
                        {d} {dmt.daysUnit}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-saathi-navy mb-1">
                    {dmt.instructionsForAshaLabel}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={followupAdviceText}
                    onChange={(e) => setFollowupAdviceText(e.target.value)}
                    placeholder={dmt.instructionsPlaceholder}
                    className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-xs font-medium focus:bg-white focus:border-saathi-teal outline-none"
                  />
                </div>

                {/* Jan Aushadhi Generic Savings Checker */}
                <div className="space-y-1.5">
                  <button
                    type="button"
                    disabled={janAushadhiLoading}
                    onClick={handleCheckJanAushadhi}
                    className="w-full text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-xl border border-emerald-300 transition-saathi flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {janAushadhiLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                        <span>एजेंट जन औषधि पोर्टल जांच रहा है...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>💰 जन औषधि जेनेरिक दर तुलना (Check PMBJP Savings)</span>
                      </>
                    )}
                  </button>

                  {janAushadhiData && (
                    <div className="p-2.5 bg-emerald-50/90 rounded-xl border border-emerald-300 text-xs text-emerald-950 space-y-1 animate-fade-in font-sans">
                      <div className="flex justify-between font-bold text-[11px]">
                        <span>{janAushadhiData.genericName}</span>
                        <span className="text-emerald-700 font-black">
                          {janAushadhiData.savingsPercentage}% बचत (Save ₹{janAushadhiData.brandPriceInr - janAushadhiData.janAushadhiPriceInr})
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-800">
                        ब्रांडेड दर: ₹{janAushadhiData.brandPriceInr} • जन औषधि दर: ₹{janAushadhiData.janAushadhiPriceInr}
                      </p>
                      <p className="text-[9px] text-emerald-700">
                        {janAushadhiData.nearestKendra}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setExaminingReferral(null)}
                    className="flex-1 py-2.5 border border-gray-300 font-bold rounded-xl text-xs text-gray-700 hover:bg-gray-50"
                  >
                    {dmt.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-saathi-teal hover:bg-teal-600 text-white font-bold rounded-xl text-xs shadow-md transition-saathi flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>{dmt.sendToAshaBtn}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: SUBMIT DOCTOR COMMENT ON VISITED FOLLOW-UP */}
      {reviewingFollowup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-4 shadow-2xl border border-indigo-200 max-h-[90vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2 text-indigo-700">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-saathi-navy">
                  {dmt.postVisitModalTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewingFollowup(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ASHA Report Quote */}
            <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-xs space-y-1">
              <span className="text-[10px] font-bold text-amber-900 block">
                {dmt.ashaReportObservationsLabel}
              </span>
              <p className="italic text-slate-800">
                &quot;{reviewingFollowup.ashaVisitNotes || 'Home visit completed. Condition stable.'}&quot;
              </p>
            </div>

            <form onSubmit={handleSubmitFollowupComment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-saathi-navy mb-1">
                  {dmt.doctorFinalReviewDirectionLabel}
                </label>
                <textarea
                  rows={3}
                  required
                  value={doctorCommentInput}
                  onChange={(e) => setDoctorCommentInput(e.target.value)}
                  placeholder={dmt.postVisitCommentPlaceholder}
                  className="w-full p-2.5 bg-slate-50 border border-saathi-border rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-saathi-navy">
                <input
                  type="checkbox"
                  checked={closeReferralOnComment}
                  onChange={(e) => setCloseReferralOnComment(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span>{dmt.closeReferralCheckboxLabel}</span>
              </label>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setReviewingFollowup(null)}
                  className="flex-1 py-2.5 border border-gray-300 font-bold rounded-xl text-xs text-gray-700 hover:bg-gray-50"
                >
                  {dmt.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-saathi flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{dmt.saveReviewBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
