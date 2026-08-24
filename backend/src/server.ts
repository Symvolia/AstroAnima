import 'dotenv/config';
import cron from 'node-cron';
import { createApp } from './app.js';
import { generateDueReadings } from './services/cronJobs.js';

const port = Number(process.env.PORT ?? 4000);
const app = createApp();

cron.schedule(
  '0 6 * * *',
  () => {
    void generateDueReadings();
  },
  { timezone: process.env.CRON_TZ ?? 'Europe/Rome' },
);

app.listen(port, () => {
  console.log(`AstroAnima API in ascolto su http://127.0.0.1:${port}`);
});
