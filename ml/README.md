# Project Saathi: Applied Machine Learning Subsystem

This directory contains the machine learning architecture, edge adapter interfaces, model cards, and clinical validation protocols for Project Saathi.

## Clinical Governance Principles
1. **Screening is NOT Diagnosis**: Models output calibrated triage indicators (Green, Amber, Red). Under no circumstances does the system diagnose cancer, leukemia, diabetic retinopathy, or tuberculosis.
2. **On-Device Edge Inference**: Models are quantized (INT8/TFLite/ONNX) to run entirely offline on low-cost Android hardware (e.g., MediaTek Helio G85, 2-4GB RAM).
3. **Hardware & Input Strictness**:
   - `saathi-skin`: Checks blur variance (>110) and exposure (45-220 luminance) before inference.
   - `saathi-retina`: Rejects standard smartphone external eye photos. Requires certified optical fundus attachment (Remidio/Volk).
   - `saathi-chest`: Rejects smartphone photos of the torso/skin. Requires genuine DICOM/X-ray radiograph or defaults to the clinical symptom questionnaire.
   - `saathi-smear`: Rejects photos of skin or blood vials. Requires 100x oil immersion microscope adapter.
4. **Never Default to Green**: A technical crash, missing model file, or low-quality image is mapped to `UNCLEAR` or `CLINICIAN_REVIEW_REQUIRED`, never green.

## Directory Structure
```
ml/
├── model_cards/
│   ├── skin_lesion_v1.md          # On-device skin-sign triage card
│   ├── diabetic_retinopathy_v1.md # Optical fundus screening card
│   ├── chest_xray_tb_v1.md        # Radiographic TB screening card
│   └── blood_smear_all_v1.md      # Microscopic blast cell highlighter card
├── adapters/
│   ├── base_adapter.py            # Standard BaseScreeningAdapter contract
│   ├── skin_adapter.py            # Skin screening implementation
│   ├── retina_adapter.py          # Retinal screening implementation
│   ├── chest_adapter.py           # Chest radiograph & symptom implementation
│   └── blood_smear_adapter.py     # Microscopic peripheral smear implementation
└── validation/
    ├── clinical_checklist.md      # Regulatory, ethics, and IRB sign-off protocol
    ├── subgroup_fairness.py       # Demographic disparity and FNR gap evaluator
    └── quality_metrics.py         # Laplacian blur and luminance quality gate
```

## Running Verification Tests
```bash
python3 ml/validation/quality_metrics.py
python3 ml/validation/subgroup_fairness.py
```
