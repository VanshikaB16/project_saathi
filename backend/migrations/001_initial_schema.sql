-- ==============================================================================
-- PROJECT SAATHI - DATABASE SCHEMA MIGRATION 001
-- Target: SQLite (Edge Client) & PostgreSQL (Cloud Relational Backend)
-- Covers all 17 clinical and operational entities with immutable audit trails.
-- ==============================================================================

-- 1. Users (ASHA workers, Clinicians, District Admins, System Admins)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('ASHA_WORKER', 'PATIENT_FAMILY', 'CLINICIAN', 'DISTRICT_ADMIN', 'SYSTEM_ADMIN')),
    full_name VARCHAR(128) NOT NULL,
    preferred_language VARCHAR(16) DEFAULT 'hi',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Worker Profiles (ASHA specific credentials and assignment areas)
CREATE TABLE IF NOT EXISTS worker_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    worker_badge_id VARCHAR(32) UNIQUE NOT NULL,
    sub_centre_id VARCHAR(64) NOT NULL,
    primary_health_centre_id VARCHAR(64) NOT NULL,
    assigned_villages TEXT NOT NULL, -- JSON array of village names
    device_fingerprint VARCHAR(128),
    last_sync_timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Patient Profiles (Privacy-preserving demographics, minimal data)
CREATE TABLE IF NOT EXISTS patient_profiles (
    id VARCHAR(64) PRIMARY KEY,
    safe_identifier VARCHAR(64) UNIQUE NOT NULL, -- e.g. SAA-VIL-2026-0042
    created_by_worker_id VARCHAR(64) NOT NULL REFERENCES worker_profiles(id),
    village_name VARCHAR(64) NOT NULL,
    age_years INTEGER NOT NULL,
    gender VARCHAR(16) NOT NULL CHECK (gender IN ('FEMALE', 'MALE', 'OTHER', 'TRANS')),
    preferred_language VARCHAR(16) DEFAULT 'hi',
    preferred_name_audio_uri TEXT, -- Optional audio recording
    photo_uri TEXT,                -- Optional photo (never mandatory)
    emergency_contact_phone VARCHAR(20),
    authorized_family_contact VARCHAR(20),
    is_synthetic_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Consent Records (Granular, unbundled, versioned)
CREATE TABLE IF NOT EXISTS consent_records (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id),
    worker_id VARCHAR(64) NOT NULL REFERENCES worker_profiles(id),
    consent_version VARCHAR(16) NOT NULL,
    screening_consented BOOLEAN NOT NULL DEFAULT TRUE,
    referral_coordination_consented BOOLEAN NOT NULL DEFAULT FALSE,
    family_notification_consented BOOLEAN NOT NULL DEFAULT FALSE,
    photo_storage_consented BOOLEAN NOT NULL DEFAULT FALSE,
    research_use_consented BOOLEAN NOT NULL DEFAULT FALSE, -- Never bundled!
    is_withdrawn BOOLEAN DEFAULT FALSE,
    withdrawal_timestamp TIMESTAMP,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Screening Sessions (Session tracking)
CREATE TABLE IF NOT EXISTS screening_sessions (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id),
    worker_id VARCHAR(64) NOT NULL REFERENCES worker_profiles(id),
    pathway_type VARCHAR(32) NOT NULL CHECK (pathway_type IN ('SKIN', 'RETINA', 'CHEST', 'BLOOD_CBC')),
    device_id VARCHAR(64) NOT NULL,
    is_offline_session BOOLEAN DEFAULT TRUE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 6. Screening Results (Triage flags: GREEN, AMBER, RED - Never Diagnosis)
CREATE TABLE IF NOT EXISTS screening_results (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL REFERENCES screening_sessions(id),
    patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id),
    model_id VARCHAR(64) NOT NULL,
    model_version VARCHAR(32) NOT NULL,
    flag VARCHAR(32) NOT NULL CHECK (flag IN ('GREEN', 'AMBER', 'RED', 'IMAGE_UNCLEAR', 'MODEL_UNAVAILABLE', 'CLINICIAN_REVIEW_REQUIRED', 'EMERGENCY_PATHWAY')),
    urgency_tier VARCHAR(32) NOT NULL CHECK (urgency_tier IN ('ROUTINE', 'SCHEDULED_CHECK', 'PROMPT_ASSESSMENT', 'EMERGENCY')),
    confidence_score REAL,
    primary_message_en TEXT NOT NULL,
    primary_message_hi TEXT NOT NULL,
    recommended_action_en TEXT NOT NULL,
    recommended_action_hi TEXT NOT NULL,
    follow_up_interval_days INTEGER,
    raw_probabilities_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Model Registry (Approved versions, rollback capabilities)
CREATE TABLE IF NOT EXISTS model_registry (
    model_id VARCHAR(64) PRIMARY KEY,
    model_name VARCHAR(128) NOT NULL,
    pathway_type VARCHAR(32) NOT NULL,
    approved_version VARCHAR(32) NOT NULL,
    sha256_checksum VARCHAR(64) NOT NULL,
    is_demonstration BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    clinical_approval_status VARCHAR(32) NOT NULL,
    minimum_sensitivity REAL NOT NULL,
    minimum_specificity REAL NOT NULL,
    approved_by_clinician_id VARCHAR(64),
    effective_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Lab Reports (CBC and blood smear reports)
CREATE TABLE IF NOT EXISTS lab_reports (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id),
    session_id VARCHAR(64) REFERENCES screening_sessions(id),
    report_type VARCHAR(32) NOT NULL CHECK (report_type IN ('CBC_REPORT', 'BLOOD_SMEAR_MICROSCOPE')),
    source_image_uri TEXT,
    ocr_confidence_score REAL,
    ocr_verified_by_worker BOOLEAN DEFAULT FALSE,
    manual_corrections_made BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Extracted Lab Values (Verified numbers from CBC)
CREATE TABLE IF NOT EXISTS lab_values (
    id VARCHAR(64) PRIMARY KEY,
    report_id VARCHAR(64) NOT NULL REFERENCES lab_reports(id),
    parameter_code VARCHAR(32) NOT NULL, -- HEMOGLOBIN, WBC, PLATELET, NEUTROPHILS, BLASTS
    numeric_value REAL NOT NULL,
    units VARCHAR(32) NOT NULL,
    reference_low REAL,
    reference_high REAL,
    flag_state VARCHAR(16) CHECK (flag_state IN ('NORMAL', 'LOW', 'CRITICAL_LOW', 'HIGH', 'CRITICAL_HIGH')),
    is_manually_corrected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Referrals (Follow-through loop - stays OPEN until outcome)
CREATE TABLE IF NOT EXISTS referrals (
    id VARCHAR(64) PRIMARY KEY,
    safe_reference_code VARCHAR(32) UNIQUE NOT NULL, -- SAA-REF-10492
    patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id),
    originating_session_id VARCHAR(64) REFERENCES screening_sessions(id),
    originating_worker_id VARCHAR(64) NOT NULL REFERENCES worker_profiles(id),
    destination_facility_id VARCHAR(64) NOT NULL,
    urgency_tier VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('PENDING_DISPATCH', 'REFERRED', 'APPOINTMENT_SCHEDULED', 'ATTENDED', 'MISSED', 'COMPLETED', 'CLOSED_LOST_TO_FOLLOWUP')),
    reason_summary TEXT NOT NULL,
    scheduled_appointment_id VARCHAR(64),
    outcome_summary TEXT,
    closed_at TIMESTAMP,
    closed_by_clinician_id VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Facilities (Authorized Primary, Community, and District Hospitals)
CREATE TABLE IF NOT EXISTS facilities (
    id VARCHAR(64) PRIMARY KEY,
    facility_name VARCHAR(128) NOT NULL,
    facility_type VARCHAR(32) NOT NULL CHECK (facility_type IN ('PHC', 'CHC', 'DISTRICT_HOSPITAL', 'MEDICAL_COLLEGE', 'SPECIALTY_CLINIC')),
    district_name VARCHAR(64) NOT NULL,
    address TEXT NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    services_offered TEXT NOT NULL, -- JSON array of clinical services
    appointment_api_supported BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_verified_date DATE NOT NULL
);

-- 12. Appointments (Idempotent booking tracking)
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(64) PRIMARY KEY,
    referral_id VARCHAR(64) NOT NULL REFERENCES referrals(id),
    facility_id VARCHAR(64) NOT NULL REFERENCES facilities(id),
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(32) NOT NULL,
    booking_reference VARCHAR(64),
    booking_status VARCHAR(32) NOT NULL CHECK (booking_status IN ('QUEUED_OFFLINE', 'CONFIRMED_API', 'MANUAL_PHONE_CONFIRMED', 'CANCELLED')),
    attendance_status VARCHAR(32) DEFAULT 'PENDING' CHECK (attendance_status IN ('PENDING', 'ATTENDED', 'MISSED', 'RESCHEDULED')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Follow-up Tasks (ASHA recheck reminders)
CREATE TABLE IF NOT EXISTS followup_tasks (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) NOT NULL REFERENCES patient_profiles(id),
    referral_id VARCHAR(64) REFERENCES referrals(id),
    assigned_worker_id VARCHAR(64) NOT NULL REFERENCES worker_profiles(id),
    due_date DATE NOT NULL,
    task_type VARCHAR(32) NOT NULL CHECK (task_type IN ('RECHECK_EXAM', 'MISSED_APPOINTMENT_VISIT', 'TREATMENT_ADHERENCE', 'FAMILY_COUNSELING')),
    status VARCHAR(32) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'OVERDUE')),
    completed_date TIMESTAMP,
    worker_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Notification Jobs (Queued messages)
CREATE TABLE IF NOT EXISTS notification_jobs (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) REFERENCES patient_profiles(id),
    recipient_phone VARCHAR(20) NOT NULL,
    channel VARCHAR(16) NOT NULL CHECK (channel IN ('SMS', 'IN_APP', 'FCM')),
    message_content TEXT NOT NULL, -- Must be neutral, NO diagnoses
    consent_verified BOOLEAN NOT NULL DEFAULT TRUE,
    queue_status VARCHAR(32) NOT NULL CHECK (queue_status IN ('WAITING_TO_SEND', 'DISPATCHED', 'DELIVERED', 'FAILED')),
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Notification Events (Audit of deliveries)
CREATE TABLE IF NOT EXISTS notification_events (
    id VARCHAR(64) PRIMARY KEY,
    job_id VARCHAR(64) NOT NULL REFERENCES notification_jobs(id),
    provider_name VARCHAR(32) NOT NULL,
    provider_response_code VARCHAR(64),
    delivery_status VARCHAR(32) NOT NULL,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Sync Events (Idempotent mobile-to-cloud synchronization)
CREATE TABLE IF NOT EXISTS sync_events (
    id VARCHAR(64) PRIMARY KEY,
    device_id VARCHAR(64) NOT NULL,
    worker_id VARCHAR(64) NOT NULL,
    batch_size INTEGER NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('SYNC_PENDING', 'SYNCING', 'SYNCED', 'SYNC_CONFLICT', 'SYNC_FAILED')),
    conflicts_count INTEGER DEFAULT 0,
    sync_started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_completed_at TIMESTAMP
);

-- 17. Audit Logs (Tamper-evident logs of logins, syncs, referrals, consent)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor_id VARCHAR(64) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45),
    details_json TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. District Aggregates (Precalculated anonymized metrics with small-cell suppression < 5)
CREATE TABLE IF NOT EXISTS district_aggregates (
    id VARCHAR(64) PRIMARY KEY,
    district_name VARCHAR(64) NOT NULL,
    reporting_period VARCHAR(16) NOT NULL, -- e.g. '2026-Q3'
    village_name VARCHAR(64) NOT NULL,
    total_screenings_count INTEGER NOT NULL,
    unique_patients_count INTEGER NOT NULL,
    open_referrals_count INTEGER NOT NULL,
    confirmed_appointments_count INTEGER NOT NULL,
    completed_referrals_count INTEGER NOT NULL,
    overdue_followups_count INTEGER NOT NULL,
    quality_rejections_count INTEGER NOT NULL,
    is_cell_suppressed BOOLEAN DEFAULT FALSE, -- Set TRUE if any count < 5
    last_aggregated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
