import React, { useState } from 'react';
import { Layout, AppMode, AdminTab } from './components/Layout';
import { OverviewPage } from './pages/admin/OverviewPage';
import { VillagesPage } from './pages/admin/VillagesPage';
import { ReferralsPage } from './pages/admin/ReferralsPage';
import { CampsPage } from './pages/admin/CampsPage';
import { ModelsPage } from './pages/admin/ModelsPage';
import { AuditPage } from './pages/admin/AuditPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { MobileSimulator } from './pages/mobile_simulator/MobileSimulator';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('ADMIN');
  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTab>('overview');

  return (
    <Layout
      currentMode={currentMode}
      onModeChange={setCurrentMode}
      currentAdminTab={currentAdminTab}
      onAdminTabChange={setCurrentAdminTab}
    >
      {currentMode === 'MOBILE' ? (
        <div className="flex flex-col items-center">
          <div className="mb-4 text-center max-w-xl">
            <h2 className="text-xl font-bold text-saathi-navy">
              आशा मोबाइल स्क्रीनिंग सहायक सिम्युलेटर (ASHA Mobile App Simulator)
            </h2>
            <p className="text-xs text-saathi-textSecondary mt-1">
              कम साक्षरता, आवाज़-प्रथम और ऑफ़लाइन वातावरण के लिए डिज़ाइन किया गया 16-स्क्रीन इंटरैक्टिव अनुभव। ध्वनि सुनने के लिए &quot;सुनें&quot; बटन दबाएं।
            </p>
          </div>
          <MobileSimulator />
        </div>
      ) : (
        <>
          {currentAdminTab === 'overview' && <OverviewPage onNavigateTab={setCurrentAdminTab} />}
          {currentAdminTab === 'villages' && <VillagesPage onNavigateTab={setCurrentAdminTab} />}
          {currentAdminTab === 'referrals' && <ReferralsPage />}
          {currentAdminTab === 'camps' && <CampsPage onNavigateTab={setCurrentAdminTab} />}
          {currentAdminTab === 'models' && <ModelsPage />}
          {currentAdminTab === 'audit' && <AuditPage />}
          {currentAdminTab === 'settings' && <SettingsPage />}
        </>
      )}
    </Layout>
  );
};

export default App;
