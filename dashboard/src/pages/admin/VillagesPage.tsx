import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Shield,
  Search,
  Filter,
  Users,
  Activity,
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  X,
  Building2,
  Tent,
  ExternalLink,
  Info,
} from 'lucide-react';
import { VillageAggregate } from '../../services/mockData';
import { offlineStore } from '../../services/offlineStore';

interface VillagesPageProps {
  onNavigateTab?: (tab: any) => void;
}

export const VillagesPage: React.FC<VillagesPageProps> = ({ onNavigateTab }) => {
  const [villages, setVillages] = useState<VillageAggregate[]>(() => offlineStore.getLiveVillageAggregates());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'GAPS' | 'HIGH_DEMAND' | 'SUPPRESSED'>('ALL');
  const [selectedVillage, setSelectedVillage] = useState<VillageAggregate | null>(null);

  useEffect(() => {
    const update = () => {
      const live = offlineStore.getLiveVillageAggregates();
      setVillages(live);
      // Keep selected village in sync if open
      setSelectedVillage((prev) => (prev ? live.find((v) => v.villageName === prev.villageName) || null : null));
    };
    update();
    const unsubscribe = offlineStore.subscribe(update);
    return () => unsubscribe();
  }, []);

  // Filtered village list
  const filteredVillages = useMemo(() => {
    return villages.filter((v) => {
      // Search matching (English or Hindi name)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        v.villageName.toLowerCase().includes(q) ||
        (v.hindiName && v.hindiName.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Status filters
      if (activeFilter === 'GAPS') {
        return v.serviceGaps !== 'Adequate';
      }
      if (activeFilter === 'HIGH_DEMAND') {
        const demand = parseInt(v.referralDemand, 10);
        return !isNaN(demand) && demand >= 5;
      }
      if (activeFilter === 'SUPPRESSED') {
        return v.isCellSuppressed;
      }
      return true;
    });
  }, [villages, searchQuery, activeFilter]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalVillages = villages.length;
    let totalSessions = 0;
    let totalReferrals = 0;
    let totalCompleted = 0;
    let serviceGapsCount = 0;

    villages.forEach((v) => {
      totalSessions += v.screeningActivity;
      const ref = parseInt(v.referralDemand, 10);
      if (!isNaN(ref)) totalReferrals += ref;
      const foll = parseInt(v.followupCompleted, 10);
      if (!isNaN(foll)) totalCompleted += foll;
      if (v.serviceGaps !== 'Adequate') serviceGapsCount += 1;
    });

    return { totalVillages, totalSessions, totalReferrals, totalCompleted, serviceGapsCount };
  }, [villages]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-saathi-navy">गाँव स्तरीय परिचालन विश्लेषण</h2>
            <span className="text-xs bg-saathi-paleMint text-saathi-teal px-2.5 py-0.5 rounded-full font-bold border border-saathi-softMint">
              Villages Overview
            </span>
          </div>
          <p className="text-xs text-saathi-textSecondary mt-1">
            पटियाला जिले के {villages.length} एकीकृत ग्रामों में वास्तविक समय स्क्रीनिंग कवरेज, रेफरल मांग एवं सेवा अंतराल
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-800 border border-amber-300 px-3.5 py-2 rounded-xl font-medium shadow-2xs">
          <Shield className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>DPDPA 2023 अनुपालन:</strong> 5 से कम संख्या वाले मामलों में पहचान छिपाने हेतु मान सप्रैस (&lt; 5) किया गया है।
          </span>
        </div>
      </div>

      {/* Top Summary Metrics KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-saathi-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-saathi-textSecondary">सक्रिय ग्राम (Villages)</span>
            <div className="p-2 bg-emerald-50 text-saathi-teal rounded-xl">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-saathi-navy">{summaryMetrics.totalVillages}</span>
            <span className="text-xs text-emerald-600 font-semibold">100% कवरेज</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-saathi-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-saathi-textSecondary">कुल सत्र (Sessions)</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-saathi-navy">{summaryMetrics.totalSessions}</span>
            <span className="text-xs text-saathi-textMuted">सत्र संपन्न</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-saathi-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-saathi-textSecondary">रेफरल मांग (Referrals)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <GitPullRequest className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-saathi-amber">{summaryMetrics.totalReferrals}+</span>
            <span className="text-xs text-saathi-textMuted">अस्पताल रेफर</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-saathi-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-saathi-textSecondary">सेवा अंतराल (Service Gaps)</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-700">{summaryMetrics.serviceGapsCount}</span>
            <span className="text-xs text-purple-600 font-medium">ध्यान देने योग्य</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-saathi-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-saathi-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="गाँव खोजें (e.g. Rampur, मेरठ, Kalyanpur, Lolpur)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-saathi-border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-saathi-teal focus:bg-white transition-saathi"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl transition-saathi whitespace-nowrap ${
              activeFilter === 'ALL'
                ? 'bg-saathi-navy text-white shadow-xs'
                : 'bg-slate-100 text-saathi-textSecondary hover:bg-slate-200'
            }`}
          >
            सभी गाँव ({villages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('GAPS')}
            className={`px-3 py-1.5 rounded-xl transition-saathi whitespace-nowrap ${
              activeFilter === 'GAPS'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-slate-100 text-saathi-textSecondary hover:bg-slate-200'
            }`}
          >
            सेवा अंतराल ({summaryMetrics.serviceGapsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('HIGH_DEMAND')}
            className={`px-3 py-1.5 rounded-xl transition-saathi whitespace-nowrap ${
              activeFilter === 'HIGH_DEMAND'
                ? 'bg-saathi-teal text-white shadow-xs'
                : 'bg-slate-100 text-saathi-textSecondary hover:bg-slate-200'
            }`}
          >
            उच्च मांग (≥ 5)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('SUPPRESSED')}
            className={`px-3 py-1.5 rounded-xl transition-saathi whitespace-nowrap ${
              activeFilter === 'SUPPRESSED'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-saathi-textSecondary hover:bg-slate-200'
            }`}
          >
            गोपनीय संरक्षित (&lt; 5)
          </button>
        </div>
      </div>

      {/* Villages Table in Dedicated Scrollable Container (Solves Header Clipping On Scroll) */}
      <div className="bg-white rounded-2xl border border-saathi-border shadow-xs overflow-hidden">
        {/* Scrollable Container with max height and internal vertical scroll */}
        <div className="overflow-x-auto overflow-y-auto max-h-[580px] scroll-smooth">
          <table className="w-full text-left text-sm border-collapse">
            {/* Sticky Table Header - Never clipped under top nav */}
            <thead className="sticky top-0 z-20 bg-emerald-50 text-saathi-navy text-xs uppercase font-bold border-b border-saathi-border shadow-2xs">
              <tr>
                <th className="px-6 py-4 bg-emerald-50 font-black">गाँव का नाम (Village)</th>
                <th className="px-6 py-4 bg-emerald-50 font-black">स्क्रीनिंग गतिविधि (Sessions)</th>
                <th className="px-6 py-4 bg-emerald-50 font-black">रेफरल मांग (Referral Demand)</th>
                <th className="px-6 py-4 bg-emerald-50 font-black">फॉलो-अप पूर्ण (Completed)</th>
                <th className="px-6 py-4 bg-emerald-50 font-black">पहचाना गया सेवा अंतराल (Service Gap)</th>
                <th className="px-6 py-4 text-right bg-emerald-50 font-black">स्थिति एवं विवरण (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-saathi-border">
              {filteredVillages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-saathi-textMuted">
                    <p className="font-semibold text-base text-saathi-navy">कोई गाँव नहीं मिला</p>
                    <p className="text-xs mt-1">
                      खोज फ़िल्टर &quot;{searchQuery}&quot; के लिए कोई रिकॉर्ड उपलब्ध नहीं है।
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('ALL');
                      }}
                      className="mt-3 text-xs text-saathi-teal font-bold hover:underline"
                    >
                      फ़िल्टर रीसेट करें (Reset Filters)
                    </button>
                  </td>
                </tr>
              ) : (
                filteredVillages.map((v) => {
                  const isSelected = selectedVillage?.villageName === v.villageName;
                  return (
                    <tr
                      key={v.villageName}
                      onClick={() => setSelectedVillage(v)}
                      className={`cursor-pointer transition-saathi ${
                        isSelected
                          ? 'bg-saathi-paleMint/50 font-medium'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Village Name Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100/70 text-saathi-teal rounded-xl shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-saathi-navy flex items-center gap-1.5">
                              <span>{v.villageName}</span>
                              {v.hindiName && v.hindiName !== v.villageName && (
                                <span className="text-xs font-semibold text-slate-500">
                                  ({v.hindiName})
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-saathi-textMuted block font-mono">
                              पटियाला क्लस्टर उप-केन्द्र
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Screening Activity Column */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-saathi-navy text-sm">
                          {v.screeningActivity}
                        </span>{' '}
                        <span className="text-xs text-saathi-textSecondary">सत्र</span>
                      </td>

                      {/* Referral Demand Column */}
                      <td className="px-6 py-4">
                        {v.isCellSuppressed ? (
                          <span
                            className="inline-flex items-center gap-1 font-mono text-xs font-bold text-amber-800 bg-amber-100/80 border border-amber-300 px-2.5 py-1 rounded-lg"
                            title="DPDPA Differential Privacy: Count < 5 suppressed to prevent re-identification"
                          >
                            <Shield className="w-3 h-3 text-amber-600" />
                            &lt; 5 (Suppressed)
                          </span>
                        ) : (
                          <span className="font-bold text-saathi-amber text-sm">
                            {v.referralDemand} मामले
                          </span>
                        )}
                      </td>

                      {/* Follow-up Completed Column */}
                      <td className="px-6 py-4">
                        {v.isCellSuppressed ? (
                          <span
                            className="inline-flex items-center gap-1 font-mono text-xs font-bold text-amber-800 bg-amber-100/80 border border-amber-300 px-2.5 py-1 rounded-lg"
                            title="DPDPA Differential Privacy: Count < 5 suppressed to prevent re-identification"
                          >
                            <Shield className="w-3 h-3 text-amber-600" />
                            &lt; 5 (Suppressed)
                          </span>
                        ) : (
                          <span className="font-bold text-saathi-success text-sm">
                            {v.followupCompleted} मरीज़
                          </span>
                        )}
                      </td>

                      {/* Service Gap Column */}
                      <td className="px-6 py-4">
                        {v.serviceGaps === 'Adequate' ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            संतोषजनक (Adequate)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-800 font-semibold px-2.5 py-1 rounded-lg border border-purple-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-purple-600" />
                            {v.serviceGaps}
                          </span>
                        )}
                      </td>

                      {/* Action / Status Column */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVillage(v);
                          }}
                          className="text-xs bg-saathi-paleMint text-saathi-teal hover:bg-saathi-softMint/50 font-bold px-3 py-1.5 rounded-xl border border-saathi-softMint transition-saathi inline-flex items-center gap-1"
                        >
                          <span>विवरण देखें</span>
                          <Info className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Small-Cell Explanation Footer */}
        <div className="bg-slate-50 p-4 border-t border-saathi-border text-xs text-saathi-textSecondary flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-saathi-textMuted shrink-0 mt-0.5" />
          <p>
            <strong>गोपनीयता सुरक्षा स्पष्टीकरण (Differential Privacy Safeguard - DPDPA 2023):</strong> जब किसी ग्रामीण क्लस्टर में 5 से कम मरीज़ किसी विशेष स्वास्थ्य लक्षण में आते हैं, तो जाति/लिंग/उम्र के आधार पर पहचान उजागर होने का खतरा होता है। इसलिए प्रोजेक्ट साथी 5 से कम संख्या को &quot;&lt; 5&quot; के रूप में स्वतः दबा देता है।
          </p>
        </div>
      </div>

      {/* Selected Village Detail Modal */}
      {selectedVillage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-saathi-border shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-saathi-border">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-saathi-teal rounded-2xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-saathi-navy flex items-center gap-2">
                    <span>{selectedVillage.villageName}</span>
                    {selectedVillage.hindiName && selectedVillage.hindiName !== selectedVillage.villageName && (
                      <span className="text-sm font-semibold text-slate-500">
                        ({selectedVillage.hindiName})
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-saathi-textSecondary">
                    पटियाला जिला स्वास्थ्य परिचालन उप-केन्द्र
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVillage(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-saathi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-xs text-saathi-textSecondary block">कुल स्क्रीनिंग सत्र</span>
                <span className="text-xl font-black text-saathi-navy">
                  {selectedVillage.screeningActivity} सत्र
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-xs text-saathi-textSecondary block">रेफरल मांग (Hospital)</span>
                <span className="text-xl font-black text-saathi-amber">
                  {selectedVillage.isCellSuppressed ? '< 5' : `${selectedVillage.referralDemand} मामले`}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-xs text-saathi-textSecondary block">अस्पताल फॉलो-अप पूर्ण</span>
                <span className="text-xl font-black text-saathi-success">
                  {selectedVillage.isCellSuppressed ? '< 5' : `${selectedVillage.followupCompleted} मरीज़`}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-xs text-saathi-textSecondary block">संबद्ध स्वास्थ्य केंद्र</span>
                <span className="text-xs font-bold text-saathi-navy block mt-1 truncate">
                  {selectedVillage.villageName === 'Rampur' || selectedVillage.villageName === 'Bishanpur'
                    ? 'Rampur PHC (प्राथमिक स्वास्थ्य केंद्र)'
                    : 'Nabha CHC (सामुदायिक स्वास्थ्य केंद्र)'}
                </span>
              </div>
            </div>

            {/* Service Gap Alert */}
            <div className="bg-saathi-paleMint/40 rounded-2xl p-4 border border-saathi-teal/30 flex items-start gap-3">
              <Building2 className="w-5 h-5 text-saathi-teal shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-saathi-navy block">
                  पहचाना गया सेवा अंतराल (Service Gap Status):
                </span>
                <span className="text-sm font-semibold text-saathi-textPrimary">
                  {selectedVillage.serviceGaps}
                </span>
                {selectedVillage.serviceGaps !== 'Adequate' && (
                  <p className="text-xs text-purple-700 mt-1">
                    सुझाव: इस ग्राम में अतिरिक्त मोबाइल वैन या विशेष विशेषज्ञ स्क्रीनिंग कैंप की आवश्यकता है।
                  </p>
                )}
              </div>
            </div>

            {/* Privacy note */}
            {selectedVillage.isCellSuppressed && (
              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  इस गाँव के मामले 5 से कम हैं, अतः गोपनीयता अधिनियम के तहत विशिष्ट संख्या सप्रैस की गई है।
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedVillage(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-saathi-navy font-bold rounded-xl text-sm transition-saathi"
              >
                बंद करें (Close)
              </button>
              <button
                type="button"
                onClick={() => {
                  offlineStore.planCampForVillage(selectedVillage.villageName);
                  setSelectedVillage(null);
                  if (onNavigateTab) {
                    onNavigateTab('camps');
                  } else {
                    alert(`गाँव ${selectedVillage.villageName} के लिए नया स्क्रीनिंग कैंप सफलतापूर्वक शेड्यूल किया गया!`);
                  }
                }}
                className="flex-1 py-2.5 bg-saathi-teal hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-saathi flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Tent className="w-4 h-4" />
                <span>कैंप नियोजित करें एवं देखें</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
