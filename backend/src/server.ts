import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import screeningRoutes from './routes/screenings.js';
import referralRoutes from './routes/referrals.js';
import syncRoutes from './routes/sync.js';
import notificationRoutes from './routes/notifications.js';
import districtRoutes from './routes/district.js';

export const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'project-saathi-api',
    demoMode: config.isDemoMode,
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/screenings', screeningRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/district', districtRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`[Project Saathi API Server] Listening on http://localhost:${config.port}`);
    console.log(`[Demonstration Mode] ${config.isDemoMode ? 'ENABLED (Simulated Records Only)' : 'DISABLED'}`);
  });
}
