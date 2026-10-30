/**
 * Local Test Runner for Project Saathi Render Workflow
 * Executes the workflow in-process or connects to the Render Workflows daemon.
 */

import { districtOutbreakWorkflow } from './districtOutbreakWorkflow.js';
import type { TaskContext } from '@renderinc/sdk/workflows';

// Helper mock context to test tasks and pipelines locally with identical semantics
export function createLocalTaskContext(taskRunId = `local-run-${Date.now()}`): TaskContext {
  return {
    metadata: {
      taskRunId,
      rootTaskRunId: taskRunId,
    },
    async run(taskDef, ...args: any[]) {
      console.log(`  └─ [Mock Runner] Dispatching task: ${taskDef.name}`);
      return (taskDef.func as any)(this, ...args);
    },
  };
}

export async function runLocalWorkflow() {
  console.log('===============================================================');
  console.log('  Project Saathi - Render Workflows Execution Engine');
  console.log('  Testing Durable Pipeline with @renderinc/sdk/workflows');
  console.log('===============================================================');

  const ctx = createLocalTaskContext();
  const startTime = Date.now();
  const result = await (districtOutbreakWorkflow.func as any)(ctx);

  console.log('\n--- Workflow Execution Output ---');
  console.log(JSON.stringify(result, null, 2));
  console.log(`\nExecution finished in ${Date.now() - startTime}ms.`);
  console.log('===============================================================');

  return result;
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('runWorkflowLocal.js') || process.argv[1]?.endsWith('runWorkflowLocal.ts')) {
  runLocalWorkflow().catch((err) => {
    console.error('Workflow error:', err);
    process.exit(1);
  });
}
