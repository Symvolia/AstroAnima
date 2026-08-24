import type { Lang, MoonPhaseId } from './types';
import type { AspectType, InterestTheme } from '../types';

type Pair = { it: string; en: string };

const SIGN_ORDER = [
  'ariete',
  'toro',
  'gemelli',
  'cancro',
  'leone',
  'vergine',
  'bilancia',
  'scorpione',
  'sagittario',
  'capricorno',
  'acquario',
  'pesci',
] as const;

const SIGNS: Record<(typeof SIGN_ORDER)[number], { name: Pair; abbr: Pair }> = {
  ariete: { name: { it: 'Ariete', en: 'Aries' }, abbr: { it: 'ARI', en: 'ARI' } },
  toro: { name: { it: 'Toro', en: 'Taurus' }, abbr: { it: 'TOR', en: 'TAU' } },
  gemelli: { name: { it: 'Gemelli', en: 'Gemini' }, abbr: { it: 'GEM', en: 'GEM' } },
  cancro: { name: { it: 'Cancro', en: 'Cancer' }, abbr: { it: 'CAN', en: 'CAN' } },
  leone: { name: { it: 'Leone', en: 'Leo' }, abbr: { it: 'LEO', en: 'LEO' } },
  vergine: { name: { it: 'Vergine', en: 'Virgo' }, abbr: { it: 'VER', en: 'VIR' } },
  bilancia: { name: { it: 'Bilancia', en: 'Libra' }, abbr: { it: 'BIL', en: 'LIB' } },
  scorpione: { name: { it: 'Scorpione', en: 'Scorpio' }, abbr: { it: 'SCO', en: 'SCO' } },
  sagittario: { name: { it: 'Sagittario', en: 'Sagittarius' }, abbr: { it: 'SAG', en: 'SAG' } },
  capricorno: { name: { it: 'Capricorno', en: 'Capricorn' }, abbr: { it: 'CAP', en: 'CAP' } },
  acquario: { name: { it: 'Acquario', en: 'Aquarius' }, abbr: { it: 'ACQ', en: 'AQU' } },
  pesci: { name: { it: 'Pesci', en: 'Pisces' }, abbr: { it: 'PES', en: 'PIS' } },
};

const PLANETS: Record<string, { name: Pair; abbr: Pair }> = {
  sun: { name: { it: 'Sole', en: 'Sun' }, abbr: { it: 'SOL', en: 'SUN' } },
  moon: { name: { it: 'Luna', en: 'Moon' }, abbr: { it: 'LUN', en: 'MOO' } },
  mercury: { name: { it: 'Mercurio', en: 'Mercury' }, abbr: { it: 'MER', en: 'MER' } },
  venus: { name: { it: 'Venere', en: 'Venus' }, abbr: { it: 'VEN', en: 'VEN' } },
  mars: { name: { it: 'Marte', en: 'Mars' }, abbr: { it: 'MAR', en: 'MAR' } },
  jupiter: { name: { it: 'Giove', en: 'Jupiter' }, abbr: { it: 'GIO', en: 'JUP' } },
  saturn: { name: { it: 'Saturno', en: 'Saturn' }, abbr: { it: 'SAT', en: 'SAT' } },
  uranus: { name: { it: 'Urano', en: 'Uranus' }, abbr: { it: 'URA', en: 'URA' } },
  neptune: { name: { it: 'Nettuno', en: 'Neptune' }, abbr: { it: 'NET', en: 'NEP' } },
  pluto: { name: { it: 'Plutone', en: 'Pluto' }, abbr: { it: 'PLU', en: 'PLU' } },
  northnode: { name: { it: 'Nodo Nord', en: 'North Node' }, abbr: { it: 'NOD', en: 'NOD' } },
};

const ELEMENTS: Record<string, Pair> = {
  fuoco: { it: 'Fuoco', en: 'Fire' },
  terra: { it: 'Terra', en: 'Earth' },
  aria: { it: 'Aria', en: 'Air' },
  acqua: { it: 'Acqua', en: 'Water' },
};

const MODES: Record<string, Pair> = {
  cardinale: { it: 'Cardinale', en: 'Cardinal' },
  fisso: { it: 'Fisso', en: 'Fixed' },
  mobile: { it: 'Mobile', en: 'Mutable' },
};

const PHASES: Record<MoonPhaseId, Pair> = {
  new: { it: 'Luna nuova', en: 'New Moon' },
  waxingCrescent: { it: 'Crescente', en: 'Waxing crescent' },
  firstQuarter: { it: 'Primo quarto', en: 'First quarter' },
  waxingGibbous: { it: 'Gibbosa crescente', en: 'Waxing gibbous' },
  full: { it: 'Luna piena', en: 'Full Moon' },
  waningGibbous: { it: 'Gibbosa calante', en: 'Waning gibbous' },
  lastQuarter: { it: 'Ultimo quarto', en: 'Last quarter' },
  waningCrescent: { it: 'Calante', en: 'Waning crescent' },
};

const ASPECTS: Record<AspectType, Pair> = {
  conjunction: { it: 'Congiunzione', en: 'Conjunction' },
  sextile: { it: 'Sestile', en: 'Sextile' },
  square: { it: 'Quadratura', en: 'Square' },
  trine: { it: 'Trigono', en: 'Trine' },
  quincunx: { it: 'Quinconce', en: 'Quincunx' },
  opposition: { it: 'Opposizione', en: 'Opposition' },
};

const AREAS: Record<InterestTheme, Pair> = {
  amore: { it: 'Amore', en: 'Love' },
  lavoro: { it: 'Opera', en: 'Work' },
  finanze: { it: 'Sostanza', en: 'Means' },
  salute: { it: 'Corpo', en: 'Body' },
  spiritualita: { it: 'Anima', en: 'Spirit' },
};

const LEVELS: Record<string, Pair> = {
  principiante: { it: 'Neofita', en: 'Neophyte' },
  intermedio: { it: 'Iniziato', en: 'Initiate' },
  avanzato: { it: 'Adeptus', en: 'Adept' },
};

const HOUSE_AREA: Pair[] = [
  { it: 'Soglia, corpo, apparire', en: 'Threshold, body, appearance' },
  { it: 'Valore, sostanza, possessi', en: 'Worth, substance, possessions' },
  { it: 'Verbo, fratelli, dintorni', en: 'Word, kin, vicinity' },
  { it: 'Radici, dimora, memoria', en: 'Roots, dwelling, memory' },
  { it: 'Gioco, eros, creazione', en: 'Play, eros, creation' },
  { it: 'Rito quotidiano, salute, servizio', en: 'Daily rite, health, service' },
  { it: 'Altro, patti, specchio', en: 'The other, pacts, the mirror' },
  { it: 'Soglia oscura, eredità, metamorfosi', en: 'Dark threshold, inheritance, metamorphosis' },
  { it: 'Orizzonte, fede, sapienza', en: 'Horizon, faith, wisdom' },
  { it: 'Vocazione, reputazione, Medio Cielo', en: 'Vocation, reputation, Midheaven' },
  { it: 'Cerchia, ideali, avvenire', en: 'Circle, ideals, the yet-to-come' },
  { it: 'Velato, riposo, inconscio', en: 'The veiled, rest, the unseen' },
];

export const WEEKDAYS: Pair[][] = [
  [{ it: 'Lun', en: 'Mon' }, { it: 'Mar', en: 'Tue' }, { it: 'Mer', en: 'Wed' }, { it: 'Gio', en: 'Thu' }, { it: 'Ven', en: 'Fri' }, { it: 'Sab', en: 'Sat' }, { it: 'Dom', en: 'Sun' }],
];

export const WEEKDAY_SHORT = {
  it: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

export const MONTHS = {
  it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

function pair(p: Pair | undefined, lang: Lang, fallback = ''): string {
  return p ? p[lang] : fallback;
}

export function tSign(raw: string, lang: Lang): string {
  const id = raw.toLowerCase() as keyof typeof SIGNS;
  if (SIGNS[id]) return SIGNS[id].name[lang];
  const found = Object.values(SIGNS).find((s) => s.name.it === raw || s.name.en === raw);
  return found ? found.name[lang] : raw;
}

export function tSignAbbr(raw: string, lang: Lang): string {
  const id = raw.toLowerCase() as keyof typeof SIGNS;
  if (SIGNS[id]) return SIGNS[id].abbr[lang];
  const found = (Object.entries(SIGNS) as [string, (typeof SIGNS)[keyof typeof SIGNS]][]).find(
    ([, s]) => s.name.it === raw || s.name.en === raw,
  );
  return found ? found[1].abbr[lang] : raw.slice(0, 3).toUpperCase();
}

export function tSignByIndex(index: number, lang: Lang): string {
  const id = SIGN_ORDER[((index % 12) + 12) % 12];
  return SIGNS[id].name[lang];
}

export function tSignAbbrByIndex(index: number, lang: Lang): string {
  const id = SIGN_ORDER[((index % 12) + 12) % 12];
  return SIGNS[id].abbr[lang];
}

export function tPlanet(id: string, lang: Lang): string {
  return pair(PLANETS[id]?.name, lang, id);
}

export function tPlanetAbbr(id: string, lang: Lang): string {
  return pair(PLANETS[id]?.abbr, lang, id.slice(0, 3).toUpperCase());
}

export function tElement(key: string, lang: Lang): string {
  return pair(ELEMENTS[key], lang, key);
}

export function tMode(key: string, lang: Lang): string {
  return pair(MODES[key], lang, key);
}

export function tPhase(id: MoonPhaseId, lang: Lang): string {
  return PHASES[id][lang];
}

export function tAspect(type: AspectType, lang: Lang): string {
  return ASPECTS[type][lang];
}

export function tArea(id: InterestTheme, lang: Lang): string {
  return AREAS[id][lang];
}

export function tLevel(id: string, lang: Lang): string {
  return pair(LEVELS[id], lang, id);
}

export function tHouseTitle(n: number, lang: Lang): string {
  return lang === 'en' ? `House ${n}` : `Casa ${n}`;
}

export function tHouseArea(n: number, lang: Lang): string {
  return HOUSE_AREA[n - 1]?.[lang] ?? '';
}

export function moonPhaseFromElongation(e: number): MoonPhaseId {
  const n = ((e % 360) + 360) % 360;
  if (n >= 337.5 || n < 22.5) return 'new';
  if (n < 67.5) return 'waxingCrescent';
  if (n < 112.5) return 'firstQuarter';
  if (n < 157.5) return 'waxingGibbous';
  if (n < 202.5) return 'full';
  if (n < 247.5) return 'waningGibbous';
  if (n < 292.5) return 'lastQuarter';
  return 'waningCrescent';
}

export function isWaxing(id: MoonPhaseId): boolean {
  return id === 'new' || id === 'waxingCrescent' || id === 'firstQuarter' || id === 'waxingGibbous' || id === 'full';
}

export const LUCKY_COLORS: Pair[] = [
  { it: 'indaco', en: 'indigo' },
  { it: 'oro', en: 'gold' },
  { it: 'verde bosco', en: 'forest green' },
  { it: 'viola', en: 'violet' },
  { it: 'argento', en: 'silver' },
  { it: 'blu notte', en: 'night blue' },
  { it: 'ambra', en: 'amber' },
];

export const DAY_NAMES = {
  it: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};
