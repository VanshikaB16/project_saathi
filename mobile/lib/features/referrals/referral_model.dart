class ReferralRecord {
  final String id;
  final String safeReferenceCode;
  final String patientId;
  final String destinationFacilityId;
  final String urgencyTier;
  final String status;
  final String reasonSummary;
  final String? outcomeSummary;
  final String createdAt;
  final String updatedAt;

  ReferralRecord({
    required this.id,
    required this.safeReferenceCode,
    required this.patientId,
    required this.destinationFacilityId,
    required this.urgencyTier,
    required this.status,
    required this.reasonSummary,
    this.outcomeSummary,
    required this.createdAt,
    required this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'safe_reference_code': safeReferenceCode,
      'patient_id': patientId,
      'destination_facility_id': destinationFacilityId,
      'urgency_tier': urgencyTier,
      'status': status,
      'reason_summary': reasonSummary,
      'outcome_summary': outcomeSummary,
      'created_at': createdAt,
      'updated_at': updatedAt,
    };
  }

  factory ReferralRecord.fromMap(Map<String, dynamic> map) {
    return ReferralRecord(
      id: map['id'],
      safeReferenceCode: map['safe_reference_code'],
      patientId: map['patient_id'],
      destinationFacilityId: map['destination_facility_id'],
      urgencyTier: map['urgency_tier'],
      status: map['status'],
      reasonSummary: map['reason_summary'],
      outcomeSummary: map['outcome_summary'],
      createdAt: map['created_at'],
      updatedAt: map['updated_at'],
    );
  }
}
