import type { Lang, MoonPhaseId } from './types';
import { DAY_NAMES, LUCKY_COLORS, tArea, tElement, tPhase, tPlanet, tSign } from './catalog';
import { STRINGS } from './strings';
import type { AspectType, InterestTheme } from '../types';

export function moonEffect(phase: MoonPhaseId, sign: string, lang: Lang): string {
  const s = tSign(sign, lang);
  if (lang === 'en') {
    const map: Record<MoonPhaseId, string> = {
      new: `A seed-hour for ${s}: listen to the quiet wish. Do not force fruit.`,
      waxingCrescent: `The light gathers. ${s} may take a first visible step, however small.`,
      firstQuarter: `Useful friction. For ${s}, choose, and cut what will not carry you.`,
      waxingGibbous: `Refine, correct, perfect. The patience of ${s} is rewarded.`,
      full: `All is lit. The feeling of ${s} asks for truth, and for the closing of cycles.`,
      waningGibbous: `Digest what was seen. ${s} finds peace in sharing, and in letting go.`,
      lastQuarter: `Clear the inner house. For ${s}, a practical forgiveness.`,
      waningCrescent: `Sacred rest. ${s} is fed by silence, dream, and care of the body.`,
    };
    return map[phase];
  }
  const map: Record<MoonPhaseId, string> = {
    new: `Ora di semi per ${s}: ascolta il desiderio quieto. Non forzare il frutto.`,
    waxingCrescent: `La luce si raccoglie. ${s} può fare il primo passo visibile, anche minimo.`,
    firstQuarter: `Attrito utile. Per ${s} è tempo di scegliere e tagliare ciò che non sostiene.`,
    waxingGibbous: `Affina, correggi, perfeziona. La pazienza di ${s} viene premiata.`,
    full: `Tutto è illuminato. Il sentire di ${s} chiede verità e chiusura di cicli.`,
    waningGibbous: `Digerisci ciò che hai visto. ${s} trova pace nel condividere e nel lasciare andare.`,
    lastQuarter: `Pulisci la casa interiore. Per ${s} è tempo di perdono pratico.`,
    waningCrescent: `Riposo sacro. ${s} si nutre di silenzio, di sogno e di cura del corpo.`,
  };
  return map[phase];
}

export function solarEnergyLine(sign: string, element: string, short: string, lang: Lang): string {
  const s = tSign(sign, lang);
  const el = tElement(element, lang).toLowerCase();
  const essence = short.replace(/\.$/, '').toLowerCase();
  if (lang === 'en') {
    return `The Sun in ${s} colours the day with ${el} and asks that you embody ${essence}.`;
  }
  return `Il Sole in ${s} colora il giorno di ${el} e chiede di incarnare ${essence}.`;
}

export function areaPhrase(id: InterestTheme, tone: 'green' | 'yellow' | 'red', lang: Lang): string {
  const label = tArea(id, lang).toLowerCase();
  if (lang === 'en') {
    if (tone === 'green') return `Favourable current in ${label}: trust the movement.`;
    if (tone === 'yellow') return `${tArea(id, lang)} asks presence: neither force nor withdraw.`;
    return `Tension in ${label}: reduce, breathe, choose quality.`;
  }
  if (tone === 'green') return `Corrente favorevole in ${label}: fidati del movimento.`;
  if (tone === 'yellow') return `${tArea(id, lang)} chiede presenza: né forzare né ritirarti.`;
  return `Tensione in ${label}: riduci, respira, scegli la qualità.`;
}

export function planetDayReason(
  planetId: string,
  isRuler: boolean,
  weekday: number,
  speed: number,
  nature: string,
  lang: Lang,
): string {
  const name = tPlanet(planetId, lang);
  if (lang === 'en') {
    return isRuler
      ? `${DAY_NAMES.en[weekday]} is the day of ${name}: ${nature}`
      : `${name} is the most vivid body in today’s sky (${speed.toFixed(2)}°/day). ${nature}`;
  }
  return isRuler
    ? `${DAY_NAMES.it[weekday]} è il giorno di ${name}: ${nature}`
    : `${name} è il corpo più vivace nel cielo di oggi (${speed.toFixed(2)}°/giorno). ${nature}`;
}

export function eventCopy(
  kind: 'lunarEclipse' | 'solarEclipse' | 'fullMoon' | 'retrograde',
  extra: string,
  lang: Lang,
): { title: string; detail: string } {
  if (lang === 'en') {
    if (kind === 'lunarEclipse') {
      return { title: `Lunar eclipse ${extra}`, detail: 'Earth stands between Sun and Moon: feeling hastens, and chapters close.' };
    }
    if (kind === 'solarEclipse') {
      return { title: `Solar eclipse ${extra}`, detail: 'The Moon covers the Sun: identity is rewritten at the root.' };
    }
    if (kind === 'fullMoon') {
      return { title: 'Coming Full Moon', detail: 'Emotional culmination and visibility: complete, then release.' };
    }
    return { title: `${extra} retrograde`, detail: `${extra} is in apparent reverse. An hour of revision, not of launching.` };
  }
  if (kind === 'lunarEclipse') {
    return { title: `Eclissi lunare ${extra}`, detail: 'La Terra sta tra Sole e Luna: il sentire accelera, i capitoli si chiudono.' };
  }
  if (kind === 'solarEclipse') {
    return { title: `Eclissi solare ${extra}`, detail: 'La Luna copre il Sole: l’identità si riscrive alla radice.' };
  }
  if (kind === 'fullMoon') {
    return { title: 'Prossima Luna piena', detail: 'Culmine emotivo e visibilità: porta a compimento, poi rilascia.' };
  }
  return { title: `${extra} retrogrado`, detail: `${extra} è in moto apparente inverso. Ora di revisione, non di lancio.` };
}

export function eclipseDetail(type: 'lunare' | 'solare', kind: string, lang: Lang): string {
  if (lang === 'en') {
    if (type === 'lunare') {
      if (kind === 'total') return 'Total lunar eclipse: intensity of feeling, and revelation.';
      if (kind === 'partial') return 'Partial lunar eclipse: adjustments of the inner tide.';
      return 'Penumbral lunar eclipse: a whisper more than a storm.';
    }
    if (kind === 'total') return 'Total solar eclipse: a reset of identity and direction.';
    if (kind === 'annular') return 'Annular eclipse: a ring of light, a purpose to refine.';
    return 'Partial solar eclipse: a gentler beginning, yet real.';
  }
  if (type === 'lunare') {
    if (kind === 'total') return 'Eclissi lunare totale: intensità del sentire e rivelazione.';
    if (kind === 'partial') return 'Eclissi lunare parziale: aggiustamenti della marea interiore.';
    return 'Eclissi lunare penombrale: un sussurro più che un uragano.';
  }
  if (kind === 'total') return 'Eclissi solare totale: reset di identità e direzione.';
  if (kind === 'annular') return 'Eclissi anulare: un anello di luce, un proposito da raffinare.';
  return 'Eclissi solare parziale: un inizio più gentile, ma reale.';
}

export function aspectLine(
  planetA: string,
  planetB: string,
  type: AspectType,
  effect: string,
  transit: boolean,
  lang: Lang,
): string {
  const a = tPlanet(planetA, lang);
  const b = tPlanet(planetB, lang);
  const label = {
    it: {
      conjunction: 'congiunzione',
      sextile: 'sestile',
      square: 'quadratura',
      trine: 'trigono',
      quincunx: 'quinconce',
      opposition: 'opposizione',
    },
    en: {
      conjunction: 'conjunction',
      sextile: 'sextile',
      square: 'square',
      trine: 'trine',
      quincunx: 'quincunx',
      opposition: 'opposition',
    },
  }[lang][type];
  if (lang === 'en') {
    return transit ? `${a} in transit ${label} natal ${b}: ${effect}` : `${a} ${label} ${b}: ${effect}`;
  }
  return transit ? `${a} in transito ${label} ${b} natale: ${effect}` : `${a} ${label} ${b}: ${effect}`;
}

export function aspectEffect(type: AspectType, lang: Lang): string {
  const it: Record<AspectType, string> = {
    conjunction: 'Fusione di nature: i due principi si uniscono e si potenziano.',
    sextile: 'Opportunità: collaborazione facile, se scegli di agire.',
    square: 'Tensione e prova: attrito che spinge a crescere.',
    trine: 'Armonia e dono: flusso naturale, da usare con coscienza.',
    quincunx: 'Aggiustamento: due linguaggi cercano un terzo modo.',
    opposition: 'Polarità: l’altro specchia ciò che non vuoi vedere.',
  };
  const en: Record<AspectType, string> = {
    conjunction: 'Fusion of natures: the two principles join and intensify.',
    sextile: 'Opportunity: easy collaboration, if you choose to act.',
    square: 'Tension and trial: friction that forces growth.',
    trine: 'Harmony and gift: a natural current, to be used with awareness.',
    quincunx: 'Adjustment: two languages seeking a third way.',
    opposition: 'Polarity: the other mirrors what you will not see.',
  };
  return (lang === 'en' ? en : it)[type];
}

export function luckyMoment(energy: number, illumination: number, lang: Lang): string {
  const m = STRINGS[lang].moments;
  if (energy >= 7) return m.morning;
  if (illumination > 60) return m.evening;
  return m.afternoon;
}

export function socialUpdate(moonSign: string, mercuryRetro: boolean, lang: Lang): string {
  const s = tSign(moonSign, lang);
  if (lang === 'en') {
    return mercuryRetro
      ? `Words return before they land. With the Moon in ${s}, say less, and mean it.`
      : `The circle around you answers the Moon in ${s}. Choose one conversation worth the hour.`;
  }
  return mercuryRetro
    ? `Le parole tornano prima di arrivare. Con la Luna in ${s}, di’ meno, e intendilo.`
    : `La cerchia risponde alla Luna in ${s}. Scegli un solo colloquio che valga l’ora.`;
}

export function dayCounsel(
  energy: number,
  hasHardTransit: boolean,
  mercuryRetro: boolean,
  lang: Lang,
): { favor: string[]; withhold: string[] } {
  if (lang === 'en') {
    return {
      favor: [
        energy >= 7 ? 'One completed gesture, not ten begun.' : 'Care of the body before the task.',
        hasHardTransit ? 'Name the friction; do not decorate it.' : 'A request spoken without theatre.',
      ],
      withhold: [
        mercuryRetro ? 'Do not sign, send, or launch what cannot be revised.' : 'Do not perform certainty you do not hold.',
        hasHardTransit ? 'Do not force a closing. The sky is already doing that work.' : 'Do not scatter the hour across too many rooms.',
      ],
    };
  }
  return {
    favor: [
      energy >= 7 ? 'Un gesto compiuto, non dieci iniziati.' : 'La cura del corpo prima del compito.',
      hasHardTransit ? 'Nomina l’attrito; non decorarlo.' : 'Una richiesta detta senza teatro.',
    ],
    withhold: [
      mercuryRetro ? 'Non firmare, inviare o lanciare ciò che non può essere rivisto.' : 'Non recitare una certezza che non possiedi.',
      hasHardTransit ? 'Non forzare una chiusura. Il cielo sta già facendo quel lavoro.' : 'Non disperdere l’ora in troppe stanze.',
    ],
  };
}

export function synastryNote(
  sunA: string,
  sunB: string,
  moonA: string,
  moonB: string,
  harmonious: number,
  tense: number,
  lang: Lang,
): { bond: string; desire: string } {
  const a = tSign(sunA, lang);
  const b = tSign(sunB, lang);
  const ma = tSign(moonA, lang);
  const mb = tSign(moonB, lang);
  const lean = harmonious >= tense ? 'flow' : 'friction';
  if (lang === 'en') {
    return {
      bond: `Sun ${a} meeting Sun ${b}. Moon ${ma} answering Moon ${mb}. ${
        lean === 'flow'
          ? 'The current between you is usable: stay honest, and it holds.'
          : 'The current is instructive: the other names what you avoid.'
      }`,
      desire:
        lean === 'flow'
          ? 'Desire asks for presence, not proof. Let the bond be simple before it is grand.'
          : 'Desire sharpens. Name the need without turning it into a trial.',
    };
  }
  return {
    bond: `Sole ${a} incontra Sole ${b}. Luna ${ma} risponde a Luna ${mb}. ${
      lean === 'flow'
        ? 'La corrente tra voi è usabile: restate onesti, e tiene.'
        : 'La corrente istruisce: l’altro nomina ciò che eviti.'
    }`,
    desire:
      lean === 'flow'
        ? 'Il desiderio chiede presenza, non prova. Lascia che il vincolo sia semplice prima di essere grande.'
        : 'Il desiderio affila. Di’ il bisogno senza farne un processo.',
  };
}

export function luckyColor(dateIso: string, lang: Lang): string {
  const day = new Date(dateIso).getDate();
  return LUCKY_COLORS[day % LUCKY_COLORS.length][lang];
}

export function localReadingCopy(
  lang: Lang,
  args: {
    name: string;
    sunSign: string;
    moonSign: string;
    phase: string;
    natalMoon: string;
    natalSun: string;
    asc: string;
    planetName: string;
    nature: string;
    energy: number;
    transit?: string;
    love?: string;
    work?: string;
    moonEffect: string;
  },
): { general: string; love: string; work: string; health: string; spiritual: string } {
  if (lang === 'en') {
    return {
      general: `Today the sky addresses ${args.name} in the voice of ${args.sunSign}. Sun in ${args.sunSign}, Moon in ${args.moonSign} (${args.phase}): hold identity and feeling as one current. ${args.transit ?? 'The transits are quiet: attend to the small signs.'} Temper of the day: ${args.energy}/10.`,
      love: `Venus and the Moon ask for truth, not performance. From ${args.natalSun} with natal Moon in ${args.natalMoon}, the bond grows when the need is spoken without theatre. ${args.love ?? ''}`,
      work: `The regent of the day is ${args.planetName}. ${args.nature} In work, the quality of the gesture outweighs its number. ${args.work ?? ''}`,
      health: `The ${args.phase} governs the body as a tide. ${args.moonEffect} Drink, walk, guard sleep: the most astrological path there is.`,
      spiritual: `Ascendant ${args.asc}: enter the day as you would a temple. One rite is enough — a breath before speech, an honest question before action.`,
    };
  }
  return {
    general: `Oggi il cielo parla a ${args.name} con voce di ${args.sunSign}. Sole in ${args.sunSign}, Luna in ${args.moonSign} (${args.phase}): tieni insieme identità e sentire. ${args.transit ?? 'I transiti sono discreti: ascolta i dettagli.'} Temperatura del giorno: ${args.energy}/10.`,
    love: `Venere e la Luna chiedono autenticità, non prestazione. Da ${args.natalSun} con Luna natale in ${args.natalMoon}, il vincolo cresce se dici il bisogno senza teatro. ${args.love ?? ''}`,
    work: `Il reggente del giorno è ${args.planetName}. ${args.nature} Nell’opera conta la qualità del gesto più della quantità. ${args.work ?? ''}`,
    health: `La ${args.phase} governa il corpo come una marea. ${args.moonEffect} Bevi, cammina, proteggi il sonno: è la via più astrologica che esista.`,
    spiritual: `Ascendente ${args.asc}: entra nella giornata come in un tempio. Un solo rito basta — un respiro prima di parlare, una domanda onesta prima di agire.`,
  };
}
