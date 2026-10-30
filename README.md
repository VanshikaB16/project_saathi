## MOBILE APP (ASHA Worker & Doctor) - https://project-saathi-rho.vercel.app/app
## Website (District Health Officer dashboard) - https://project-saathi-rho.vercel.app



# Project Saathi | Healthcare Screening & Referral Platform

> **"A little closer to care. A step earlier to health."**  
> *Screen locally. Refer safely. Follow through until care is reached.*

---

## 1. Project Purpose & Clinical Mission
Project Saathi is an offline-first community healthcare screening and care-coordination platform engineered for Accredited Social Health Activist (ASHA) workers serving rural, low-connectivity, and low-literacy communities in India. 

Rural patients frequently encounter delays in early warning sign identification, diagnostic testing, and specialist referrals. Late presentation exponentially increases morbidity, mortality, and financial distress. Project Saathi equips frontline workers with an assistive triage tool that identifies visible and laboratory warning signs, records patient journeys locally, coordinates appointments, notifies families through privacy-safe channels, and **maintains open follow-through loops until a clinical outcome is verified**.

### Core Clinical Governance Principles
- **Screening is NOT Diagnosis**: The application never claims to diagnose cancer, leukemia, diabetic retinopathy, tuberculosis, or any other disease.
- **Strict Visual & Audio Copy**: The system never outputs phrases like *"You have cancer"*, *"You have TB"*, or *"You are healthy"*. Allowed wording is strictly:
  - *"No concerning sign was detected by this screening."* (Green)
  - *"Some signs need a closer medical check."* (Amber)
  - *"Please arrange a medical assessment promptly."* (Red)
- **Urgent Symptom Escalation**: Acute life-threatening symptoms (severe breathing distress, unconsciousness, heavy bleeding, sudden acute vision loss) bypass all AI models and immediately surface emergency contact instructions (108 Ambulance).
- **Never Default to Green**: Any edge model inference failure, memory exception, or poor image quality reverts to `CLINICIAN_REVIEW_REQUIRED`, never green.
- **Demonstration Mode**: All unvalidated research models are permanently marked `DEMO — NOT FOR CLINICAL USE`.

---

## 2. System Architecture

```
project-saathi/
├── mobile/                     # Flutter / Dart Android-first application
│   ├── lib/
│   │   ├── app/                # Route definitions and MaterialApp wrapper
│   │   ├── core/
│   │   │   ├── theme/          # High-contrast Material 3 Saathi design tokens
│   │   │   ├── localization/   # English & Hindi reviewed clinical translations
│   │   │   ├── security/       # SQLCipher encryption and local auth service
│   │   │   └── database/       # SQLite schema and ACID database helper
│   │   ├── features/
│   │   │   ├── welcome/        # Worker welcome & language selection
│   │   │   ├── home/           # ASHA home with daily task counts & large icons
│   │   │   ├── patients/       # Privacy-preserving registration & safe IDs
│   │   │   ├── consent/        # Granular 5-choice unbundled consent
│   │   │   ├── screening/      # 3-tap screening (Skin, Eye, Chest, Blood)
│   │   │   ├── laboratory/     # Deterministic CBC rules engine
│   │   │   ├── referrals/      # Follow-through loop (stays open until outcome)
│   │   │   ├── followups/      # Rechecks and missed appointments
│   │   │   ├── timeline/       # Multi-source chronological patient timeline
│   │   │   └── settings/       # Audio TTS, language, and sync triggers
│   │   ├── services/           # TTS, sync engine, facilities, notifications
│   │   └── main.dart           # Flutter application entry point
│   └── test/                   # Comprehensive mobile unit and safety tests
│
├── dashboard/                  # React + TypeScript Web Portal & Mobile Simulator
│   ├── src/
│   │   ├── components/         # Layout, StatCard, GIS Map, Quality Overlay, Banner
│   │   ├── pages/
│   │   │   ├── admin/          # Overview, Villages, Referrals, Camps, Models, Audit
│   │   │   └── mobile_simulator/ # 16-Screen interactive ASHA mobile simulator
│   │   ├── services/           # OfflineStore, Client CBC Engine, Web Speech TTS
│   │   ├── theme/              # Palette and typography tokens
│   │   └── tests/              # Vitest test suites
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                    # Node.js / TypeScript API & Sync Engine
│   ├── src/
│   │   ├── models/             # 17 domain entities (Patients, Referrals, Audit, etc.)
│   │   ├── routes/             # Auth, Patients, Screenings, Referrals, Sync, District
│   │   ├── services/           # Pluggable SMS Adapter & Conflict Resolution Sync
│   │   └── server.ts           # Express application server
│   ├── security/               # Firestore and Storage security rules
│   ├── migrations/             # SQL schema (PostgreSQL / SQLite)
│   └── tests/                  # Node built-in API tests
│
├── ml/                         # Applied ML Edge Subsystem
│   ├── model_cards/            # Quantized INT8 model cards (Skin, DR, Chest, Smear)
│   ├── adapters/               # Common screening interface & hardware gates
│   └── validation/             # Clinical checklist, fairness, and quality metrics
│
├── docs/                       # Comprehensive Governance Documentation
│   ├── architecture.md         # Full architecture specification & trade-offs
│   ├── privacy.md              # DPDPA compliance, consent, and anonymization
│   ├── clinical_safety.md      # Clinical safety overrides & wording manual
│   ├── validation_plan.md      # Multi-phase clinical validation plan
│   └── deployment.md           # Deployment runbook and infrastructure guide
│
├── .env.example                # Safe environment variable configuration template
└── README.md                   # Master documentation
```

---

## 3. Quick Start & Local Execution

### Prerequisites
- Node.js v18+ and npm v9+
- Python 3.9+ (for ML adapters & validation)
- Flutter SDK 3.22+ (only required if building Android APKs)

### A. Run Dashboard & Interactive Mobile Simulator
The React application contains both the **District Admin Dashboard** and the **16-Screen ASHA Mobile App Simulator** with spoken Web Speech audio:
```bash
cd dashboard
npm install
npm run dev
```
- Open `http://localhost:5173` in your browser.
- Toggle between **"District Admin Portal"** and **"ASHA Mobile App"** using the top pill bar.
- Test the 3-tap screening, offline toggle, CBC rules engine, and referral creation directly.

### B. Run Backend API Server
```bash
cd backend
npm install
npm run build
npm start
```
- Backend runs on `http://localhost:5000` with endpoints for auth, sync, and district analytics.

### C. Run Machine Learning Tests (Python)
```bash
python3 ml/validation/quality_metrics.py
python3 ml/validation/subgroup_fairness.py
```

### D. Run Test Suites
```bash
# Dashboard & Logic Tests
cd dashboard
npm test

# Backend Tests
cd backend
npm test

# Mobile Flutter Tests (when Flutter SDK installed)
cd mobile
flutter test
```

---

## 4. Environment Variables Configuration
Copy `.env.example` to `.env` in the root and in the subprojects:
```bash
cp .env.example .env
```
Key configuration keys:
- `SAATHI_DEMO_MODE`: Set `true` to enforce persistent demonstration badges and synthetic datasets.
- `SMALL_CELL_SUPPRESSION_THRESHOLD`: Default `5`. Suppresses village counts `< 5` to prevent patient re-identification.
- `SMS_PROVIDER`: Options `mock`, `twilio`, `gupshup`, `fast2sms`. Neutral notification content enforced.
- `JWT_SECRET`: Random 64-character secret for role-based sessions.

---

## 5. Offline-First Database & Synchronization
- **On-Device Storage**: Native encrypted SQLite via SQLCipher (256-bit AES). Keys stored in Android Keystore.
- **Idempotent Sync Engine**: Offline records are queued locally with timestamps. When network returns, records sync in idempotent batches.
- **Conflict Resolution**: Server records never silently overwrite newer clinical data. Once a referral is marked `COMPLETED` or `ATTENDED` by an authorized medical officer, an offline client cannot revert it to `PENDING`.
- **Zero Illusion**: The app never pretends an SMS was sent or an appointment booked while offline. Status displays `"Waiting to send"` until delivery confirmation.

---

## 6. The Four Screening Pathways

| Pathway | Route | Required Hardware Input | Quality Gates | Fallback Workflow |
|---|---|---|---|---|
| **Skin Signs** | `/screening/skin` | Smartphone camera | Blur variance > 110, Luminance 45–220 | Spoken guidance: "Move to natural daylight", "Hold phone steady". |
| **Eye & Retina** | `/screening/eye` | **Certified optical fundus attachment** (Remidio/Volk) | Lens connection verification, disc centering | Phone photo rejected. Falls back to diabetic risk factor questionnaire & clinic referral. |
| **Chest Imaging** | `/screening/chest` | **Genuine digital radiograph** (DICOM / Medical Scanner) | Rib symmetry, exposure | Torso camera photo rejected. Runs NTEP symptom protocol (cough > 2 weeks, hemoptysis). |
| **Blood Cancer Funnel** | `/screening/blood` | **Multi-stage evidence**: Visual signs, CBC values, **100x oil microscope** | Implausible value bounds, staining verification | 4-Stage Funnel: Visual signs -> CBC report entry -> Deterministic clinical rules -> Microscopic candidate cell review. |

---

## 7. Follow-Through Loop & Referral Management
Project Saathi enforces the principle: **A screening flag is only the beginning. The real goal is helping people reach appropriate care safely.**
1. **Screening Result**: Flag generated (Amber / Red).
2. **Referral Creation**: Worker selects authorized facility from verified directory.
3. **Appointment Scheduling**: API-confirmed or manual phone appointment booked.
4. **Family Notification**: Neutral SMS dispatched (only if consent granted; no disease names).
5. **Follow-Up Tasks**: Automatic reminders for ASHA worker to check attendance.
6. **Clinical Outcome Documentation**: Closed only when medical officer records definitive clinical evaluation.

---

## 8. Privacy, Security & DPDPA Compliance
- **Granular 5-Choice Consent**: Screening, referral coordination, family notifications, photo storage, and research. Research consent is **never bundled** into care consent.
- **Non-Biometric Identification**: No facial recognition or voice biometrics. Unique municipal codes (`SAA-VIL-2026-XXXX`) or QR health cards.
- **Small-Cell Suppression**: Aggregated counts under 5 in rural sub-centres are suppressed (`< 5`) to prevent demographic re-identification.
- **No Stigmatizing Disease Maps**: Maps display operational screening coverage and referral transport capacity, never disease "hotspot" pins.
- **Neutral SMS Messages**: All notifications avoid sensitive medical terms to protect shared household phones.

---

## 9. Steps Required Before Real-World Clinical Deployment
1. **Institutional Review Board (IRB) Clearance**: Formal multi-site study approvals across designated Primary Health Centres.
2. **Regulatory Certification**: Compliance clearance under CDSCO Software as a Medical Device (SaMD) and ICMR ethical guidelines.
3. **Subgroup Performance Audit**: Clinical sensitivity (>= 90%) and specificity (>= 80%) verified across Fitzpatrick skin phototypes IV, V, and VI on representative target hardware.
4. **Clinical Threshold Sign-off**: Explicit sign-off on operating points by state health officers and specialist panels.
5. **Version Pinning & Rollback Plan**: Centralized model registry validation with automated 15-minute emergency rollback procedures.

---

## 10. Licensing & Provenance Notices
Candidate research datasets referenced in demonstration adapters (HAM10000, EyePACS, MESSIDOR, NIH ChestX-ray14, ALL-IDB) have distinct research licenses. They are used exclusively to illustrate edge adapter interfaces and **do not constitute clinical validation for unmagnified smartphone rural screening**.

---

## 11. Render Workflows Distributed Orchestration Pipeline

Project Saathi utilizes **Render Workflows** via the official `@renderinc/sdk/workflows` engine for long-running, durable, and distributed public health tasks:

- **Ingest & Validation Task (`ingestOfflineSyncBatch`)**: Ingests and validates cryptographic hashes of offline sync batches from field ASHA workers.
- **DPDP Act Small-Cell Suppression Task (`applyDpdPrivacySuppression`)**: Enforces privacy compliance by suppressing counts below 5 (`< 5`) in rural village clusters to prevent re-identification.
- **Autonomous OPD Pre-Booking Task (`dispatchHighRiskReferrals`)**: Dispatches autonomous token booking for high-risk referrals to CHC hospitals via browser-use agents.
- **District Epidemiological Ledger Task (`generateDistrictAuditLedger`)**: Writes tamper-evident audit blocks and recalculates district outbreak risk levels.

### Running & Testing the Render Workflow
```bash
# From the backend directory:
npm run workflow:run   # Executes the durable pipeline with full task trace
npm test               # Automated test suite verifying the workflow
```

Live API endpoints:
- `POST /api/district/run-workflow`: Triggers the pipeline via REST API
- `GET /api/district/workflow-info`: Returns task metadata, retries, and timeout configuration
