import React, { useState, useEffect } from 'react';
import { MapPin, ShieldCheck, AlertCircle, Layers } from 'lucide-react';
import { VillageAggregate } from '../services/mockData';
import { offlineStore } from '../services/offlineStore';

interface MapVisualizationProps {
  onNavigateTab?: (tab: any) => void;
}

export const MapVisualization: React.FC<MapVisualizationProps> = ({ onNavigateTab }) => {
  const [villages, setVillages] = useState<VillageAggregate[]>(() => offlineStore.getLiveVillageAggregates());
  const [selectedVillage, setSelectedVillage] = useState<VillageAggregate | null>(() => villages[0] || null);

  useEffect(() => {
    const update = () => {
      const live = offlineStore.getLiveVillageAggregates();
      setVillages(live);
      setSelectedVillage((prev) => live.find((v) => v.villageName === prev?.villageName) || live[0]);
    };
    update();
    const unsubscribe = offlineStore.subscribe(update);
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 border border-saathi-border shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-saathi-border gap-2">
        <div>
          <h3 className="text-lg font-bold text-saathi-navy flex items-center gap-2">
            <Layers className="w-5 h-5 text-saathi-teal" />
            गाँव स्तरीय परिचालन दृश्य (Village Operational Coverage)
          </h3>
          <p className="text-xs text-saathi-textSecondary mt-0.5">
            प्राइवेसी सुरक्षा: किसी भी मरीज़ का व्यक्तिगत पिन या नाम प्रदर्शित नहीं है। केवल एकत्रित परिचालन क्षमता प्रदर्शित है।
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-saathi-paleMint text-saathi-teal px-3 py-1.5 rounded-xl font-semibold border border-saathi-teal/30">
          <ShieldCheck className="w-4 h-4" />
          <span>Small-Cell Suppression (&lt; 5) Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Synthetic Schematic Map Grid */}
        <div className="lg:col-span-2 relative bg-slate-50 border-2 border-dashed border-saathi-border rounded-2xl p-6 min-h-[300px] flex flex-col justify-between overflow-hidden">
          <div className="absolute top-3 left-4 text-xs font-bold text-saathi-textMuted uppercase tracking-wider">
            पटियाला उप-केन्द्र क्लस्टर (Patiala District Sub-Centre Schematic)
          </div>

          {/* Village Nodes on Schematic Map */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-auto pt-6">
            {villages.map((v) => {
              const isSelected = selectedVillage?.villageName === v.villageName;
              return (
                <button
                  key={v.villageName}
                  onClick={() => setSelectedVillage(v)}
                  className={`p-4 rounded-xl text-left transition-saathi border ${
                    isSelected
                      ? 'bg-saathi-navy text-white border-saathi-navy shadow-lg scale-105'
                      : 'bg-white text-saathi-textPrimary border-saathi-border hover:border-saathi-teal'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="truncate pr-1">
                      <span className="font-bold text-sm">{v.villageName}</span>
                      {v.hindiName && v.hindiName !== v.villageName && (
                        <span className={`text-[11px] ml-1.5 font-normal ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          ({v.hindiName})
                        </span>
                      )}
                    </div>
                    <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-saathi-softMint' : 'text-saathi-teal'}`} />
                  </div>
                  <div className="text-xs space-y-1 opacity-90">
                    <p>स्क्रीनिंग: <strong>{v.screeningActivity}</strong></p>
                    <p>रेफरल मांग: <strong>{v.referralDemand}</strong></p>
                  </div>
                  {v.isCellSuppressed && (
                    <span className="inline-block mt-2 text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                      Suppressed (&lt;5)
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-saathi-textMuted pt-4 border-t border-gray-200">
            <span>डेटा स्रोत: आशा साप्ताहिक स्वास्थ्य रिपोर्ट • अक्टूबर 2026</span>
            <span className="text-[11px] text-gray-500 italic">रोग का हॉटस्पॉट लेबल लगाना सख्त वर्जित है</span>
          </div>
        </div>

        {/* Selected Village Detail Panel */}
        {selectedVillage && (
          <div className="bg-saathi-paleMint/40 rounded-2xl p-5 border border-saathi-teal/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-saathi-navy flex items-center gap-1.5">
                  <span>{selectedVillage.villageName}</span>
                  {selectedVillage.hindiName && selectedVillage.hindiName !== selectedVillage.villageName && (
                    <span className="text-xs font-semibold text-slate-500">
                      ({selectedVillage.hindiName})
                    </span>
                  )}
                </h4>
                <span className="text-xs bg-saathi-teal text-white font-bold px-2 py-0.5 rounded-full">
                  सक्रिय क्षेत्र
                </span>
              </div>

              <div className="space-y-3 mt-4 text-sm">
                <div className="bg-white p-3 rounded-xl border border-saathi-border">
                  <span className="text-xs text-saathi-textSecondary block">कुल स्क्रीनिंग सत्र</span>
                  <strong className="text-xl text-saathi-navy">{selectedVillage.screeningActivity}</strong> सत्र
                </div>

                <div className="bg-white p-3 rounded-xl border border-saathi-border">
                  <span className="text-xs text-saathi-textSecondary block">रेफरल मांग (Referral Demand)</span>
                  <strong className="text-xl text-saathi-amber">{selectedVillage.referralDemand}</strong> मामले
                  {selectedVillage.isCellSuppressed && (
                    <p className="text-[11px] text-amber-700 mt-1">
                      गोपनीयता नियम: 5 से कम संख्या होने पर सुरक्षा कारणों से मान छिपाया गया है।
                    </p>
                  )}
                </div>

                <div className="bg-white p-3 rounded-xl border border-saathi-border">
                  <span className="text-xs text-saathi-textSecondary block">अस्पताल फॉलो-अप पूर्ण</span>
                  <strong className="text-xl text-saathi-success">{selectedVillage.followupCompleted}</strong> मरीज़
                </div>

                <div className="bg-white p-3 rounded-xl border border-saathi-border">
                  <span className="text-xs text-saathi-textSecondary block">पहचानी गई परिचालन कमी (Service Gaps)</span>
                  <span className="font-semibold text-saathi-navy text-xs">{selectedVillage.serviceGaps}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                offlineStore.planCampForVillage(selectedVillage.villageName);
                if (onNavigateTab) {
                  onNavigateTab('camps');
                } else {
                  alert(`गाँव ${selectedVillage.villageName} के लिए नया स्क्रीनिंग कैंप सफलतापूर्वक शेड्यूल किया गया!`);
                }
              }}
              className="mt-4 w-full py-2.5 bg-saathi-navy hover:bg-saathi-deepNavy text-white font-bold rounded-xl text-sm transition-saathi text-center cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <span>स्क्रीनिंग कैंप की योजना बनाएं (Plan Camp)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
