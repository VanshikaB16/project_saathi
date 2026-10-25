# Project Saathi: Clinical Validation & Deployment Governance Checklist

Before any AI screening model or threshold update is promoted from **Demonstration Mode** to **Live Clinical Care Support**, the Institutional Review Board (IRB) and District Medical Committee must sign off on each item below.

---

## 1. Regulatory & Ethical Clearances
- [ ] **Institutional Review Board (IRB) / Ethics Committee Approval**: Protocols approved for community-based screening studies involving vulnerable rural populations.
- [ ] **Regulatory Alignment**: Compliance with Central Drugs Standard Control Organisation (CDSCO) guidelines for Software as a Medical Device (SaMD) and Indian Council of Medical Research (ICMR) Ethical Guidelines.
- [ ] **Informed Consent Protocol**: Consent workflow vetted for low-literacy communities, supporting spoken local language translation and documented voluntary non-biometric alternatives.
- [ ] **No Care Conditioning**: Formal protocol guaranteeing that declining screening or data-sharing never impedes standard emergency or primary care access.

## 2. Dataset & Population Validity
- [ ] **Intended Population Alignment**: Clinical evaluation conducted on representative rural Indian cohorts, accounting for regional demographic variations, nutrition, and comorbidities.
- [ ] **Skin Phototype Representation**: Evaluation explicitly audited across Fitzpatrick skin types IV, V, and VI. Models trained solely on Caucasian dermoscopic datasets (e.g., HAM10000) are **prohibited** from real-world phone photography inference without localized clinical re-validation.
- [ ] **Hardware Compatibility Verification**: Tests executed on target low-cost Android hardware (e.g. MediaTek Helio A22/G85, 2GB–4GB RAM) under realistic field conditions (ambient daylight, village dust, handheld motion).

## 3. Threshold Calibration & Clinical Performance
- [ ] **Clinician-Approved Operating Thresholds**: Operating points (cutoffs) signed off by clinical specialists:
  - Dermatology pathway: Dermatologist panel approval.
  - Retinal pathway: Retinal ophthalmologist panel approval (with certified fundus lens specifications).
  - Chest radiograph pathway: Pulmonologist & National Tuberculosis Elimination Program (NTEP) officer approval.
  - Blood cancer pathway: Hematopathologist approval of CBC reference ranges and smear review protocols.
- [ ] **Metric Targets Met**:
  - Sensitivity for high-risk triage >= 90.0% (minimizing false negatives).
  - Specificity >= 80.0% (preventing primary health center referral saturation).
  - Positive Predictive Value (PPV) and Negative Predictive Value (NPV) modeled on expected community disease prevalence.
- [ ] **Subgroup Disparity Audit**: No statistically significant disparity in False Negative Rate across gender, age brackets (pediatric, adult, geriatric), or skin phototypes.

## 4. Safety Fail-Safes & User Interface Wording
- [ ] **Non-Diagnostic Language Audit**: Complete UI text and audio strings audited. The system **MUST NEVER** display or voice:
  - "You have cancer" / "You have leukemia" / "You have TB" / "You are healthy"
  - Allowed wording strictly confirmed:
    - *"No concerning sign was detected by this screening."*
    - *"Some signs need a closer medical check."*
    - *"Please arrange a medical assessment promptly."*
- [ ] **Never Default to Green**: Audit confirms that model inference failure, memory exhaustion, network disconnect, or bad image quality never produces a green flag.
- [ ] **Independent Symptom Escalation Pathway**: Independent red-flag symptom screening (severe breathing distress, altered consciousness, uncontrolled bleeding, sudden vision loss) bypasses all image models and immediately displays emergency instructions (108 Ambulance / nearest PHC).

## 5. Ongoing Monitoring & Incident Management
- [ ] **Model Version Pinning**: Edge mobile devices enforce SHA-256 hash pinning against the centralized model registry.
- [ ] **Rollback Strategy Tested**: District administrators can remotely deactivate an approved model version within 15 minutes of an anomaly or safety report.
- [ ] **Adverse Event Reporting**: Standard Operating Procedure (SOP) established for health workers to report false negatives or missed diagnoses through the application audit log.
