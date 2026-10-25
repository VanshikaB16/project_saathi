# Project Saathi: Clinical Validation Plan & Roadmap

## 1. Validation Philosophy
No research dataset or demonstration classifier automatically establishes clinical validity in real-world rural healthcare. Project Saathi follows a 4-phase clinical validation pathway modeled on WHO digital health intervention assessment frameworks and CDSCO Software as a Medical Device (SaMD) requirements.

## 2. Four-Phase Validation Pathway

```
+------------------------------------------------------------------------------------+
| Phase 1: Technical & In-Silico Benchmarking                                         |
| - Verify TFLite/ONNX quantization fidelity vs float32 models.                      |
| - Measure edge latency on representative Android phones (< 300 ms).                |
| - Image quality gate evaluation against synthetic blur, underexposure, and glare. |
+------------------------------------------------------------------------------------+
                                         |
                                         v
+------------------------------------------------------------------------------------+
| Phase 2: Retrospective Multi-Centre Clinical Audit                                 |
| - Evaluate models against >= 10,000 clinically confirmed patient records from       |
|   Indian tertiary and district hospitals.                                          |
| - Stratified evaluation across Fitzpatrick skin phototypes IV, V, and VI.          |
| - Sensitivity target >= 90.0% for high-urgency conditions; Specificity >= 80.0%.  |
+------------------------------------------------------------------------------------+
                                         |
                                         v
+------------------------------------------------------------------------------------+
| Phase 3: Prospective Field Feasibility Trial (Supervised ASHA Cohort)               |
| - Pilot deployed in 50 Gram Panchayats across 3 diverse states.                   |
| - ASHA workers paired with mobile medical officers for simultaneous evaluation.    |
| - Measure ASHA workflow completion time (target: < 3 minutes per screening).       |
| - Audit referral completion rates, false-negative escalations, and user trust.    |
+------------------------------------------------------------------------------------+
                                         |
                                         v
+------------------------------------------------------------------------------------+
| Phase 4: Controlled District Rollout & Longitudinal Registry                       |
| - Centralized model registry version pinning with remote emergency rollback.        |
| - Bi-weekly clinical oversight meetings reviewing suppressed aggregate data.       |
| - Independent audit by state health directorate before wide-scale adoption.        |
+------------------------------------------------------------------------------------+
```

## 3. Quantitative Safety & Performance Thresholds
Every deployed screening model must satisfy the following clinical benchmarks:

| Clinical Pathway | Minimum Sensitivity | Minimum Specificity | Max Disparity in FNR across Subgroups | Permitted Hardware Inputs |
|---|---|---|---|---|
| **Skin Signs** | >= 88.0% | >= 80.0% | <= 4.0% gap between Fitzpatrick IV & VI | Smartphone camera with blur > 110 & proper lighting |
| **Diabetic Retinopathy** | >= 90.0% | >= 85.0% | <= 3.5% gap across age groups | Certified optical fundus attachment only |
| **Chest Screening** | >= 92.0% | >= 82.0% | <= 3.0% gap across genders | Genuine DICOM / digital radiograph from authorized van |
| **Microscopic Smear** | >= 94.0% | >= 85.0% | <= 2.5% gap across stain batches | 100x oil immersion microscope camera adapter only |

## 4. Incident Reporting & Continuous Auditing
- If a clinician encounters a case where an ASHA screening produced a green result but subsequent clinical symptoms indicated serious illness, a **Discrepancy Audit Incident** is registered in the district dashboard.
- The district medical board reviews all incidents bi-weekly to determine if threshold tuning or model rollback is needed.
