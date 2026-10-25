/**
 * Project Saathi - Core Domain Models & Schemas
 * Type-safe definitions for all 17 clinical and operational entities.
 */

export type UserRole = 
  | 'ASHA_WORKER'
  | 'PATIENT_FAMILY'
  | 'CLINICIAN'
  | 'DISTRICT_ADMIN'
  | 'SYSTEM_ADMIN';

export type ScreeningPathway = 'SKIN' | 'RETINA' | 'CHEST' | 'BLOOD_CBC';

export type ScreeningFlag = 
  | 'GREEN'
  | 'AMBER'
  | 'RED'
  | 'IMAGE_UNCLEAR'
  | 'MODEL_UNAVAILABLE'
  | 'CLINICIAN_REVIEW_REQUIRED'
  | 'EMERGENCY_PATHWAY';

export type UrgencyTier = 'ROUTINE' | 'SCHEDULED_CHECK' | 'PROMPT_ASSESSMENT' | 'EMERGENCY';

export type ReferralStatus = 
  | 'PENDING_DISPATCH'
  | 'REFERRED'
  | 'APPOINTMENT_SCHEDULED'
  | 'ATTENDED'
  | 'MISSED'
  | 'COMPLETED'
  | 'CLOSED_LOST_TO_FOLLOWUP';

export type NotificationChannel = 'SMS' | 'IN_APP' | 'FCM';
export type QueueStatus = 'WAITING_TO_SEND' | 'DISPATCHED' | 'DELIVERED' | 'FAILED';

export interface User {
  id: string;
  phoneNumber: string;
  role: UserRole;
  fullName: string;
  preferredLanguage: string;
  isActive: boolean;
  createdAt: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  workerBadgeId: string;
  subCentreId: string;
  primaryHealthCentreId: string;
  assignedVillages: string[];
  deviceFingerprint: string;
  lastSyncTimestamp: string;
}

export interface PatientProfile {
  id: string;
  safeIdentifier: string; // e.g., SAA-VIL-2026-0042
  createdByWorkerId: string;
  villageName: string;
  ageYears: number;
  gender: 'FEMALE' | 'MALE' | 'OTHER' | 'TRANS';
  preferredLanguage: string;
  preferredNameAudioUri?: string;
  photoUri?: string;
  emergencyContactPhone?: string;
  authorizedFamilyContact?: string;
  isSyntheticDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConsentRecord {
  id: string;
  patientId: string;
  workerId: string;
  consentVersion: string;
  screeningConsented: boolean;
  referralCoordinationConsented: boolean;
  familyNotificationConsented: boolean;
  photoStorageConsented: boolean;
  researchUseConsented: boolean; // Never bundled into care!
  isWithdrawn: boolean;
  withdrawalTimestamp?: string;
  timestamp: string;
}

export interface ScreeningSession {
  id: string;
  patientId: string;
  workerId: string;
  pathwayType: ScreeningPathway;
  deviceId: string;
  isOfflineSession: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface ScreeningResult {
  id: string;
  sessionId: string;
  patientId: string;
  modelId: string;
  modelVersion: string;
  flag: ScreeningFlag;
  urgencyTier: UrgencyTier;
  confidenceScore: number;
  primaryMessageEn: string;
  primaryMessageHi: string;
  recommendedActionEn: string;
  recommendedActionHi: string;
  followUpIntervalDays?: number;
  rawProbabilities?: Record<string, number>;
  createdAt: string;
}

export interface Referral {
  id: string;
  safeReferenceCode: string; // SAA-REF-10492
  patientId: string;
  originatingSessionId?: string;
  originatingWorkerId: string;
  destinationFacilityId: string;
  urgencyTier: UrgencyTier;
  status: ReferralStatus;
  reasonSummary: string;
  scheduledAppointmentId?: string;
  outcomeSummary?: string;
  closedAt?: string;
  closedByClinicianId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  facilityName: string;
  facilityType: 'PHC' | 'CHC' | 'DISTRICT_HOSPITAL' | 'MEDICAL_COLLEGE' | 'SPECIALTY_CLINIC';
  districtName: string;
  address: string;
  contactPhone: string;
  servicesOffered: string[];
  appointmentApiSupported: boolean;
  isActive: boolean;
  lastVerifiedDate: string;
}

export interface Appointment {
  id: string;
  referralId: string;
  facilityId: string;
  appointmentDate: string;
  timeSlot: string;
  bookingReference?: string;
  bookingStatus: 'QUEUED_OFFLINE' | 'CONFIRMED_API' | 'MANUAL_PHONE_CONFIRMED' | 'CANCELLED';
  attendanceStatus: 'PENDING' | 'ATTENDED' | 'MISSED' | 'RESCHEDULED';
  notes?: string;
  createdAt: string;
}

export interface FollowupTask {
  id: string;
  patientId: string;
  referralId?: string;
  assignedWorkerId: string;
  dueDate: string;
  taskType: 'RECHECK_EXAM' | 'MISSED_APPOINTMENT_VISIT' | 'TREATMENT_ADHERENCE' | 'FAMILY_COUNSELING';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';
  completedDate?: string;
  workerNotes?: string;
  createdAt: string;
}

export interface NotificationJob {
  id: string;
  patientId?: string;
  recipientPhone: string;
  channel: NotificationChannel;
  messageContent: string; // Neutral, no diagnoses!
  consentVerified: boolean;
  queueStatus: QueueStatus;
  retryCount: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: UserRole;
  actionType: string;
  entityType: string;
  entityId: string;
  ipAddress?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface DistrictAggregate {
  districtName: string;
  reportingPeriod: string;
  villageName: string;
  totalScreenings: number;
  uniquePatients: number;
  openReferrals: number;
  confirmedAppointments: number;
  completedReferrals: number;
  overdueFollowups: number;
  qualityRejections: number;
  isCellSuppressed: boolean; // True if count < 5
}
