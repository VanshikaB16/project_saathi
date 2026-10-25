/**
 * Project Saathi - Client-Side Offline Data Store
 * Persists data locally in browser localStorage, simulating the on-device SQLite database.
 * Supports offline-first operations without requiring continuous network access.
 */

import { firebaseService } from './firebaseSync';
import { VillageAggregate } from './mockData';

export interface StoredScreening {
  id: string;
  patientSafeId: string;
  pathway: string;
  resultFlag: 'GREEN' | 'AMBER' | 'RED';
  timestamp: string;
}

export interface StoredPatient {
  id: string;
  safeIdentifier: string;
  name?: string;
  villageName: string;
  ageYears: number;
  gender: string;
  emergencyContact?: string;
  photoUri?: string;
  createdAt: string;
}

export interface StoredReferral {
  id: string;
  safeReferenceCode: string;
  patientSafeId: string;
  villageName: string;
  pathway: string;
  urgencyTier: string;
  status: 'PENDING_DISPATCH' | 'REFERRED' | 'APPOINTMENT_SCHEDULED' | 'ATTENDED' | 'COMPLETED' | 'MISSED';
  facilityName: string;
  reasonSummary: string;
  outcomeSummary?: string;
  // Doctor & ASHA Follow-up Loop Closure
  followupRequested?: boolean;
  followupDays?: number;
  doctorInitialAdvice?: string;
  doctorName?: string;
  linkedFollowupId?: string;
  doctorPostFollowupComment?: string;
  doctorCommentedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredFollowup {
  id: string;
  patientSafeId: string;
  patientName: string;
  patientAge: number;
  villageName: string;
  taskTitle: string;
  dueLabel: string;
  status: 'PENDING' | 'VISITED';
  referralCode?: string; // Links this follow-up slip to the hospital referral code
  doctorInitialAdvice?: string; // Doctor's instructions for the follow-up
  doctorName?: string; // Doctor who prescribed or reviewed
  ashaVisitNotes?: string; // Clinical observations noted by ASHA during home visit
  doctorPostFollowupComment?: string; // Doctor's further comment / review after ASHA visits
  doctorCommentedAt?: string; // When doctor provided the follow-up comment
  createdAt: string;
  visitedAt?: string;
}

export interface StoredCamp {
  id: string;
  name: string;
  date: string;
  village: string;
  targetPopulation: string;
  allocatedStaff: string;
  equipmentReady: string;
  status: 'PLANNING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  rosterDetails?: {
    medicalOfficer: string;
    ashaWorkers: string[];
    labTechnician: string;
    vanDetails?: string;
  };
  createdAt: string;
}

const INITIAL_PATIENTS: StoredPatient[] = [
  {
    id: 'pat-01',
    safeIdentifier: 'SAA-RAM-2026-4421',
    name: 'सुनीता देवी (Sunita Devi)',
    villageName: 'रामपूर (Rampur)',
    ageYears: 54,
    gender: 'FEMALE',
    emergencyContact: '+919876543210',
    createdAt: '2026-10-14T09:30:00Z',
  },
  {
    id: 'pat-02',
    safeIdentifier: 'SAA-KAL-2026-8812',
    name: 'बलबीर सिंह (Balbir Singh)',
    villageName: 'कल्याणपुर (Kalyanpur)',
    ageYears: 62,
    gender: 'MALE',
    emergencyContact: '+919812345678',
    createdAt: '2026-10-13T14:15:00Z',
  },
  {
    id: 'pat-03',
    safeIdentifier: 'SAA-SUN-2026-1049',
    name: 'मंजीत कौर (Manjeet Kaur)',
    villageName: 'सुंदरनगर (Sundernagar)',
    ageYears: 48,
    gender: 'FEMALE',
    emergencyContact: '+919855512345',
    createdAt: '2026-10-12T11:00:00Z',
  },
];

const INITIAL_REFERRALS: StoredReferral[] = [
  {
    id: 'ref-01',
    safeReferenceCode: 'SAA-REF-10492',
    patientSafeId: 'SAA-RAM-2026-4421',
    villageName: 'रामपूर',
    pathway: 'त्वचा लक्षण स्क्रीनिंग',
    urgencyTier: 'PROMPT_ASSESSMENT',
    status: 'APPOINTMENT_SCHEDULED',
    facilityName: 'Nabha Community Health Centre (CHC)',
    reasonSummary: 'असामान्य त्वचा बदलाव एवं नीले निशान दिखे।',
    followupRequested: true,
    followupDays: 5,
    doctorInitialAdvice: 'त्वचा घाव की स्थिति और लाली की जाँच 5 दिन बाद आशा कार्यकर्ता द्वारा की जाए। दवा अनुपालन सुनिश्चित करें।',
    doctorName: 'डॉ. राजीव वर्मा (Dr. Rajiv Verma)',
    linkedFollowupId: 'foll-01',
    createdAt: '2026-10-14T10:00:00Z',
    updatedAt: '2026-10-14T10:00:00Z',
  },
  {
    id: 'ref-02',
    safeReferenceCode: 'SAA-REF-20188',
    patientSafeId: 'SAA-KAL-2026-8812',
    villageName: 'कल्याणपुर',
    pathway: 'आंख एवं रेटिना स्क्रीनिंग',
    urgencyTier: 'PROMPT_ASSESSMENT',
    status: 'REFERRED',
    facilityName: 'Mata Kaushalya District Hospital',
    reasonSummary: 'मधुमेह के साथ धुंधली दृष्टि। नेत्र विशेषज्ञ परामर्श आवश्यक।',
    createdAt: '2026-10-13T15:00:00Z',
    updatedAt: '2026-10-13T15:00:00Z',
  },
  {
    id: 'ref-03',
    safeReferenceCode: 'SAA-REF-30911',
    patientSafeId: 'SAA-SUN-2026-1049',
    villageName: 'सुंदरनगर',
    pathway: 'सीबीसी रक्त फनल',
    urgencyTier: 'PROMPT_ASSESSMENT',
    status: 'COMPLETED',
    facilityName: 'Nabha Community Health Centre (CHC)',
    reasonSummary: 'प्लेटलेट्स 45,000 /uL।',
    outcomeSummary: 'वरिष्ठ चिकित्सा अधिकारी द्वारा जांच संपन्न। प्लेटलेट्स सुधरकर 90,000 हुई। छुट्टी दी गई।',
    createdAt: '2026-10-12T12:00:00Z',
    updatedAt: '2026-10-14T16:00:00Z',
  },
];

const INITIAL_FOLLOWUPS: StoredFollowup[] = [
  {
    id: 'foll-01',
    patientSafeId: 'SAA-RAM-2026-4421',
    patientName: 'सुनीता देवी (Sunita Devi)',
    patientAge: 54,
    villageName: 'रामपूर (Rampur)',
    taskTitle: 'त्वचा पुनः जाँच (Skin Recheck)',
    dueLabel: 'Due Tomorrow',
    status: 'PENDING',
    referralCode: 'SAA-REF-10492',
    doctorInitialAdvice: 'डॉ. राजीव वर्मा: 5 दिन बाद घाव के भरने और लाली की स्थिति पुनः जाँचें। दवा का असर देखें।',
    doctorName: 'डॉ. राजीव वर्मा (Dr. Rajiv Verma)',
    createdAt: '2026-10-14T10:00:00Z',
  },
  {
    id: 'foll-02',
    patientSafeId: 'SAA-KAL-2026-8812',
    patientName: 'राजिंदर सिंह (Rajinder Singh)',
    patientAge: 62,
    villageName: 'कल्याणपुर (Kalyanpur)',
    taskTitle: 'नेत्र दृष्टि जांच (Vision Recheck)',
    dueLabel: 'Due in 2 days',
    status: 'PENDING',
    referralCode: 'SAA-REF-20188',
    doctorInitialAdvice: 'डॉ. अमिता कौल: 7 दिन बाद विज़न सुधार व दवा अनुपालन की गृह भेंट करें।',
    doctorName: 'डॉ. अमिता कौल (Dr. Amita Kaul)',
    createdAt: '2026-10-13T15:00:00Z',
  },
];

const INITIAL_SCREENINGS: StoredScreening[] = [
  {
    id: 'scr-01',
    patientSafeId: 'SAA-RAM-2026-4421',
    pathway: 'Skin Sign Screening',
    resultFlag: 'AMBER',
    timestamp: '2026-10-14T09:45:00Z',
  },
  {
    id: 'scr-02',
    patientSafeId: 'SAA-KAL-2026-8812',
    pathway: 'Eye / Retina Screening',
    resultFlag: 'RED',
    timestamp: '2026-10-13T14:30:00Z',
  },
  {
    id: 'scr-03',
    patientSafeId: 'SAA-SUN-2026-1049',
    pathway: 'CBC Blood Funnel',
    resultFlag: 'RED',
    timestamp: '2026-10-12T11:20:00Z',
  },
];

const INITIAL_CAMPS: StoredCamp[] = [
  {
    id: 'camp-01',
    name: 'Rampur Gram Panchayat Health Mela',
    date: '2026-10-24',
    village: 'Rampur',
    targetPopulation: 'Elderly & NCD High-Risk (बुजुर्ग एवं गैर-संचारी रोग)',
    allocatedStaff: '4 ASHA Workers, 1 MO, 1 Lab Tech',
    equipmentReady: 'Portable CBC, 1 Fundus Lens',
    status: 'CONFIRMED',
    rosterDetails: {
      medicalOfficer: 'डॉ. राजीव वर्मा (Dr. Rajiv Verma, MO PHC Rampur)',
      ashaWorkers: ['सुनीता कौर (ASHA-01)', 'कमलेश देवी (ASHA-02)', 'हरप्रीत कौर (ASHA-03)', 'पूजा रानी (ASHA-04)'],
      labTechnician: 'गुरप्रीत सिंह (Lab Tech, Rampur PHC)',
      vanDetails: 'Patiala District Health Mobile Van #PB-11-2041',
    },
    notes: 'विशेष फोकस: मधुमेह, उच्च रक्तचाप एवं मोतियाबिंद/रेटिनोपैथी स्क्रीनिंग।',
    createdAt: '2026-10-18T09:00:00Z',
  },
  {
    id: 'camp-02',
    name: 'Kalyanpur Mobile Screening Camp',
    date: '2026-11-02',
    village: 'Kalyanpur',
    targetPopulation: 'General Community & School Children (सामान्य ग्रामीण समुदाय)',
    allocatedStaff: '3 ASHA Workers, 1 Mobile Van, 1 MO',
    equipmentReady: 'Digital Radiograph Van Scheduled',
    status: 'PLANNING',
    rosterDetails: {
      medicalOfficer: 'डॉ. अमिता कौल (Dr. Amita Kaul, MO Nabha CHC)',
      ashaWorkers: ['मंजीत कौर (ASHA-05)', 'बलजीत कौर (ASHA-06)', 'रेखा शर्मा (ASHA-07)'],
      labTechnician: 'राजेश कुमार (Lab Tech, Nabha CHC)',
      vanDetails: 'NTEP Digital X-Ray Van #PB-11-9921',
    },
    notes: 'क्षयरोग (TB) संभावित लक्षण एवं सीबीसी रक्त एनीमिया जांच शिविर।',
    createdAt: '2026-10-20T11:30:00Z',
  },
  {
    id: 'camp-03',
    name: 'Sundernagar NCD & Eye Outreach Camp',
    date: '2026-11-08',
    village: 'Sundernagar',
    targetPopulation: 'High Referral Demand & Follow-up Gap Cohort (फॉलो-अप अंतराल समाधान)',
    allocatedStaff: '3 ASHA Workers, 1 Optometrist, 1 MO',
    equipmentReady: 'Non-Mydriatic Fundus Camera, BP/Glucose Kit',
    status: 'PLANNING',
    rosterDetails: {
      medicalOfficer: 'डॉ. सुखविंदर सिंह (Dr. Sukhwinder Singh, Eye Specialist)',
      ashaWorkers: ['सिमरनजीत कौर (ASHA-08)', 'जसप्रीत कौर (ASHA-09)', 'अमनदीप कौर (ASHA-10)'],
      labTechnician: 'विकास मेहरा (Senior Lab Tech)',
      vanDetails: 'District Mobile Outreach Van #PB-11-4012',
    },
    notes: 'सुंदरनगर में पहचाने गए सेवा अंतराल और लंबित फॉलो-अप को पूरा करने हेतु विशेष शिविर।',
    createdAt: '2026-10-22T14:00:00Z',
  },
];

class OfflineStore {
  private isOnline: boolean = true;
  private pendingSyncCount: number = 3;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', () => {
        this.notify();
      });
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public notify(): void {
    this.listeners.forEach(l => {
      try {
        l();
      } catch {}
    });
  }

  public getPatients(): StoredPatient[] {
    try {
      const data = localStorage.getItem('saathi_patients');
      return data ? JSON.parse(data) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  }

  public savePatient(patient: StoredPatient): void {
    const list = this.getPatients();
    list.unshift(patient);
    try {
      localStorage.setItem('saathi_patients', JSON.stringify(list));
    } catch {}
    this.pendingSyncCount++;
    this.notify();

    if (this.isOnline) {
      firebaseService.syncPatient(patient).then((ok) => {
        if (ok && this.pendingSyncCount > 0) this.pendingSyncCount--;
        this.notify();
      }).catch(() => {});
    }
  }

  public getReferrals(): StoredReferral[] {
    try {
      const data = localStorage.getItem('saathi_referrals');
      return data ? JSON.parse(data) : INITIAL_REFERRALS;
    } catch {
      return INITIAL_REFERRALS;
    }
  }

  public saveReferral(referral: StoredReferral): void {
    const list = this.getReferrals();
    list.unshift(referral);
    try {
      localStorage.setItem('saathi_referrals', JSON.stringify(list));
    } catch {}
    this.pendingSyncCount++;
    this.notify();

    if (this.isOnline) {
      firebaseService.syncReferral(referral).then((ok) => {
        if (ok && this.pendingSyncCount > 0) this.pendingSyncCount--;
        this.notify();
      }).catch(() => {});
    }
  }

  public updateReferralOutcome(id: string, outcomeSummary: string, status: StoredReferral['status'] = 'COMPLETED'): void {
    const list = this.getReferrals();
    const item = list.find(r => r.id === id);
    if (item) {
      item.outcomeSummary = outcomeSummary;
      item.status = status;
      item.updatedAt = new Date().toISOString();
      try {
        localStorage.setItem('saathi_referrals', JSON.stringify(list));
      } catch {}
      this.pendingSyncCount++;
      this.notify();

      if (this.isOnline) {
        firebaseService.syncReferral(item).then((ok) => {
          if (ok && this.pendingSyncCount > 0) this.pendingSyncCount--;
          this.notify();
        }).catch(() => {});
      }
    }
  }

  public getOpenReferrals(): StoredReferral[] {
    return this.getReferrals().filter(r => r.status !== 'COMPLETED');
  }

  public getFollowups(): StoredFollowup[] {
    try {
      const data = localStorage.getItem('saathi_followups');
      return data ? JSON.parse(data) : INITIAL_FOLLOWUPS;
    } catch {
      return INITIAL_FOLLOWUPS;
    }
  }

  public saveFollowup(followup: StoredFollowup): void {
    const list = this.getFollowups();
    list.unshift(followup);
    try {
      localStorage.setItem('saathi_followups', JSON.stringify(list));
    } catch {}
    this.pendingSyncCount++;
    this.notify();
  }

  public markFollowupVisited(id: string, ashaVisitNotes?: string): void {
    const list = this.getFollowups();
    const item = list.find(f => f.id === id);
    if (item) {
      item.status = 'VISITED';
      item.visitedAt = new Date().toISOString();
      if (ashaVisitNotes) {
        item.ashaVisitNotes = ashaVisitNotes;
      } else if (!item.ashaVisitNotes) {
        item.ashaVisitNotes = 'गृह भेंट पूर्ण की गई। मरीज़ की स्थिति स्थिर पाई गई। घाव में सुधार है एवं दवाएं समय पर ली जा रही हैं।';
      }
      try {
        localStorage.setItem('saathi_followups', JSON.stringify(list));
      } catch {}
      this.pendingSyncCount++;

      // If linked to referral, sync update timestamp
      if (item.referralCode) {
        const referrals = this.getReferrals();
        const ref = referrals.find(r => r.safeReferenceCode === item.referralCode);
        if (ref) {
          ref.updatedAt = new Date().toISOString();
          try {
            localStorage.setItem('saathi_referrals', JSON.stringify(referrals));
          } catch {}
        }
      }
      this.notify();
    }
  }

  public addDoctorFollowupComment(
    followupId: string,
    doctorComment: string,
    doctorName: string = 'डॉ. राजीव वर्मा (Dr. Rajiv Verma, MO CHC)',
    closeReferralLoop: boolean = true
  ): void {
    const followups = this.getFollowups();
    const item = followups.find(f => f.id === followupId);
    if (item) {
      item.doctorPostFollowupComment = doctorComment;
      item.doctorCommentedAt = new Date().toISOString();
      item.doctorName = doctorName;
      try {
        localStorage.setItem('saathi_followups', JSON.stringify(followups));
      } catch {}
      this.pendingSyncCount++;

      // If linked to a referral, update referral outcome and mark COMPLETED
      if (item.referralCode) {
        const referrals = this.getReferrals();
        const ref = referrals.find(r => r.safeReferenceCode === item.referralCode);
        if (ref) {
          ref.doctorPostFollowupComment = doctorComment;
          ref.doctorCommentedAt = new Date().toISOString();
          ref.doctorName = doctorName;
          ref.outcomeSummary = (ref.outcomeSummary ? ref.outcomeSummary + ' • ' : '') + `डॉक्टर फॉलो-अप समीक्षा (${doctorName}): ${doctorComment}`;
          if (closeReferralLoop) {
            ref.status = 'COMPLETED';
          }
          ref.updatedAt = new Date().toISOString();
          try {
            localStorage.setItem('saathi_referrals', JSON.stringify(referrals));
          } catch {}
        }
      }
      this.notify();
    }
  }

  public requestReferralFollowup(
    referralId: string,
    days: number,
    doctorAdvice: string,
    doctorName: string = 'डॉ. राजीव वर्मा (Dr. Rajiv Verma, MO CHC)'
  ): StoredFollowup | null {
    const referrals = this.getReferrals();
    const ref = referrals.find(r => r.id === referralId);
    if (!ref) return null;

    ref.followupRequested = true;
    ref.followupDays = days;
    ref.doctorInitialAdvice = doctorAdvice;
    ref.doctorName = doctorName;
    ref.status = 'APPOINTMENT_SCHEDULED';
    ref.updatedAt = new Date().toISOString();

    const followups = this.getFollowups();
    let existing = followups.find(f => f.referralCode === ref.safeReferenceCode);
    if (!existing) {
      const matchedPat = this.getPatients().find(p => p.safeIdentifier === ref.patientSafeId);
      const patientDisplayName = matchedPat?.name || (ref.patientSafeId === 'SAA-RAM-2026-4421' ? 'सुनीता देवी (Sunita Devi)' : `${ref.villageName} Patient`);
      const newFoll: StoredFollowup = {
        id: `foll-${Date.now()}`,
        patientSafeId: ref.patientSafeId,
        patientName: patientDisplayName,
        patientAge: matchedPat?.ageYears || 54,
        villageName: ref.villageName,
        taskTitle: `डॉक्टर फॉलो-अप: ${ref.pathway}`,
        dueLabel: `Due in ${days} days`,
        status: 'PENDING',
        referralCode: ref.safeReferenceCode,
        doctorInitialAdvice: doctorAdvice,
        doctorName: doctorName,
        createdAt: new Date().toISOString(),
      };
      followups.unshift(newFoll);
      ref.linkedFollowupId = newFoll.id;
      existing = newFoll;
    } else {
      existing.doctorInitialAdvice = doctorAdvice;
      existing.doctorName = doctorName;
      existing.dueLabel = `Due in ${days} days`;
      existing.status = 'PENDING';
    }

    try {
      localStorage.setItem('saathi_referrals', JSON.stringify(referrals));
      localStorage.setItem('saathi_followups', JSON.stringify(followups));
    } catch {}
    this.pendingSyncCount++;
    this.notify();

    return existing;
  }

  public generateFollowupFromReferral(
    referralCode: string,
    taskTitle: string = 'त्वचा पुनः जाँच (Skin Recheck)',
    dueLabel: string = 'Due in 5 days'
  ): StoredFollowup | null {
    const referrals = this.getReferrals();
    const ref = referrals.find(r => r.safeReferenceCode === referralCode);
    if (!ref) return null;

    const followups = this.getFollowups();
    let existing = followups.find(f => f.referralCode === referralCode);
    if (existing) return existing;

    const matchedPat = this.getPatients().find(p => p.safeIdentifier === ref.patientSafeId);
    const patientDisplayName = matchedPat?.name || (ref.patientSafeId === 'SAA-RAM-2026-4421' ? 'सुनीता देवी (Sunita Devi)' : `${ref.villageName} Patient`);
    const newFoll: StoredFollowup = {
      id: `foll-${Date.now()}`,
      patientSafeId: ref.patientSafeId,
      patientName: patientDisplayName,
      patientAge: matchedPat?.ageYears || 54,
      villageName: ref.villageName,
      taskTitle: taskTitle,
      dueLabel: dueLabel,
      status: 'PENDING',
      referralCode: ref.safeReferenceCode,
      doctorInitialAdvice: ref.doctorInitialAdvice || 'डॉक्टर द्वारा 5 दिन बाद घाव एवं दवाओं के असर की पुनः जाँच की सलाह दी गई है।',
      doctorName: ref.doctorName || 'डॉ. राजीव वर्मा (Dr. Rajiv Verma, MO CHC)',
      createdAt: new Date().toISOString(),
    };

    followups.unshift(newFoll);
    ref.linkedFollowupId = newFoll.id;
    ref.followupRequested = true;

    try {
      localStorage.setItem('saathi_referrals', JSON.stringify(referrals));
      localStorage.setItem('saathi_followups', JSON.stringify(followups));
    } catch {}
    this.pendingSyncCount++;
    this.notify();

    return newFoll;
  }

  public getPendingFollowups(): StoredFollowup[] {
    return this.getFollowups().filter(f => f.status === 'PENDING');
  }


  public toggleNetwork(): boolean {
    this.isOnline = !this.isOnline;
    if (this.isOnline) {
      this.triggerSync();
    }
    return this.isOnline;
  }

  public getNetworkStatus(): boolean {
    return this.isOnline;
  }

  public getPendingSyncCount(): number {
    return this.pendingSyncCount;
  }

  public async triggerSync(): Promise<void> {
    const res = await firebaseService.syncAllLocalRecords(this.getPatients(), this.getReferrals());
    if (res.success) {
      this.pendingSyncCount = 0;
      this.notify();
    }
  }

  /**
   * Pull records from Cloud Firestore into local storage, merging with offline records.
   */
  public async pullFromCloud(): Promise<{ patientCount: number; referralCount: number }> {
    const cloudPatients = await firebaseService.fetchPatients();
    const cloudReferrals = await firebaseService.fetchReferrals();

    if (cloudPatients.length > 0) {
      const current = this.getPatients();
      const existingIds = new Set(current.map(p => p.id));
      for (const p of cloudPatients) {
        if (!existingIds.has(p.id)) {
          current.push(p);
        }
      }
      try {
        localStorage.setItem('saathi_patients', JSON.stringify(current));
      } catch {}
    }

    if (cloudReferrals.length > 0) {
      const current = this.getReferrals();
      const existingIds = new Set(current.map(r => r.id));
      for (const r of cloudReferrals) {
        if (!existingIds.has(r.id)) {
          current.push(r);
        }
      }
      try {
        localStorage.setItem('saathi_referrals', JSON.stringify(current));
      } catch {}
    }

    this.notify();
    return {
      patientCount: cloudPatients.length,
      referralCount: cloudReferrals.length,
    };
  }

  public getScreenings(): StoredScreening[] {
    try {
      const data = localStorage.getItem('saathi_screenings');
      return data ? JSON.parse(data) : INITIAL_SCREENINGS;
    } catch {
      return INITIAL_SCREENINGS;
    }
  }

  public recordScreening(screening: StoredScreening): void {
    const list = this.getScreenings();
    list.unshift(screening);
    try {
      localStorage.setItem('saathi_screenings', JSON.stringify(list));
    } catch {}
    this.pendingSyncCount++;
    this.notify();
  }

  public getScreeningsCount(): number {
    return this.getScreenings().length;
  }

  public getQualityFailuresCount(): number {
    try {
      const data = localStorage.getItem('saathi_quality_failures');
      return data !== null ? parseInt(data, 10) : 0;
    } catch {
      return 0;
    }
  }

  public recordQualityFailure(): void {
    const current = this.getQualityFailuresCount();
    try {
      localStorage.setItem('saathi_quality_failures', (current + 1).toString());
    } catch {}
    this.notify();
  }

  // --- Screening Camps Management (Real-Time & Local Persistence) ---
  private memoryCamps: StoredCamp[] | null = null;

  public getCamps(): StoredCamp[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem('saathi_camps');
        if (data) return JSON.parse(data);
      }
    } catch {}
    if (!this.memoryCamps) {
      this.memoryCamps = JSON.parse(JSON.stringify(INITIAL_CAMPS));
    }
    return [...(this.memoryCamps || INITIAL_CAMPS)];
  }

  public saveCamp(camp: StoredCamp): void {
    const list = this.getCamps();
    const idx = list.findIndex((c) => c.id === camp.id);
    if (idx >= 0) {
      list[idx] = camp;
    } else {
      list.unshift(camp);
    }
    this.memoryCamps = list;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('saathi_camps', JSON.stringify(list));
      }
    } catch {}
    this.pendingSyncCount++;
    this.notify();
  }

  public updateCampStatus(campId: string, status: StoredCamp['status']): void {
    const list = this.getCamps();
    const camp = list.find((c) => c.id === campId);
    if (camp) {
      camp.status = status;
      this.memoryCamps = list;
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('saathi_camps', JSON.stringify(list));
        }
      } catch {}
      this.pendingSyncCount++;
      this.notify();
    }
  }

  public deleteCamp(campId: string): void {
    const list = this.getCamps().filter((c) => c.id !== campId);
    this.memoryCamps = list;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('saathi_camps', JSON.stringify(list));
      }
    } catch {}
    this.notify();
  }

  public planCampForVillage(
    villageName: string,
    targetPopulation: string = 'NCD, Eye & General Community Screening (सामुदायिक स्वास्थ्य शिविर)',
    allocatedStaff: string = '3 ASHA Workers, 1 MO, 1 Lab Tech',
    equipmentReady: string = 'Portable CBC, 1 Non-Mydriatic Fundus Camera, BP/Glucose Kit'
  ): StoredCamp {
    const list = this.getCamps();
    const existing = list.find(
      (c) => c.village.toLowerCase() === villageName.toLowerCase() && (c.status === 'PLANNING' || c.status === 'CONFIRMED')
    );
    if (existing) {
      return existing;
    }

    const today = new Date();
    today.setDate(today.getDate() + 7);
    const dateStr = today.toISOString().split('T')[0];

    const newCamp: StoredCamp = {
      id: `camp-${Date.now()}`,
      name: `${villageName} स्वास्थ्य सेवा शिविर (${villageName} Health Camp)`,
      date: dateStr,
      village: villageName,
      targetPopulation,
      allocatedStaff,
      equipmentReady,
      status: 'PLANNING',
      notes: `${villageName} में सेवा अंतराल एवं रेफरल मांग को पूरा करने हेतु प्राथमिक स्वास्थ्य केंद्र द्वारा प्रस्तावित।`,
      rosterDetails: {
        medicalOfficer: 'डॉ. राजीव वर्मा (Dr. Rajiv Verma, MO PHC)',
        ashaWorkers: ['स्थानीय आशा कार्यकर्ता (Local ASHA Workers)'],
        labTechnician: 'जिला मोबाइल लैब टेक्नीशियन (District Mobile Lab Tech)',
        vanDetails: 'Patiala Mobile Outreach Unit #PB-11-2041',
      },
      createdAt: new Date().toISOString(),
    };

    list.unshift(newCamp);
    this.memoryCamps = list;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('saathi_camps', JSON.stringify(list));
      }
    } catch {}
    this.pendingSyncCount++;
    this.notify();
    return newCamp;
  }

  public getLiveVillageAggregates(): VillageAggregate[] {
    const patients = this.getPatients();
    const referrals = this.getReferrals();
    const followups = this.getFollowups();
    const screenings = this.getScreenings();

    // Bilingual Canonical Map to eliminate duplicate Hindi/English village entries
    const CANONICAL_MAP: Record<string, string> = {
      // Rampur
      rampur: 'Rampur',
      'रामपूर': 'Rampur',
      'रामपुर': 'Rampur',
      // Kalyanpur
      kalyanpur: 'Kalyanpur',
      'कल्याणपुर': 'Kalyanpur',
      'कल्याणपूर': 'Kalyanpur',
      // Sundernagar
      sundernagar: 'Sundernagar',
      'सुंदरनगर': 'Sundernagar',
      'सुन्दरनगर': 'Sundernagar',
      // Bishanpur
      bishanpur: 'Bishanpur',
      'बिशनपुर': 'Bishanpur',
      'बिशनपूर': 'Bishanpur',
      // Shivgarh
      shivgarh: 'Shivgarh',
      'शिवगढ़': 'Shivgarh',
      // Nabha
      nabha: 'Nabha',
      'नाभा': 'Nabha',
      // Bahadurgarh
      bahadurgarh: 'Bahadurgarh',
      'बहादुरगढ़': 'Bahadurgarh',
      // Rajpura
      rajpura: 'Rajpura',
      'राजपुरा': 'Rajpura',
      // Patiala
      patiala: 'Patiala',
      'पटियाला': 'Patiala',
      // Meerut
      meerut: 'Meerut',
      'मेरठ': 'Meerut',
      // Srinagar
      srinagar: 'Srinagar',
      'श्रीनगर': 'Srinagar',
      // Dholakpur
      dholakpur: 'Dholakpur',
      'ढोलकपुर': 'Dholakpur',
      // Lolpur
      lolpur: 'Lolpur',
      'लोलपुर': 'Lolpur',
    };

    // Helper to extract clean canonical display name (e.g. "रामपूर (Rampur)" or "रामपूर" -> "Rampur")
    const normalizeVillageName = (raw: string): string => {
      if (!raw) return '';
      const trimmed = raw.trim();

      // Check if it has parentheses like "रामपूर (Rampur)"
      const match = trimmed.match(/\(([^)]+)\)/);
      if (match && match[1]) {
        const inside = match[1].trim();
        const key = inside.toLowerCase();
        if (CANONICAL_MAP[key]) return CANONICAL_MAP[key];
        return inside.charAt(0).toUpperCase() + inside.slice(1);
      }

      // Check canonical map directly
      const lower = trimmed.toLowerCase();
      if (CANONICAL_MAP[lower]) {
        return CANONICAL_MAP[lower];
      }

      // Check if raw matches any known alias substring
      for (const [key, canonical] of Object.entries(CANONICAL_MAP)) {
        if (lower.includes(key)) {
          return canonical;
        }
      }

      // Capitalize first letter for new custom villages (e.g. "lolpur" -> "Lolpur")
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    };

    // Helper to check if a record belongs to this village
    const isSameVillage = (a: string, b: string): boolean => {
      if (!a || !b) return false;
      const normA = normalizeVillageName(a);
      const normB = normalizeVillageName(b);
      return normA.toLowerCase() === normB.toLowerCase();
    };

    // 1. Start with the standard 5 district sub-centre schematic villages
    const defaultVillages = ['Rampur', 'Kalyanpur', 'Sundernagar', 'Bishanpur', 'Shivgarh'];
    const villageList: string[] = [...defaultVillages];

    // 2. Discover all dynamically registered village names across patients, referrals, and follow-ups
    const recordedVillages = [
      ...patients.map((p) => p.villageName),
      ...referrals.map((r) => r.villageName),
      ...followups.map((f) => f.villageName),
    ];

    for (const raw of recordedVillages) {
      if (!raw) continue;
      const display = normalizeVillageName(raw);
      if (display && !villageList.some((existing) => isSameVillage(existing, display))) {
        villageList.push(display);
      }
    }

    const HINDI_NAME_MAP: Record<string, string> = {
      Rampur: 'रामपूर',
      Kalyanpur: 'कल्याणपुर',
      Sundernagar: 'सुंदरनगर',
      Bishanpur: 'बिशनपुर',
      Shivgarh: 'शिवगढ़',
      Nabha: 'नाभा',
      Bahadurgarh: 'बहादुरगढ़',
      Rajpura: 'राजपुरा',
      Patiala: 'पटियाला',
      Meerut: 'मेरठ',
      Srinagar: 'श्रीनगर',
      Dholakpur: 'ढोलकपुर',
      Lolpur: 'लोलपुर',
      Amritsar: 'अमृतसर',
      Ludhiana: 'लुधियाना',
      Jalandhar: 'जालंधर',
      Bathinda: 'बठिंडा',
      Mohali: 'मोहाली',
    };

    return villageList.map((name) => {
      const vPatients = patients.filter((p) => isSameVillage(p.villageName, name));
      const vRefs = referrals.filter((r) => isSameVillage(r.villageName, name));
      const vFolls = followups.filter((f) => isSameVillage(f.villageName, name));
      const vScreenings = screenings.filter((s) => {
        const pat = patients.find((p) => p.safeIdentifier === s.patientSafeId);
        return pat ? isSameVillage(pat.villageName, name) : false;
      });

      const totalScreenings = Math.max(vScreenings.length, vPatients.length, vRefs.length);
      const refCount = vRefs.length;
      const follCompletedCount = vFolls.filter((f) => f.status === 'VISITED').length;

      // DPDPA Small-cell suppression (< 5) applied when 0 < count < 5
      const isRefSuppressed = refCount > 0 && refCount < 5;
      const isFollSuppressed = follCompletedCount > 0 && follCompletedCount < 5;
      const isCellSuppressed = isRefSuppressed || isFollSuppressed;

      return {
        villageName: name,
        hindiName: HINDI_NAME_MAP[name] || undefined,
        screeningActivity: totalScreenings,
        referralDemand: isRefSuppressed ? '< 5' : refCount.toString(),
        followupCompleted: isFollSuppressed ? '< 5' : follCompletedCount.toString(),
        serviceGaps:
          refCount > 0 && follCompletedCount === 0
            ? 'Follow-up Gap Identified'
            : name === 'Sundernagar'
            ? 'Transport Assistance Required'
            : 'Adequate',
        isCellSuppressed,
      };
    });
  }
}

export const offlineStore = new OfflineStore();

