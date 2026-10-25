import { describe, it, expect } from 'vitest';
import { mockVillages } from '../services/mockData';
import { offlineStore } from '../services/offlineStore';

describe('District Aggregates Privacy & Small-Cell Suppression', () => {
  it('suppresses metrics when count is fewer than 5 (DPDPA compliance)', () => {
    const suppressedVillages = mockVillages.filter(v => v.isCellSuppressed);
    expect(suppressedVillages.length).toBeGreaterThan(0);

    suppressedVillages.forEach(v => {
      expect(v.referralDemand).toBe('< 5');
      expect(v.followupCompleted).toBe('< 5');
    });
  });

  it('reveals exact integer counts when cohort size is >= 5', () => {
    const rampur = mockVillages.find(v => v.villageName === 'Rampur');
    expect(rampur?.isCellSuppressed).toBe(false);
    expect(rampur?.referralDemand).toBe('9');
  });

  it('deduplicates bilingual Hindi and English village entries without duplicate rows', () => {
    const liveVillages = offlineStore.getLiveVillageAggregates();
    const villageNames = liveVillages.map(v => v.villageName.toLowerCase());

    // Ensure Rampur, Kalyanpur, Sundernagar are present only once
    const rampurCount = villageNames.filter(n => n === 'rampur').length;
    expect(rampurCount).toBe(1);

    const kalyanpurCount = villageNames.filter(n => n === 'kalyanpur').length;
    expect(kalyanpurCount).toBe(1);

    const sundernagarCount = villageNames.filter(n => n === 'sundernagar').length;
    expect(sundernagarCount).toBe(1);

    // Verify there are no duplicate Devnagari names as separate rows
    expect(liveVillages.some(v => v.villageName === 'रामपूर' || v.villageName === 'रामपुर')).toBe(false);
    expect(liveVillages.some(v => v.villageName === 'कल्याणपुर' || v.villageName === 'कल्याणपूर')).toBe(false);
    expect(liveVillages.some(v => v.villageName === 'सुंदरनगर' || v.villageName === 'सुन्दरनगर')).toBe(false);

    // Verify Hindi names are properly mapped as metadata
    const rampur = liveVillages.find(v => v.villageName === 'Rampur');
    expect(rampur?.hindiName).toBe('रामपूर');
  });

  it('manages screening camps in real-time with local persistence', () => {
    const initialCamps = offlineStore.getCamps();
    expect(initialCamps.length).toBeGreaterThanOrEqual(2);

    // Plan a new camp for a newly registered village
    const plannedCamp = offlineStore.planCampForVillage('Meerut', 'Specialist NCD Outreach');
    expect(plannedCamp).toBeDefined();
    expect(plannedCamp.village).toBe('Meerut');
    expect(plannedCamp.status).toBe('PLANNING');

    const updatedCamps = offlineStore.getCamps();
    expect(updatedCamps.some(c => c.village === 'Meerut')).toBe(true);

    // Update status to CONFIRMED
    offlineStore.updateCampStatus(plannedCamp.id, 'CONFIRMED');
    const confirmedCamp = offlineStore.getCamps().find(c => c.id === plannedCamp.id);
    expect(confirmedCamp?.status).toBe('CONFIRMED');

    // Clean up
    offlineStore.deleteCamp(plannedCamp.id);
    expect(offlineStore.getCamps().some(c => c.id === plannedCamp.id)).toBe(false);
  });
});


