import { MakeTime } from 'astronomy-engine';
import { getPlanetPositions, longitudeToZodiac, norm360, ramcDegrees } from './astronomy.js';

const ASPECTS = [
  { type: 'conjunction', angle: 0, orb: 8 },
  { type: 'sextile', angle: 60, orb: 4 },
  { type: 'square', angle: 90, orb: 8 },
  { type: 'trine', angle: 120, orb: 8 },
  { type: 'quincunx', angle: 150, orb: 3 },
  { type: 'opposition', angle: 180, orb: 8 },
];

function sep(a: number, b: number) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export function calculateAspects(planets: ReturnType<typeof getPlanetPositions>) {
  const out: { planetA: string; planetB: string; type: string; orb: number }[] = [];
  for (let i = 0; i < planets.length; i += 1) {
    for (let j = i + 1; j < planets.length; j += 1) {
      const a = planets[i];
      const b = planets[j];
      const s = sep(a.longitude, b.longitude);
      for (const def of ASPECTS) {
        const orb = Math.abs(s - def.angle);
        if (orb <= def.orb) {
          out.push({ planetA: a.id, planetB: b.id, type: def.type, orb: Number(orb.toFixed(2)) });
          break;
        }
      }
    }
  }
  return out.sort((x, y) => x.orb - y.orb);
}

export function calculateTransits(
  natal: ReturnType<typeof getPlanetPositions>,
  transiting: ReturnType<typeof getPlanetPositions>,
) {
  const out: { planetA: string; planetB: string; type: string; orb: number }[] = [];
  for (const t of transiting) {
    for (const n of natal) {
      const s = sep(t.longitude, n.longitude);
      for (const def of ASPECTS) {
        const orb = Math.abs(s - def.angle);
        if (orb <= def.orb * 0.75) {
          out.push({ planetA: t.id, planetB: n.id, type: def.type, orb: Number(orb.toFixed(2)) });
          break;
        }
      }
    }
  }
  return out.sort((a, b) => a.orb - b.orb).slice(0, 16);
}

function d2r(d: number) { return (d * Math.PI) / 180; }
function r2d(r: number) { return (r * 180) / Math.PI; }

function obliquity(date: Date) {
  const T = MakeTime(date).tt / 36525;
  return 23.439291111 - 0.013004167 * T;
}

function midheaven(ramc: number, eps: number) {
  return norm360(r2d(Math.atan2(Math.sin(d2r(ramc)), Math.cos(d2r(ramc)) * Math.cos(d2r(eps)))));
}

function ascendant(ramc: number, lat: number, eps: number) {
  const y = Math.cos(d2r(ramc));
  const x = -(Math.sin(d2r(eps)) * Math.tan(d2r(lat)) + Math.cos(d2r(eps)) * Math.sin(d2r(ramc)));
  return norm360(r2d(Math.atan2(y, x)));
}

export function natalAngles(date: Date, lat: number, lng: number) {
  const eps = obliquity(date);
  const ramc = ramcDegrees(date, lng);
  return {
    ascendant: longitudeToZodiac(ascendant(ramc, lat, eps)),
    midheaven: longitudeToZodiac(midheaven(ramc, eps)),
  };
}

export interface ProfilePayload {
  uid?: string;
  name: string;
  birthDate: string;
  birthTime: string | null;
  unknownBirthTime: boolean;
  birthPlace: { name: string; lat: number; lng: number };
  solarSign: string;
  interests?: string[];
  level?: string;
}

export function birthDate(profile: ProfilePayload) {
  const [y, m, d] = profile.birthDate.split('-').map(Number);
  if (profile.unknownBirthTime || !profile.birthTime) return new Date(y, m - 1, d, 12, 0, 0);
  const [hh, mm] = profile.birthTime.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, 0);
}

export function buildNatal(profile: ProfilePayload) {
  const date = birthDate(profile);
  const planets = getPlanetPositions(date);
  const hasTime = !profile.unknownBirthTime && Boolean(profile.birthTime);
  const angles = hasTime ? natalAngles(date, profile.birthPlace.lat, profile.birthPlace.lng) : null;
  return {
    planets,
    aspects: calculateAspects(planets),
    ascendant: angles?.ascendant ?? null,
    midheaven: angles?.midheaven ?? null,
  };
}
