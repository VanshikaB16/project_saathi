import React, { useState, useEffect } from 'react';
import { Layout, AdminTab } from './components/Layout';
import { OverviewPage } from './pages/admin/OverviewPage';
import { VillagesPage } from './pages/admin/VillagesPage';
import { ReferralsPage } from './pages/admin/ReferralsPage';
import { CampsPage } from './pages/admin/CampsPage';
import { ModelsPage } from './pages/admin/ModelsPage';
import { AuditPage } from './pages/admin/AuditPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { MobileSimulator } from './pages/mobile_simulator/MobileSimulator';

export const App: React.FC = () => {
  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTab>('overview');
  const [pathname, setPathname] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '/';
  });

  // Keep in sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname.toLowerCase());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Determine if viewing the Dedicated Mobile App
  const isMobileApp = (
    pathname.startsWith('/app') ||
    pathname.startsWith('/mobile') ||
    pathname.startsWith('/asha') ||
    pathname.startsWith('/doctor')
  );

  // 1. DEDICATED MOBILE APP VIEW
  // - Pure mobile phone interface (no backend or DMO navigation on the page)
  // - Unified Login Screen for both ASHA Worker and Doctor
  if (isMobileApp) {
    const isDoctorDirect = pathname.startsWith('/doctor');
    const isAshaDirect = pathname.startsWith('/asha');

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-4 select-none font-sans">
        <MobileSimulator
          standalone
          initialRole={isDoctorDirect ? 'DOCTOR' : isAshaDirect ? 'ASHA' : undefined}
          startAtLogin={!isDoctorDirect && !isAshaDirect}
        />
      </div>
    );
  }

  // 2. DEDICATED DISTRICT ORGANISATION (DMO) WEBSITE VIEW
  // - Pure District Health Administration Analytics & Operations Command Center
  // - No mobile app tabs or embedded phone simulator
  return (
    <Layout
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
