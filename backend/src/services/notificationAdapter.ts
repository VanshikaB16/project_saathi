/**
 * Project Saathi - Pluggable Notification Gateway Adapter
 * Strict privacy governance: Messages must NEVER include disease names or diagnoses.
 */

import { NotificationJob, NotificationChannel, QueueStatus } from '../models/schema.js';
import { config } from '../config.js';

export interface NotificationProvider {
  name: string;
  sendSms(to: string, message: string): Promise<{ success: boolean; providerId?: string; error?: string }>;
}

export class MockSmsProvider implements NotificationProvider {
  name = 'MockSmsProvider';

  async sendSms(to: string, message: string) {
    // In demo/test mode, simulate delivery with latency
    console.log(`[Mock SMS Dispatched] To: ${to} | Content: "${message}"`);
    return {
      success: true,
      providerId: `mock-msg-${Date.now()}`
    };
  }
}

export class NotificationService {
  private provider: NotificationProvider;
  private jobs: Map<string, NotificationJob> = new Map();

  constructor(provider?: NotificationProvider) {
    this.provider = provider || new MockSmsProvider();
  }

  /**
   * Enforce privacy-preserving neutral notification message content.
   * Strips any inadvertent medical terms.
   */
  public sanitizeMessageContent(content: string): string {
    const prohibitedWords = [/cancer/gi, /leukemia/gi, /tuberculosis/gi, /tb/gi, /tumour/gi];
    let sanitized = content;
    for (const pattern of prohibitedWords) {
      if (pattern.test(sanitized)) {
        sanitized = sanitized.replace(pattern, '[health follow-up]');
      }
    }
    return sanitized;
  }

  public async queueNotification(
    recipientPhone: string,
    rawContent: string,
    consentVerified: boolean,
    patientId?: string,
    channel: NotificationChannel = 'SMS'
  ): Promise<NotificationJob> {
    if (!consentVerified) {
      throw new Error('Cannot queue notification: Patient consent was not granted for family/contact notifications.');
    }

    const safeContent = this.sanitizeMessageContent(rawContent);
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const job: NotificationJob = {
      id: jobId,
      patientId,
      recipientPhone,
      channel,
      messageContent: safeContent,
      consentVerified: true,
      queueStatus: 'WAITING_TO_SEND',
      retryCount: 0,
      createdAt: new Date().toISOString()
    };

    this.jobs.set(jobId, job);
    return job;
  }

  public async processPendingQueue(): Promise<{ processed: number; succeeded: number; failed: number }> {
    let processed = 0;
    let succeeded = 0;
    let failed = 0;

    for (const [id, job] of this.jobs.entries()) {
      if (job.queueStatus === 'WAITING_TO_SEND') {
        processed++;
        try {
          const result = await this.provider.sendSms(job.recipientPhone, job.messageContent);
          if (result.success) {
            job.queueStatus = 'DELIVERED';
            succeeded++;
          } else {
            job.retryCount++;
            job.queueStatus = job.retryCount >= 3 ? 'FAILED' : 'WAITING_TO_SEND';
            failed++;
          }
        } catch (err) {
          job.retryCount++;
          job.queueStatus = job.retryCount >= 3 ? 'FAILED' : 'WAITING_TO_SEND';
          failed++;
        }
      }
    }

    return { processed, succeeded, failed };
  }

  public getJob(jobId: string): NotificationJob | undefined {
    return this.jobs.get(jobId);
  }

  public getAllJobs(): NotificationJob[] {
    return Array.from(this.jobs.values());
  }
}

export const notificationService = new NotificationService();
