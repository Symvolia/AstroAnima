import type { Request, Response } from 'express';
import { listEclipses, nextFullMoon } from '../services/astronomy.js';

export function eclipses(_req: Request, res: Response) {
  const from = new Date();
  res.json({
    eclipses: listEclipses(from),
    nextFullMoon: nextFullMoon(from),
  });
}
