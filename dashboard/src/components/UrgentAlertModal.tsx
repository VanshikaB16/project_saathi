import React from 'react';
import { AlertOctagon, PhoneCall, X, ShieldAlert, HeartPulse } from 'lucide-react';

interface UrgentAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UrgentAlertModal: React.FC<UrgentAlertModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-4 border-saathi-red">
        <div className="flex items-center justify-between pb-3 border-b border-red-200">
          <div className="flex items-center gap-2.5 text-saathi-red">
            <AlertOctagon className="w-8 h-8 text-saathi-red animate-pulse" />
            <h2 className="text-xl font-bold">आपातकालीन क्लिनिकल चेतावनी (Emergency)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="my-4 space-y-3 text-sm text-saathi-textPrimary">
          <p className="font-bold text-red-900 bg-red-50 p-3 rounded-xl border border-red-200">
            चेतावनी: यदि मरीज़ को इनमें से कोई भी गंभीर लक्षण है, तो किसी भी फोटो या स्क्रीनिंग मॉडल का इंतज़ार न करें!
          </p>

          <ul className="space-y-2 font-medium">
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-saathi-red"></span>
              <strong>गंभीर सांस फूलना या बेहोशी</strong> (Severe Breathing Distress / Syncope)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-saathi-red"></span>
              <strong>अनियंत्रित भारी खून बहना</strong> (Major Arterial Bleeding / Hemoptysis)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-saathi-red"></span>
              <strong>अचानक आंखों की पूरी रोशनी चले जाना</strong> (Acute Sudden Vision Loss)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-saathi-red"></span>
              <strong>सीने में असहनीय भारी दर्द</strong> (Severe Crushing Chest Pain)
            </li>
          </ul>

          <div className="bg-saathi-paleMint p-3 rounded-xl border border-saathi-teal/40">
            <p className="text-xs text-saathi-navy font-semibold">
              तत्काल प्राथमिक उपचार: मरीज़ को आरामदायक स्थिति में लिटाएं या सहारा देकर बैठाएं। भीड़ को दूर रखें और ताजी हवा आने दें।
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="tel:108"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-saathi-red hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-saathi text-center"
          >
            <PhoneCall className="w-5 h-5" />
            108 एम्बुलेंस को तुरंत कॉल करें
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 border-2 border-gray-300 hover:border-gray-400 font-semibold rounded-xl text-gray-700"
          >
            यह आपातकालीन स्थिति नहीं है
          </button>
        </div>
      </div>
    </div>
  );
};
