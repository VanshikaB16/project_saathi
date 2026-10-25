import React, { useState } from 'react';
import {
  Smartphone,
  Stethoscope,
  LayoutDashboard,
  AlertTriangle,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { DemoBanner } from './DemoBanner';
import { UrgentAlertModal } from './UrgentAlertModal';
import { speechTts } from '../services/speechTts';
import { offlineStore } from '../services/offlineStore';

export type AppRoute = 'ADMIN' | 'MOBILE' | 'DOCTOR';

interface StandaloneMobileShellProps {
  currentRoute: AppRoute;
  onNavigateRoute: (route: AppRoute) => void;
  children: React.ReactNode;
}

export const StandaloneMobileShell: React.FC<StandaloneMobileShellProps> = ({
  currentRoute,
  onNavigateRoute,
  children,
}) => {
  const [isOnline, setIsOnline] = useState(offlineStore.getNetworkStatus());
  const [isMuted, setIsMuted] = useState(speechTts.getIsMuted());
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const toggleNetwork = () => {
    const newState = offlineStore.toggleNetwork();
    setIsOnline(newState);
  };

  const toggleAudio = () => {
    const newMuted = !isMuted;
    speechTts.setMuted(newMuted);
    setIsMuted(newMuted);
  };

  const isAsha = currentRoute === 'MOBILE';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-100">
      {/* Persistent Demonstration Mode Warning Banner */}
      <DemoBanner />

      {/* Standalone Top Bar */}
      <header className="bg-saathi-navy text-white sticky top-0 z-40 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Logo and Dedicated Context Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-1 bg-white rounded-xl shadow-md border border-slate-700/50 flex items-center justify-center shrink-0">
                <img
                  src="/sathi-logo.png"
                  alt="Project Saathi Logo"
                  className="w-8 h-8 object-contain rounded-lg"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white truncate">
                    Project Saathi
                  </h1>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      isAsha
                        ? 'bg-emerald-400 text-emerald-950'
                        : 'bg-indigo-400 text-indigo-950'
                    }`}
                  >
                    {isAsha ? 'आशा मोबाइल (ASHA)' : 'चिकित्सक पोर्टल (DOCTOR)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 hidden sm:block truncate">
                  {isAsha
                    ? 'आशा स्वास्थ्य कार्यकर्ता मोबाइल स्क्रीनिंग सहायक • 16-Screen Edge AI Simulator'
                    : 'सामुदायिक स्वास्थ्य केंद्र (CHC) चिकित्सा अधिकारी रेफरल एवं ओपीडी प्री-बुकिंग'}
                </p>
              </div>
            </div>

            {/* Direct Route Switchers */}
            <div className="bg-saathi-deepNavy p-1 rounded-2xl border border-slate-700 flex items-center shadow-inner shrink-0">
              <button
                type="button"
                onClick={() => onNavigateRoute('MOBILE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-saathi ${
                  currentRoute === 'MOBILE'
                    ? 'bg-saathi-teal text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="ASHA Mobile Screening App (/mobile)"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden md:inline">आशा मोबाइल</span>
                <span>ASHA App</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateRoute('DOCTOR')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-saathi ${
                  currentRoute === 'DOCTOR'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Doctor Review & OPD Portal (/doctor)"
              >
                <Stethoscope className="w-4 h-4" />
                <span className="hidden md:inline">चिकित्सक</span>
                <span>Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateRoute('ADMIN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-saathi ${
                  currentRoute === 'ADMIN'
                    ? 'bg-saathi-teal text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="District Admin Analytics (/)"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">जिला प्रशासन</span>
                <span>Admin</span>
              </button>
            </div>

            {/* Utility Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Emergency Alert Button */}
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="bg-saathi-red hover:bg-red-700 text-white font-bold p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-saathi"
                title="Immediate clinical emergency protocol"
              >
                <AlertTriangle className="w-4 h-4 text-amber-200 animate-pulse" />
                <span className="hidden xl:inline">108 आपातकालीन</span>
              </button>

              {/* Online / Offline Simulator Toggle */}
              <button
                type="button"
                onClick={toggleNetwork}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-saathi ${
                  isOnline
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                }`}
                title={isOnline ? 'Online - Click to simulate offline' : 'Offline - Click to reconnect'}
              >
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4 animate-bounce" />}
                <span className="hidden lg:inline">{isOnline ? 'Online' : 'Offline'}</span>
              </button>

              {/* Spoken Voice TTS Toggle */}
              <button
                type="button"
                onClick={toggleAudio}
                className={`p-2 rounded-xl text-xs font-semibold border transition-saathi ${
                  isMuted
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-saathi-teal/20 text-saathi-mint border-saathi-teal/40'
                }`}
                title={isMuted ? 'Audio Muted' : 'Audio Active'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Clean, Centered, Focused on the Mobile App */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col items-center justify-center">
        {children}
      </main>

      {/* Clean Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Project Saathi • Screen locally. Refer safely. Follow through until care is reached.</span>
          <span>Dedicated Mobile Interface • ABDM / NDHM Triage Protocol Compliant</span>
        </div>
      </footer>

      {/* Emergency Escalation Modal */}
      <UrgentAlertModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
};
