import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/schema.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    workerId?: string;
  };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // For local dev/demo testing fallback, allow anonymous or header-based user
    const devRole = (req.headers['x-saathi-role'] as UserRole) || 'ASHA_WORKER';
    const devUserId = (req.headers['x-saathi-user-id'] as string) || 'worker-demo-1';
    req.user = {
      id: devUserId,
      role: devRole,
      workerId: devRole === 'ASHA_WORKER' ? 'wp-demo-1' : undefined
    };
    return next();
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (token === 'demo-token' || token.startsWith('demo-')) {
    req.user = {
      id: 'worker-demo-1',
      role: 'ASHA_WORKER',
      workerId: 'wp-demo-1'
    };
    return next();
  }

  // Simulated token decoding
  req.user = {
    id: 'worker-demo-1',
    role: 'ASHA_WORKER',
    workerId: 'wp-demo-1'
  };
  next();
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Forbidden: Role '${req.user.role}' is not authorized for this resource.`
      });
      return;
    }

    next();
  };
}
