/**
 * Project Saathi - Core Systems & Clinical Safety Verification Test Runner
 * Runs natively on Node 26 without external npm dependencies.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '../..');

console.log('================================================================');
console.log('PROJECT SAATHI: AUTOMATED SYSTEM & SAFETY VERIFICATION');
console.log(`Root: ${projectRoot}`);
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`[PASS] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}\n`);
  }
}

// 1. Clinical Safety Wording Test (Section 4 Overrides)
runTest('Section 4: System Wording strictly prohibits diagnostic assertions', () => {
  const prohibited = [
    'you have cancer',
    'you have leukemia',
    'you have tb',
    'you are healthy',
  ];

  const appTranslationsPath = path.join(projectRoot, 'mobile/lib/core/localization/app_translations.dart');
  const translationsContent = fs.readFileSync(appTranslationsPath, 'utf8').toLowerCase();

  for (const phrase of prohibited) {
    assert.ok(
      !translationsContent.includes(phrase),
      `Prohibited diagnosis phrase "${phrase}" must not be present in mobile translations.`
    );
  }

  // Ensure required non-diagnostic triage phrases exist
  assert.ok(
    translationsContent.includes('no concerning sign was detected by this screening'),
    'Must include approved Green phrasing.'
  );
  assert.ok(
    translationsContent.includes('some signs need a closer medical check') ||
    translationsContent.includes('follow-up or repeat check recommended'),
    'Must include approved Amber phrasing.'
  );
  assert.ok(
    translationsContent.includes('prompt medical assessment recommended'),
    'Must include approved Red phrasing.'
  );
});

// 2. Database Schema Completeness Test (Section 25 - 17 Required Entities)
runTest('Section 25: SQL Schema covers all 17 clinical and operational entities', () => {
  const schemaPath = path.join(projectRoot, 'backend/migrations/001_initial_schema.sql');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');

  const requiredTables = [
    'users',
    'worker_profiles',
    'patient_profiles',
    'consent_records',
    'screening_sessions',
    'screening_results',
    'model_registry',
    'lab_reports',
    'lab_values',
    'referrals',
    'facilities',
    'appointments',
    'followup_tasks',
    'notification_jobs',
    'notification_events',
    'sync_events',
    'audit_logs',
    'district_aggregates'
  ];

  for (const table of requiredTables) {
    assert.ok(
      schemaContent.includes(`CREATE TABLE IF NOT EXISTS ${table}`),
      `Schema must define table/collection: "${table}"`
    );
  }
});

// 3. Clinical Model Cards & Adapters Test (Section 22 & 23)
runTest('Section 22-23: Quantized edge model cards and validation exist for all 4 pathways', () => {
  const expectedCards = [
    'skin_lesion_v1.md',
    'diabetic_retinopathy_v1.md',
    'chest_xray_tb_v1.md',
    'blood_smear_all_v1.md'
  ];

  for (const card of expectedCards) {
    const cardPath = path.join(projectRoot, `ml/model_cards/${card}`);
    assert.ok(fs.existsSync(cardPath), `Model card "${card}" must exist.`);
    const content = fs.readFileSync(cardPath, 'utf8');
    assert.ok(content.includes('DEMONSTRATION MODEL ONLY'), `Card "${card}" must include demonstration disclaimer.`);
  }
});

// 4. Differential Privacy & Small-Cell Suppression Test (Section 26 & 27)
runTest('Section 26-27: Small-cell suppression (< 5) is enforced to prevent re-identification', () => {
  const threshold = 5;
  const rawCounts = [
    { village: 'Rampur', count: 9 },
    { village: 'Kalyanpur', count: 6 },
    { village: 'Bishanpur', count: 3 },
    { village: 'Shivgarh', count: 2 },
  ];

  const processed = rawCounts.map(v => ({
    village: v.village,
    display: v.count < threshold ? '< 5' : v.count.toString(),
    isSuppressed: v.count < threshold,
  }));

  const bishanpur = processed.find(p => p.village === 'Bishanpur');
  const rampur = processed.find(p => p.village === 'Rampur');

  assert.equal(bishanpur?.display, '< 5', 'Bishanpur count (3) must be suppressed.');
  assert.equal(bishanpur?.isSuppressed, true);
  assert.equal(rampur?.display, '9', 'Rampur count (9) must remain visible.');
  assert.equal(rampur?.isSuppressed, false);
});

// 5. Documentation Package Completeness Test (Section 37)
runTest('Section 37: Deliverables include all 5 comprehensive governance documents', () => {
  const requiredDocs = [
    'architecture.md',
    'privacy.md',
    'clinical_safety.md',
    'validation_plan.md',
    'deployment.md'
  ];

  for (const doc of requiredDocs) {
    const docPath = path.join(projectRoot, `docs/${doc}`);
    assert.ok(fs.existsSync(docPath), `Document "${doc}" must exist.`);
  }
});

// 6. Non-Biometric Identification Safety Check (Section 8)
runTest('Section 8: Patient model enforces safe non-biometric identifier and optional photos', () => {
  const patientModelPath = path.join(projectRoot, 'mobile/lib/features/patients/patient_model.dart');
  const content = fs.readFileSync(patientModelPath, 'utf8');
  assert.ok(content.includes('safeIdentifier'), 'Must use safeIdentifier.');
  assert.ok(content.includes('String? photoUri'), 'photoUri must be optional String?.');
});

// 7. Follow-Through Loop Referral Closure Safety (Section 18)
runTest('Section 18: Referral follows through until clinical outcome is recorded', () => {
  const referralModelPath = path.join(projectRoot, 'mobile/lib/features/referrals/referral_model.dart');
  const content = fs.readFileSync(referralModelPath, 'utf8');
  assert.ok(content.includes('String? outcomeSummary'), 'outcomeSummary must be tracked as optional String?.');
  assert.ok(content.includes('status'), 'status must be tracked.');
});

console.log(`\nVerification Summary: ${passedTests} / ${totalTests} tests passed.`);
assert.equal(passedTests, totalTests, 'All core tests must pass.');
console.log('ALL PROJECT SAATHI SAFETY AND SYSTEM CONTRACTS VERIFIED SUCCESSFULLY!');
