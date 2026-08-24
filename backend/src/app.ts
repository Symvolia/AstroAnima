import cors from 'cors';
import express from 'express';
import { router } from './routes/index.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.get('/health', (_req, res) => res.json({ ok: true, name: 'AstroAnima' }));
  app.use('/api', router);
  return app;
}
