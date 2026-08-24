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
  SiderealTime,
  NextGlobalSolarEclipse,
  NextLunarEclipse,
  NextMoonQuarter,
} from 'astronomy-engine';

export function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

const SIGNS = [
  'Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine',
  'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci',
];

export function longitudeToZodiac(longitude: number) {
  const lon = norm360(longitude);
  const signIndex = Math.floor(lon / 30);
  const inSign = lon - signIndex * 30;
  const degree = Math.floor(inSign);
  const minute = Math.floor((inSign - degree) * 60);
  return {
    longitude: lon,
    sign: SIGNS[signIndex],
    signIndex,
    degree,
    minute,
    formatted: `${degree}°${minute.toString().padStart(2, '0')}′ ${SIGNS[signIndex]}`,
  };
}

const PLANETS: { id: string; name: string; body?: Body }[] = [
  { id: 'sun', name: 'Sole', body: Body.Sun },
  { id: 'moon', name: 'Luna', body: Body.Moon },
  { id: 'mercury', name: 'Mercurio', body: Body.Mercury },
  { id: 'venus', name: 'Venere', body: Body.Venus },
  { id: 'mars', name: 'Marte', body: Body.Mars },
  { id: 'jupiter', name: 'Giove', body: Body.Jupiter },
  { id: 'saturn', name: 'Saturno', body: Body.Saturn },
  { id: 'uranus', name: 'Urano', body: Body.Uranus },
  { id: 'neptune', name: 'Nettuno', body: Body.Neptune },
  { id: 'pluto', name: 'Plutone', body: Body.Pluto },
  { id: 'northnode', name: 'Nodo Nord' },
];

function meanNorthNode(date: Date): number {
  const T = MakeTime(date).tt / 36525;
  return norm360(125.0445479 - 1934.1362608 * T + 0.0020708 * T * T + (T * T * T) / 450000);
}

function geoLon(body: Body, date: Date): number {
  return Ecliptic(GeoVector(body, MakeTime(date), true)).elon;
}

function speedOf(body: Body, date: Date) {
  const lon0 = geoLon(body, date);
  const lon1 = geoLon(body, new Date(date.getTime() + 86400000));
  let delta = lon1 - lon0;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return { speed: delta, retrograde: delta < -0.002 };
}

export function getPlanetPositions(date: Date) {
  const time = MakeTime(date);
  return PLANETS.map((meta) => {
    if (meta.id === 'northnode' || !meta.body) {
      const z = longitudeToZodiac(meanNorthNode(date));
      return { id: meta.id, name: meta.name, ...z, speed: -0.053, retrograde: true, distanceAu: 0 };
    }
    const z = longitudeToZodiac(geoLon(meta.body, date));
    const motion = speedOf(meta.body, date);
    let distanceAu = 0;
    try {
      const v = GeoVector(meta.body, time, true);
      distanceAu = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    } catch {
      distanceAu = 0;
    }
    return {
      id: meta.id,
      name: meta.name,
      ...z,
      speed: motion.speed,
      retrograde: meta.id === 'sun' || meta.id === 'moon' ? false : motion.retrograde,
      distanceAu,
    };
  });
}

export function moonPhaseName(elongation: number) {
  const e = norm360(elongation);
  if (e < 22.5 || e >= 337.5) return 'Luna Nuova';
  if (e < 67.5) return 'Crescente';
  if (e < 112.5) return 'Primo quarto';
  if (e < 157.5) return 'Gibbosa crescente';
  if (e < 202.5) return 'Luna Piena';
  if (e < 247.5) return 'Gibbosa calante';
  if (e < 292.5) return 'Ultimo quarto';
  return 'Calante';
}

export function currentMoon(date: Date) {
  const time = MakeTime(date);
  const elongation = MoonPhase(time);
  const illum = Illumination(Body.Moon, time);
  const z = longitudeToZodiac(geoLon(Body.Moon, date));
  return {
    phaseName: moonPhaseName(elongation),
    illumination: Math.round(illum.phase_fraction * 100),
    sign: z.sign,
    longitude: z.longitude,
  };
}

export function sunSignAndRiseSet(date: Date, lat?: number, lng?: number) {
  const time = MakeTime(date);
  const sign = longitudeToZodiac(geoLon(Body.Sun, date)).sign;
  let sunrise: string | null = null;
  let sunset: string | null = null;
  if (typeof lat === 'number' && typeof lng === 'number') {
    try {
      const observer = new Observer(lat, lng, 0);
      const start = MakeTime(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 1));
      const rise = SearchRiseSet(Body.Sun, observer, +1, start, 1);
      const set = SearchRiseSet(Body.Sun, observer, -1, start, 1);
      sunrise = rise?.date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) ?? null;
      sunset = set?.date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) ?? null;
    } catch {
      /* polar / missing */
    }
  }
  return { sign, sunrise, sunset };
}

export function listEclipses(from: Date, count = 8) {
  const list: { type: string; kind: string; peak: string }[] = [];
  try {
    let lunar = SearchLunarEclipse(from);
    for (let i = 0; i < count; i += 1) {
      list.push({ type: 'lunare', kind: lunar.kind, peak: lunar.peak.date.toISOString() });
      lunar = NextLunarEclipse(lunar.peak);
    }
  } catch {
    /* ignore */
  }
  try {
    let solar = SearchGlobalSolarEclipse(from);
    for (let i = 0; i < count; i += 1) {
      list.push({ type: 'solare', kind: solar.kind, peak: solar.peak.date.toISOString() });
      solar = NextGlobalSolarEclipse(solar.peak);
    }
  } catch {
    /* ignore */
  }
  return list.sort((a, b) => a.peak.localeCompare(b.peak)).slice(0, count);
}

export function nextFullMoon(from: Date) {
  let q = SearchMoonQuarter(from);
  for (let i = 0; i < 8; i += 1) {
    if (q.quarter === 2) return q.time.date.toISOString();
    q = NextMoonQuarter(q);
  }
  return null;
}

export function ramcDegrees(date: Date, longitude: number) {
  return norm360(SiderealTime(MakeTime(date)) * 15 + longitude);
}
