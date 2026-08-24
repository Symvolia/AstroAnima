import type { Lang } from './types';
import { tElement, tMode, tPlanet, tSign } from './catalog';

type Pair = { it: string; en: string };

const NATURE: Record<string, Pair> = {
  sun: { it: 'Ego, identità, vitalità, il Sé visibile', en: 'Ego, identity, vitality, the visible Self' },
  moon: { it: 'Emozioni, istinto, inconscio, la madre interiore', en: 'Feeling, instinct, the unseen, the inner mother' },
  mercury: { it: 'Mente, verbo, spostamenti brevi, scambio', en: 'Mind, word, short journeys, exchange' },
  venus: { it: 'Amore, bellezza, arte, piacere, valore', en: 'Love, beauty, art, pleasure, worth' },
  mars: { it: 'Azione, desiderio, coraggio, conflitto sacro', en: 'Action, desire, courage, sacred conflict' },
  jupiter: { it: 'Espansione, fede, filosofia, crescita', en: 'Expansion, faith, philosophy, growth' },
  saturn: { it: 'Disciplina, limite, tempo, struttura', en: 'Discipline, limit, time, structure' },
  uranus: { it: 'Rottura, originalità, libertà, scatto', en: 'Rupture, originality, freedom, the sudden' },
  neptune: { it: 'Sogno, velo, spiritualità, compassione', en: 'Dream, veil, spirit, compassion' },
  pluto: { it: 'Metamorfosi, potere, inconscio collettivo, rinascita', en: 'Metamorphosis, power, the collective unseen, rebirth' },
  northnode: { it: 'Direzione dell’anima, crescita, soglia futura', en: 'Direction of the soul, growth, the future threshold' },
};

const RULES: Record<string, Pair> = {
  sun: { it: 'Leone', en: 'Leo' },
  moon: { it: 'Cancro', en: 'Cancer' },
  mercury: { it: 'Gemelli e Vergine', en: 'Gemini and Virgo' },
  venus: { it: 'Toro e Bilancia', en: 'Taurus and Libra' },
  mars: { it: 'Ariete (e Scorpione tradizionale)', en: 'Aries (and traditional Scorpio)' },
  jupiter: { it: 'Sagittario (e Pesci tradizionale)', en: 'Sagittarius (and traditional Pisces)' },
  saturn: { it: 'Capricorno (e Acquario tradizionale)', en: 'Capricorn (and traditional Aquarius)' },
  uranus: { it: 'Acquario', en: 'Aquarius' },
  neptune: { it: 'Pesci', en: 'Pisces' },
  pluto: { it: 'Scorpione', en: 'Scorpio' },
  northnode: { it: 'Asse karmico', en: 'Karmic axis' },
};

const CYCLE: Record<string, Pair> = {
  sun: { it: 'Trenta giorni per segno, un anno completo', en: 'Thirty days per sign, one full year' },
  moon: { it: 'Due giorni e mezzo per segno, ventotto giorni', en: 'Two and a half days per sign, twenty-eight days' },
  mercury: { it: 'Circa un anno, con periodi veloci e lenti', en: 'About one year, with swift and slow seasons' },
  venus: { it: 'Circa diciannove mesi per il ciclo intero', en: 'About nineteen months for the full cycle' },
  mars: { it: 'Circa due anni per il giro dello zodiaco', en: 'About two years around the zodiac' },
  jupiter: { it: 'Circa dodici anni, un anno per segno', en: 'About twelve years, one year per sign' },
  saturn: { it: 'Circa ventinove anni e mezzo, due anni e mezzo per segno', en: 'About twenty-nine and a half years, two and a half years per sign' },
  uranus: { it: 'Circa ottantaquattro anni, sette anni per segno', en: 'About eighty-four years, seven years per sign' },
  neptune: { it: 'Circa centosessantacinque anni, quattordici anni per segno', en: 'About one hundred and sixty-five years, fourteen years per sign' },
  pluto: { it: 'Circa duecentoquarantotto anni, dodici–trenta anni per segno', en: 'About two hundred and forty-eight years, twelve to thirty years per sign' },
  northnode: { it: 'Circa diciotto anni e mezzo per il giro', en: 'About eighteen and a half years around the wheel' },
};

const RETRO: Record<string, Pair> = {
  sun: { it: 'Non va retrogrado', en: 'Does not turn retrograde' },
  moon: { it: 'Non si considera retrograda in astrologia classica', en: 'Not treated as retrograde in classical astrology' },
  mercury: { it: 'Tre o quattro volte l’anno, circa tre settimane', en: 'Three or four times a year, about three weeks' },
  venus: { it: 'Ogni diciotto mesi, circa quaranta giorni', en: 'Every eighteen months, about forty days' },
  mars: { it: 'Ogni ventisei mesi, circa sessanta–ottanta giorni', en: 'Every twenty-six months, about sixty to eighty days' },
  jupiter: { it: 'Circa quattro mesi all’anno', en: 'About four months each year' },
  saturn: { it: 'Circa quattro mesi e mezzo all’anno', en: 'About four and a half months each year' },
  uranus: { it: 'Circa cinque mesi all’anno', en: 'About five months each year' },
  neptune: { it: 'Circa cinque mesi all’anno', en: 'About five months each year' },
  pluto: { it: 'Circa cinque–sei mesi all’anno', en: 'About five to six months each year' },
  northnode: { it: 'Il nodo medio è sempre retrogrado', en: 'The mean node is always retrograde' },
};

const RETRO_FX: Record<string, Pair> = {
  sun: { it: 'Il Sole non è mai retrogrado.', en: 'The Sun is never retrograde.' },
  moon: { it: 'Le fasi lunari parlano più del moto apparente.', en: 'The lunar phases speak more than apparent motion.' },
  mercury: { it: 'Rallentamenti nel verbo, nella tecnica, nei patti. Tempo di rivedere, non di lanciare.', en: 'Slowing in word, technique, and pacts. An hour of review, not of launch.' },
  venus: { it: 'Revisione di vincoli, valori e desideri. Si torna su ciò che si ama davvero.', en: 'Revision of bonds, values and desires. One returns to what is truly loved.' },
  mars: { it: 'Energia trattenuta o reindirizzata. Meglio rivedere le mosse che forzarne di nuove.', en: 'Energy held or redirected. Better to revise a move than force a new one.' },
  jupiter: { it: 'Crescita interiore, fede rivista, viaggi e studi più contemplativi.', en: 'Inner growth, faith revised, more contemplative study and travel.' },
  saturn: { it: 'Revisione di responsabilità e confini. Il maestro interiore parla più piano.', en: 'Revision of duty and boundary. The inner teacher speaks more quietly.' },
  uranus: { it: 'Rivoluzioni interiori, insight improvvisi, bisogno di autenticità più che di ribellione.', en: 'Inner revolts, sudden insight, a need for authenticity more than rebellion.' },
  neptune: { it: 'Dissoluzione di veli e risveglio. Attenzione alla nebbia del sentire.', en: 'Veils dissolve; awakening follows. Beware the fog of feeling.' },
  pluto: { it: 'Metamorfosi interiore. Ciò che è sepolto chiede di emergere.', en: 'Inner metamorphosis. What was buried asks to rise.' },
  northnode: { it: 'Il Nodo Nord indica dove andare, anche quando il cammino sembra contrario.', en: 'The North Node shows where to walk, even when the path seems contrary.' },
};

const SIGN_DATES: Record<string, Pair> = {
  ariete: { it: '21 mar – 19 apr', en: '21 Mar – 19 Apr' },
  toro: { it: '20 apr – 20 mag', en: '20 Apr – 20 May' },
  gemelli: { it: '21 mag – 20 giu', en: '21 May – 20 Jun' },
  cancro: { it: '21 giu – 22 lug', en: '21 Jun – 22 Jul' },
  leone: { it: '23 lug – 22 ago', en: '23 Jul – 22 Aug' },
  vergine: { it: '23 ago – 22 set', en: '23 Aug – 22 Sep' },
  bilancia: { it: '23 set – 22 ott', en: '23 Sep – 22 Oct' },
  scorpione: { it: '23 ott – 21 nov', en: '23 Oct – 21 Nov' },
  sagittario: { it: '22 nov – 21 dic', en: '22 Nov – 21 Dec' },
  capricorno: { it: '22 dic – 19 gen', en: '22 Dec – 19 Jan' },
  acquario: { it: '20 gen – 18 feb', en: '20 Jan – 18 Feb' },
  pesci: { it: '19 feb – 20 mar', en: '19 Feb – 20 Mar' },
};

const SIGN_DESC: Record<string, Pair> = {
  ariete: {
    it: 'L’Ariete accende la ruota. Sei fatto per iniziare, osare, lasciare un segno. La tua energia è un fuoco che chiede movimento: quando ascolti l’istinto senza bruciare i ponti, diventi una guida.',
    en: 'Aries lights the wheel. You are made to begin, to dare, to leave a mark. Your energy is a fire that asks for motion: when instinct walks without burning the bridges, you become a guide.',
  },
  toro: {
    it: 'Il Toro radica ciò che l’Ariete ha seminato. Ami ciò che è concreto, bello e duraturo. La tua forza è la pazienza: costruisci mondi lenti, e insegni il piacere di restare.',
    en: 'Taurus roots what Aries has sown. You love what is concrete, beautiful and lasting. Your strength is patience: you build slow worlds, and teach the pleasure of remaining.',
  },
  gemelli: {
    it: 'I Gemelli tessono ponti tra idee e persone. La mente è veloce, affamata di storie. Quando scegli profondità oltre la varietà, la voce diventa medicina.',
    en: 'Gemini weaves bridges between ideas and people. The mind is swift, hungry for stories. When you choose depth beyond variety, the voice becomes medicine.',
  },
  cancro: {
    it: 'Il Cancro protegge il cuore del cielo. Senti prima di capire. La casa interiore è un santuario: quando la condividi, nutri chi ti sta accanto.',
    en: 'Cancer guards the heart of the sky. You feel before you understand. The inner house is a sanctuary: when you share it, you nourish those beside you.',
  },
  leone: {
    it: 'Il Leone è il Sole fatto persona. Brilli quando crei e ti mostri senza maschere. Il vero potere nasce dal cuore, non dal palcoscenico.',
    en: 'Leo is the Sun made person. You shine when you create and appear unmasked. True power is born of the heart, not of the stage.',
  },
  vergine: {
    it: 'La Vergine affina il mondo. Vedi i dettagli che altri ignorano. Il dono è rendere sacro l’ordinario, un gesto alla volta.',
    en: 'Virgo refines the world. You see the details others ignore. The gift is to make the ordinary sacred, one gesture at a time.',
  },
  bilancia: {
    it: 'La Bilancia cerca il punto d’incontro. Ami bellezza, dialogo, misura. Quando non tradisci te stesso per piacere, diventi artefice di pace autentica.',
    en: 'Libra seeks the meeting-point. You love beauty, dialogue, measure. When you do not betray yourself to please, you become a maker of true peace.',
  },
  scorpione: {
    it: 'Lo Scorpione non teme le profondità. Trasformi ciò che muore in ciò che vive. La lealtà è assoluta: chi merita il tuo sguardo, merita anche il tuo mistero.',
    en: 'Scorpio does not fear the depths. You turn what dies into what lives. Loyalty is absolute: whoever earns your gaze also earns your mystery.',
  },
  sagittario: {
    it: 'Il Sagittario punta oltre l’orizzonte. Cerchi verità che allarghino il mondo. Quando la fede si fa pratica, ispiri gli altri a crescere.',
    en: 'Sagittarius aims beyond the horizon. You seek truths that widen the world. When faith becomes practice, you inspire others to grow.',
  },
  capricorno: {
    it: 'Il Capricorno scala montagne interiori. Rispetti il tempo e i risultati che restano. L’ambizione è sacra quando serve qualcosa di più grande di te.',
    en: 'Capricorn climbs inner mountains. You honour time and results that remain. Ambition is sacred when it serves something larger than you.',
  },
  acquario: {
    it: 'L’Acquario porta il futuro nel presente. Pensi in reti e in rivoluzioni gentili. Il compito è restare umano mentre cambi il sistema.',
    en: 'Aquarius brings the future into the present. You think in nets and gentle revolts. The task is to remain human while changing the system.',
  },
  pesci: {
    it: 'I Pesci sentono l’oceano dietro ogni cosa. Intuisci, sogni, perdoni. Quando dai forma alla compassione, diventi un ponte tra visibile e invisibile.',
    en: 'Pisces feels the ocean behind each thing. You sense, dream, forgive. When compassion takes form, you become a bridge between the seen and the unseen.',
  },
};

function pick(map: Record<string, Pair>, id: string, lang: Lang, fallback = ''): string {
  return map[id]?.[lang] ?? fallback;
}

export function planetNature(id: string, lang: Lang): string {
  return pick(NATURE, id, lang);
}
export function planetRules(id: string, lang: Lang): string {
  return pick(RULES, id, lang);
}
export function planetCycle(id: string, lang: Lang): string {
  return pick(CYCLE, id, lang);
}
export function planetRetro(id: string, lang: Lang): string {
  return pick(RETRO, id, lang);
}
export function planetRetroFx(id: string, lang: Lang): string {
  return pick(RETRO_FX, id, lang);
}

export function signDates(id: string, lang: Lang): string {
  return pick(SIGN_DATES, id, lang);
}
export function signDescription(id: string, lang: Lang): string {
  return pick(SIGN_DESC, id, lang);
}

export function signSubtitle(id: string, element: string, mode: string, rulerId: string, lang: Lang): string {
  const dates = signDates(id, lang);
  return `${tElement(element, lang)} · ${tMode(mode, lang).toLowerCase()} · ${tPlanet(rulerId, lang)} · ${dates}`;
}

export { tSign };
