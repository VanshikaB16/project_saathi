import { Router } from 'express';
import { AuthenticatedRequest, authenticate, requireRole } from '../middleware/auth.js';
import { syncEngine } from '../services/syncEngine.js';
import { PatientProfile } from '../models/schema.js';
import { auditMiddleware } from '../middleware/audit.js';

const router = Router();

// List patients (ASHA worker, Clinician)
router.get('/', authenticate, (req: AuthenticatedRequest, res) => {
  const patients = syncEngine.getPatients();
  res.json(patients);
});

// Register patient
router.post(
  '/',
  authenticate,
  requireRole('ASHA_WORKER', 'SYSTEM_ADMIN'),
  auditMiddleware('CREATE', 'PATIENT_PROFILE'),
  (req: AuthenticatedRequest, res) => {
    const {
      villageName,
      ageYears,
      gender,
      preferredLanguage = 'hi',
      emergencyContactPhone,
      authorizedFamilyContact,
      photoUri,
      preferredNameAudioUri
    } = req.body;

    if (!villageName || !ageYears || !gender) {
      res.status(400).json({ error: 'villageName, ageYears, and gender are required.' });
      return;
    }

    const uniqueSeq = Math.floor(1000 + Math.random() * 9000);
    const safeIdentifier = `SAA-${villageName.substring(0, 3).toUpperCase()}-2026-${uniqueSeq}`;
    const newPatient: PatientProfile = {
      id: `pat-${Date.now()}`,
      safeIdentifier,
      createdByWorkerId: req.user?.workerId || 'wp-demo-1',
      villageName,
      ageYears: Number(ageYears),
      gender,
      preferredLanguage,
      emergencyContactPhone,
      authorizedFamilyContact,
      photoUri,
      preferredNameAudioUri,
      isSyntheticDemo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in syncEngine
    syncEngine.processBatch({
      deviceId: 'dev-gateway',
      workerId: req.user?.workerId || 'wp-demo-1',
      syncTimestamp: new Date().toISOString(),
      schemaVersion: '1.0.0',
      patients: [newPatient],
      consents: [],
      screeningResults: [],
      referrals: []
    });

    res.status(201).json(newPatient);
  }
);

// Get single patient
router.get('/:id', authenticate, (req: AuthenticatedRequest, res) => {
  const patient = syncEngine.getPatients().find(p => p.id === req.params.id || p.safeIdentifier === req.params.id);
  if (!patient) {
    res.status(404).json({ error: 'Patient profile not found' });
    return;
  }
  res.json(patient);
});

// Get patient timeline (chronological event history distinguishing AI, worker, clinician, lab)
router.get('/:id/timeline', authenticate, (req: AuthenticatedRequest, res) => {
  const patientId = req.params.id;
  const screenings = syncEngine.getScreenings().filter(s => s.patientId === patientId);
  const referrals = syncEngine.getReferrals().filter(r => r.patientId === patientId);

  const timelineEvents = [
    ...screenings.map(s => ({
      id: `ev-${s.id}`,
      type: 'SCREENING_RESULT',
      sourceType: 'AI_SCREENING_OUTPUT',
      sourceLabel: `Edge AI Model (${s.modelId})`,
      timestamp: s.createdAt,
      title: `${s.flag} Screening Flag`,
      summary: s.primaryMessageEn,
      urgencyTier: s.urgencyTier,
      badgeColor: s.flag === 'GREEN' ? 'green' : s.flag === 'AMBER' ? 'amber' : 'red'
    })),
    ...referrals.map(r => ({
      id: `ev-${r.id}`,
      type: 'REFERRAL_EVENT',
      sourceType: r.outcomeSummary ? 'CLINICIAN_CONFIRMED_FINDING' : 'WORKER_ENTERED_INFORMATION',
      sourceLabel: r.outcomeSummary ? 'Clinician Consultation' : 'ASHA Health Worker',
      timestamp: r.updatedAt,
      title: `Referral Status: ${r.status}`,
      summary: r.outcomeSummary || r.reasonSummary,
      urgencyTier: r.urgencyTier,
      badgeColor: r.status === 'COMPLETED' ? 'green' : 'amber'
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.json(timelineEvents);
});

export default router;
