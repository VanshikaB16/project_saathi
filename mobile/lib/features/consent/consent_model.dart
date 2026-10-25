class Consent {
  final String id;
  final String patientId;
  final String workerId;
  final String consentVersion;
  final bool screeningConsented;
  final bool referralConsented;
  final bool familyNotificationConsented;
  final bool photoConsented;
  final bool researchConsented; // Never bundled into care!
  final bool isWithdrawn;
  final String timestamp;

  Consent({
    required this.id,
    required this.patientId,
    required this.workerId,
    this.consentVersion = 'v1.0.0',
    this.screeningConsented = true,
    this.referralConsented = false,
    this.familyNotificationConsented = false,
    this.photoConsented = false,
    this.researchConsented = false,
    this.isWithdrawn = false,
    required this.timestamp,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'patient_id': patientId,
      'worker_id': workerId,
      'consent_version': consentVersion,
      'screening_consented': screeningConsented ? 1 : 0,
      'referral_consented': referralConsented ? 1 : 0,
      'family_notification_consented': familyNotificationConsented ? 1 : 0,
      'photo_consented': photoConsented ? 1 : 0,
      'research_consented': researchConsented ? 1 : 0,
      'is_withdrawn': isWithdrawn ? 1 : 0,
      'timestamp': timestamp,
    };
  }

  factory Consent.fromMap(Map<String, dynamic> map) {
    return Consent(
      id: map['id'],
      patientId: map['patient_id'],
      workerId: map['worker_id'],
      consentVersion: map['consent_version'] ?? 'v1.0.0',
      screeningConsented: map['screening_consented'] == 1,
      referralConsented: map['referral_consented'] == 1,
      familyNotificationConsented: map['family_notification_consented'] == 1,
      photoConsented: map['photo_consented'] == 1,
      researchConsented: map['research_consented'] == 1,
      isWithdrawn: map['is_withdrawn'] == 1,
      timestamp: map['timestamp'],
    );
  }
}
