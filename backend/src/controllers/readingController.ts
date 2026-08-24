import type { Request, Response } from 'express';
import { generateReadingFor } from '../services/openai.js';
import { loadReading, saveReading } from '../services/firebase.js';
import type { ProfilePayload } from '../services/astrology.js';

export async function generateReading(req: Request, res: Response) {
  const { profile, date } = req.body as { profile?: ProfilePayload; date?: string };
  if (!profile?.name || !profile.birthDate || !profile.birthPlace) {
    res.status(400).json({ error: 'Profilo incompleto' });
    return;
  }
  const day = date ?? new Date().toISOString().slice(0, 10);
  const uid = profile.uid ?? profile.name;
  const cached = await loadReading(uid, day);
  if (cached) {
    res.json(cached);
    return;
  }
  const reading = await generateReadingFor(profile, day);
  await saveReading(uid, reading);
  res.json(reading);
}
