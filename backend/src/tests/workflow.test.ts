import test from 'node:test';
import assert from 'node:assert';
import { runLocalWorkflow } from '../workflows/runWorkflowLocal.js';

test('Render Workflows: District Outbreak Orchestration Pipeline', async () => {
  const result = await runLocalWorkflow();
  assert.ok(result.workflowRunId, 'Expected workflowRunId');
  assert.strictEqual(result.ingestedBatches, 4);
  assert.ok(result.totalScreenings > 0);
  assert.ok(result.totalHighRisk > 0);
  assert.strictEqual(result.suppressedClusters, 2);
  assert.ok(result.dispatchedTokens.length > 0);
  assert.ok(result.tamperEvidentAuditId.startsWith('AUDIT-BLK-'));
  assert.ok(['NORMAL', 'ELEVATED', 'CRITICAL'].includes(result.alertLevel));
});
