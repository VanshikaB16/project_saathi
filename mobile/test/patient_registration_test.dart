import 'package:flutter_test/flutter_test.dart';
import 'package:project_saathi_mobile/features/patients/patient_model.dart';
import 'package:project_saathi_mobile/features/consent/consent_model.dart';

void main() {
  group('Patient Registration & Privacy-Preserving Identifier Tests', () {
    test('Non-biometric safe identifier serialization is sound', () {
      final patient = Patient(
        id: 'pat-101',
        safeIdentifier: 'SAA-RAM-2026-4421',
        villageName: 'रामपूर',
        ageYears: 52,
        gender: 'FEMALE',
        emergencyContact: '+919876543210',
        createdAt: '2026-10-15T10:00:00Z',
        updatedAt: '2026-10-15T10:00:00Z',
      );

      final map = patient.toMap();
      expect(map['safe_identifier'], 'SAA-RAM-2026-4421');
      expect(map['photo_uri'], isNull); // Optional, not mandatory

      final restored = Patient.fromMap(map);
      expect(restored.safeIdentifier, patient.safeIdentifier);
      expect(restored.ageYears, 52);
    });

    test('Consent record enforces unbundled optional research consent', () {
      final consent = Consent(
        id: 'con-1',
        patientId: 'pat-101',
        workerId: 'wp-1',
        screeningConsented: true,
        referralConsented: true,
        familyNotificationConsented: false,
        photoConsented: false,
        researchConsented: false, // Must remain independent
        timestamp: '2026-10-15T10:05:00Z',
      );

      expect(consent.screeningConsented, isTrue);
      expect(consent.researchConsented, isFalse);
    });
  });
}
