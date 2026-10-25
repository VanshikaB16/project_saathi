import React, { useState, useEffect } from 'react';
import { Layout, AdminTab } from './components/Layout';
import { StandaloneMobileShell, AppRoute } from './components/StandaloneMobileShell';
import { OverviewPage } from './pages/admin/OverviewPage';
import { VillagesPage } from './pages/admin/VillagesPage';
import { ReferralsPage } from './pages/admin/ReferralsPage';
import { CampsPage } from './pages/admin/CampsPage';
import { ModelsPage } from './pages/admin/ModelsPage';
import { AuditPage } from './pages/admin/AuditPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { MobileSimulator } from './pages/mobile_simulator/MobileSimulator';

const getInitialRoute = (): AppRoute => {
  if (typeof window === 'undefined') return 'ADMIN';
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith('/doctor') || path.startsWith('/mo') || path.startsWith('/opd')) {
    return 'DOCTOR';
  }
  if (path.startsWith('/mobile') || path.startsWith('/asha') || path.startsWith('/screening')) {
    return 'MOBILE';
  }
  return 'ADMIN';
};

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getInitialRoute);
  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTab>('overview');

  // Synchronize on browser history popstate (Back / Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (newRoute: AppRoute) => {
    setCurrentRoute(newRoute);
    let targetPath = '/';
    if (newRoute === 'MOBILE') targetPath = '/mobile';
    if (newRoute === 'DOCTOR') targetPath = '/doctor';

    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  // Route 1: Standalone ASHA Mobile App (/mobile or /asha)
  if (currentRoute === 'MOBILE') {
    return (
      <StandaloneMobileShell currentRoute="MOBILE" onNavigateRoute={navigateTo}>
        <div className="flex flex-col items-center w-full">
          <div className="mb-4 text-center max-w-xl">
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-1 rounded-full inline-block mb-2">
              Standalone ASHA Mobile View • /mobile
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              आशा मोबाइल स्क्रीनिंग सहायक (ASHA Mobile App)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-lg mx-auto">
              कम साक्षरता, 22 संवैधानिक भाषाएँ, आवाज़-प्रथम और बिना इंटरनेट काम करने वाला 16-स्क्रीन इंटरैक्टिव स्क्रीनिंग सिस्टम।
            </p>
          </div>
          <MobileSimulator
            initialRole="ASHA"
            standalone
            onNavigatePortal={(r) => navigateTo(r as AppRoute)}
          />
        </div>
      </StandaloneMobileShell>
    );
  }

  // Route 2: Standalone Doctor OPD & Review Portal (/doctor or /mo)
  if (currentRoute === 'DOCTOR') {
    return (
      <StandaloneMobileShell currentRoute="DOCTOR" onNavigateRoute={navigateTo}>
        <div className="flex flex-col items-center w-full">
          <div className="mb-4 text-center max-w-xl">
            <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-300 bg-indigo-950/70 border border-indigo-800/60 px-2.5 py-1 rounded-full inline-block mb-2">
              Standalone Doctor Review Portal • /doctor
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              सामुदायिक स्वास्थ्य केंद्र चिकित्सक पोर्टल (Doctor Review & OPD)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-lg mx-auto">
              डॉ. राजीव वर्मा (MO CHC) • एआई-फ्लैग्ड रेफरल सत्यापन, जन औषधि दवा स्टॉक एवं क्लाउड एजेंट द्वारा स्वतः अस्पताल टोकन बुकिंग।
            </p>
          </div>
          <MobileSimulator
            initialRole="DOCTOR"
            standalone
            onNavigatePortal={(r) => navigateTo(r as AppRoute)}
          />
        </div>
      </StandaloneMobileShell>
    );
  }

  // Route 3: District Administration Analytics Dashboard (/ or /admin)
  return (
    <Layout
      currentMode="ADMIN"
      currentRoute="ADMIN"
      onNavigateRoute={navigateTo}
      currentAdminTab={currentAdminTab}
      onAdminTabChange={setCurrentAdminTab}
    >
      {currentAdminTab === 'overview' && <OverviewPage onNavigateTab={setCurrentAdminTab} />}
      {currentAdminTab === 'villages' && <VillagesPage onNavigateTab={setCurrentAdminTab} />}
      {currentAdminTab === 'referrals' && <ReferralsPage />}
      {currentAdminTab === 'camps' && <CampsPage onNavigateTab={setCurrentAdminTab} />}
      {currentAdminTab === 'models' && <ModelsPage />}
      {currentAdminTab === 'audit' && <AuditPage />}
      {currentAdminTab === 'settings' && <SettingsPage />}
    </Layout>
  );
};

export default App;
