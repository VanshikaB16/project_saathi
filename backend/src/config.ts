/**
 * Project Saathi - Server Configuration
 */

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDemoMode: process.env.SAATHI_DEMO_MODE !== 'false',
  jwtSecret: process.env.JWT_SECRET || 'saathi_default_insecure_dev_secret_replace_in_prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  smallCellSuppressionThreshold: parseInt(process.env.SMALL_CELL_SUPPRESSION_THRESHOLD || '5', 10),
  smsProvider: process.env.SMS_PROVIDER || 'mock',
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    fromPhone: process.env.TWILIO_FROM_PHONE || '+919876543210'
  }
};
