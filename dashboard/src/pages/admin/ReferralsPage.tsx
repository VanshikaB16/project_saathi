import React, { useState } from 'react';
import {
  GitPullRequest,
  Search,
  CheckCircle,
  Clock,
  Building2,
  Phone,
  FileText,
  Stethoscope,
  Calendar,
  UserCheck,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  Check,
} from 'lucide-react';
import { offlineStore, StoredReferral, StoredFollowup } from '../../services/offlineStore';

export const ReferralsPage: React.FC = () => {
  const [referrals, setReferrals] = useState<StoredReferral[]>(() => offlineStore.getReferrals());
  const [followups, setFollowups] = useState<StoredFollowup[]>(() => offlineStore.getFollowups());
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Direct Outcome Modal
  const [selectedReferral, setSelectedReferral] = useState<StoredReferral | null>(null);
  const [outcomeText, setOutcomeText] = useState<string>('');

  // Doctor Request Follow-up Modal
  const [followupOrderReferral, setFollowupOrderReferral] = useState<StoredReferral | null>(null);
  const [orderDays, setOrderDays] = useState<number>(5);
  const [orderAdvice, setOrderAdvice] = useState<string>('');
  const [orderDoctorName, setOrderDoctorName] = useState<string>('डॉ. राजीव वर्मा (Dr. Rajiv Verma, MO CHC)');

  // Doctor Review Visited Follow-up Modal
  const [reviewingFollowup, setReviewingFollowup] = useState<StoredFollowup | null>(null);
  const [doctorCommentText, setDoctorCommentText] = useState<string>('');
  const [reviewDoctorName, setReviewDoctorName] = useState<string>('डॉ. राजीव वर्मा (Dr. Rajiv Verma, MO CHC)');
  const [closeReferralOnComment, setCloseReferralOnComment] = useState<boolean>(true);

  const refreshData = () => {
    setReferrals([...offlineStore.getReferrals()]);
    setFollowups([...offlineStore.getFollowups()]);
  };

  const filteredReferrals = referrals.filter((r) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'OPEN') return ['REFERRED', 'APPOINTMENT_SCHEDULED', 'ATTENDED'].includes(r.status);
    if (filterStatus === 'COMPLETED') return r.status === 'COMPLETED';
    return r.status === filterStatus;
  });

  const handleCloseLoop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReferral || !outcomeText.trim()) return;

    offlineStore.updateReferralOutcome(selectedReferral.id, outcomeText.trim(), 'COMPLETED');
    refreshData();
    setSelectedReferral(null);
    setOutcomeText('');
  };

  const handleOrderFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupOrderReferral || !orderAdvice.trim()) return;

    offlineStore.requestReferralFollowup(
      followupOrderReferral.id,
      orderDays,
      orderAdvice.trim(),
      orderDoctorName.trim()
    );
    refreshData();
    setFollowupOrderReferral(null);
    setOrderAdvice('');
  };

  const handleDoctorSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingFollowup || !doctorCommentText.trim()) return;

    offlineStore.addDoctorFollowupComment(
      reviewingFollowup.id,
      doctorCommentText.trim(),
      reviewDoctorName.trim(),
      closeReferralOnComment
    );
    refreshData();
    setReviewingFollowup(null);
    setDoctorCommentText('');
  };

  const visitedFollowups = followups.filter((f) => f.status === 'VISITED');
  const pendingFollowups = followups.filter((f) => f.status === 'PENDING');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-black text-saathi-navy flex items-center gap-2">
            <GitPullRequest className="w-6 h-6 text-saathi-teal" />
            <span>रेफरल एवं फॉलो-अप समन्वय (Doctor & ASHA Closed-Loop)</span>
          </h2>
          <p className="text-xs text-saathi-textSecondary mt-1">
            डॉक्टर द्वारा फॉलो-अप आदेश, आशा गृह भेंट रिपोर्ट, एवं डॉक्टर की अग्रिम समीक्षा का संपूर्ण क्लिनिकल लूप।
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-saathi-border text-xs">
          {['ALL', 'OPEN', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-saathi ${
                filterStatus === status
                  ? 'bg-saathi-teal text-white shadow-sm'
                  : 'text-saathi-textSecondary hover:text-saathi-navy'
              }`}
            >
              {status === 'ALL' ? 'सभी रेफरल' : status === 'OPEN' ? 'सक्रिय खुले (Open)' : 'पूर्ण (Completed)'}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Action Banner if any ASHA Follow-up is awaiting Doctor Review */}
      {visitedFollowups.some((f) => !f.doctorPostFollowupComment) && (
        <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-start justify-between gap-3 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-bold text-amber-900 block">
                कार्रवाई आवश्यक: आशा गृह भेंट पूर्ण — डॉक्टर की अग्रिम क्लिनिकल समीक्षा प्रतीक्षित
              </strong>
              <p className="text-xs text-amber-800 mt-0.5">
                आशा कार्यकर्ता ने गृह भेंट कर मरीज़ की स्थिति दर्ज कर दी है। कृपया क्लिनिकल समीक्षा व अग्रिम निर्देश दर्ज करें।
              </p>
            </div>
          </div>
          <a
            href="#doctor-review-section"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shrink-0 shadow-xs transition-saathi"
          >
            समीक्षा करें ↓
          </a>
        </div>
      )}

      {/* SECTION 1: Referrals Table */}
      <div className="bg-white rounded-2xl border border-saathi-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-saathi-border bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-saathi-navy text-sm">अस्पताल रेफरल ट्रैकिंग (Hospital Referrals Queue)</h3>
            <span className="text-xs text-gray-500">कुल {filteredReferrals.length} रेफरल रिकॉर्ड्स</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-saathi-paleMint/60 text-saathi-navy text-xs uppercase font-bold border-b border-saathi-border">
              <tr>
                <th className="px-6 py-4">रेफरल कोड (Ref Code)</th>
                <th className="px-6 py-4">मरीज़ पहचान (Safe ID)</th>
                <th className="px-6 py-4">स्क्रीनिंग फनल (Pathway)</th>
                <th className="px-6 py-4">फॉलो-अप स्थिति (Follow-up Status)</th>
                <th className="px-6 py-4">स्थिति (Status)</th>
                <th className="px-6 py-4 text-right">डॉक्टर कार्यवाही (Doctor Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-saathi-border">
              {filteredReferrals.map((r) => {
                const isClosed = r.status === 'COMPLETED';
                const linkedFoll = followups.find((f) => f.referralCode === r.safeReferenceCode);

                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition-saathi">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-saathi-teal block">{r.safeReferenceCode}</span>
                      <span className="text-[10px] text-gray-400 block">{r.facilityName}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-saathi-navy">
                      {r.patientSafeId}
                      <span className="block text-xs font-normal text-saathi-textSecondary">{r.villageName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-saathi-navy block">{r.pathway}</span>
                      <p className="text-xs text-saathi-textMuted truncate max-w-xs">{r.reasonSummary}</p>
                    </td>
                    <td className="px-6 py-4">
                      {linkedFoll ? (
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              linkedFoll.doctorPostFollowupComment
                                ? 'bg-emerald-100 text-emerald-800'
                                : linkedFoll.status === 'VISITED'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {linkedFoll.doctorPostFollowupComment
                              ? 'समीक्षा पूर्ण ✓'
                              : linkedFoll.status === 'VISITED'
                              ? 'आशा भेंट पूर्ण (समीक्षा बाकी)'
                              : `${linkedFoll.dueLabel} (आशा भेंट बाकी)`}
                          </span>
                          {linkedFoll.doctorPostFollowupComment && (
                            <p className="text-[10px] text-emerald-700 italic truncate max-w-xs">
                              डॉक्टर: {linkedFoll.doctorPostFollowupComment}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">फॉलो-अप आदेश नहीं</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                          isClosed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isClosed ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {r.status}
                      </span>
                      {r.outcomeSummary && (
                        <p className="text-[11px] text-emerald-700 mt-1 italic truncate max-w-xs">
                          {r.outcomeSummary}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!isClosed ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setFollowupOrderReferral(r);
                              setOrderAdvice(
                                r.pathway.includes('त्वचा')
                                  ? '5 दिन बाद घाव के सूखने एवं लाली की स्थिति पुनः जाँचें। दवा का असर देखें।'
                                  : '7 दिन बाद लक्षणों व दवा के प्रभाव की गृह भेंट करें।'
                              );
                            }}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold rounded-lg text-xs transition-saathi flex items-center gap-1"
                            title="आशा कार्यकर्ता के लिए फॉलो-अप गृह भेंट आदेशित करें"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>फॉलो-अप आदेश</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReferral(r);
                              setOutcomeText('');
                            }}
                            className="px-3 py-1.5 bg-saathi-teal hover:bg-teal-600 text-white font-bold rounded-lg text-xs transition-saathi shadow-sm"
                          >
                            परिणाम दर्ज करें
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                          लूप पूर्ण ✓
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Doctor Follow-up Reviews Command Center */}
      <div id="doctor-review-section" className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-saathi-navy flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-indigo-600" />
              <span>आशा फॉलो-अप समीक्षा एवं डॉक्टर अग्रिम क्लिनिकल टिप्पणी</span>
            </h3>
            <p className="text-xs text-saathi-textSecondary mt-0.5">
              जब आशा कार्यकर्ता गृह भेंट पूर्ण कर रिपोर्ट दर्ज करती है, तो डॉक्टर यहाँ अपनी अग्रिम क्लिनिकल समीक्षा दर्ज करता है। यह टिप्पणी तुरंत आशा कार्यकर्ता के मोबाइल पर दिखती है।
            </p>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-xl border border-indigo-200">
            {visitedFollowups.length} भेंट सम्पन्न • {pendingFollowups.length} आगामी
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {followups.map((f) => {
            const isVisited = f.status === 'VISITED';
            const hasDoctorComment = !!f.doctorPostFollowupComment;

            return (
              <div
                key={f.id}
                className={`p-4 bg-white rounded-2xl border ${
                  hasDoctorComment
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isVisited
                    ? 'border-indigo-300 ring-2 ring-indigo-200'
                    : 'border-saathi-border'
                } shadow-sm space-y-3 transition-saathi`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-saathi-border pb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-saathi-teal block">
                      {f.referralCode || 'SAA-REF-DIRECT'}
                    </span>
                    <strong className="text-sm text-saathi-navy">
                      {f.patientName} (उम्र {f.patientAge})
                    </strong>
                    <span className="text-xs text-gray-500 block">
                      {f.villageName} • {f.taskTitle}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                      hasDoctorComment
                        ? 'bg-emerald-100 text-emerald-800'
                        : isVisited
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {hasDoctorComment ? 'समीक्षा पूर्ण ✓' : isVisited ? 'गृह भेंट पूर्ण' : f.dueLabel}
                  </span>
                </div>

                {/* 1. Doctor Initial Order */}
                {f.doctorInitialAdvice && (
                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-0.5 border border-slate-200">
                    <span className="font-bold text-gray-700 block text-[11px]">
                      1. डॉक्टर का प्रारंभिक निर्देश ({f.doctorName || 'Dr. Verma'}):
                    </span>
                    <p className="text-gray-600 italic">&quot;{f.doctorInitialAdvice}&quot;</p>
                  </div>
                )}

                {/* 2. ASHA Home Visit Observations */}
                <div
                  className={`p-2.5 rounded-xl text-xs space-y-0.5 border ${
                    isVisited
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  <span className="font-bold block text-[11px] flex items-center justify-between">
                    <span>2. आशा कार्यकर्ता गृह भेंट रिपोर्ट:</span>
                    {isVisited && (
                      <span className="text-[10px] text-blue-700">
                        भेंट पूर्ण: {new Date(f.visitedAt || f.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </span>
                  <p className="italic">
                    {isVisited
                      ? f.ashaVisitNotes || 'गृह भेंट पूर्ण की गई। मरीज़ की स्थिति सामान्य पाई गई।'
                      : 'आशा कार्यकर्ता द्वारा गृह भेंट प्रतीक्षित है...'}
                  </p>
                </div>

                {/* 3. Doctor Post-Followup Review & Comment */}
                {hasDoctorComment ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                        <Stethoscope className="w-4 h-4 text-emerald-700" />
                        <span>3. डॉक्टर की अग्रिम क्लिनिकल टिप्पणी (Doctor Review):</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {new Date(f.doctorCommentedAt || f.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-emerald-950 font-medium italic">&quot;{f.doctorPostFollowupComment}&quot;</p>
                    <span className="text-[11px] text-emerald-700 font-bold block pt-1">
                      {f.doctorName || 'डॉ. राजीव वर्मा (Dr. Rajiv Verma, MO CHC)'}
                    </span>
                  </div>
                ) : isVisited ? (
                  /* Action to Add Doctor Review */
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setReviewingFollowup(f);
                        setDoctorCommentText(
                          'आशा की रिपोर्ट देखी गई। घाव में सुधार संतोषजनक है। एंटीबायोटिक बंद करें, सामान्य ऑइंटमेंट 3 दिन जारी रखें। केस डिस्चार्ज।'
                        );
                      }}
                      className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-saathi flex items-center justify-center gap-2"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>डॉक्टर की अग्रिम क्लिनिकल टिप्पणी दर्ज करें (Add Doctor Comment)</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 italic text-center py-1">
                    आशा कार्यकर्ता द्वारा भेंट पूर्ण होने के बाद डॉक्टर समीक्षा विकल्प उपलब्ध होगा।
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: Direct Outcome Recording Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-saathi-border space-y-4">
            <h3 className="text-lg font-bold text-saathi-navy flex items-center gap-2">
              <FileText className="w-5 h-5 text-saathi-teal" />
              क्लिनिकल परिणाम दर्ज करें (Record Outcome & Close Loop)
            </h3>
            <p className="text-xs text-saathi-textSecondary">
              रेफरल कोड: <strong>{selectedReferral.safeReferenceCode}</strong> • मरीज़:{' '}
              <strong>{selectedReferral.patientSafeId}</strong>
            </p>

            <form onSubmit={handleCloseLoop} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-saathi-navy mb-1">
                  डॉक्टर का परामर्श एवं जांच परिणाम (Medical Officer Findings) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={outcomeText}
                  onChange={(e) => setOutcomeText(e.target.value)}
                  placeholder="उदा. त्वचा रोग विशेषज्ञ ने बायोप्सी की। सौम्य सिस्ट की पुष्टि हुई। 14 दिन की दवा देकर छुट्टी दी गई।"
                  className="w-full text-sm p-3 border border-saathi-border rounded-xl focus:ring-2 focus:ring-saathi-teal outline-none"
                />
              </div>

              <div className="p-3 bg-saathi-paleMint rounded-xl text-xs text-saathi-navy">
                सूचना: यह विवरण दर्ज करने के बाद यह रेफरल आधिकारिक तौर पर &quot;COMPLETED&quot; माना जाएगा।
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReferral(null)}
                  className="px-4 py-2 border border-gray-300 font-semibold rounded-xl text-xs text-gray-700"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-saathi-teal hover:bg-teal-600 text-white font-bold rounded-xl text-xs shadow-md transition-saathi"
                >
                  लूप पूर्ण करें (Close Loop)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Request ASHA Follow-up Recheck Modal */}
      {followupOrderReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-saathi-border space-y-4">
            <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              आशा कार्यकर्ता के लिए पुनः जाँच (Follow-up) आदेश जारी करें
            </h3>
            <p className="text-xs text-saathi-textSecondary">
              रेफरल कोड: <strong>{followupOrderReferral.safeReferenceCode}</strong> • मरीज़:{' '}
              <strong>{followupOrderReferral.patientSafeId}</strong> ({followupOrderReferral.villageName})
            </p>

            <form onSubmit={handleOrderFollowup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-saathi-navy mb-1">
                  फॉलो-अप समयसीमा (Days until Recheck)
                </label>
                <select
                  value={orderDays}
                  onChange={(e) => setOrderDays(parseInt(e.target.value, 10))}
                  className="w-full text-xs p-2.5 border border-saathi-border rounded-xl bg-slate-50 outline-none"
                >
                  <option value={3}>3 दिन बाद (After 3 days)</option>
                  <option value={5}>5 दिन बाद (After 5 days)</option>
                  <option value={7}>7 दिन बाद (After 7 days)</option>
                  <option value={14}>14 दिन बाद (After 14 days)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-saathi-navy mb-1">
                  डॉक्टर का क्लिनिकल निर्देश (Instructions for ASHA Worker) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={orderAdvice}
                  onChange={(e) => setOrderAdvice(e.target.value)}
                  placeholder="उदा. 5 दिन बाद घाव के भरने और लाली की स्थिति पुनः जाँचें। दवा का असर देखें।"
                  className="w-full text-sm p-3 border border-saathi-border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-saathi-navy mb-1">
                  चिकित्सक का नाम (Medical Officer Name)
                </label>
                <input
                  type="text"
                  value={orderDoctorName}
                  onChange={(e) => setOrderDoctorName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-saathi-border rounded-xl bg-slate-50 outline-none"
                />
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl text-xs text-indigo-900 border border-indigo-200">
                सूचना: यह आदेश तुरंत आशा कार्यकर्ता के मोबाइल ऐप में &quot;पुनः जाँच और फॉलो-अप&quot; सूची में जुड़ जाएगा।
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFollowupOrderReferral(null)}
                  className="px-4 py-2 border border-gray-300 font-semibold rounded-xl text-xs text-gray-700"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-saathi"
                >
                  फॉलो-अप आदेश जारी करें ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Doctor Post-Followup Review Modal */}
      {reviewingFollowup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-saathi-border space-y-4">
            <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-indigo-600" />
              डॉक्टर की अग्रिम क्लिनिकल टिप्पणी दर्ज करें
            </h3>
            <p className="text-xs text-saathi-textSecondary">
              मरीज़: <strong>{reviewingFollowup.patientName}</strong> • रेफरल कोड:{' '}
              <strong>{reviewingFollowup.referralCode || 'N/A'}</strong>
            </p>

            {/* ASHA Recorded Notes preview */}
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
              <strong className="block font-bold">आशा कार्यकर्ता की गृह भेंट रिपोर्ट:</strong>
              <p className="italic">
                &quot;{reviewingFollowup.ashaVisitNotes || 'गृह भेंट पूर्ण की गई। मरीज़ की स्थिति सामान्य पाई गई।'}&quot;
              </p>
            </div>

            <form onSubmit={handleDoctorSubmitComment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-saathi-navy mb-1">
                  डॉक्टर की अग्रिम क्लिनिकल समीक्षा व परामर्श (Doctor Review & Advice) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={doctorCommentText}
                  onChange={(e) => setDoctorCommentText(e.target.value)}
                  placeholder="उदा. आशा की रिपोर्ट देखी गई। घाव में सुधार संतोषजनक है। एंटीबायोटिक बंद करें, सामान्य ऑइंटमेंट 3 दिन जारी रखें। केस डिस्चार्ज।"
                  className="w-full text-sm p-3 border border-saathi-border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-saathi-navy mb-1">
                  चिकित्सक का नाम (Medical Officer Name)
                </label>
                <input
                  type="text"
                  value={reviewDoctorName}
                  onChange={(e) => setReviewDoctorName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-saathi-border rounded-xl bg-slate-50 outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-saathi-navy cursor-pointer">
                <input
                  type="checkbox"
                  checked={closeReferralOnComment}
                  onChange={(e) => setCloseReferralOnComment(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>इस टिप्पणी के साथ अस्पताल रेफरल लूप को पूर्ण (COMPLETED) करें</span>
              </label>

              <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 border border-emerald-200">
                सूचना: यह टिप्पणी तुरंत आशा कार्यकर्ता के मोबाइल स्क्रीन पर चमकेगी और मरीज़ टाइमलाइन में जुड़ जाएगी।
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingFollowup(null)}
                  className="px-4 py-2 border border-gray-300 font-semibold rounded-xl text-xs text-gray-700"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-saathi flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>टिप्पणी सुरक्षित करें एवं आशा को भेजें</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
