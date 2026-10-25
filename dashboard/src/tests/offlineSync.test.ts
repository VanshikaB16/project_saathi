import { describe, it, expect } from 'vitest';
import { offlineStore } from '../services/offlineStore';

describe('Offline Store & Synchronization Behavior', () => {
  it('toggles network connectivity state seamlessly', () => {
    const initial = offlineStore.getNetworkStatus();
    const toggled = offlineStore.toggleNetwork();
    expect(toggled).toBe(!initial);
    // Restore
    offlineStore.toggleNetwork();
  });

  it('maintains open follow-through loop until clinician outcome is recorded', () => {
    let referrals = offlineStore.getReferrals();
    let openReferral = referrals.find(r => r.status === 'REFERRED');
    if (!openReferral) {
      offlineStore.saveReferral({
        id: 'ref-test-01',
        safeReferenceCode: 'SAA-REF-TEST',
        patientSafeId: 'SAA-PAT-TEST',
        villageName: 'Rampur',
        pathway: 'Skin Sign Screening',
        urgencyTier: 'PROMPT_ASSESSMENT',
        status: 'REFERRED',
        facilityName: 'Nabha CHC',
        reasonSummary: 'Test referral',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      referrals = offlineStore.getReferrals();
      openReferral = referrals.find(r => r.status === 'REFERRED');
    }
    expect(openReferral).toBeDefined();
    expect(openReferral?.outcomeSummary).toBeUndefined();

    // Clinician records outcome
    offlineStore.updateReferralOutcome(openReferral!.id, 'Examined at CHC. Prescribed antibiotics.', 'COMPLETED');
    const updated = offlineStore.getReferrals().find(r => r.id === openReferral!.id);
    expect(updated?.status).toBe('COMPLETED');
    expect(updated?.outcomeSummary).toContain('Prescribed antibiotics');
  });
});
