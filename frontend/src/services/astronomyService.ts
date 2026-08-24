import type { DailySky, EclipseInfo, NatalChart, PlanetPosition, UserProfile } from '../types';
import type { Lang } from '../i18n/types';
import { buildDailySky, buildNatalChart } from './astrologService';
import { getEclipses, getPlanetPositions, getSkyPoints } from '../utils/planetCalculations';

export const astronomyService = {
  natalChart(profile: UserProfile): NatalChart {
    return buildNatalChart(profile);
  },
  dailySky(profile: UserProfile, natal: NatalChart, geo?: { lat: number; lng: number }, lang: Lang = 'it'): DailySky {
    return buildDailySky(profile, natal, new Date(), geo, lang);
  },
  planetsNow(date = new Date()): PlanetPosition[] {
    return getPlanetPositions(date);
  },
  eclipses(from = new Date(), lang: Lang = 'it'): EclipseInfo[] {
    return getEclipses(from, 8, lang);
  },
  skyMap(lat: number, lng: number, date = new Date()) {
    return getSkyPoints(date, lat, lng);
  },
};
