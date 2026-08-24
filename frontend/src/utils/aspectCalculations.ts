import type { Aspect, AspectType, PlanetPosition } from '../types';
import type { Lang } from '../i18n/types';
import { aspectEffect, aspectLine } from '../i18n/sky';

const ASPECT_DEFS: {
  type: AspectType;
  angle: number;
  orb: number;
  harmonious: boolean;
  label: string;
  effect: string;
}[] = [
  {
    type: 'conjunction',
    angle: 0,
    orb: 8,
    harmonious: true,
    label: 'Congiunzione',
    effect: 'Fusione di energie: i due principi si uniscono e si potenziano.',
  },
  {
    type: 'sextile',
    angle: 60,
    orb: 4,
    harmonious: true,
    label: 'Sestile',
    effect: 'Opportunità: collaborazione facile se scegli di agire.',
  },
  {
    type: 'square',
    angle: 90,
    orb: 8,
    harmonious: false,
    label: 'Quadratura',
    effect: 'Tensione e sfida: attrito che spinge a crescere.',
  },
  {
    type: 'trine',
    angle: 120,
    orb: 8,
    harmonious: true,
    label: 'Trigono',
    effect: 'Armonia e talento: flusso naturale, dono da usare con coscienza.',
  },
  {
    type: 'quincunx',
    angle: 150,
    orb: 3,
    harmonious: false,
    label: 'Quinconce',
    effect: 'Aggiustamento: due linguaggi diversi cercano un compromesso.',
  },
  {
    type: 'opposition',
    angle: 180,
    orb: 8,
    harmonious: false,
    label: 'Opposizione',
    effect: 'Polarità e equilibrio: l’altro specchia ciò che non vedi.',
  },
];

export function aspectLabel(type: AspectType): string {
  return ASPECT_DEFS.find((d) => d.type === type)?.label ?? type;
}

function angularSep(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export function calculateAspects(planets: PlanetPosition[], lang: Lang = 'it'): Aspect[] {
  const aspects: Aspect[] = [];
  for (let i = 0; i < planets.length; i += 1) {
    for (let j = i + 1; j < planets.length; j += 1) {
      const a = planets[i];
      const b = planets[j];
      if (a.id === 'northnode' && b.id === 'northnode') continue;
      const sep = angularSep(a.longitude, b.longitude);
      for (const def of ASPECT_DEFS) {
        const orb = Math.abs(sep - def.angle);
        if (orb <= def.orb) {
          const applying = a.speed - b.speed > 0
            ? sep < def.angle || (def.angle === 0 && a.speed > b.speed)
            : true;
          aspects.push({
            planetA: a.id,
            planetB: b.id,
            type: def.type,
            angle: def.angle,
            orb: Number(orb.toFixed(2)),
            applying,
            harmonious: def.harmonious && !(def.type === 'conjunction' && (a.id === 'mars' || b.id === 'mars') && (a.id === 'saturn' || b.id === 'saturn')),
            description: aspectLine(a.id, b.id, def.type, aspectEffect(def.type, lang), false, lang),
          });
          break;
        }
      }
    }
  }
  return aspects.sort((x, y) => x.orb - y.orb);
}

export function calculateTransits(
  natal: PlanetPosition[],
  transiting: PlanetPosition[],
  lang: Lang = 'it',
): Aspect[] {
  const aspects: Aspect[] = [];
  for (const t of transiting) {
    if (t.id === 'northnode') continue;
    for (const n of natal) {
      const sep = angularSep(t.longitude, n.longitude);
      for (const def of ASPECT_DEFS) {
        const tighter = def.orb * 0.75;
        const orb = Math.abs(sep - def.angle);
        if (orb <= tighter) {
          aspects.push({
            planetA: t.id,
            planetB: n.id,
            type: def.type,
            angle: def.angle,
            orb: Number(orb.toFixed(2)),
            applying: t.speed < 0 ? sep > def.angle : sep < def.angle,
            harmonious: def.harmonious,
            description: aspectLine(t.id, n.id, def.type, aspectEffect(def.type, lang), true, lang),
          });
          break;
        }
      }
    }
  }
  return aspects.sort((a, b) => a.orb - b.orb).slice(0, 18);
}

export function calculateSynastry(
  chartA: PlanetPosition[],
  chartB: PlanetPosition[],
  lang: Lang = 'it',
): Aspect[] {
  const aspects: Aspect[] = [];
  for (const a of chartA) {
    if (a.id === 'northnode') continue;
    for (const b of chartB) {
      if (b.id === 'northnode') continue;
      const sep = angularSep(a.longitude, b.longitude);
      for (const def of ASPECT_DEFS) {
        const orb = Math.abs(sep - def.angle);
        if (orb <= def.orb * 0.85) {
          aspects.push({
            planetA: a.id,
            planetB: b.id,
            type: def.type,
            angle: def.angle,
            orb: Number(orb.toFixed(2)),
            applying: true,
            harmonious: def.harmonious,
            description: aspectLine(a.id, b.id, def.type, aspectEffect(def.type, lang), false, lang),
          });
          break;
        }
      }
    }
  }
  return aspects.sort((x, y) => x.orb - y.orb).slice(0, 16);
}

export function energyFromAspects(aspects: Aspect[]): number {
  let score = 5.4;
  for (const a of aspects) {
    const weight = Math.max(0.15, 1 - a.orb / 10);
    if (a.type === 'trine' || a.type === 'sextile') score += 0.32 * weight;
    else if (a.type === 'conjunction') score += 0.12 * weight;
    else if (a.type === 'square' || a.type === 'opposition') score -= 0.28 * weight;
    else score -= 0.08 * weight;
  }
  return Math.max(1, Math.min(10, Math.round(score)));
}
