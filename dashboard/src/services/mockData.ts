/**
 * Project Saathi - Demonstration Mock Data
 * Synthetic, privacy-safe records compliant with Section 35 Demonstration Mode.
 */

export interface VillageAggregate {
  villageName: string;
  hindiName?: string;
  screeningActivity: number;
  referralDemand: string; // e.g. "9" or "< 5" (small-cell suppressed)
  followupCompleted: string;
  serviceGaps: string;
  isCellSuppressed: boolean;
}

export interface AdminReferralItem {
  id: string;
  referenceCode: string;
  patientSafeId: string;
  villageName: string;
  pathway: string;
  urgencyTier: string;
  status: 'PENDING_DISPATCH' | 'REFERRED' | 'APPOINTMENT_SCHEDULED' | 'ATTENDED' | 'COMPLETED' | 'MISSED';
  facilityName: string;
  daysOpen: number;
  reasonSummary: string;
  outcomeSummary?: string;
}

export const mockOverviewStats = {
  reportingPeriod: 'October 2026',
  totalScreenings: 142,
  uniquePatients: 118,
  openReferrals: 28,
  confirmedAppointments: 22,
  completedReferrals: 19,
  overdueFollowups: 6,
  modelQualityFailures: 11,
  offlineSyncBacklog: 4,
};

export const mockVillages: VillageAggregate[] = [
  { villageName: 'Rampur', screeningActivity: 48, referralDemand: '9', followupCompleted: '7', serviceGaps: 'Adequate', isCellSuppressed: false },
  { villageName: 'Kalyanpur', screeningActivity: 34, referralDemand: '6', followupCompleted: '5', serviceGaps: 'Adequate', isCellSuppressed: false },
  { villageName: 'Sundernagar', screeningActivity: 29, referralDemand: '5', followupCompleted: '3', serviceGaps: 'Transport Assistance Required', isCellSuppressed: false },
  { villageName: 'Bishanpur', screeningActivity: 18, referralDemand: '< 5', followupCompleted: '< 5', serviceGaps: 'Pending Mobile Van', isCellSuppressed: true },
  { villageName: 'Shivgarh', screeningActivity: 13, referralDemand: '< 5', followupCompleted: '< 5', serviceGaps: 'Adequate', isCellSuppressed: true },
];

export const mockReferralsList: AdminReferralItem[] = [
  {
    id: 'ref-01',
    referenceCode: 'SAA-REF-10492',
    patientSafeId: 'SAA-RAM-2026-4421',
    villageName: 'Rampur',
    pathway: 'Skin Sign Screening',
    urgencyTier: 'PROMPT_ASSESSMENT',
    status: 'REFERRED',
    facilityName: 'Nabha Community Health Centre (CHC)',
    daysOpen: 2,
    reasonSummary: 'Visible concerning skin changes flagged during village screening visit.',
  },
  {
    id: 'ref-02',
    referenceCode: 'SAA-REF-20188',
    patientSafeId: 'SAA-KAL-2026-8812',
    villageName: 'Kalyanpur',
    pathway: 'Retina & Vision Screening',
    urgencyTier: 'PROMPT_ASSESSMENT',
    status: 'APPOINTMENT_SCHEDULED',
    facilityName: 'Mata Kaushalya District Hospital',
    daysOpen: 4,
    reasonSummary: 'Diabetic history with reported blurred vision. Optical fundus examination requested.',
  },
  {
    id: 'ref-03',
    referenceCode: 'SAA-REF-30911',
    patientSafeId: 'SAA-SUN-2026-1049',
    villageName: 'Sundernagar',
    pathway: 'CBC Blood Funnel',
    urgencyTier: 'PROMPT_ASSESSMENT',
    status: 'ATTENDED',
    facilityName: 'Nabha Community Health Centre (CHC)',
    daysOpen: 5,
    reasonSummary: 'Platelet count 45,000 /uL and petechiae spots. Hospital repeat smear completed.',
    outcomeSummary: 'Examined by Medical Officer. Mild immune thrombocytopenia managed conservatively. Followup in 7 days.',
  },
  {
    id: 'ref-04',
    referenceCode: 'SAA-REF-41002',
    patientSafeId: 'SAA-BIS-2026-3021',
    villageName: 'Bishanpur',
    pathway: 'Chest Symptom Screening',
    urgencyTier: 'PROMPT_ASSESSMENT',
    status: 'COMPLETED',
    facilityName: 'Rampur Primary Health Centre (PHC)',
    daysOpen: 7,
    reasonSummary: 'Cough > 2 weeks and fever. Sputum CBNAAT ordered.',
    outcomeSummary: 'Sputum NAAT negative for Mycobacterium tuberculosis. Treated for community-acquired bronchitis.',
  },
];

export const mockModelsRegistry = [
  {
    modelId: 'saathi-skin-v1.0-q8',
    name: 'Skin-Sign Triage Model',
    approvedVersion: '1.0.2-demo',
    status: 'Active (Demonstration Mode)',
    clinicalApprovalStatus: 'IRB Approved for Pilot Study Only',
    sensitivity: '88.4%',
    specificity: '82.1%',
    disparityFNR: '2.1%',
    hardware: 'Standard Smartphone Camera',
    provenance: 'Fitzpatrick IV-VI Curated Benchmark Subset',
  },
  {
    modelId: 'saathi-retina-v1.0-q8',
    name: 'Diabetic Retinopathy Optical Fundus Model',
    approvedVersion: '1.0.1-demo',
    status: 'Active (Requires Fundus Lens)',
    clinicalApprovalStatus: 'Multi-centre Field Validation in Progress',
    sensitivity: '91.2%',
    specificity: '87.5%',
    disparityFNR: '1.8%',
    hardware: 'Optical Fundus Camera Lens Adapter Only',
    provenance: 'EyePACS/MESSIDOR-2 Research Datasets',
  },
  {
    modelId: 'saathi-chest-v1.0-q8',
    name: 'Chest Radiograph TB Screener',
    approvedVersion: '1.0.0-demo',
    status: 'Active (Radiograph Import Required)',
    clinicalApprovalStatus: 'NTEP Pilot Clearance Pending',
    sensitivity: '92.0%',
    specificity: '82.0%',
    disparityFNR: '2.4%',
    hardware: 'Digital Radiograph (DICOM / Medical Scanner)',
    provenance: 'NIH ChestX-ray14 & Shenzhen TB Cohort',
  },
  {
    modelId: 'saathi-smear-v1.0-q8',
    name: 'Peripheral Smear Candidate Cell Highlighter',
    approvedVersion: '1.0.0-demo',
    status: 'Active (Assistive Lab Technologist Tool)',
    clinicalApprovalStatus: 'Laboratory Technologist Assistive Protocol',
    sensitivity: '94.0%',
    specificity: '85.0%',
    disparityFNR: '1.9%',
    hardware: '100x Oil Immersion Optical Microscope Adapter',
    provenance: 'ALL-IDB1/2 Benchmark Datasets',
  },
];

export const mockCamps = [
  {
    id: 'camp-01',
    name: 'Rampur Gram Panchayat Health Mela',
    date: '2026-10-24',
    village: 'Rampur',
    targetPopulation: 'Elderly & NCD High-Risk',
    allocatedStaff: '4 ASHA Workers, 1 MO, 1 Lab Tech',
    equipmentReady: 'Portable CBC, 1 Fundus Lens',
    status: 'CONFIRMED',
  },
  {
    id: 'camp-02',
    name: 'Kalyanpur Mobile Screening Camp',
    date: '2026-11-02',
    village: 'Kalyanpur',
    targetPopulation: 'General Community & School Children',
    allocatedStaff: '3 ASHA Workers, 1 Mobile Van',
    equipmentReady: 'Digital Radiograph Van Scheduled',
    status: 'PLANNING',
  },
];
