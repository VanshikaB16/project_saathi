import React, { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  GitPullRequest,
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CloudOff,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { MapVisualization } from '../../components/MapVisualization';
import { offlineStore, StoredPatient, StoredReferral, StoredFollowup } from '../../services/offlineStore';

interface OverviewPageProps {
  onNavigateTab: (tab: any) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigateTab }) => {
  const [patients, setPatients] = useState<StoredPatient[]>(() => offlineStore.getPatients());
  const [referrals, setReferrals] = useState<StoredReferral[]>(() => offlineStore.getReferrals());
  const [followups, setFollowups] = useState<StoredFollowup[]>(() => offlineStore.getFollowups());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() => offlineStore.getPendingSyncCount());
  const [screeningsCount, setScreeningsCount] = useState<number>(() => offlineStore.getScreeningsCount());
  const [qualityFailuresCount, setQualityFailuresCount] = useState<number>(() => offlineStore.getQualityFailuresCount());

  useEffect(() => {
    const update = () => {
      setPatients([...offlineStore.getPatients()]);
      setReferrals([...offlineStore.getReferrals()]);
      setFollowups([...offlineStore.getFollowups()]);
      setPendingSyncCount(offlineStore.getPendingSyncCount());
      setScreeningsCount(offlineStore.getScreeningsCount());
      setQualityFailuresCount(offlineStore.getQualityFailuresCount());
    };

    update();
    const unsubscribe = offlineStore.subscribe(update);
    return () => unsubscribe();
  }, []);

  const openReferrals = referrals.filter((r) => r.status !== 'COMPLETED');
  const openReferralsCount = openReferrals.length;

  const completedReferrals = referrals.filter((r) => r.status === 'COMPLETED');
  const completedReferralsCount = completedReferrals.length;

  const confirmedAppointments = referrals.filter((r) =>
    ['APPOINTMENT_SCHEDULED', 'ATTENDED'].includes(r.status)
  );
  const confirmedAppointmentsCount = confirmedAppointments.length;

  const pendingFollowups = followups.filter((f) => f.status === 'PENDING');
  const pendingFollowupsCount = pendingFollowups.length;

  const uniquePatientsCount = patients.length;
  const femalePatients = patients.filter((p) => p.gender === 'FEMALE').length;
  const femalePercent = uniquePatientsCount > 0 ? Math.round((femalePatients / uniquePatientsCount) * 100) : 60;
  const malePercent = 100 - femalePercent;

  const villagesSet = new Set(
    patients.map((p) => p.villageName).concat(referrals.map((r) => r.villageName))
  );
  const activeVillagesCount = Math.max(1, villagesSet.size);

  const totalReferrals = openReferralsCount + completedReferralsCount;
  const followThroughRate =
    totalReferrals > 0 ? ((completedReferralsCount / totalReferrals) * 100).toFixed(1) : '100.0';

  return (
    <div className="space-y-6">
      {/* Page Title & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-saathi-navy">
              पटियाला जिला स्वास्थ्य अवलोकन (District Health Overview)
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              लाइव सिंक (Real-time Live Data)
            </span>
          </div>
          <p className="text-xs text-saathi-textSecondary mt-1">
            रिपोर्टिंग अवधि: <strong>October 2026</strong> • स्रोत: प्राथमिक स्वास्थ्य केंद्र (PHC) एवं आशा नेटवर्क
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-saathi ${
              parseFloat(followThroughRate) >= 80
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-saathi-paleMint text-saathi-teal border-saathi-teal/30'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Follow-Through Rate: {followThroughRate}%</span>
          </span>
        </div>
      </div>

      {/* 8 Primary Operational Metrics Grid (Real-Time Synced) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => onNavigateTab('villages')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="कुल स्क्रीनिंग सत्र (Screenings)"
            value={screeningsCount}
            subtitle={`${activeVillagesCount} उप-केन्द्रों में कुल सत्र`}
            icon={Activity}
            variant="navy"
            badge={screeningsCount > 0 ? 'सक्रिय फील्ड स्क्रीनिंग' : 'कोई नया सत्र नहीं'}
          />
        </div>

        <div onClick={() => onNavigateTab('villages')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="जाँच किए गए अनोखे मरीज़ (Unique Patients)"
            value={uniquePatientsCount}
            subtitle="समुदाय आधारित रजिस्ट्री"
            icon={Users}
            variant="teal"
            badge={`${femalePercent}% महिला, ${malePercent}% पुरुष`}
          />
        </div>

        <div onClick={() => onNavigateTab('referrals')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="खुले रेफरल (Open Referrals)"
            value={openReferralsCount}
            subtitle={openReferralsCount === 0 ? 'सभी रेफरल परिणाम दर्ज (All Closed) ✓' : 'अस्पताल परिणाम की प्रतीक्षा में'}
            icon={GitPullRequest}
            variant={openReferralsCount === 0 ? 'green' : 'amber'}
            badge={openReferralsCount === 0 ? 'सभी लूप बंद हैं ✓' : `${openReferralsCount} सक्रिय लूप`}
          />
        </div>

        <div onClick={() => onNavigateTab('referrals')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="पुष्ट अपॉइंटमेंट (Appointments)"
            value={confirmedAppointmentsCount}
            subtitle="सीएचसी एवं जिला अस्पताल"
            icon={CalendarCheck}
            variant="teal"
            badge={confirmedAppointmentsCount > 0 ? `${confirmedAppointmentsCount} अपॉइंटमेंट सक्रिय` : 'कोई अपॉइंटमेंट लंबित नहीं'}
          />
        </div>

        <div onClick={() => onNavigateTab('referrals')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="पूर्ण किए गए रेफरल (Completed Loop)"
            value={completedReferralsCount}
            subtitle="डॉक्टर का क्लिनिकल परिणाम दर्ज"
            icon={CheckCircle2}
            variant="green"
            badge={completedReferralsCount > 0 ? `${completedReferralsCount} सत्यापित रिकॉर्ड` : '0 पूर्ण'}
          />
        </div>

        <div onClick={() => onNavigateTab('referrals')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="अतिदेय / लंबित फॉलो-अप (Pending Rechecks)"
            value={pendingFollowupsCount}
            subtitle={pendingFollowupsCount === 0 ? 'सभी निर्धारित फॉलो-अप पूर्ण ✓' : 'आशा कार्यकर्ता द्वारा गृह भेंट बाकी'}
            icon={Clock}
            variant={pendingFollowupsCount === 0 ? 'green' : 'red'}
            badge={pendingFollowupsCount === 0 ? 'सभी कार्य पूर्ण ✓' : `${pendingFollowupsCount} पुनः जाँच बाकी`}
          />
        </div>

        <div onClick={() => onNavigateTab('models')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="मॉडल गुणवत्ता विफलताएं (Quality Rejections)"
            value={qualityFailuresCount}
            subtitle="धुंधली फोटो / खराब रोशनी"
            icon={AlertTriangle}
            variant="amber"
            badge={qualityFailuresCount === 0 ? '100% स्पष्ट फोटो दर' : `${qualityFailuresCount} गुणवत्ता अस्वीकृत`}
          />
        </div>

        <div onClick={() => onNavigateTab('settings')} className="cursor-pointer transition-transform hover:-translate-y-0.5">
          <StatCard
            title="ऑफ़लाइन सिंक प्रतीक्षा (Sync Backlog)"
            value={pendingSyncCount}
            subtitle={pendingSyncCount === 0 ? 'क्लाउड से पूर्णतः सिंक ✓' : 'नेटवर्क कनेक्शन मिलते ही सिंक होगा'}
            icon={CloudOff}
            variant={pendingSyncCount === 0 ? 'green' : 'navy'}
            badge={pendingSyncCount === 0 ? 'शून्य पेंडिंग सिंक ✓' : `${pendingSyncCount} सिंक प्रतीक्षारत`}
          />
        </div>
      </div>

      {/* Village GIS Operational Map Component */}
      <MapVisualization onNavigateTab={onNavigateTab} />

      {/* Follow-Through Loop Action Banner */}
      <div className="bg-gradient-to-r from-saathi-navy to-saathi-deepNavy text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-bold">फॉलो-थ्रू लूप सिद्धांत (The Follow-Through Principle)</h4>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            स्क्रीनिंग केवल शुरुआत है। असली लक्ष्य यह सुनिश्चित करना है कि संभावित लक्षण वाले प्रत्येक ग्रामीण मरीज़ को समय पर विशेषज्ञ परामर्श और उपचार मिले, और परिणाम दर्ज होने तक केस खुला रहे।
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('referrals')}
          className="shrink-0 px-5 py-2.5 bg-saathi-teal hover:bg-teal-600 active:scale-95 font-bold rounded-xl text-sm flex items-center gap-2 transition-saathi shadow-lg"
        >
          <span>सक्रिय रेफरल ट्रैक करें</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
