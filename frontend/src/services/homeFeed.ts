import { tAspect, tPlanet } from '../i18n/catalog';
import { dayCounsel, socialUpdate } from '../i18n/sky';
import type { Lang } from '../i18n/types';
import type { Copy } from '../i18n/strings';
import type { Aspect, DailyReading, DailySky } from '../types';

export type FeedTone = 'flow' | 'tension' | 'neutral';

export interface FeedCard {
  id: string;
  kicker: string;
  body: string;
  meta?: string;
  tone: FeedTone;
}

function transitKicker(planetId: string, copy: Copy): string {
  if (planetId === 'venus') return copy.reading.love;
  if (planetId === 'mercury') return copy.home.social;
  if (planetId === 'mars' || planetId === 'saturn' || planetId === 'jupiter') return copy.reading.work;
  if (planetId === 'moon') return copy.reading.health;
  return copy.home.self;
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  return (match ? match[0] : text).trim();
}

function transitMeta(aspect: Aspect, lang: Lang): string {
  return `${tPlanet(aspect.planetA, lang)} ${tAspect(aspect.type, lang).toLowerCase()} ${tPlanet(aspect.planetB, lang)} natal  ·  ${aspect.orb.toFixed(1)}°`;
}

export function buildHomeFeed(
  sky: DailySky,
  reading: DailyReading | null,
  copy: Copy,
  lang: Lang,
): {
  headline: string;
  updates: FeedCard[];
  transits: FeedCard[];
  favor: string[];
  withhold: string[];
  retrogrades: string[];
} {
  const mercuryRetro = Boolean(sky.planets.find((p) => p.id === 'mercury')?.retrograde);
  const hard = sky.transits.some((t) => !t.harmonious);
  const counsel = dayCounsel(sky.energy, hard, mercuryRetro, lang);

  const updates: FeedCard[] = [
    {
      id: 'self',
      kicker: copy.home.self,
      body: reading ? firstSentence(reading.spiritual) : sky.moon.emotionalEffect,
      tone: 'neutral',
    },
    {
      id: 'work',
      kicker: copy.reading.work,
      body: reading ? firstSentence(reading.work) : sky.planetOfDay.reason,
      tone: sky.lifeAreas.find((a) => a.id === 'lavoro')?.tone === 'red' ? 'tension' : 'flow',
    },
    {
      id: 'love',
      kicker: copy.reading.love,
      body: reading ? firstSentence(reading.love) : (sky.lifeAreas.find((a) => a.id === 'amore')?.phrase ?? ''),
      tone: sky.lifeAreas.find((a) => a.id === 'amore')?.tone === 'red' ? 'tension' : 'neutral',
    },
    {
      id: 'social',
      kicker: copy.home.social,
      body: socialUpdate(sky.moon.sign, mercuryRetro, lang),
      tone: mercuryRetro ? 'tension' : 'neutral',
    },
    {
      id: 'health',
      kicker: copy.reading.health,
      body: reading ? firstSentence(reading.health) : sky.moon.emotionalEffect,
      tone: 'neutral',
    },
  ].filter((card) => card.body.length > 0);

  const transits: FeedCard[] = sky.transits.slice(0, 6).map((t, i) => ({
    id: `tr-${t.planetA}-${t.planetB}-${i}`,
    kicker: transitKicker(t.planetA, copy),
    body: t.description,
    meta: transitMeta(t, lang),
    tone: t.harmonious ? 'flow' : 'tension',
  }));

  const retrogrades = sky.planets
    .filter((p) => p.retrograde && p.id !== 'northnode')
    .map((p) => tPlanet(p.id, lang));

  return {
    headline: reading ? firstSentence(reading.general) : sky.sun.solarEnergy,
    updates,
    transits,
    favor: counsel.favor,
    withhold: counsel.withhold,
    retrogrades,
  };
}
