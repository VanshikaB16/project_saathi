import { Router } from 'express';
import { AuthenticatedRequest, authenticate, requireRole } from '../middleware/auth.js';
import { notificationService } from '../services/notificationAdapter.js';
import { auditMiddleware } from '../middleware/audit.js';

const router = Router();

router.get('/', authenticate, (req: AuthenticatedRequest, res) => {
  res.json(notificationService.getAllJobs());
});

router.post(
  '/queue',
  authenticate,
  requireRole('ASHA_WORKER', 'CLINICIAN', 'SYSTEM_ADMIN'),
  auditMiddleware('QUEUE_NOTIFICATION', 'NOTIFICATION_JOB'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { recipientPhone, messageContent, consentVerified, patientId, channel } = req.body;
      const job = await notificationService.queueNotification(
        recipientPhone,
        messageContent,
        Boolean(consentVerified),
        patientId,
        channel
      );
      res.status(201).json(job);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.post('/dispatch', authenticate, async (req: AuthenticatedRequest, res) => {
  const result = await notificationService.processPendingQueue();
  res.json(result);
});

export default router;
