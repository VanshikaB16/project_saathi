# Project Saathi: Clinical Safety & Governance Manual

## 1. Core Clinical Directive: Screening is Not Diagnosis
Project Saathi is an assistive community triage platform. It is engineered to identify people who may benefit from professional evaluation, not to diagnose medical conditions.

### Prohibited System Output Strings
The mobile app, voice prompts, notifications, and district dashboards are strictly prohibited from generating the following phrases or their equivalents in any language:
- ❌ *"You have cancer"* / *"कैंसर पाया गया"*
- ❌ *"You have leukemia"* / *"ल्यूकेमिया है"*
- ❌ *"You have TB"* / *"टीबी है"*
- ❌ *"You are healthy"* / *"आप पूरी तरह स्वस्थ हैं"*

### Clinically Approved Standard Wording
The system uses calibrated, anxiety-reducing, clinically responsible phrasing:

| Color Flag | Standard Visual Label | Standard Spoken Guidance | Clinical Interpretation |
|---|---|---|---|
| **Green** | *"No concerning sign was detected by this screening."* | *"This check did not identify a concerning sign. Please continue routine care and follow any advice from your health worker."* | **Does not rule out disease.** Indicates low probability of high-urgency findings on this specific screening pathway. Routine preventive care continues. |
| **Amber** | *"Follow-up or repeat check recommended."* | *"A closer check may be helpful. Your health worker will explain the next step."* | Moderate concern or borderline finding. Clinician-reviewed interval assigned (e.g. 7–14 days for skin recheck, 6 months for mild diabetic eye check). |
| **Red** | *"Prompt medical assessment recommended."* | *"This check suggests that a medical assessment is needed. Your health worker can help arrange the next step."* | Elevated risk indicators identified. Fast-tracks patient to authorized Primary or Community Health Centre. Never tells patient they have cancer or a lethal disease. |

## 2. Urgent Symptom Escalation Protocol (Bypasses AI Models)
If an individual presents with acute life-threatening "red flag" symptoms, the ASHA worker is instructed to initiate immediate medical emergency transport **without waiting for photos, report entry, or model execution**.

### Emergency Triggers:
1. **Severe Breathing Difficulty** (stridor, cyanosis, gasping, inability to speak full sentences).
2. **Altered Consciousness / Loss of Consciousness / Seizures**.
3. **Major / Uncontrolled Bleeding** (heavy hematemesis, massive hemoptysis, severe arterial wound).
4. **Sudden, Acute Loss of Vision** (painless or painful sudden visual blackout).
5. **Severe Crushing Chest Pain** radiating to arm, jaw, or back.

### Immediate Action Screen:
- Displays prominent red banner with direct one-tap call button to **108 (National Ambulance)** and the local Primary Health Centre (PHC) Medical Officer.
- Provides immediate first-aid positioning guidance.
- Locks routine screening workflows until patient safety is addressed.

## 3. Strict Input & Hardware Preconditions
- **Retina Screening**: Smartphone cameras cannot view the retina. Requires verified non-mydriatic fundus camera adapter. If absent, system switches to diabetic history and eye clinic referral questionnaire.
- **Chest Imaging**: Smartphone photos of the chest skin cannot detect pulmonary disease. Requires genuine radiograph import (PACS/DICOM) or runs the National Tuberculosis Elimination Program (NTEP) symptom checklist.
- **Blood Smear**: Phone photos of skin or CBC test tubes are rejected. Requires 100x oil immersion optical microscope connection for laboratory cell review.

## 4. Failure Mode Governance: Technical Failures Never Default to Green
If an edge model experiences memory exhaustion, missing model weights, corrupted files, camera failure, or poor lighting:
- The system **MUST NEVER** default to a green flag.
- The outcome is assigned to `IMAGE_UNCLEAR` or `CLINICIAN_REVIEW_REQUIRED`.
- Worker is instructed on retake steps or prompted to schedule a clinical visit.
