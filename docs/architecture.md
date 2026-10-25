# Project Saathi: Architecture Specification

## 1. Executive Architecture Summary
Project Saathi is designed for rural primary healthcare delivery in low-connectivity environments. The platform bridges community-level triage performed by Accredited Social Health Activist (ASHA) workers and specialized clinical care provided at Primary Health Centres (PHCs), Community Health Centres (CHCs), and District Hospitals.

```
+-----------------------------------------------------------------------------------+
|                            ASHA Field Environment                                 |
|                                                                                   |
|  [ ASHA Worker ] <---> [ Flutter Mobile App / PWA Simulator ]                     |
|                              |                                                    |
|                 +------------+------------+                                       |
|                 |                         |                                       |
|       [ SQLite Local DB ]      [ On-Device ML (TFLite/ONNX) ]                    |
|        - Patients, Consents     - Skin Triage                                     |
|        - Screening Records      - Fundus Gate                                     |
|        - Sync Queue             - Radiograph Gate                                 |
|        - Audit Log              - CBC Rules Engine                                |
+-----------------|-----------------------------------------------------------------+
                  | (Intermittent 2G/4G Sync - Idempotent Batch)
                  v
+-----------------------------------------------------------------------------------+
|                            Saathi Cloud & Backend                                 |
|                                                                                   |
|  [ API Gateway / Cloud Functions ]                                                |
|        |                                                                          |
|        +---> [ Auth Service ] (RBAC: ASHA, Clinician, District Admin, SysAdmin)   |
|        +---> [ Sync Engine ] (Conflict resolution, schema versioning)             |
|        +---> [ Notification Service ] (Neutral SMS, In-App, FCM Queue)            |
|        +---> [ Audit Logger ] (Immutable tamper-evident trails)                   |
|        +---> [ Anonymized Aggregator ] (Small-cell suppression < 5)               |
|                                                                                   |
|  [ Relational / Firestore Database ]                                              |
|        - 17 Collections / Tables with explicit record provenance                  |
+-----------------|-----------------------------------------------------------------+
                  |
                  v
+-----------------------------------------------------------------------------------+
|                        District Health Administration                             |
|                                                                                   |
|  [ React + TypeScript District Admin Dashboard ]                                  |
|        - /admin/overview   - /admin/villages (Aggregated GIS, privacy-safe)       |
|        - /admin/referrals  - /admin/camps (Screening camp logistics)              |
|        - /admin/models     - /admin/audit (Full traceability)                     |
|        - /admin/settings   (Threshold versioning & facility directory)            |
+-----------------------------------------------------------------------------------+
```

## 2. Core Architectural Pillars
1. **Offline-First Resilience**: All core ASHA workflows (patient registration, consent collection, 3-tap screening, CBC rules evaluation, referral creation, and timeline viewing) execute locally against SQLite without requiring internet connectivity.
2. **Follow-Through Loop**: Referrals remain in an open, auditable state until a definitive clinical outcome is documented by an authorized medical professional.
3. **Clinical Safety & Non-Diagnostic Boundary**: The mobile application is strictly an assistive screening aid. It never outputs a medical diagnosis (e.g. "You have cancer"), but instead provides calibrated risk flags ("No concerning sign detected", "Some signs need closer medical check") and guides urgent red-flag symptoms straight to emergency care.

## 3. Technology Stack Selection & Trade-Offs

| Layer | Primary Technology | Architectural Rationale & Trade-Offs |
|---|---|---|
| **Mobile Client** | Flutter / Dart (Android-first) + M3 Custom Theme | Compiles to native ARM binaries for low-cost Android hardware; single codebase ensures consistent offline SQLite logic and Material 3 high-contrast accessibility. |
| **Edge ML Runtime** | TensorFlow Lite / ONNX Runtime (Quantized INT8) | Sub-300ms execution on MediaTek Helio chipsets without relying on unstable mobile cloud connectivity. |
| **Local Storage** | Encrypted SQLite (`sqflite_sqlcipher` / AES-256) | Robust ACID transactions, relational referential integrity between patients, screenings, and referrals, with platform key-management storage. |
| **Backend API** | Node.js / TypeScript + Express / Cloud Functions | Type-safe JSON APIs, event-driven idempotent sync queue processing, lightweight memory footprint. |
| **Database** | PostgreSQL / Cloud Firestore | Documented relational schema with fine-grained row-level/collection-level security rules enforcing least-privilege. |
| **District Dashboard** | React 19 + TypeScript + Vite + Tailwind CSS | Fast responsive single-page application for district health officers with aggregate data visualization and model registry administration. |
| **Voice & Speech** | Android Native TTS / Web Speech API | Multi-lingual voice playback (Hindi, English) to empower workers and patients in low-literacy communities. |
