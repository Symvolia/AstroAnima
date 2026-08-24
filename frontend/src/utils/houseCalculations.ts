import { MakeTime, SiderealTime } from 'astronomy-engine';
import { HOUSES } from '../constants/houses';
import type { HouseCusp, PlanetPosition, ZodiacPosition } from '../types';
import { longitudeToZodiac, norm360 } from './planetCalculations';

function d2r(d: number): number {
  return (d * Math.PI) / 180;
}
function r2d(r: number): number {
  return (r * 180) / Math.PI;
}

function obliquity(date: Date): number {
  const T = MakeTime(date).tt / 36525;
  return 23.439291111 - 0.013004167 * T - 1.638888e-7 * T * T + 5.036111e-7 * T * T * T;
}

function ramcDegrees(date: Date, longitude: number): number {
  const gmstHours = SiderealTime(MakeTime(date));
  return norm360(gmstHours * 15 + longitude);
}

function midheaven(ramc: number, eps: number): number {
  return norm360(r2d(Math.atan2(Math.sin(d2r(ramc)), Math.cos(d2r(ramc)) * Math.cos(d2r(eps)))));
}

function ascendant(ramc: number, lat: number, eps: number): number {
  const y = Math.cos(d2r(ramc));
  const x = -(Math.sin(d2r(eps)) * Math.tan(d2r(lat)) + Math.cos(d2r(eps)) * Math.sin(d2r(ramc)));
  return norm360(r2d(Math.atan2(y, x)));
}

function raToEcliptic(ra: number, eps: number): number {
  return norm360(r2d(Math.atan2(Math.sin(d2r(ra)), Math.cos(d2r(ra)) * Math.cos(d2r(eps)))));
}

function placidusIterate(ramc: number, lat: number, eps: number, add: number, fraction: number): number {
  let ra = ramc + add;
  for (let i = 0; i < 16; i += 1) {
    const decl = Math.asin(Math.sin(d2r(eps)) * Math.sin(d2r(ra)));
    const arg = -Math.tan(d2r(lat)) * Math.tan(decl);
    if (Math.abs(arg) >= 0.995) {
      return norm360(midheaven(ramc, eps) + add);
    }
    const semiArc = r2d(Math.acos(Math.max(-1, Math.min(1, arg))));
    const candidate = ramc + (add > 90 ? 180 - fraction * semiArc : fraction * semiArc);
    if (Math.abs(norm360(candidate - ra)) < 0.01) {
      ra = candidate;
      break;
    }
    ra = candidate;
  }
  return raToEcliptic(ra, eps);
}

function houseCuspsPlacidus(date: Date, lat: number, lng: number): number[] {
  const eps = obliquity(date);
  const ramc = ramcDegrees(date, lng);
  const cusps = new Array<number>(13);
  cusps[10] = midheaven(ramc, eps);
  cusps[4] = norm360(cusps[10] + 180);
  cusps[1] = ascendant(ramc, lat, eps);
  cusps[7] = norm360(cusps[1] + 180);

  if (Math.abs(lat) > 66) {
    for (let h = 1; h <= 12; h += 1) {
      cusps[h] = norm360(cusps[1] + (h - 1) * 30);
    }
    return cusps;
  }

  cusps[11] = placidusIterate(ramc, lat, eps, 30, 1 / 3);
  cusps[12] = placidusIterate(ramc, lat, eps, 60, 2 / 3);
  cusps[2] = norm360(placidusIterate(ramc + 180, -lat, eps, 30, 1 / 3) + 180);
  cusps[3] = norm360(placidusIterate(ramc + 180, -lat, eps, 60, 2 / 3) + 180);
  cusps[5] = norm360(cusps[11] + 180);
  cusps[6] = norm360(cusps[12] + 180);
  cusps[8] = norm360(cusps[2] + 180);
  cusps[9] = norm360(cusps[3] + 180);
  return cusps;
}

export function planetHouse(longitude: number, cusps: number[]): number {
  for (let h = 1; h <= 12; h += 1) {
    const start = cusps[h];
    const end = cusps[h === 12 ? 1 : h + 1];
    const lon = norm360(longitude);
    if (start < end) {
      if (lon >= start && lon < end) return h;
    } else if (lon >= start || lon < end) {
      return h;
    }
  }
  return 1;
}

export function calculateHouses(
  date: Date,
  lat: number,
  lng: number,
  planets: PlanetPosition[],
): { houses: HouseCusp[]; ascendant: ZodiacPosition; midheaven: ZodiacPosition } {
  const cusps = houseCuspsPlacidus(date, lat, lng);
  const houses: HouseCusp[] = HOUSES.map((meta) => {
    const lon = cusps[meta.number];
    const z = longitudeToZodiac(lon);
    const occupants = planets.filter((p) => planetHouse(p.longitude, cusps) === meta.number).map((p) => p.id);
    return {
      number: meta.number,
      longitude: lon,
      sign: z.sign,
      degree: z.degree,
      formatted: z.formatted,
      area: meta.area,
      planets: occupants,
    };
  });

  return {
    houses,
    ascendant: longitudeToZodiac(cusps[1]),
    midheaven: longitudeToZodiac(cusps[10]),
  };
}

export function assignHousesToPlanets(
  planets: PlanetPosition[],
  houses: HouseCusp[] | null,
): PlanetPosition[] {
  if (!houses) return planets;
  const cusps = [0, ...houses.map((h) => h.longitude)];
  return planets.map((p) => ({ ...p, house: planetHouse(p.longitude, cusps) }));
}
