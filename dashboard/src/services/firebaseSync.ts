/**
 * Project Saathi - Firebase Firestore & Cloud Storage Integration Service
 * Uses standard Fetch API to connect directly to Firestore REST API & Cloud Storage.
 * Fully compliant with offline-first architecture (syncs local records to Cloud Firestore).
 */

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA1H1mfNmoI_ReKf85F-D8Amf6hOqDW8eI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'projectsaathi-e7fe4.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'projectsaathi-e7fe4',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'projectsaathi-e7fe4.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '635168137288',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:635168137288:web:3a3195a9334a4c74cb387d',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-GW61W1575S',
};

const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents`;

export interface FirebaseSyncResult {
  success: boolean;
  syncedCount: number;
  message: string;
}

class FirebaseService {
  public isConfigured(): boolean {
    return Boolean(FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.apiKey);
  }

  /**
   * Sync a patient profile to Cloud Firestore `patient_profiles` collection
   */
  public async syncPatient(patient: {
    id: string;
    safeIdentifier: string;
    villageName: string;
    ageYears: number;
    gender: string;
    emergencyContact?: string;
    photoUri?: string;
    createdAt: string;
  }): Promise<boolean> {
    try {
      const url = `${FIRESTORE_BASE_URL}/patient_profiles/${patient.id}?key=${FIREBASE_CONFIG.apiKey}`;
      const firestoreDoc = {
        fields: {
          id: { stringValue: patient.id },
          safe_identifier: { stringValue: patient.safeIdentifier },
          village_name: { stringValue: patient.villageName },
          age_years: { integerValue: String(patient.ageYears) },
          gender: { stringValue: patient.gender },
          emergency_contact: { stringValue: patient.emergencyContact || '' },
          photo_uri: { stringValue: patient.photoUri ? 'attached_in_storage' : '' },
          created_at: { timestampValue: new Date(patient.createdAt).toISOString() },
          sync_source: { stringValue: 'saathi-web-simulator' },
        },
      };

      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firestoreDoc),
      });

      return res.ok;
    } catch (err) {
      console.warn('Firebase Firestore patient sync error:', err);
      return false;
    }
  }

  /**
   * Sync a clinical referral to Cloud Firestore `referrals` collection
   */
  public async syncReferral(referral: {
    id: string;
    safeReferenceCode: string;
    patientSafeId: string;
    villageName: string;
    pathway: string;
    urgencyTier: string;
    status: string;
    facilityName: string;
    reasonSummary: string;
    outcomeSummary?: string;
    createdAt: string;
    updatedAt: string;
  }): Promise<boolean> {
    try {
      const url = `${FIRESTORE_BASE_URL}/referrals/${referral.id}?key=${FIREBASE_CONFIG.apiKey}`;
      const firestoreDoc = {
        fields: {
          id: { stringValue: referral.id },
          safe_reference_code: { stringValue: referral.safeReferenceCode },
          patient_safe_id: { stringValue: referral.patientSafeId },
          village_name: { stringValue: referral.villageName },
          pathway: { stringValue: referral.pathway },
          urgency_tier: { stringValue: referral.urgencyTier },
          status: { stringValue: referral.status },
          facility_name: { stringValue: referral.facilityName },
          reason_summary: { stringValue: referral.reasonSummary },
          outcome_summary: { stringValue: referral.outcomeSummary || '' },
          created_at: { timestampValue: new Date(referral.createdAt).toISOString() },
          updated_at: { timestampValue: new Date(referral.updatedAt).toISOString() },
          sync_source: { stringValue: 'saathi-web-simulator' },
        },
      };

      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firestoreDoc),
      });

      return res.ok;
    } catch (err) {
      console.warn('Firebase Firestore referral sync error:', err);
      return false;
    }
  }

  /**
   * Fetch patient profiles from Cloud Firestore
   */
  public async fetchPatients(): Promise<any[]> {
    try {
      const url = `${FIRESTORE_BASE_URL}/patient_profiles?key=${FIREBASE_CONFIG.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      if (!data.documents) return [];
      return data.documents.map((doc: any) => {
        const fields = doc.fields || {};
        return {
          id: fields.id?.stringValue || doc.name.split('/').pop(),
          safeIdentifier: fields.safe_identifier?.stringValue || '',
          villageName: fields.village_name?.stringValue || '',
          ageYears: parseInt(fields.age_years?.integerValue || '0', 10),
          gender: fields.gender?.stringValue || '',
          emergencyContact: fields.emergency_contact?.stringValue || '',
          photoUri: fields.photo_uri?.stringValue || undefined,
          createdAt: fields.created_at?.timestampValue || new Date().toISOString(),
        };
      });
    } catch (err) {
      console.warn('Error fetching patients from Firestore:', err);
      return [];
    }
  }

  /**
   * Fetch referrals from Cloud Firestore
   */
  public async fetchReferrals(): Promise<any[]> {
    try {
      const url = `${FIRESTORE_BASE_URL}/referrals?key=${FIREBASE_CONFIG.apiKey}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      if (!data.documents) return [];
      return data.documents.map((doc: any) => {
        const fields = doc.fields || {};
        return {
          id: fields.id?.stringValue || doc.name.split('/').pop(),
          safeReferenceCode: fields.safe_reference_code?.stringValue || '',
          patientSafeId: fields.patient_safe_id?.stringValue || '',
          villageName: fields.village_name?.stringValue || '',
          pathway: fields.pathway?.stringValue || '',
          urgencyTier: fields.urgency_tier?.stringValue || 'SCHEDULED_CHECK',
          status: fields.status?.stringValue || 'REFERRED',
          facilityName: fields.facility_name?.stringValue || '',
          reasonSummary: fields.reason_summary?.stringValue || '',
          outcomeSummary: fields.outcome_summary?.stringValue || undefined,
          createdAt: fields.created_at?.timestampValue || new Date().toISOString(),
          updatedAt: fields.updated_at?.timestampValue || new Date().toISOString(),
        };
      });
    } catch (err) {
      console.warn('Error fetching referrals from Firestore:', err);
      return [];
    }
  }

  /**
   * Sync all pending local offline records to Cloud Firestore
   */
  public async syncAllLocalRecords(
    patients: any[],
    referrals: any[]
  ): Promise<FirebaseSyncResult> {
    let synced = 0;
    try {
      for (const pat of patients) {
        const ok = await this.syncPatient(pat);
        if (ok) synced++;
      }
      for (const ref of referrals) {
        const ok = await this.syncReferral(ref);
        if (ok) synced++;
      }
      return {
        success: true,
        syncedCount: synced,
        message: `सफलतापूर्वक ${synced} रिकॉर्ड्स क्लाउड फायरबेस से सिंक हुए।`,
      };
    } catch (err: any) {
      return {
        success: false,
        syncedCount: synced,
        message: `सिंक में त्रुटि: ${err.message || 'Network error'}`,
      };
    }
  }
}

export const firebaseService = new FirebaseService();

