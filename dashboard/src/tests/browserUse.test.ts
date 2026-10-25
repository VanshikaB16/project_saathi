import { describe, it, expect } from 'vitest';
import { browserUseService } from '../services/browserUseService';

describe('Browser Use Cloud Autonomous Agent Service', () => {
  it('reads configured API key from environment', () => {
    expect(browserUseService.hasApiKey()).toBe(true);
    expect(browserUseService.getApiKey()).toContain('bu_');
  });

  it('generates simulated or real hospital OPD appointment token with department mapping', async () => {
    const result = await browserUseService.bookDistrictHospitalReferral({
      patientName: 'Sunita Devi',
      age: 48,
      safeId: 'SAA-MAL-2026-4019',
      specialty: 'Dermatology',
      facilityName: 'Nabha Civil Hospital (SDH)',
      reason: 'Suspected severe erythematous lesion with ulceration',
    });

    expect(result.tokenNumber).toBeTruthy();
    expect(result.confirmed).toBe(true);
    expect(result.tokenNumber).toContain('OPD-DER');
  });

  it('fetches Jan Aushadhi generic price comparison and savings percentage', async () => {
    const result = await browserUseService.checkJanAushadhiPrices('Hydrocortisone 1% Ointment', '147201');

    expect(result.genericName).toBeTruthy();
    expect(result.brandPriceInr).toBeGreaterThan(result.janAushadhiPriceInr);
    expect(result.savingsPercentage).toBeGreaterThan(50);
  });
});
