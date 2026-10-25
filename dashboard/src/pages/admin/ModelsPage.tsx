import React, { useState } from 'react';
import { Cpu, ShieldCheck, AlertTriangle, RotateCcw, CheckCircle2, FileCode2 } from 'lucide-react';
import { mockModelsRegistry } from '../../services/mockData';

export const ModelsPage: React.FC = () => {
  const [models, setModels] = useState(mockModelsRegistry);
  const [rollbackSuccess, setRollbackSuccess] = useState<string | null>(null);

  const handleRollback = (modelId: string) => {
    setRollbackSuccess(`मॉडल ${modelId} को आपातकालीन बैकअप संस्करण v0.9.8 पर सुरक्षित रूप से वापस (Rollback) कर दिया गया है।`);
    setTimeout(() => setRollbackSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-black text-saathi-navy">ऑन-डिवाइस मॉडल रजिस्ट्री एवं प्रशासन (Models Registry)</h2>
          <p className="text-xs text-saathi-textSecondary mt-1">
            क्वांटाइज्ड ऑन-डिवाइस एमएल मॉडल, क्लिनिकल अनुमोदन स्थिति, उपसमूह निष्पक्षता और रोलबैक नियंत्रण
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>सभी मॉडल डिमॉन्स्ट्रेशन मोड में पिन किए गए हैं</span>
        </span>
      </div>

      {rollbackSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{rollbackSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((m) => (
          <div key={m.modelId} className="bg-white rounded-2xl p-6 border border-saathi-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-saathi-border">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-saathi-paleMint text-saathi-teal rounded-xl">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-saathi-navy text-base">{m.name}</h3>
                    <code className="text-[11px] text-saathi-teal font-mono bg-saathi-paleMint/60 px-1.5 py-0.5 rounded">
                      {m.modelId} • {m.approvedVersion}
                    </code>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {m.status.includes('Active') ? 'Active (Demo)' : 'Pending'}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-saathi-textSecondary">अनुमोदन स्थिति (Clinical Status):</span>
                  <strong className="text-saathi-navy text-right">{m.clinicalApprovalStatus}</strong>
                </div>

                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-saathi-textSecondary">संवेदनशीलता (Sensitivity):</span>
                  <strong className="text-saathi-success">{m.sensitivity}</strong>
                </div>

                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-saathi-textSecondary">विशिष्टता (Specificity):</span>
                  <strong className="text-saathi-navy">{m.specificity}</strong>
                </div>

                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-saathi-textSecondary">उपसमूह FNR असमानता (Fairness Gap):</span>
                  <strong className="text-saathi-teal">{m.disparityFNR} (&lt;4.0% सीमा)</strong>
                </div>

                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-saathi-textSecondary">हार्डवेयर पूर्व-शर्त (Hardware Input):</span>
                  <strong className="text-saathi-navy text-right">{m.hardware}</strong>
                </div>

                <div className="py-1">
                  <span className="text-saathi-textSecondary block">प्रशिक्षण डेटा स्रोत (Provenance):</span>
                  <span className="text-slate-600 font-medium">{m.provenance}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-saathi-border flex items-center justify-between">
              <span className="text-[11px] text-saathi-textMuted flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-saathi-teal" />
                SHA-256 पिनिंग सत्यापित
              </span>

              <button
                type="button"
                onClick={() => handleRollback(m.modelId)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-saathi-red font-bold rounded-xl text-xs flex items-center gap-1.5 transition-saathi border border-red-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                आपातकालीन रोलबैक (Rollback)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
