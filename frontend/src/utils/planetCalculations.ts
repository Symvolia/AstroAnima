import {
  Body,
  Ecliptic,
  GeoVector,
  Illumination,
  MakeTime,
  MoonPhase,
  Observer,
  SearchGlobalSolarEclipse,
  SearchLunarEclipse,
  SearchMoonQuarter,
  SearchRiseSet,
  NextGlobalSolarEclipse,
  NextLunarEclipse,
  NextMoonQuarter,
  Equator,
  Horizon,
  SiderealTime,
} from 'astronomy-engine';
import { PLANETS, WEEKDAY_RULERS } from '../constants/planets';
import { ZODIAC_SIGNS } from '../constants/zodiacSigns';
import type { Lang } from '../i18n/types';
import { moonPhaseFromElongation, tPhase, tPlanet } from '../i18n/catalog';
import { eclipseDetail, eventCopy, moonEffect, planetDayReason, solarEnergyLine } from '../i18n/sky';
import { planetNature } from '../i18n/bodies';
import type {
  CosmicEvent,
  EclipseInfo,
  MoonSnapshot,
  PlanetPosition,
  SunSnapshot,
  ZodiacPosition,
} from '../types';

const BODY_MAP: Record<string, Body> = {
  sun: Body.Sun,
  moon: Body.Moon,
  mercury: Body.Mercury,
  venus: Body.Venus,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
  uranus: Body.Uranus,
  neptune: Body.Neptune,
  pluto: Body.Pluto,
};

export function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function longitudeToZodiac(longitude: number): ZodiacPosition {
  const lon = norm360(longitude);
  const signIndex = Math.floor(lon / 30);
  const inSign = lon - signIndex * 30;
  const degree = Math.floor(inSign);
  const minute = Math.floor((inSign - degree) * 60);
  const sign = ZODIAC_SIGNS[signIndex];
  return {
    longitude: lon,
    sign: sign.name,
    signIndex,
    degree,
    minute,
    formatted: `${degree}°${minute.toString().padStart(2, '0')}′ ${sign.name}`,
  };
}

export function geoEclipticLongitude(body: Body, date: Date): number {
  const vec = GeoVector(body, MakeTime(date), true);
  return Ecliptic(vec).elon;
}

export function solarSignFromDate(date: Date): string {
  return longitudeToZodiac(geoEclipticLongitude(Body.Sun, date)).sign;
}

function julianDay(date: Date): number {
  return MakeTime(date).tt / 86400 + 2451545;
}

export function meanNorthNodeLongitude(date: Date): number {
  const T = (julianDay(date) - 2451545.0) / 36525;
  const lon =
    125.0445479 - 1934.1362608 * T + 0.0020708 * T * T + (T * T * T) / 450000;
  return norm360(lon);
}

function planetSpeed(body: Body, date: Date): { speed: number; retrograde: boolean } {
  const lon0 = geoEclipticLongitude(body, date);
  const lon1 = geoEclipticLongitude(body, new Date(date.getTime() + 24 * 60 * 60 * 1000));
  let delta = lon1 - lon0;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return { speed: delta, retrograde: delta < -0.002 };
}

export function getPlanetPositions(date: Date): PlanetPosition[] {
  const time = MakeTime(date);
  const positions: PlanetPosition[] = [];

  for (const meta of PLANETS) {
    if (meta.id === 'northnode') {
      const lon = meanNorthNodeLongitude(date);
      const z = longitudeToZodiac(lon);
      positions.push({
        id: meta.id,
        name: meta.name,
        glyph: meta.glyph,
        ...z,
        speed: -0.053,
        retrograde: true,
        distanceAu: 0,
      });
      continue;
    }

    const body = BODY_MAP[meta.id];
    const lon = geoEclipticLongitude(body, date);
    const z = longitudeToZodiac(lon);
    const motion = planetSpeed(body, date);
    let distanceAu = 0;
    try {
      const vec = GeoVector(body, time, true);
      distanceAu = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    } catch {
      distanceAu = 0;
    }

    positions.push({
      id: meta.id,
      name: meta.name,
      glyph: meta.glyph,
      ...z,
      speed: motion.speed,
      retrograde: meta.id === 'sun' || meta.id === 'moon' ? false : motion.retrograde,
      distanceAu,
    });
  }

  return positions;
}

export function moonPhaseName(elongation: number, lang: Lang = 'it'): string {
  return tPhase(moonPhaseFromElongation(elongation), lang);
}

export function moonEmotionalEffect(phaseName: string, userSign: string, lang: Lang = 'it'): string {
  return moonEffect(moonPhaseFromElongation(0), userSign, lang);
}

export function getMoonSnapshot(date: Date, userSign: string, lang: Lang = 'it') {
  const time = MakeTime(date);
  const elongation = MoonPhase(time);
  const phaseId = moonPhaseFromElongation(elongation);
  const phaseName = tPhase(phaseId, lang);
  const illum = Illumination(Body.Moon, time);
  const lon = geoEclipticLongitude(Body.Moon, date);
  const z = longitudeToZodiac(lon);
  return {
    phaseId,
    phaseName,
    illumination: Math.round(illum.phase_fraction * 100),
    sign: z.sign,
    longitude: z.longitude,
    emotionalEffect: moonEffect(phaseId, userSign, lang),
  };
}

function formatClock(date: Date | null, lang: Lang = 'it'): string | null {
  if (!date) return null;
  return date.toLocaleTimeString(lang === 'it' ? 'it-IT' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function getSunSnapshot(
  date: Date,
  lat?: number,
  lng?: number,
  lang: Lang = 'it',
): SunSnapshot {
  const time = MakeTime(date);
  const lon = geoEclipticLongitude(Body.Sun, date);
  const z = longitudeToZodiac(lon);
  let sunrise: string | null = null;
  let sunset: string | null = null;

  if (typeof lat === 'number' && typeof lng === 'number') {
    try {
      const observer = new Observer(lat, lng, 0);
      const start = MakeTime(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 1));
      const rise = SearchRiseSet(Body.Sun, observer, +1, start, 1);
      const set = SearchRiseSet(Body.Sun, observer, -1, start, 1);
      sunrise = formatClock(rise?.date ?? null, lang);
      sunset = formatClock(set?.date ?? null, lang);
    } catch {
      sunrise = null;
      sunset = null;
    }
  }

  const meta = ZODIAC_SIGNS.find((s) => s.name === z.sign);
  const solarEnergy = solarEnergyLine(z.sign, meta?.element ?? 'fuoco', meta?.short ?? '', lang);

  return { sign: z.sign, sunrise, sunset, solarEnergy };
}

export function getUpcomingEvents(from: Date, lang: Lang = 'it'): CosmicEvent[] {
  const events: CosmicEvent[] = [];
  try {
    const lunar = SearchLunarEclipse(from);
    const copy = eventCopy('lunarEclipse', lunar.kind, lang);
    events.push({ kind: 'eclipse', title: copy.title, date: lunar.peak.date.toISOString(), detail: copy.detail });
  } catch {
    /* ignore */
  }

  try {
    const solar = SearchGlobalSolarEclipse(from);
    const copy = eventCopy('solarEclipse', solar.kind, lang);
    events.push({ kind: 'eclipse', title: copy.title, date: solar.peak.date.toISOString(), detail: copy.detail });
  } catch {
    /* ignore */
  }

  try {
    let q = SearchMoonQuarter(from);
    for (let i = 0; i < 8; i += 1) {
      if (q.quarter === 2) {
        const copy = eventCopy('fullMoon', '', lang);
        events.push({ kind: 'fullmoon', title: copy.title, date: q.time.date.toISOString(), detail: copy.detail });
        break;
      }
      q = NextMoonQuarter(q);
    }
  } catch {
    /* ignore */
  }

  const planets = getPlanetPositions(from);
  const retro = planets.filter((p) => p.retrograde && p.id !== 'northnode' && p.id !== 'moon');
  for (const p of retro.slice(0, 3)) {
    const copy = eventCopy('retrograde', tPlanet(p.id, lang), lang);
    events.push({ kind: 'retrograde', title: copy.title, date: from.toISOString(), detail: copy.detail });
  }

  return events
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);
}

export function getEclipses(from: Date, count = 6, lang: Lang = 'it'): EclipseInfo[] {
  const list: EclipseInfo[] = [];
  try {
    let lunar = SearchLunarEclipse(from);
    for (let i = 0; i < count; i += 1) {
      list.push({
        type: 'lunare',
        kind: lunar.kind,
        peak: lunar.peak.date.toISOString(),
        detail: eclipseDetail('lunare', lunar.kind, lang),
      });
      lunar = NextLunarEclipse(lunar.peak);
    }
  } catch {
    /* ignore */
  }

  try {
    let solar = SearchGlobalSolarEclipse(from);
    for (let i = 0; i < count; i += 1) {
      list.push({
        type: 'solare',
        kind: solar.kind,
        peak: solar.peak.date.toISOString(),
        detail: eclipseDetail('solare', solar.kind, lang),
      });
      solar = NextGlobalSolarEclipse(solar.peak);
    }
  } catch {
    /* ignore */
  }

  return list.sort((a, b) => new Date(a.peak).getTime() - new Date(b.peak).getTime()).slice(0, count);
}

export function planetOfTheDay(date: Date, planets: PlanetPosition[], lang: Lang = 'it'): {
  id: string;
  name: string;
  reason: string;
} {
  const weekday = date.getDay();
  const rulerId = WEEKDAY_RULERS[weekday];
  const traditional = planets.find((p) => p.id === rulerId) ?? planets[0];
  const activated = planets
    .filter((p) => p.id !== 'northnode')
    .sort((a, b) => Math.abs(b.speed) - Math.abs(a.speed))[0];

  const chosen = Math.abs(activated.speed) > 0.8 ? activated : traditional;
  return {
    id: chosen.id,
    name: tPlanet(chosen.id, lang),
    reason: planetDayReason(
      chosen.id,
      chosen.id === rulerId,
      weekday,
      chosen.speed,
      planetNature(chosen.id, lang),
      lang,
    ),
  };
}

export interface SkyPoint {
  id: string;
  name: string;
  glyph: string;
  azimuth: number;
  altitude: number;
  visible: boolean;
}

export function getSkyPoints(date: Date, lat: number, lng: number): SkyPoint[] {
  const time = MakeTime(date);
  const observer = new Observer(lat, lng, 0);
  const ids = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'] as const;
  return ids.map((id) => {
    const body = BODY_MAP[id];
    const meta = PLANETS.find((p) => p.id === id)!;
    const equ = Equator(body, time, observer, true, true);
    const hor = Horizon(time, observer, equ.ra, equ.dec, 'normal');
    return {
      id,
      name: meta.name,
      glyph: meta.glyph,
      azimuth: hor.azimuth,
      altitude: hor.altitude,
      visible: hor.altitude > 0,
    };
  });
}

export function localSiderealTimeHours(date: Date, longitude: number): number {
  const gmst = SiderealTime(MakeTime(date));
  return ((gmst + longitude / 15) % 24 + 24) % 24;
}
