import { generateReadingFor } from './openai.js';
import { listUsers, loadReading, saveReading } from './firebase.js';
import type { ProfilePayload } from './astrology.js';

export async function generateDueReadings() {
  const date = new Date().toISOString().slice(0, 10);
  const users = await listUsers();
  console.log(`Cron letture ${date}: ${users.length} utenti`);
  for (const raw of users) {
    const profile = raw as ProfilePayload;
    if (!profile?.uid && !profile?.name) continue;
    const uid = profile.uid ?? profile.name;
    const existing = await loadReading(uid, date);
    if (existing) continue;
    const reading = await generateReadingFor(profile, date);
    await saveReading(uid, reading);
  }
}
