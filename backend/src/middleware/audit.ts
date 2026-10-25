import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.js';
import { AuditLog } from '../models/schema.js';

// In-memory append-only audit log store for backend
export const inMemoryAuditLogs: AuditLog[] = [];

export function logAuditEvent(
  actorId: string,
  actorRole: any,
  actionType: string,
  entityType: string,
  entityId: string,
  details?: Record<string, any>,
  ipAddress?: string
): AuditLog {
  const log: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    actorId,
    actorRole,
    actionType,
    entityType,
    entityId,
    ipAddress,
    details,
    timestamp: new Date().toISOString()
  };
  inMemoryAuditLogs.push(log);
  return log;
}

export function auditMiddleware(actionType: string, entityType: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const entityId = body?.id || req.params?.id || 'unknown';
        logAuditEvent(
          req.user?.id || 'anonymous',
          req.user?.role || 'SYSTEM_ADMIN',
          actionType,
          entityType,
          entityId,
          { path: req.path, method: req.method },
          req.ip
        );
      }
      return originalJson(body);
    };
    next();
  };
}
