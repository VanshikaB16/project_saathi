import { Router } from 'express';
import { AuthenticatedRequest, authenticate, requireRole } from '../middleware/auth.js';
import { syncEngine } from '../services/syncEngine.js';
import { Referral, ReferralStatus } from '../models/schema.js';
import { auditMiddleware } from '../middleware/audit.js';

const router = Router();

// List all referrals (with filtering by status)
router.get('/', authenticate, (req: AuthenticatedRequest, res) => {
  const { status, patientId } = req.query;
  let referrals = syncEngine.getReferrals();

  if (status) {
    referrals = referrals.filter(r => r.status === status);
  }
  if (patientId) {
    referrals = referrals.filter(r => r.patientId === patientId);
  }

  res.json(referrals);
});

// Create new referral (ASHA worker)
router.post(
  '/',
  authenticate,
  requireRole('ASHA_WORKER', 'SYSTEM_ADMIN'),
  auditMiddleware('CREATE', 'REFERRAL'),
  (req: AuthenticatedRequest, res) => {
    const {
      patientId,
      destinationFacilityId,
      urgencyTier = 'PROMPT_ASSESSMENT',
      reasonSummary,
      originatingSessionId
    } = req.body;

    if (!patientId || !destinationFacilityId || !reasonSummary) {
      res.status(400).json({ error: 'patientId, destinationFacilityId, and reasonSummary are required.' });
      return;
    }

    const refNum = Math.floor(10000 + Math.random() * 90000);
    const newReferral: Referral = {
      id: `ref-${Date.now()}`,
      safeReferenceCode: `SAA-REF-${refNum}`,
      patientId,
      originatingSessionId,
      originatingWorkerId: req.user?.workerId || 'wp-demo-1',
      destinationFacilityId,
      urgencyTier,
      status: 'REFERRED',
      reasonSummary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    syncEngine.processBatch({
      deviceId: 'api-server',
      workerId: req.user?.workerId || 'wp-demo-1',
      syncTimestamp: new Date().toISOString(),
      schemaVersion: '1.0.0',
      patients: [],
      consents: [],
      screeningResults: [],
      referrals: [newReferral]
    });

    res.status(201).json(newReferral);
  }
);

// Get single referral
router.get('/:id', authenticate, (req: AuthenticatedRequest, res) => {
  const referral = syncEngine.getReferrals().find(r => r.id === req.params.id || r.safeReferenceCode === req.params.id);
  if (!referral) {
    res.status(404).json({ error: 'Referral not found' });
    return;
  }
  res.json(referral);
});

// Update referral outcome (Clinician / Medical Officer closing the loop)
router.patch(
  '/:id/outcome',
  authenticate,
  requireRole('CLINICIAN', 'SYSTEM_ADMIN'),
  auditMiddleware('UPDATE_OUTCOME', 'REFERRAL'),
  (req: AuthenticatedRequest, res) => {
    const { outcomeSummary, status = 'COMPLETED' } = req.body;
    const referral = syncEngine.getReferrals().find(r => r.id === req.params.id);

    if (!referral) {
      res.status(404).json({ error: 'Referral not found' });
      return;
    }

    if (!outcomeSummary) {
      res.status(400).json({ error: 'A documented clinical outcome summary is required to close the follow-through loop.' });
      return;
    }

    referral.outcomeSummary = outcomeSummary;
    referral.status = status as ReferralStatus;
    referral.closedAt = new Date().toISOString();
    referral.closedByClinicianId = req.user?.id;
    referral.updatedAt = new Date().toISOString();

    res.json(referral);
  }
);

export default router;
