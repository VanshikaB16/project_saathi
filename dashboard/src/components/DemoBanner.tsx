import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-amber-600 text-white text-xs md:text-sm font-semibold px-4 py-2 flex items-center justify-between shadow-sm z-50">
      <div className="flex items-center gap-2 max-w-5xl mx-auto">
        <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0 animate-pulse" />
        <span>
          <strong className="tracking-wide">DEMO — NOT FOR CLINICAL USE:</strong> Simulated demonstration models and synthetic records only. Clinical validity must be established through IRB-approved trials before real-world referrals.
        </span>
      </div>
      <span className="hidden sm:inline-block bg-amber-700/60 text-amber-100 text-xs px-2 py-0.5 rounded border border-amber-500/40">
        v1.0.0-pilot
      </span>
    </div>
  );
};
