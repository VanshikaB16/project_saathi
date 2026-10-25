class LocalSchema {
  static const String tablePatients = 'patient_profiles';
  static const String tableConsent = 'consent_records';
  static const String tableScreenings = 'screening_results';
  static const String tableReferrals = 'referrals';
  static const String tableFollowups = 'followup_tasks';
  static const String tableSyncQueue = 'sync_queue';
  static const String tableAudit = 'audit_events';

  static const String createTablePatients = '''
    CREATE TABLE IF NOT EXISTS $tablePatients (
      id TEXT PRIMARY KEY,
      safe_identifier TEXT UNIQUE NOT NULL,
      village_name TEXT NOT NULL,
      age_years INTEGER NOT NULL,
      gender TEXT NOT NULL,
      preferred_language TEXT DEFAULT 'hi',
      emergency_contact TEXT,
      authorized_family TEXT,
      photo_uri TEXT,
      preferred_name_audio_uri TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  ''';

  static const String createTableConsent = '''
    CREATE TABLE IF NOT EXISTS $tableConsent (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      worker_id TEXT NOT NULL,
      consent_version TEXT NOT NULL,
      screening_consented INTEGER NOT NULL,
      referral_consented INTEGER NOT NULL,
      family_notification_consented INTEGER NOT NULL,
      photo_consented INTEGER NOT NULL,
      research_consented INTEGER NOT NULL,
      is_withdrawn INTEGER DEFAULT 0,
      timestamp TEXT NOT NULL
    );
  ''';

  static const String createTableScreenings = '''
    CREATE TABLE IF NOT EXISTS $tableScreenings (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      patient_id TEXT NOT NULL,
      model_id TEXT NOT NULL,
      flag TEXT NOT NULL,
      urgency_tier TEXT NOT NULL,
      primary_message TEXT NOT NULL,
      spoken_message TEXT NOT NULL,
      recommended_action TEXT NOT NULL,
      follow_up_days INTEGER,
      created_at TEXT NOT NULL
    );
  ''';

  static const String createTableReferrals = '''
    CREATE TABLE IF NOT EXISTS $tableReferrals (
      id TEXT PRIMARY KEY,
      safe_reference_code TEXT UNIQUE NOT NULL,
      patient_id TEXT NOT NULL,
      destination_facility_id TEXT NOT NULL,
      urgency_tier TEXT NOT NULL,
      status TEXT NOT NULL,
      reason_summary TEXT NOT NULL,
      outcome_summary TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  ''';

  static const String createTableSyncQueue = '''
    CREATE TABLE IF NOT EXISTS $tableSyncQueue (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      created_at TEXT NOT NULL
    );
  ''';
}
