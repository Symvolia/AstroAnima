export type InterestTheme = 'amore' | 'lavoro' | 'salute' | 'spiritualita' | 'finanze';
export type ExperienceLevel = 'principiante' | 'intermedio' | 'avanzato';
export type ChartView = 'ruota' | 'lista';

export interface GeoPlace {
  name: string;
  country: string;
  admin?: string;
  lat: number;
  lng: number;
}

export interface ChartInput {
  name: string;
  birthDate: string;
  birthTime: string | null;
  unknownBirthTime: boolean;
  birthPlace: GeoPlace;
}

export interface UserProfile extends ChartInput {
  uid: string;
  solarSign: string;
  notificationHour: number;
  notificationMinute: number;
  interests: InterestTheme[];
  level: ExperienceLevel;
  onboardingComplete: boolean;
}

export interface ZodiacPosition {
  longitude: number;
  sign: string;
  signIndex: number;
  degree: number;
  minute: number;
  formatted: string;
}

export interface PlanetPosition extends ZodiacPosition {
  id: string;
  name: string;
  glyph: string;
  speed: number;
  retrograde: boolean;
  distanceAu: number;
  house?: number;
}

export interface HouseCusp {
  number: number;
  longitude: number;
  sign: string;
  degree: number;
  formatted: string;
  area: string;
  planets: string[];
}

export type AspectType =
  | 'conjunction'
  | 'sextile'
  | 'square'
  | 'trine'
  | 'opposition'
  | 'quincunx';

export interface Aspect {
  planetA: string;
  planetB: string;
  type: AspectType;
  angle: number;
  orb: number;
  applying: boolean;
  harmonious: boolean;
  description: string;
}

export interface NatalChart {
  julianDay: number;
  planets: PlanetPosition[];
  houses: HouseCusp[] | null;
  aspects: Aspect[];
  ascendant: ZodiacPosition | null;
  midheaven: ZodiacPosition | null;
}

export interface MoonSnapshot {
  phaseId: string;
  phaseName: string;
  illumination: number;
  sign: string;
  longitude: number;
  emotionalEffect: string;
}

export interface SunSnapshot {
  sign: string;
  sunrise: string | null;
  sunset: string | null;
  solarEnergy: string;
}

export interface LifeAreaScore {
  id: InterestTheme;
  label: string;
  score: number;
  tone: 'green' | 'yellow' | 'red';
  phrase: string;
}

export interface CosmicEvent {
  kind: 'eclipse' | 'fullmoon' | 'retrograde';
  title: string;
  date: string;
  detail: string;
}

export interface DailySky {
  date: string;
  moon: MoonSnapshot;
  sun: SunSnapshot;
  planets: PlanetPosition[];
  aspects: Aspect[];
  transits: Aspect[];
  energy: number;
  lifeAreas: LifeAreaScore[];
  planetOfDay: { id: string; name: string; reason: string };
  upcoming: CosmicEvent[];
}

export interface DailyReading {
  date: string;
  general: string;
  love: string;
  work: string;
  health: string;
  spiritual: string;
  luckyNumber: number;
  luckyColor: string;
  bestMoment: string;
  source: 'openai' | 'local';
}

export interface EclipseInfo {
  type: 'lunare' | 'solare';
  kind: string;
  peak: string;
  detail: string;
}
