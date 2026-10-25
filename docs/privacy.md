# Project Saathi: Privacy and Data Governance Policy

## 1. Privacy by Design Framework
Project Saathi operates in rural community healthcare where patients may have limited literacy and high vulnerability to social stigma. The platform adheres to the Digital Personal Data Protection Act (DPDPA 2023) and international health data standards.

## 2. Granular Informed Consent
Consent is recorded with explicit timestamps, consent policy version numbers, and the authenticated ASHA Worker ID.
The application supports spoken explanations in the patient's preferred language (Hindi, Punjabi, Tamil, Telugu, English) and provides **independent, unbundled options**:

1. **Care Screening**: Permission to conduct triage assessment.
2. **Referral Coordination**: Permission to share necessary medical triage details with Primary Health Centre (PHC) clinicians.
3. **Family Notifications**: Permission to send neutral appointment reminders to an authorized family member's phone.
4. **Optional Photographic Storage**: Separate permission to store clinical images. Photographs are **never required** to receive medical care.
5. **Research & Quality Improvement**: Unbundled permission. **Research consent must never be required or bundled into routine care consent.**

Declining any optional consent never prevents the patient from receiving standard medical assistance or emergency transport.

## 3. Patient Identification & Non-Biometric Safety
- **No Biometric Enforcement**: Facial recognition, iris recognition, and voice biometrics are strictly prohibited for patient identification.
- **Safe Identifiers**: The system generates unique, privacy-preserving municipal identifiers (e.g., `SAA-PB-042-8812`) or supports physical QR/NFC community health cards.
- **Duplicate Prevention**: A privacy-preserving fuzzy matching workflow verifies village name, age bracket, and initials without broadcasting identifiable details.

## 4. Notification & Communication Privacy
- **Neutral SMS Content**: SMS messages dispatched to shared household phones or lock screens **must never disclose suspected diagnoses, disease names, or sensitive flags**.
- **Standard Approved SMS Format**:
  > *"Hello. Please contact your local ASHA worker regarding an important health follow-up. Appointment details: CHC Rampur, Room 4, 18 Oct 10:00 AM. Ref: SAA-REF-9021."*
- Notifications are queued locally when offline with status `"Waiting to send"` and never marked sent until the SMS gateway confirms dispatch.

## 5. District Dashboard Anonymization & Suppression
- **Zero Identifiable Data on Admin Portals**: District administrators view only aggregate metrics.
- **Small-Cell Suppression Rule**: If the count of individuals flagged for a specific clinical condition in a village or sub-centre is fewer than 5 (`N < 5`), the metric is suppressed (`< 5`) to prevent re-identification through demographic triangulation.
- **No Stigmatizing Disease Maps**: Maps visualize screening operational coverage and referral capacity, never disease "hotspot" markers.

## 6. Data Encryption & Lifecycle
- **At Rest**: SQLite database encrypted via SQLCipher (256-bit AES). Keys stored in Android Keystore / iOS Keychain.
- **In Transit**: All API traffic strictly encrypted via TLS 1.3 with Certificate Pinning.
- **Image Purge Policy**: Edge images are retained on mobile devices only until validated sync completes, after which they are removed from edge storage unless explicit longitudinal comparison is active.
- **Consent Withdrawal**: When consent is revoked, optional processing stops immediately and patient data is queued for clinical archive or deletion subject to statutory medical retention obligations.
