import { Router } from 'express';
import { AuthenticatedRequest, authenticate, requireRole } from '../middleware/auth.js';
import { syncEngine } from '../services/syncEngine.js';
import { ScreeningResult, ScreeningFlag } from '../models/schema.js';
import { auditMiddleware } from '../middleware/audit.js';

const router = Router();

router.get('/', authenticate, (req: AuthenticatedRequest, res) => {
  const results = syncEngine.getScreenings();
  res.json(results);
});

router.post(
  '/result',
  authenticate,
  requireRole('ASHA_WORKER', 'SYSTEM_ADMIN'),
  auditMiddleware('CREATE', 'SCREENING_RESULT'),
  (req: AuthenticatedRequest, res) => {
    const {
      sessionId = `ses-${Date.now()}`,
      patientId,
      modelId,
      modelVersion,
      flag,
      urgencyTier,
      confidenceScore,
      primaryMessageEn,
      primaryMessageHi,
      recommendedActionEn,
      recommendedActionHi,
      followUpIntervalDays,
      rawProbabilities
    } = req.body;

    if (!patientId || !modelId || !flag) {
      res.status(400).json({ error: 'patientId, modelId, and flag are required.' });
      return;
    }

    const screeningResult: ScreeningResult = {
      id: `scr-${Date.now()}`,
      sessionId,
      patientId,
      modelId,
      modelVersion: modelVersion || '1.0.0-demo',
      flag: flag as ScreeningFlag,
      urgencyTier: urgencyTier || 'ROUTINE',
      confidenceScore: confidenceScore || 0.9,
      primaryMessageEn: primaryMessageEn || 'No concerning sign was detected by this screening.',
      primaryMessageHi: primaryMessageHi || 'इस जाँच में कोई चिंताजनक लक्षण नहीं दिखा।',
      recommendedActionEn: recommendedActionEn || 'Continue routine care.',
      recommendedActionHi: recommendedActionHi || 'नियमित देखभाल जारी रखें।',
      followUpIntervalDays,
      rawProbabilities,
      createdAt: new Date().toISOString()
    };

    syncEngine.processBatch({
      deviceId: 'api-server',
      workerId: req.user?.workerId || 'wp-demo-1',
      syncTimestamp: new Date().toISOString(),
      schemaVersion: '1.0.0',
      patients: [],
      consents: [],
      screeningResults: [screeningResult],
      referrals: []
    });

    res.status(201).json(screeningResult);
  }
);

export default router;
