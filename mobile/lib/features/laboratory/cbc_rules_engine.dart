/// Project Saathi - CBC Clinical Rules Engine
/// Version: 2026.1-clinician-approved
/// Implements deterministic, audited reference ranges.
/// Explicit clinical rule: Rules flag values for medical review, NEVER diagnose leukemia.

enum LabFlag { normal, low, criticalLow, high, criticalHigh, missing, implausible }

class LabValueResult {
  final String parameterName;
  final double? value;
  final String unit;
  final LabFlag flag;
  final String explanationEn;
  final String explanationHi;

  LabValueResult({
    required this.parameterName,
    required this.value,
    required this.unit,
    required this.flag,
    required this.explanationEn,
    required this.explanationHi,
  });
}

class CbcEvaluationSummary {
  final String version = '2026.1-clinician-approved';
  final List<LabValueResult> parameters;
  final bool requiresUrgentMedicalCheck;
  final bool requiresScheduledFollowup;
  final String recommendedActionEn;
  final String recommendedActionHi;

  CbcEvaluationSummary({
    required this.parameters,
    required this.requiresUrgentMedicalCheck,
    required this.requiresScheduledFollowup,
    required this.recommendedActionEn,
    required this.recommendedActionHi,
  });
}

class CbcRulesEngine {
  /// Reference Ranges (Adult Standard Clinical Guidelines):
  /// - Hemoglobin (Hb): 12.0 - 16.0 g/dL (Critical Low < 7.0 g/dL)
  /// - Total WBC: 4,000 - 11,000 /uL (Critical Low < 2,000 / Critical High > 30,000)
  /// - Platelet Count: 150,000 - 450,000 /uL (Critical Low < 50,000 / Severe Bleeding Risk < 20,000)
  /// - Blasts / Atypical cells: 0% normal. Any blasts > 0 requires specialist review.

  static CbcEvaluationSummary evaluate({
    double? hemoglobin,
    double? totalWbc,
    double? platelets,
    double? candidateBlastsPercent,
    int patientAge = 35,
  }) {
    final results = <LabValueResult>[];
    int criticalCount = 0;
    int abnormalCount = 0;

    // 1. Hemoglobin
    if (hemoglobin == null) {
      results.add(LabValueResult(
        parameterName: 'Hemoglobin',
        value: null,
        unit: 'g/dL',
        flag: LabFlag.missing,
        explanationEn: 'Hemoglobin value missing from CBC report.',
        explanationHi: 'सीबीसी रिपोर्ट में हीमोग्लोबिन मान दर्ज नहीं है।',
      ));
    } else if (hemoglobin < 2.0 || hemoglobin > 26.0) {
      results.add(LabValueResult(
        parameterName: 'Hemoglobin',
        value: hemoglobin,
        unit: 'g/dL',
        flag: LabFlag.implausible,
        explanationEn: 'Hemoglobin reading $hemoglobin g/dL is physiologically implausible. Check for report transcription error.',
        explanationHi: 'हीमोग्लोबिन का यह मान अमान्य प्रतीत होता है। कृपया रिपोर्ट दोबारा जांचें।',
      ));
    } else if (hemoglobin < 7.0) {
      criticalCount++;
      results.add(LabValueResult(
        parameterName: 'Hemoglobin',
        value: hemoglobin,
        unit: 'g/dL',
        flag: LabFlag.criticalLow,
        explanationEn: 'Severely low hemoglobin ($hemoglobin g/dL). Severe anemia requiring prompt clinical assessment.',
        explanationHi: 'हीमोग्लोबिन का स्तर बहुत कम ($hemoglobin g/dL) है। तुरंत अस्पताल में दिखाना आवश्यक है।',
      ));
    } else if (hemoglobin < 11.5) {
      abnormalCount++;
      results.add(LabValueResult(
        parameterName: 'Hemoglobin',
        value: hemoglobin,
        unit: 'g/dL',
        flag: LabFlag.low,
        explanationEn: 'Mild-to-moderate low hemoglobin ($hemoglobin g/dL). Follow-up with PHC medical officer recommended.',
        explanationHi: 'हीमोग्लोबिन सामान्य से कम ($hemoglobin g/dL) है। प्राथमिक स्वास्थ्य केंद्र में डॉक्टर से सलाह लें।',
      ));
    } else {
      results.add(LabValueResult(
        parameterName: 'Hemoglobin',
        value: hemoglobin,
        unit: 'g/dL',
        flag: LabFlag.normal,
        explanationEn: 'Hemoglobin ($hemoglobin g/dL) within expected clinical range.',
        explanationHi: 'हीमोग्लोबिन सामान्य सीमा में है।',
      ));
    }

    // 2. Total WBC Count
    if (totalWbc == null) {
      results.add(LabValueResult(
        parameterName: 'Total WBC',
        value: null,
        unit: '/uL',
        flag: LabFlag.missing,
        explanationEn: 'WBC count missing from CBC report.',
        explanationHi: 'सफेद रक्त कोशिका (WBC) मान अनुपस्थित है।',
      ));
    } else if (totalWbc < 500 || totalWbc > 300000) {
      results.add(LabValueResult(
        parameterName: 'Total WBC',
        value: totalWbc,
        unit: '/uL',
        flag: LabFlag.implausible,
        explanationEn: 'WBC reading $totalWbc /uL is outside plausible automated counter limits. Verification required.',
        explanationHi: 'WBC का मान असामान्य रूप से बाहर है। लैब से पुष्टि करें।',
      ));
    } else if (totalWbc < 2000 || totalWbc > 30000) {
      criticalCount++;
      results.add(LabValueResult(
        parameterName: 'Total WBC',
        value: totalWbc,
        unit: '/uL',
        flag: totalWbc < 2000 ? LabFlag.criticalLow : LabFlag.criticalHigh,
        explanationEn: 'Markedly abnormal WBC count ($totalWbc /uL). Indicates possible severe infection or marrow suppression.',
        explanationHi: 'WBC की संख्या अत्यधिक असामान्य ($totalWbc /uL) है। तुरंत विशेषज्ञ डॉक्टर से मिलें।',
      ));
    } else if (totalWbc < 4000 || totalWbc > 11000) {
      abnormalCount++;
      results.add(LabValueResult(
        parameterName: 'Total WBC',
        value: totalWbc,
        unit: '/uL',
        flag: totalWbc < 4000 ? LabFlag.low : LabFlag.high,
        explanationEn: 'WBC count slightly outside reference range ($totalWbc /uL). Scheduled checkup advised.',
        explanationHi: 'WBC सामान्य सीमा से थोड़ा बाहर है।',
      ));
    } else {
      results.add(LabValueResult(
        parameterName: 'Total WBC',
        value: totalWbc,
        unit: '/uL',
        flag: LabFlag.normal,
        explanationEn: 'Total WBC count within normal range ($totalWbc /uL).',
        explanationHi: 'WBC सामान्य सीमा में है।',
      ));
    }

    // 3. Platelet Count
    if (platelets == null) {
      results.add(LabValueResult(
        parameterName: 'Platelets',
        value: null,
        unit: '/uL',
        flag: LabFlag.missing,
        explanationEn: 'Platelet count missing from report.',
        explanationHi: 'प्लेटलेट मान अनुपस्थित है।',
      ));
    } else if (platelets < 5000 || platelets > 2000000) {
      results.add(LabValueResult(
        parameterName: 'Platelets',
        value: platelets,
        unit: '/uL',
        flag: LabFlag.implausible,
        explanationEn: 'Platelet count $platelets /uL requires laboratory manual smear verification.',
        explanationHi: 'प्लेटलेट मान संदिग्ध है। लैब से दोबारा जांच कराएं।',
      ));
    } else if (platelets < 50000) {
      criticalCount++;
      results.add(LabValueResult(
        parameterName: 'Platelets',
        value: platelets,
        unit: '/uL',
        flag: LabFlag.criticalLow,
        explanationEn: 'Severe thrombocytopenia ($platelets /uL). Risk of spontaneous bleeding. Prompt medical assessment required.',
        explanationHi: 'प्लेटलेट्स बहुत कम ($platelets /uL) हैं। रक्तस्राव का खतरा है, तुरंत अस्पताल जाएं।',
      ));
    } else if (platelets < 150000) {
      abnormalCount++;
      results.add(LabValueResult(
        parameterName: 'Platelets',
        value: platelets,
        unit: '/uL',
        flag: LabFlag.low,
        explanationEn: 'Mild-to-moderate low platelets ($platelets /uL). Health worker follow-up advised.',
        explanationHi: 'प्लेटलेट्स सामान्य से कम हैं। कुछ दिनों में पुनः जाँच कराएं।',
      ));
    } else {
      results.add(LabValueResult(
        parameterName: 'Platelets',
        value: platelets,
        unit: '/uL',
        flag: LabFlag.normal,
        explanationEn: 'Platelets within normal reference range.',
        explanationHi: 'प्लेटलेट्स सामान्य सीमा में हैं।',
      ));
    }

    // 4. Candidate Blast Cells (Stage 4 correlation)
    if (candidateBlastsPercent != null && candidateBlastsPercent > 0.0) {
      criticalCount++;
      results.add(LabValueResult(
        parameterName: 'Blast Cells',
        value: candidateBlastsPercent,
        unit: '%',
        flag: LabFlag.criticalHigh,
        explanationEn: 'Atypical/blast cells flagged on peripheral review. Pathologist evaluation required.',
        explanationHi: 'असामान्य कोशिकाएं पाई गईं। वरिष्ठ रोगविज्ञानी (पैथोलॉजिस्ट) से जांच अनिवार्य है।',
      ));
    }

    final isUrgent = criticalCount > 0;
    final isFollowup = abnormalCount > 0 && !isUrgent;

    return CbcEvaluationSummary(
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
              : 'जाँच में सभी मान सामान्य सीमा में हैं। सामान्य देखभाल जारी रखें।'),
    );
  }
}
