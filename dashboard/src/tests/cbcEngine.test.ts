import { describe, it, expect } from 'vitest';
import { ClientCbcRulesEngine } from '../services/cbcEngine';

describe('Client CBC Clinical Rules Engine', () => {
  it('correctly triggers prompt assessment for critical low platelets (<50,000)', () => {
    const res = ClientCbcRulesEngine.evaluate({
      hemoglobin: 12.0,
      totalWbc: 6000,
      platelets: 32000,
    });

    expect(res.requiresUrgentMedicalCheck).toBe(true);
    const plt = res.parameters.find(p => p.parameterName === 'Platelets');
    expect(plt?.flag).toBe('criticalLow');
    expect(res.recommendedActionEn).toContain('immediate medical assessment');
  });

  it('correctly validates normal ranges', () => {
    const res = ClientCbcRulesEngine.evaluate({
      hemoglobin: 13.5,
      totalWbc: 7200,
      platelets: 240000,
    });

    expect(res.requiresUrgentMedicalCheck).toBe(false);
    expect(res.requiresScheduledFollowup).toBe(false);
    expect(res.parameters.every(p => p.flag === 'normal')).toBe(true);
  });

  it('identifies implausible values to prevent corrupted reports from triggering triage', () => {
    const res = ClientCbcRulesEngine.evaluate({
      hemoglobin: 35.0, // > 26.0 g/dL is implausible
      totalWbc: 5000,
      platelets: 200000,
    });

    const hb = res.parameters.find(p => p.parameterName === 'Hemoglobin');
    expect(hb?.flag).toBe('implausible');
  });

  it('handles missing laboratory fields gracefully', () => {
    const res = ClientCbcRulesEngine.evaluate({
      hemoglobin: null,
      totalWbc: 5000,
      platelets: 200000,
    });

    const hb = res.parameters.find(p => p.parameterName === 'Hemoglobin');
    expect(hb?.flag).toBe('missing');
  });
});
