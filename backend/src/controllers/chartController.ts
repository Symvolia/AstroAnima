import type { Request, Response } from 'express';
import { buildNatal, type ProfilePayload } from '../services/astrology.js';
import { currentMoon, getPlanetPositions, sunSignAndRiseSet } from '../services/astronomy.js';

export function natalChart(req: Request, res: Response) {
  const profile = req.body as ProfilePayload;
  if (!profile?.birthDate || !profile.birthPlace) {
    res.status(400).json({ error: 'Dati di nascita mancanti' });
    return;
  }
  res.json(buildNatal(profile));
}

export function skyNow(req: Request, res: Response) {
  const { lat, lng } = req.body as { lat?: number; lng?: number };
  const now = new Date();
  res.json({
    date: now.toISOString(),
    planets: getPlanetPositions(now),
    moon: currentMoon(now),
    sun: sunSignAndRiseSet(now, lat, lng),
  });
}
