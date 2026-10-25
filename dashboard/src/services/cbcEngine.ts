/**
 * Project Saathi - Client-Side CBC Clinical Rules Engine
 * Version: 2026.1-clinician-approved
 * Evaluates laboratory blood counts deterministically.
 * Strict Governance: Rules flag values for medical review, NEVER diagnose leukemia.
 */

export type LabFlag = 'normal' | 'low' | 'criticalLow' | 'high' | 'criticalHigh' | 'missing' | 'implausible';

export interface LabValueResult {
  parameterName: string;
  value: number | null;
  unit: string;
  flag: LabFlag;
  explanationEn: string;
  explanationHi: string;
}

export interface CbcEvaluationSummary {
  version: string;
  parameters: LabValueResult[];
  requiresUrgentMedicalCheck: boolean;
  requiresScheduledFollowup: boolean;
  recommendedActionEn: string;
  recommendedActionHi: string;
}

export class ClientCbcRulesEngine {
  static evaluate(params: {
    hemoglobin?: number | null;
    totalWbc?: number | null;
    platelets?: number | null;
    candidateBlastsPercent?: number | null;
    patientAge?: number;
  }): CbcEvaluationSummary {
    const results: LabValueResult[] = [];
    let criticalCount = 0;
    let abnormalCount = 0;

    const { hemoglobin, totalWbc, platelets, candidateBlastsPercent } = params;

    // 1. Hemoglobin (Hb)
    if (hemoglobin === undefined || hemoglobin === null) {
      results.push({
        parameterName: 'Hemoglobin',
        value: null,
        unit: 'g/dL',
        flag: 'missing',
        explanationEn: 'Hemoglobin reading missing from CBC report.',
        explanationHi: 'सीबीसी रिपोर्ट में हीमोग्लोबिन मान दर्ज नहीं है।'
      });
    } else if (hemoglobin < 2.0 || hemoglobin > 26.0) {
      results.push({
        parameterName: 'Hemoglobin',
        value: hemoglobin,
        unit: 'g/dL',
        flag: 'implausible',
        explanationEn: `Reading of ${hemoglobin} g/dL is physiologically implausible. Verification required.`,
        explanationHi: 'हीमोग्लोबिन का यह मान अमान्य प्रतीत होता है। पुनः जाँच करें।'
      });
    } else if (hemoglobin < 7.0) {
      criticalCount++;
      results.push({
        parameterName: 'Hemoglobin',
        value: hemoglobin,
        unit: 'g/dL',
        flag: 'criticalLow',
        explanationEn: `Severely low hemoglobin (${hemoglobin} g/dL). Severe anemia requiring prompt clinical assessment.`,
        explanationHi: `हीमोग्लोबिन का स्तर बहुत कम (${hemoglobin} g/dL) है। तुरंत अस्पताल में दिखाना आवश्यक है।`
      });
    } else if (hemoglobin < 11.5) {
      abnormalCount++;
      results.push({
        parameterName: 'Hemoglobin',
        value: hemoglobin,
        unit: 'g/dL',
        flag: 'low',
        explanationEn: `Mild-to-moderate low hemoglobin (${hemoglobin} g/dL). Follow-up with PHC medical officer.`,
        explanationHi: `हीमोग्लोबिन सामान्य से कम (${hemoglobin} g/dL) है। डॉक्टर से सलाह लें।`
      });
    } else {
      results.push({
        parameterName: 'Hemoglobin',
        value: hemoglobin,
        unit: 'g/dL',
        flag: 'normal',
        explanationEn: `Hemoglobin (${hemoglobin} g/dL) within expected clinical range.`,
        explanationHi: 'हीमोग्लोबिन सामान्य सीमा में है।'
      });
    }

    // 2. Total WBC Count
    if (totalWbc === undefined || totalWbc === null) {
      results.push({
        parameterName: 'Total WBC',
        value: null,
        unit: '/uL',
        flag: 'missing',
        explanationEn: 'WBC count missing from report.',
        explanationHi: 'WBC मान अनुपस्थित है।'
      });
    } else if (totalWbc < 500 || totalWbc > 300000) {
      results.push({
        parameterName: 'Total WBC',
        value: totalWbc,
        unit: '/uL',
        flag: 'implausible',
        explanationEn: `WBC reading ${totalWbc} /uL requires laboratory verification.`,
        explanationHi: 'WBC का मान असामान्य है। लैब से पुष्टि करें।'
      });
    } else if (totalWbc < 2000 || totalWbc > 30000) {
      criticalCount++;
      results.push({
        parameterName: 'Total WBC',
        value: totalWbc,
        unit: '/uL',
        flag: totalWbc < 2000 ? 'criticalLow' : 'criticalHigh',
        explanationEn: `Markedly abnormal WBC count (${totalWbc} /uL). Indicates possible severe infection or marrow suppression.`,
        explanationHi: `WBC की संख्या अत्यधिक असामान्य (${totalWbc} /uL) है। तुरंत डॉक्टर से मिलें।`
      });
    } else if (totalWbc < 4000 || totalWbc > 11000) {
      abnormalCount++;
      results.push({
        parameterName: 'Total WBC',
        value: totalWbc,
        unit: '/uL',
        flag: totalWbc < 4000 ? 'low' : 'high',
        explanationEn: `WBC count slightly outside reference range (${totalWbc} /uL).`,
        explanationHi: 'WBC सामान्य सीमा से थोड़ा बाहर है।'
      });
    } else {
      results.push({
        parameterName: 'Total WBC',
        value: totalWbc,
        unit: '/uL',
        flag: 'normal',
        explanationEn: `Total WBC count (${totalWbc} /uL) normal.`,
        explanationHi: 'WBC सामान्य सीमा में है।'
      });
    }

    // 3. Platelets
    if (platelets === undefined || platelets === null) {
      results.push({
        parameterName: 'Platelets',
        value: null,
        unit: '/uL',
        flag: 'missing',
        explanationEn: 'Platelet count missing.',
        explanationHi: 'प्लेटलेट मान अनुपस्थित है।'
      });
    } else if (platelets < 5000 || platelets > 2000000) {
      results.push({
        parameterName: 'Platelets',
        value: platelets,
        unit: '/uL',
        flag: 'implausible',
        explanationEn: `Platelet count ${platelets} /uL is outside standard automated range.`,
        explanationHi: 'प्लेटलेट मान संदिग्ध है।'
      });
    } else if (platelets < 50000) {
      criticalCount++;
      results.push({
        parameterName: 'Platelets',
        value: platelets,
        unit: '/uL',
        flag: 'criticalLow',
        explanationEn: `Severe thrombocytopenia (${platelets} /uL). Bleeding risk. Prompt medical assessment required.`,
        explanationHi: `प्लेटलेट्स बहुत कम (${platelets} /uL) हैं। तुरंत अस्पताल जाएं।`
      });
    } else if (platelets < 150000) {
      abnormalCount++;
      results.push({
        parameterName: 'Platelets',
        value: platelets,
        unit: '/uL',
        flag: 'low',
        explanationEn: `Mild-to-moderate low platelets (${platelets} /uL). Follow-up advised.`,
        explanationHi: 'प्लेटलेट्स सामान्य से कम हैं।'
      });
    } else {
      results.push({
        parameterName: 'Platelets',
        value: platelets,
        unit: '/uL',
        flag: 'normal',
        explanationEn: 'Platelets within normal reference range.',
        explanationHi: 'प्लेटलेट्स सामान्य सीमा में हैं।'
      });
    }

    // 4. Candidate Blast Cells
    if (candidateBlastsPercent && candidateBlastsPercent > 0.0) {
      criticalCount++;
      results.push({
        parameterName: 'Blast Cells',
        value: candidateBlastsPercent,
        unit: '%',
        flag: 'criticalHigh',
        explanationEn: 'Atypical/blast cells flagged on peripheral review. Pathologist evaluation required.',
        explanationHi: 'असामान्य कोशिकाएं पाई गईं। वरिष्ठ पैथोलॉजिस्ट से जांच अनिवार्य है।'
      });
    }

    const isUrgent = criticalCount > 0;
    const isFollowup = abnormalCount > 0 && !isUrgent;

    return {
      version: '2026.1-clinician-approved',
      parameters: results,
      requiresUrgentMedicalCheck: isUrgent,
      requiresScheduledFollowup: isFollowup,
      recommendedActionEn: isUrgent
        ? 'Arrange immediate medical assessment at CHC or District Hospital.'
        : (isFollowup
            ? 'Schedule a repeat CBC check and consult Medical Officer at PHC within 7 days.'
            : 'Values within normal expected ranges. Continue routine preventive care.'),
      recommendedActionHi: isUrgent
        ? 'तुरंत नजदीकी सीएचसी या जिला अस्पताल में डॉक्टर से संपर्क करें।'
        : (isFollowup
            ? '7 दिनों के भीतर प्राथमिक स्वास्थ्य केंद्र के डॉक्टर को दिखाएं।'
            : 'जाँच में सभी मान सामान्य सीमा में हैं। सामान्य देखभाल जारी रखें।')
    };
  }
}
