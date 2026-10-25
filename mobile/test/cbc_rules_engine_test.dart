import 'package:flutter_test/flutter_test.dart';
import 'package:project_saathi_mobile/features/laboratory/cbc_rules_engine.dart';

void main() {
  group('CBC Rules Engine Clinical Governance Tests', () {
    test('Identifies critical low platelets requiring urgent clinical assessment', () {
      final summary = CbcRulesEngine.evaluate(
        hemoglobin: 12.5,
        totalWbc: 7000,
        platelets: 35000, // < 50,000 is criticalLow
      );

      expect(summary.requiresUrgentMedicalCheck, isTrue);
      expect(summary.parameters.any((p) => p.parameterName == 'Platelets' && p.flag == LabFlag.criticalLow), isTrue);
    });

    test('Identifies normal range parameters without unnecessary emergency flags', () {
      final summary = CbcRulesEngine.evaluate(
        hemoglobin: 13.5,
        totalWbc: 6500,
        platelets: 220000,
      );

      expect(summary.requiresUrgentMedicalCheck, isFalse);
      expect(summary.requiresScheduledFollowup, isFalse);
      expect(summary.parameters.every((p) => p.flag == LabFlag.normal), isTrue);
    });

    test('Catches implausible physiological values to prevent erroneous automated decisions', () {
      final summary = CbcRulesEngine.evaluate(
        hemoglobin: 45.0, // Implausible (> 26.0 g/dL)
        totalWbc: 7000,
        platelets: 200000,
      );

      expect(summary.parameters.any((p) => p.flag == LabFlag.implausible), isTrue);
    });

    test('Flags atypical blast cells for urgent pathologist review without claiming to diagnose leukemia', () {
      final summary = CbcRulesEngine.evaluate(
        hemoglobin: 10.0,
        totalWbc: 3500,
        platelets: 80000,
        candidateBlastsPercent: 3.5,
      );

      expect(summary.requiresUrgentMedicalCheck, isTrue);
      final blastParam = summary.parameters.firstWhere((p) => p.parameterName == 'Blast Cells');
      expect(blastParam.flag, LabFlag.criticalHigh);
      // Ensure explanation does NOT claim to diagnose leukemia
      expect(blastParam.explanationEn.toLowerCase().contains('you have leukemia'), isFalse);
    });
  });
}
