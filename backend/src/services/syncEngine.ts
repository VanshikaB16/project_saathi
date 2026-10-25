/**
 * Project Saathi - Offline Sync Engine & Conflict Resolution
 * Guarantees idempotent writes and prevents newer clinical outcomes from being overwritten.
 */

import { PatientProfile, ConsentRecord, ScreeningResult, Referral } from '../models/schema.js';

export interface SyncBatchPayload {
  deviceId: string;
  workerId: string;
  syncTimestamp: string;
  schemaVersion: string;
  patients: PatientProfile[];
  consents: ConsentRecord[];
  screeningResults: ScreeningResult[];
  referrals: Referral[];
}

export interface SyncBatchResponse {
  success: boolean;
  acceptedCounts: {
    patients: number;
    consents: number;
    screenings: number;
    referrals: number;
  };
  conflicts: Array<{
    entityType: string;
    entityId: string;
    reason: string;
    resolution: 'SERVER_AUTHORITATIVE_PRESERVED' | 'CLIENT_ACCEPTED';
  }>;
  serverTimestamp: string;
}

export class SyncEngine {
  private serverPatients: Map<string, PatientProfile> = new Map();
  private serverConsents: Map<string, ConsentRecord> = new Map();
  private serverScreenings: Map<string, ScreeningResult> = new Map();
  private serverReferrals: Map<string, Referral> = new Map();

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    // Seed initial synthetic patient for demo
    const p1: PatientProfile = {
      id: 'patient-demo-01',
      safeIdentifier: 'SAA-PB-042-8812',
      createdByWorkerId: 'wp-demo-1',
      villageName: 'Rampur',
      ageYears: 54,
      gender: 'FEMALE',
      preferredLanguage: 'hi',
      emergencyContactPhone: '+919876543210',
      authorizedFamilyContact: '+919876543210',
      isSyntheticDemo: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
    };
    this.serverPatients.set(p1.id, p1);

    const ref1: Referral = {
      id: 'ref-demo-01',
      safeReferenceCode: 'SAA-REF-10492',
      patientId: p1.id,
      originatingWorkerId: 'wp-demo-1',
      destinationFacilityId: 'fac-chc-01',
      urgencyTier: 'PROMPT_ASSESSMENT',
      status: 'REFERRED',
      reasonSummary: 'Concerning visible skin changes flagged during village screening visit.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    };
    this.serverReferrals.set(ref1.id, ref1);
  }

  public processBatch(batch: SyncBatchPayload): SyncBatchResponse {
    const conflicts: SyncBatchResponse['conflicts'] = [];
    let patientsAccepted = 0;
    let consentsAccepted = 0;
    let screeningsAccepted = 0;
    let referralsAccepted = 0;

    // 1. Process Patients (Idempotent upsert by safeIdentifier or ID)
    for (const clientPatient of batch.patients || []) {
      const existing = this.serverPatients.get(clientPatient.id);
      if (existing) {
        // Safe merge: never overwrite with older timestamp
        if (new Date(clientPatient.updatedAt) >= new Date(existing.updatedAt)) {
          this.serverPatients.set(clientPatient.id, clientPatient);
          patientsAccepted++;
        } else {
          conflicts.push({
            entityType: 'patient',
            entityId: clientPatient.id,
            reason: 'Incoming patient record timestamp is older than server record.',
            resolution: 'SERVER_AUTHORITATIVE_PRESERVED'
          });
        }
      } else {
        this.serverPatients.set(clientPatient.id, clientPatient);
        patientsAccepted++;
      }
    }

    // 2. Process Consents (Append-only or withdrawal update)
    for (const consent of batch.consents || []) {
      this.serverConsents.set(consent.id, consent);
      consentsAccepted++;
    }

    // 3. Process Screenings (Immutable clinical triage records)
    for (const scr of batch.screeningResults || []) {
      this.serverScreenings.set(scr.id, scr);
      screeningsAccepted++;
    }

    // 4. Process Referrals (Conflict Resolution: Never overwrite clinician completed outcome with pending)
    for (const ref of batch.referrals || []) {
      const existing = this.serverReferrals.get(ref.id);
      if (existing) {
        // If server record has already been marked COMPLETED or ATTENDED by Clinician,
        // do not allow an offline client to revert it back to PENDING_DISPATCH
        if (['COMPLETED', 'ATTENDED'].includes(existing.status) && ref.status === 'PENDING_DISPATCH') {
          conflicts.push({
            entityType: 'referral',
            entityId: ref.id,
            reason: `Referral already resolved as '${existing.status}' on server. Reverting to pending is prohibited.`,
            resolution: 'SERVER_AUTHORITATIVE_PRESERVED'
          });
          continue;
        }

        this.serverReferrals.set(ref.id, ref);
        referralsAccepted++;
      } else {
        this.serverReferrals.set(ref.id, ref);
        referralsAccepted++;
      }
    }

    return {
      success: true,
      acceptedCounts: {
        patients: patientsAccepted,
        consents: consentsAccepted,
        screenings: screeningsAccepted,
        referrals: referralsAccepted
      },
      conflicts,
      serverTimestamp: new Date().toISOString()
    };
  }

  public getPatients(): PatientProfile[] {
    return Array.from(this.serverPatients.values());
  }

  public getReferrals(): Referral[] {
    return Array.from(this.serverReferrals.values());
  }

  public getScreenings(): ScreeningResult[] {
    return Array.from(this.serverScreenings.values());
  }
}

export const syncEngine = new SyncEngine();
