# Model Card: Saathi Chest Radiograph Screening Model (`saathi-chest-v1.0-q8`)

## 1. Model Details
- **Model Identifier**: `saathi-chest-v1.0-q8`
- **Architecture**: DenseNet-121 (quantized INT8)
- **Model Version**: 1.0.0-demo
- **Model Size**: 6.9 MB
- **Runtime**: TensorFlow Lite / ONNX Runtime
- **Status**: **DEMONSTRATION MODEL ONLY — NOT CLINICALLY VALIDATED FOR TB DIAGNOSIS**

## 2. Intended Use & Input Restrictions
- **Intended Use**: Edge screening triaging of authorized digital chest radiographs (from portable mobile X-ray vans or district hospital PACS) to detect pulmonary abnormalities consistent with tuberculosis or consolidation.
- **CRITICAL CLINICAL RESTRICTIONS**:
  - **A smartphone camera photograph of a person's physical chest (torso/skin) CANNOT substitute for a chest X-ray and is strictly prohibited.**
  - If a user attempts to photograph a patient's chest skin, the app detects lack of radiographic density and rejects the image: *"A camera photograph of a person's chest cannot substitute for a chest X-ray. Please import a digital radiograph or follow the clinical symptom screening pathway."*
  - If imaging is unavailable, the application switches automatically to the **Clinician-Approved Symptom & Sputum Referral Workflow** (cough > 2 weeks, fever, night sweats, unexplained weight loss, hemoptysis).
  - The model **NEVER** diagnoses TB. Model output must not independently establish or exclude tuberculosis.

## 3. Input & Output Specifications
- **Input Format**: 512 x 512 x 1 (grayscale radiographic projection, normalized float `[0.0, 1.0]`).
- **Radiograph Quality Validation**:
  - Aspect ratio and rib cage symmetry check.
  - Exposure adequacy (avoid severe burnout of lung fields or underpenetration where vertebrae are invisible behind heart).
  - Verification that image is an authorized radiograph (DICOM metadata or high-fidelity medical scanner capture).
- **Outputs**:
  - `pulmonary_abnormality_score`: Float `[0.0, 1.0]`
  - `cavitation_infiltrate_flag`: Boolean
- **Screening Result Mapping**:
  - Score >= 0.45 or Cavitation flag: **Red Flag** ("Some signs need a closer medical check. Please arrange a sputum test and chest physician assessment promptly.")
  - 0.25 <= Score < 0.45: **Amber Flag** ("Follow-up or repeat check recommended. Health worker will coordinate sputum smear microscopy.")
  - Score < 0.25: **Green Flag** ("No concerning radiographic sign was detected by this screening. Note: Does not exclude tuberculosis if symptoms persist.")

## 4. Provenance & Research Datasets
- **Research Datasets**: NIH ChestX-ray14, Shenzhen Tuberculosis Dataset, Montgomery County X-ray set.
- **Limitations**:
  - Differences in portable X-ray generator calibration, patient positioning, and patient comorbidities (e.g., silicosis, post-TB scarring).
  - Demonstration model only; requires localized district health authority clinical validation.
