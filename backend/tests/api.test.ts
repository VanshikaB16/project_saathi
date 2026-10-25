/**
 * Project Saathi - Backend Test Suite (Node.js Built-in Test Runner)
 * Tests core clinical safety contracts, idempotent sync, and privacy suppression.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { notificationService } from '../dist/services/notificationAdapter.js';
import { syncEngine } from '../dist/services/syncEngine.js';

test('Clinical Safety: Sanitizer strips prohibited diagnosis names from SMS notifications', () => {
  const unsafeMessage = 'Patient has cancer and requires emergency follow-up.';
  const sanitized = notificationService.sanitizeMessageContent(unsafeMessage);
  assert.ok(!sanitized.includes('cancer'), 'Sanitizer must remove "cancer"');
  assert.ok(sanitized.includes('[health follow-up]'), 'Sanitizer replaces disease name with neutral phrase');
});

test('Privacy Governance: Notifications cannot be queued without verified consent', async () => {
  await assert.rejects(
    async () => {
      await notificationService.queueNotification(
        '+919876543210',
        'Routine follow-up reminder',
        false // consent declined
      );
    },
    /Patient consent was not granted/,
    'Must throw error if consent was not granted'
  );
});

test('Offline Sync: Resolves conflicts by preventing reversal of completed clinical referrals', () => {
  // Setup an already completed referral on the server
  const refId = 'test-ref-conflict-01';
  syncEngine.processBatch({
    deviceId: 'dev-clinician',
    workerId: 'clinician-01',
    syncTimestamp: new Date().toISOString(),
    schemaVersion: '1.0.0',
    patients: [],
    consents: [],
    screeningResults: [],
    referrals: [
      {
        id: refId,
        safeReferenceCode: 'SAA-REF-8888',
        patientId: 'pat-01',
        originatingWorkerId: 'worker-01',
        destinationFacilityId: 'fac-01',
        urgencyTier: 'PROMPT_ASSESSMENT',
        status: 'COMPLETED',
        outcomeSummary: 'Clinician examined patient, provided topical treatment and discharged.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  });

  // Client attempts to sync an older offline pending state
  const conflictBatch = syncEngine.processBatch({
    deviceId: 'dev-worker',
    workerId: 'worker-01',
    syncTimestamp: new Date().toISOString(),
    schemaVersion: '1.0.0',
    patients: [],
    consents: [],
    screeningResults: [],
    referrals: [
      {
        id: refId,
        safeReferenceCode: 'SAA-REF-8888',
        patientId: 'pat-01',
        originatingWorkerId: 'worker-01',
        destinationFacilityId: 'fac-01',
        urgencyTier: 'PROMPT_ASSESSMENT',
        status: 'PENDING_DISPATCH',
        reasonSummary: 'Old offline state',
        createdAt: new Date(Date.now() - 100000).toISOString(),
        updatedAt: new Date(Date.now() - 100000).toISOString()
      }
    ]
  });

  assert.equal(conflictBatch.conflicts.length, 1, 'Should register one conflict');
  assert.equal(conflictBatch.conflicts[0].resolution, 'SERVER_AUTHORITATIVE_PRESERVED');

  const preserved = syncEngine.getReferrals().find(r => r.id === refId);
  assert.equal(preserved?.status, 'COMPLETED', 'Server completed status must be preserved');
});
