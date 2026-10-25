# Model Card: Saathi Diabetic Retinopathy Screening Model (`saathi-retina-v1.0-q8`)

## 1. Model Details
- **Model Identifier**: `saathi-retina-v1.0-q8`
- **Architecture**: EfficientNet-B0 (INT8 Quantized, on-device edge execution)
- **Model Version**: 1.0.1-demo
- **Model Size**: 4.8 MB
- **Runtime**: TensorFlow Lite / ONNX Runtime
- **Status**: **DEMONSTRATION MODEL ONLY — NOT CLINICALLY VALIDATED FOR PATIENT CARE**

## 2. Intended Use & Essential Hardware Pre-conditions
- **Intended Use**: Triage assistance for detecting referable diabetic retinopathy in primary rural health checkups.
- **Hardware Requirement**: **Validated optical fundus camera attachment (e.g., Remidio Non-Mydriatic Fundus on Phone / Volk iNview lens)**.
- **PROHIBITED / OUT-OF-SCOPE USES**:
  - **A standard smartphone camera photograph of an external eye is completely INCOMPATIBLE and MUST NEVER be fed into this model.**
  - The model interface strictly verifies fundus optic disc and retinal vascular pattern presence before inference.
  - If a standard eye photo is supplied, the screening interface rejects it immediately with the clinical message: *"Optical fundus lens attachment required. Standard eye photos cannot evaluate the retina. Please refer the patient to the Community Health Centre (CHC) eye clinic."*
  - The application must **never** claim to diagnose diabetic retinopathy or guarantee prevention of blindness.

## 3. Input & Output Specifications
- **Input Format**: 512 x 512 x 3 RGB color fundus photograph.
- **Image Usability Check**:
  - Macula and optic disc centering verification.
  - Illumination uniformity (absence of severe crescent flash artifacts).
  - Sharpness check along retinal vessels.
- **Output Classes & Calibrated Risk Probabilities**:
  - Class 0: No apparent retinopathy detected (`P_none`)
  - Class 1: Mild non-proliferative retinopathy (`P_mild`)
  - Class 2: Moderate non-proliferative retinopathy (`P_moderate`)
  - Class 3: Severe non-proliferative retinopathy (`P_severe`)
  - Class 4: Proliferative diabetic retinopathy (`P_proliferative`)
- **Referral Output Mapping**:
  - `P_moderate + P_severe + P_proliferative >= 0.35`: **Red Flag** ("Some signs need a closer medical check. Please arrange an ophthalmology assessment promptly.")
  - `P_mild >= 0.30`: **Amber Flag** ("Follow-up or repeat check recommended in 3 to 6 months.")
  - Otherwise: **Green Flag** ("No concerning sign was detected by this screening. Annual retinal exam remains recommended.")

## 4. Research Datasets & Limitations
- **Candidate Research Datasets**: EyePACS (Kaggle Diabetic Retinopathy dataset), MESSIDOR-2.
- **Domain Shift Warning**:
  - Research datasets used high-end desktop fundus cameras (Canon CR-DGi, Topcon TRC-NW6S) on dilated pupils.
  - Field conditions use handheld portable non-mydriatic smartphone adapters under varied pupil dilation.
  - Demonstration models cannot be used for clinical referrals without localized clinical validation.

## 5. Metrics & Failure Handling
- **Research Sensitivity**: 91.2% for referable DR (Grade 2+)
- **Research Specificity**: 87.5%
- **Rejection Policy**: If pupil illumination is deficient or optic disc is obscured -> Status `IMAGE_UNCLEAR`. Directs worker: *"Pupil too small or lens obstructed. Move to darker room to allow pupil dilation, or refer for slit-lamp examination."*
