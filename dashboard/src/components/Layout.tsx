import React, { useState } from 'react';
import {
  HeartPulse,
  LayoutDashboard,
  Smartphone,
  Map,
  GitPullRequest,
  Tent,
  Cpu,
  History,
  Settings,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  Menu,
  X,
} from 'lucide-react';
import { DemoBanner } from './DemoBanner';
import { UrgentAlertModal } from './UrgentAlertModal';
import { speechTts } from '../services/speechTts';
import { offlineStore } from '../services/offlineStore';

export type AppMode = 'ADMIN' | 'MOBILE';
export type AdminTab = 'overview' | 'villages' | 'referrals' | 'camps' | 'models' | 'audit' | 'settings';

interface LayoutProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  currentAdminTab: AdminTab;
  onAdminTabChange: (tab: AdminTab) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentMode,
  onModeChange,
  currentAdminTab,
  onAdminTabChange,
  children,
}) => {
  const [isOnline, setIsOnline] = useState(offlineStore.getNetworkStatus());
  const [isMuted, setIsMuted] = useState(speechTts.getIsMuted());
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleNetwork = () => {
    const newState = offlineStore.toggleNetwork();
    setIsOnline(newState);
  };

  const toggleAudio = () => {
    const newMuted = !isMuted;
    speechTts.setMuted(newMuted);
    setIsMuted(newMuted);
  };

  const adminNavItems: Array<{ id: AdminTab; label: string; icon: any }> = [
    { id: 'overview', label: 'अवलोकन (Overview)', icon: LayoutDashboard },
    { id: 'villages', label: 'गाँव डेटा (Villages)', icon: Map },
    { id: 'referrals', label: 'रेफरल प्रबंधन (Referrals)', icon: GitPullRequest },
    { id: 'camps', label: 'स्क्रीनिंग कैंप (Camps)', icon: Tent },
    { id: 'models', label: 'मॉडल प्रशासन (Models)', icon: Cpu },
    { id: 'audit', label: 'ऑडिट लॉग (Audit)', icon: History },
    { id: 'settings', label: 'सिस्टम सेटिंग्स (Settings)', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-saathi-offWhite font-sans">
      {/* Persistent Demonstration Mode Warning Banner */}
      <DemoBanner />

      {/* Main Top Navigation Header */}
      <header className="bg-saathi-navy text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Tagline */}
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white rounded-xl shadow-md border border-slate-700/50 flex items-center justify-center">
                <img
                  src="/sathi-logo.png"
                  alt="Project Saathi Logo"
                  className="w-8 h-8 object-contain rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-white">Project Saathi</h1>
                  <span className="text-[10px] bg-saathi-softMint text-saathi-navy font-bold px-1.5 py-0.5 rounded">
                    PROTOTYPE
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 hidden sm:block">
                  A little closer to care. A step earlier to health.
                </p>
              </div>
            </div>

            {/* Mode Switcher Pills (Admin Portal vs ASHA Mobile Simulator) */}
            <div className="bg-saathi-deepNavy p-1 rounded-2xl border border-slate-700 flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => onModeChange('ADMIN')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-saathi ${
                  currentMode === 'ADMIN'
                    ? 'bg-saathi-teal text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">जिला प्रशासन</span>
                <span>District Admin</span>
              </button>

              <button
                type="button"
                onClick={() => onModeChange('MOBILE')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-saathi ${
                  currentMode === 'MOBILE'
                    ? 'bg-saathi-teal text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden md:inline">आशा मोबाइल ऐप</span>
                <span>ASHA Mobile</span>
              </button>
            </div>

            {/* Utility Controls (Network State, TTS Mute, Emergency Action) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Emergency Alert Button */}
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="bg-saathi-red hover:bg-red-700 text-white font-bold p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-saathi"
                title="Immediate clinical emergency protocol"
              >
                <AlertTriangle className="w-4 h-4 text-amber-200 animate-pulse" />
                <span className="hidden lg:inline">आपातकालीन (108)</span>
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
                title={isOnline ? 'Network Online - Click to simulate offline' : 'Network Offline - Click to reconnect'}
              >
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4 animate-bounce" />}
                <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
              </button>

              {/* Spoken Voice TTS Toggle */}
              <button
                type="button"
                onClick={toggleAudio}
                className={`p-2 rounded-xl border transition-saathi ${
                  isMuted
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-saathi-paleMint text-saathi-navy border-saathi-softMint'
                }`}
                title={isMuted ? 'Audio Muted - Click to enable voice' : 'Audio Active - Click to mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Mobile Navigation Menu Toggle */}
              {currentMode === 'ADMIN' && (
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-xl text-slate-300 hover:text-white md:hidden"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sub-header Secondary Navigation for District Admin */}
        {currentMode === 'ADMIN' && (
          <div className="border-t border-slate-800 bg-saathi-deepNavy/70 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="hidden md:flex space-x-1 py-2 overflow-x-auto text-xs">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentAdminTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onAdminTabChange(item.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-saathi ${
                        isActive
                          ? 'bg-saathi-teal text-white shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Drawer Menu */}
              {isMobileMenuOpen && (
                <div className="md:hidden py-3 space-y-1 border-t border-slate-800">
                  {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentAdminTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onAdminTabChange(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left ${
                          isActive
                            ? 'bg-saathi-teal text-white'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-saathi-border py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-saathi-textMuted flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Project Saathi • Screen locally. Refer safely. Follow through until care is reached.</span>
          <span>Offline-First Healthcare Platform • Non-Diagnostic Screening Aid</span>
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
