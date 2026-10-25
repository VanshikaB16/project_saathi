class Patient {
  final String id;
  final String safeIdentifier;
  final String villageName;
  final int ageYears;
  final String gender;
  final String preferredLanguage;
  final String? emergencyContact;
  final String? authorizedFamily;
  final String? photoUri;
  final String? preferredNameAudioUri;
  final String createdAt;
  final String updatedAt;

  Patient({
    required this.id,
    required this.safeIdentifier,
    required this.villageName,
    required this.ageYears,
    required this.gender,
    this.preferredLanguage = 'hi',
    this.emergencyContact,
    this.authorizedFamily,
    this.photoUri,
    this.preferredNameAudioUri,
    required this.createdAt,
    required this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'safe_identifier': safeIdentifier,
      'village_name': villageName,
      'age_years': ageYears,
      'gender': gender,
      'preferred_language': preferredLanguage,
      'emergency_contact': emergencyContact,
      'authorized_family': authorizedFamily,
      'photo_uri': photoUri,
      'preferred_name_audio_uri': preferredNameAudioUri,
      'created_at': createdAt,
      'updated_at': updatedAt,
    };
  }

  factory Patient.fromMap(Map<String, dynamic> map) {
    return Patient(
      id: map['id'],
      safeIdentifier: map['safe_identifier'],
      villageName: map['village_name'],
      ageYears: map['age_years'],
      gender: map['gender'],
      preferredLanguage: map['preferred_language'] ?? 'hi',
      emergencyContact: map['emergency_contact'],
      authorizedFamily: map['authorized_family'],
      photoUri: map['photo_uri'],
      preferredNameAudioUri: map['preferred_name_audio_uri'],
      createdAt: map['created_at'],
      updatedAt: map['updated_at'],
    );
  }
}
