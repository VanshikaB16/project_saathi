import { Router } from 'express';
import { AuthenticatedRequest, authenticate } from '../middleware/auth.js';
import { syncEngine, SyncBatchPayload } from '../services/syncEngine.js';
import { auditMiddleware } from '../middleware/audit.js';

const router = Router();

// Idempotent Batch Synchronization Endpoint from ASHA mobile devices
router.post(
  '/batch',
  authenticate,
  auditMiddleware('SYNC_BATCH', 'SYNC_EVENT'),
  (req: AuthenticatedRequest, res) => {
    const batch: SyncBatchPayload = req.body;

    if (!batch.deviceId || !batch.workerId) {
      res.status(400).json({ error: 'deviceId and workerId are required in sync batch.' });
      return;
    }

    const result = syncEngine.processBatch(batch);
    res.json(result);
  }
);

export default router;
