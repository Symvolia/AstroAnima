import { HOUSES } from '../constants/houses';
import { ZODIAC_SIGNS } from '../constants/zodiacSigns';
import type { Lang } from '../i18n/types';
import { STRINGS } from '../i18n/strings';
import { tArea, tPlanet, tSign } from '../i18n/catalog';
import { areaPhrase, luckyColor, luckyMoment, localReadingCopy } from '../i18n/sky';
import { planetNature } from '../i18n/bodies';
import type {
  ChartInput,
  DailyReading,
  DailySky,
  InterestTheme,
  LifeAreaScore,
  NatalChart,
  UserProfile,
} from '../types';
import {
  calculateAspects,
  calculateTransits,
  energyFromAspects,
} from '../utils/aspectCalculations';
import { assignHousesToPlanets, calculateHouses } from '../utils/houseCalculations';
import {
  getMoonSnapshot,
  getPlanetPositions,
  getSunSnapshot,
  getUpcomingEvents,
  planetOfTheDay,
  solarSignFromDate,
} from '../utils/planetCalculations';

export function birthDateFromInput(input: Pick<ChartInput, 'birthDate' | 'birthTime' | 'unknownBirthTime'>): Date {
  const [y, m, d] = input.birthDate.split('-').map(Number);
  if (input.unknownBirthTime || !input.birthTime) {
    return new Date(y, m - 1, d, 12, 0, 0);
  }
  const [hh, mm] = input.birthTime.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, 0);
}

export function birthDateFromProfile(profile: UserProfile): Date {
  return birthDateFromInput(profile);
}

export function buildNatalFromInput(input: ChartInput): NatalChart {
  const date = birthDateFromInput(input);
  const planets = getPlanetPositions(date);
  const hasTime = !input.unknownBirthTime && Boolean(input.birthTime);
  let houses = null;
  let ascendant = null;
  let midheaven = null;
  let withHouses = planets;

  if (hasTime) {
    const result = calculateHouses(date, input.birthPlace.lat, input.birthPlace.lng, planets);
    houses = result.houses;
    ascendant = result.ascendant;
    midheaven = result.midheaven;
    withHouses = assignHousesToPlanets(planets, houses);
  }

  return {
    julianDay: date.getTime(),
    planets: withHouses,
    houses,
    aspects: calculateAspects(withHouses),
    ascendant,
    midheaven,
  };
}

export function buildNatalChart(profile: UserProfile): NatalChart {
  return buildNatalFromInput(profile);
}

export function explainBigThree(chart: NatalChart, personName?: string, lang: Lang = 'it') {
  const copy = STRINGS[lang].bigThree;
  const who = personName?.trim() || copy.someone;
  const sun = chart.planets.find((p) => p.id === 'sun');
  const moon = chart.planets.find((p) => p.id === 'moon');
  const mercury = chart.planets.find((p) => p.id === 'mercury');
  const venus = chart.planets.find((p) => p.id === 'venus');
  const mars = chart.planets.find((p) => p.id === 'mars');
  return {
    sun: sun
      ? {
          title: copy.sunTitle(tSign(sun.sign, lang)),
          body: copy.sunBody(who, tSign(sun.sign, lang)),
        }
      : null,
    moon: moon
      ? {
          title: copy.moonTitle(tSign(moon.sign, lang)),
          body: copy.moonBody(tSign(moon.sign, lang)),
        }
      : null,
    ascendant: chart.ascendant
      ? {
          title: copy.ascTitle(tSign(chart.ascendant.sign, lang)),
          body: copy.ascBody(tSign(chart.ascendant.sign, lang)),
        }
      : {
          title: copy.ascUnknownTitle,
          body: copy.ascUnknownBody,
        },
    extras: [
      mercury ? copy.mercury(tSign(mercury.sign, lang)) : '',
      venus ? copy.venus(tSign(venus.sign, lang)) : '',
      mars ? copy.mars(tSign(mars.sign, lang)) : '',
    ].filter(Boolean),
  };
}

const AREA_META: { id: InterestTheme; planets: string[] }[] = [
  { id: 'amore', planets: ['venus', 'moon', 'mars'] },
  { id: 'lavoro', planets: ['saturn', 'mars', 'sun'] },
  { id: 'finanze', planets: ['jupiter', 'venus', 'saturn'] },
  { id: 'salute', planets: ['mars', 'moon', 'sun'] },
  { id: 'spiritualita', planets: ['neptune', 'jupiter', 'pluto'] },
];

function lifeAreas(transits: ReturnType<typeof calculateTransits>, lang: Lang): LifeAreaScore[] {
  return AREA_META.map((area) => {
    const related = transits.filter(
      (t) => area.planets.includes(t.planetA) || area.planets.includes(t.planetB),
    );
    let raw = 6;
    for (const t of related) {
      if (t.harmonious) raw += 0.7;
      else raw -= 0.55;
    }
    const score = Math.max(1, Math.min(10, Math.round(raw)));
    const tone: LifeAreaScore['tone'] = score >= 7 ? 'green' : score >= 5 ? 'yellow' : 'red';
    return {
      id: area.id,
      label: tArea(area.id, lang),
      score,
      tone,
      phrase: areaPhrase(area.id, tone, lang),
    };
  });
}

export function buildDailySky(
  profile: UserProfile,
  natal: NatalChart,
  now = new Date(),
  geo?: { lat: number; lng: number },
  lang: Lang = 'it',
): DailySky {
  const planets = getPlanetPositions(now);
  const aspects = calculateAspects(planets.filter((p) => p.id !== 'northnode' || true), lang);
  const transits = calculateTransits(natal.planets, planets, lang);
  const moon = getMoonSnapshot(now, profile.solarSign, lang);
  const loc = geo ?? profile.birthPlace;
  const sun = getSunSnapshot(now, loc.lat, loc.lng, lang);

  return {
    date: now.toISOString().slice(0, 10),
    moon,
    sun,
    planets,
    aspects,
    transits,
    energy: energyFromAspects([...aspects.slice(0, 12), ...transits.slice(0, 8)]),
    lifeAreas: lifeAreas(transits, lang),
    planetOfDay: planetOfTheDay(now, planets, lang),
    upcoming: getUpcomingEvents(now, lang),
  };
}

export function localDailyReading(
  profile: UserProfile,
  natal: NatalChart,
  sky: DailySky,
  lang: Lang = 'it',
): DailyReading {
  const moonSign = natal.planets.find((p) => p.id === 'moon')?.sign ?? profile.solarSign;
  const ascRaw = natal.ascendant?.sign;
  const asc = ascRaw ? tSign(ascRaw, lang) : STRINGS[lang].profile.unknownAsc;
  const topTransit = sky.transits[0];
  const copy = localReadingCopy(lang, {
    name: profile.name,
    sunSign: tSign(sky.sun.sign, lang),
    moonSign: tSign(sky.moon.sign, lang),
    phase: sky.moon.phaseName,
    natalMoon: tSign(moonSign, lang),
    natalSun: tSign(profile.solarSign, lang),
    asc,
    planetName: tPlanet(sky.planetOfDay.id, lang),
    nature: planetNature(sky.planetOfDay.id, lang),
    energy: sky.energy,
    transit: topTransit?.description,
    love: sky.lifeAreas.find((a) => a.id === 'amore')?.phrase,
    work: sky.lifeAreas.find((a) => a.id === 'lavoro')?.phrase,
    moonEffect: sky.moon.emotionalEffect,
  });

  return {
    date: sky.date,
    ...copy,
    luckyNumber: (profile.name.length + sky.energy + new Date(sky.date).getDate()) % 9 || 9,
    luckyColor: luckyColor(sky.date, lang),
    bestMoment: luckyMoment(sky.energy, sky.moon.illumination, lang),
    source: 'local',
  };
}

export function signDescription(signName: string) {
  return ZODIAC_SIGNS.find((s) => s.name === signName) ?? ZODIAC_SIGNS[0];
}

export { HOUSES, solarSignFromDate };
