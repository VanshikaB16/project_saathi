# Model Card: Saathi Skin-Sign Screening Model (`saathi-skin-v1.0-q8`)

## 1. Model Details
- **Model Identifier**: `saathi-skin-v1.0-q8`
- **Architecture**: MobileNetV3-Small (Quantized INT8 for on-device edge execution)
- **Model Version**: 1.0.2-demo
- **Model Size**: 3.4 MB
- **Runtime**: TensorFlow Lite / ONNX Runtime Mobile
- **Status**: **DEMONSTRATION MODEL ONLY — NOT CLINICALLY VALIDATED FOR PATIENT DIAGNOSIS**

## 2. Intended Use
- **Primary Use**: Rapid edge screening of visible skin lesions, unusual bruising, pallor, and petechiae-like patterns in rural primary healthcare settings by trained ASHA health workers.
- **Role**: Triage risk indicator to assist ASHA workers in deciding whether to recommend follow-up or medical assessment.
- **Out-of-Scope / Prohibited Uses**:
  - The model **MUST NEVER** be used to diagnose melanoma, skin carcinomas, leukemia, or any specific disease.
  - Must not be used on poor-quality images (blurred, overexposed, flash glare, improper distance).
  - Must not be used as sole evidence for clinical treatment or surgical intervention.

## 3. Input & Output Specifications
- **Input Format**: Single RGB image
- **Input Dimensions**: 224 x 224 x 3 (normalized to `[-1.0, 1.0]`)
- **Required Hardware**: Android smartphone camera (minimum 8 MP, auto-focus enabled, ambient natural lighting recommended).
- **Pre-inference Quality Gates**:
  - Laplacian variance blur threshold > 120.0
  - Luminance check (mean pixel intensity 40–210 to avoid underexposure and clipping)
  - Color balance verification (prevent severe flash glare or false pallor)
- **Output Tensor**: Vector of 3 calibrated risk indicators:
  - `no_concerning_sign_prob`: Float `[0.0, 1.0]`
  - `monitor_recheck_prob`: Float `[0.0, 1.0]`
  - `medical_assessment_prob`: Float `[0.0, 1.0]`
- **Screening Result Mapping**:
  - `medical_assessment_prob >= 0.40`: **Red Flag** ("Some signs need a closer medical check. Please arrange a medical assessment promptly.")
  - `0.20 <= medical_assessment_prob < 0.40` OR `monitor_recheck_prob >= 0.35`: **Amber Flag** ("A closer check may be helpful. Your health worker will explain the next step.")
  - Otherwise: **Green Flag** ("No concerning sign was detected by this screening. Please continue routine care and follow any advice from your health worker.")

## 4. Training & Validation Provenance
- **Candidate Research Datasets**:
  - HAM10000 (Human Against Machine with 10000 training images)
  - BCN20000 (ISIC 2019 dermoscopic subset)
  - Curated open dermatological clinical images (fitzpatrick17k subset)
- **Critical Limitation & Provenance Warning**:
  - HAM10000 images were captured via dermatoscopic magnification lenses under controlled clinical illumination.
  - Real-world rural ASHA field photography uses unmagnified smartphone optics across diverse Indian skin phototypes (Fitzpatrick types IV, V, and VI).
  - Pretrained research weights **DO NOT** constitute clinical safety or efficacy on non-dermoscopic Indian rural field images.

## 5. Performance Metrics (Research Benchmark)
- **Sensitivity**: 88.4% (at operating threshold 0.40)
- **Specificity**: 82.1%
- **Positive Predictive Value (PPV)**: 64.7%
- **Negative Predictive Value (NPV)**: 94.8%
- **Average Edge Latency**: 180 ms (tested on MediaTek Helio G85, 4GB RAM)
- **Rejection Rate (Field Test Images)**: 14.2% rejected due to motion blur or inadequate lighting.

## 6. Safety Safeguards & Failure Modes
- If image quality verification fails -> Model execution aborted, worker prompted with actionable instructions ("Move to natural daylight", "Hold camera steady 15 cm from skin").
- Model inference failure or crash -> **NEVER defaults to Green**. Reverts to fallback state: "Screening not completed — Clinician review required".
- Version pinning: Device runtime enforces cryptographic checksum (`SHA-256`) match against backend approved model registry.
