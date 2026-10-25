# Model Card: Saathi Peripheral Blood Smear Cell Review Model (`saathi-smear-v1.0-q8`)

## 1. Model Details
- **Model Identifier**: `saathi-smear-v1.0-q8`
- **Architecture**: YOLOv8-Nano / Faster R-CNN edge head (Quantized INT8)
- **Model Version**: 1.0.0-demo
- **Model Size**: 5.2 MB
- **Runtime**: TensorFlow Lite / ONNX Runtime Mobile
- **Status**: **DEMONSTRATION MODEL ONLY — NOT CLINICALLY VALIDATED**

## 2. Intended Use & Role in Funnel
- **Role in Stage 4 of Blood-Cancer Funnel**:
  - Highlights candidate atypical white blood cells (lymphoblasts / myeloblasts) on stained peripheral blood smear slides under a certified 100x oil immersion microscope for laboratory technician review.
- **CLINICAL SAFEGUARDS & RESTRICTIONS**:
  - **A standard phone photograph of skin, bruising, or a blood vial is NOT a blood smear and is rejected.**
  - The model **NEVER** diagnoses leukemia.
  - The model only marks candidate regions of interest (bounding boxes) for trained laboratory personnel.
  - An abnormal flag on the blood smear review always requires manual pathologist confirmation and bone marrow biopsy correlation before any definitive clinical diagnosis.

## 3. Input & Output Specifications
- **Input**: 640 x 640 x 3 RGB image captured via certified microscope eyepiece optical adapter (Leishman or Giemsa stained smear, 100x oil objective).
- **Quality Gates**:
  - Staining color verification (pink-purple RBCs, deep purple nuclei).
  - Monolayer density check (reject areas where RBCs overlap densely or are lysed).
- **Outputs**:
  - Array of bounding boxes with candidate labels: `[x_min, y_min, x_max, y_max, confidence, cell_type]`
  - Total candidate blast cell count per high-power field (HPF).
- **Result Output**:
  - Candidate blast cell count > 0: **Amber/Red Lab Flag** ("Candidate atypical cells flagged for pathologist verification. Urgent laboratory consultation advised.")
  - Rejection: "Microscope magnification or staining inadequate. Re-examine monolayer under 100x oil immersion."

## 4. Provenance & Research Datasets
- **Research Datasets**: ALL-IDB1 & ALL-IDB2 (Acute Lymphoblastic Leukemia Image Database for Image Processing).
- **Limitations**:
  - Staining variations across PHC laboratory reagents (differences in Giemsa vs Leishman pH buffer).
  - Field microscopes may have spherical aberration or dust on optical elements.
  - Must not be used as standalone clinical proof.
