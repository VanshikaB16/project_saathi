import { Router } from 'express';
import { AuthenticatedRequest, authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/login', (req, res) => {
  const { phoneNumber, role = 'ASHA_WORKER' } = req.body;
  res.json({
    token: `demo-token-${Date.now()}`,
    user: {
      id: `user-${Date.now()}`,
      phoneNumber: phoneNumber || '+919876543210',
      role,
      fullName: role === 'ASHA_WORKER' ? 'Sunita Sharma (ASHA)' : 'Dr. Rajiv Verma (MO)',
      preferredLanguage: 'hi'
    }
  });
});

router.get('/me', authenticate, (req: AuthenticatedRequest, res) => {
  res.json({
    user: req.user
  });
});

export default router;
