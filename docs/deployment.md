# Project Saathi: Deployment and Setup Guide

## 1. System Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Python**: 3.9+ (for ML adapters and validation scripts)
- **Flutter SDK**: 3.22+ (for building native Android APKs)
- **Target Android OS**: Android 8.0 (Oreo / API Level 26) through Android 14

---

## 2. Environment Configuration
Copy the provided `.env.example` template to `.env` in the root and in the subdirectories:
```bash
cp .env.example .env
cp .env.example backend/.env
cp .env.example dashboard/.env
```

### Essential Environment Variables
```ini
# Environment Mode (demonstration / staging / production)
NODE_ENV=development
SAATHI_DEMO_MODE=true

# Mobile & Dashboard API URL
VITE_API_BASE_URL=http://localhost:5000/api
PORT=5000

# Security & Encryption Secrets (DO NOT COMMIT REAL SECRETS)
JWT_SECRET=saathi_local_development_jwt_secret_key_32chars
DATABASE_ENCRYPTION_KEY=saathi_dev_database_aes256_passphrase

# SMS Provider Adapter (mock / twilio / gupshup / fast2sms)
SMS_PROVIDER=mock
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

---

## 3. Subsystem Setup & Execution

### A. District Admin Dashboard & Mobile Simulator (React + TypeScript)
The dashboard includes both the district administration portal (`/admin/*`) and the interactive ASHA Mobile Simulator (`/mobile/*`), allowing full local testing in your web browser.

```bash
cd dashboard
npm install
npm run dev
```
- Open `http://localhost:5173` in your browser.
- Select **"ASHA Mobile App"** to experience the 16 offline mobile screens with voice TTS, 3-tap screening, and camera capture.
- Select **"District Admin Portal"** to view aggregated village metrics, referral follow-through tracking, and model governance.

### B. Backend API & Sync Engine (Node.js + TypeScript)
```bash
cd backend
npm install
npm run build
npm start
```
- The backend serves REST endpoints on port 5000 for authentication, offline synchronization, notifications, and district aggregates.

### C. Native Android Mobile Application (Flutter)
When deploying to physical Android smartphones for field trials:
```bash
cd mobile
flutter pub get
flutter run
# Or build release APK:
flutter build apk --release --split-per-abi
```

### D. Machine Learning Validation Suite
Run the on-device ML quality checks and fairness tests:
```bash
python3 ml/validation/quality_metrics.py
python3 ml/validation/subgroup_fairness.py
```

---

## 4. Demonstration Mode Policy
- In Demonstration Mode (`SAATHI_DEMO_MODE=true`), all screens render a persistent visual badge:
  `DEMO — NOT FOR CLINICAL USE`.
- Synthetic patient records (seeded with sample names like *"Sunita Devi"*, *"Ram Lal"*) are isolated from real clinical records.
- Simulated notifications and mock SMS adapters prevent inadvertent external messaging during training.
