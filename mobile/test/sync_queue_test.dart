import 'package:flutter_test/flutter_test.dart';
import 'package:project_saathi_mobile/features/referrals/referral_model.dart';

void main() {
  group('Mobile Offline Referral & Sync Tests', () {
    test('Referral serialization retains open state without false premature closure', () {
      final referral = ReferralRecord(
        id: 'ref-999',
        safeReferenceCode: 'SAA-REF-77211',
        patientId: 'pat-101',
        destinationFacilityId: 'fac-chc-01',
        urgencyTier: 'PROMPT_ASSESSMENT',
        status: 'REFERRED',
        reasonSummary: 'Visible changing skin lesion requiring clinical dermoscopy assessment.',
        outcomeSummary: null, // Open follow-through loop!
        createdAt: '2026-10-15T11:00:00Z',
        updatedAt: '2026-10-15T11:00:00Z',
      );

      final map = referral.toMap();
      expect(map['status'], 'REFERRED');
      expect(map['outcome_summary'], isNull);

      final restored = ReferralRecord.fromMap(map);
      expect(restored.status, 'REFERRED');
      expect(restored.outcomeSummary, isNull);
    });
  });
}
