import OpenAI from 'openai';
import { buildNatal, calculateTransits, type ProfilePayload } from './astrology.js';
import { currentMoon, getPlanetPositions, sunSignAndRiseSet } from './astronomy.js';

function localReading(profile: ProfilePayload, date: string) {
  const natal = buildNatal(profile);
  const now = new Date(`${date}T12:00:00`);
  const sky = getPlanetPositions(now);
  const moon = currentMoon(now);
  const sun = sunSignAndRiseSet(now, profile.birthPlace.lat, profile.birthPlace.lng);
  return {
    date,
    general: `Oggi ${profile.name} cammina sotto un Sole in ${sun.sign} e una ${moon.phaseName} in ${moon.sign}. Il cielo invita a tenere insieme identità e sentire, senza forzare risultati.`,
    love: 'Le relazioni chiedono autenticità. Dì il bisogno con calma: la magia è nella chiarezza, non nel teatro.',
    work: 'Nel lavoro conta la qualità del gesto. Un compito portato a termine con presenza vale più di dieci iniziati.',
    health: `La ${moon.phaseName} regola il corpo come una marea. Bevi, cammina, proteggi il sonno.`,
    spiritual: 'Un solo rito: un respiro prima di parlare, una domanda onesta prima di agire.',
    luckyNumber: (profile.name.length + new Date(date).getDate()) % 9 || 9,
    luckyColor: 'indaco',
    bestMoment: moon.illumination > 60 ? 'sera' : 'mattina',
    source: 'local' as const,
    natalHint: natal.ascendant?.sign ?? null,
  };
}

function formatPlanets(planets: ReturnType<typeof getPlanetPositions>) {
  return planets.map((p) => `${p.name} in ${p.formatted}${p.retrograde ? ' ℞' : ''}`).join('\n');
}

export async function generateReadingFor(profile: ProfilePayload, date: string) {
  const natal = buildNatal(profile);
  const now = new Date(`${date}T12:00:00`);
  const current = getPlanetPositions(now);
  const transits = calculateTransits(natal.planets, current);
  const moon = currentMoon(now);
  const sun = sunSignAndRiseSet(now);
  const moonNatal = natal.planets.find((p) => p.id === 'moon')?.sign ?? 'sconosciuto';
  const key = process.env.OPENAI_API_KEY;

  if (!key) return localReading(profile, date);

  const openai = new OpenAI({ apiKey: key });
  const prompt = `Sei un astrologo esperto e saggio. Crea una lettura astrologica
giornaliera personalizzata per ${profile.name} con questi dati:

DATA: ${date}
SEGNO SOLARE: ${profile.solarSign} - SEGNO LUNARE: ${moonNatal} - ASCENDENTE: ${natal.ascendant?.sign ?? 'non calcolato'}

TRANSITI ODIERNI PRINCIPALI:
${transits.map((t) => `${t.planetA} ${t.type} ${t.planetB} (orb ${t.orb}°)`).join('\n')}

POSIZIONI ATTUALI:
${formatPlanets(current)}

POSIZIONI NATALI:
${formatPlanets(natal.planets)}

FASE LUNARE: ${moon.phaseName} in ${moon.sign}
SOLE OGGI: ${sun.sign}
INTERESSI: ${(profile.interests ?? []).join(', ') || 'generali'}
LIVELLO: ${profile.level ?? 'principiante'}

Crea una lettura che includa:
1. Tema generale del giorno (3-4 frasi poetiche ma pratiche)
2. Amore e relazioni (2-3 frasi specifiche)
3. Lavoro e carriera (2-3 frasi specifiche)
4. Energia personale e salute (2-3 frasi)
5. Consiglio spirituale del giorno (1-2 frasi profonde)
6. Numero fortunato e colore del giorno
7. Momento migliore della giornata (mattina/pomeriggio/sera)

Tono: saggio, positivo ma onesto, accessibile a tutti.
Lingua: italiano.

Rispondi SOLO in JSON con chiavi: general, love, work, health, spiritual, luckyNumber, luckyColor, bestMoment.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.8,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Sei un astrologo saggio. Rispondi solo JSON valido.' },
        { role: 'user', content: prompt },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      date,
      general: String(parsed.general ?? ''),
      love: String(parsed.love ?? ''),
      work: String(parsed.work ?? ''),
      health: String(parsed.health ?? ''),
      spiritual: String(parsed.spiritual ?? ''),
      luckyNumber: Number(parsed.luckyNumber ?? 7),
      luckyColor: String(parsed.luckyColor ?? 'oro'),
      bestMoment: String(parsed.bestMoment ?? 'mattina'),
      source: 'openai' as const,
    };
  } catch (err) {
    console.error('OpenAI reading failed, fallback locale', err);
    return localReading(profile, date);
  }
}
