export interface PlanetMeta {
  id: string;
  name: string;
  glyph: string;
  astronomyBody: string;
  rules: string;
  represents: string;
  cycle: string;
  retrograde: string;
  retrogradeEffect: string;
  color: string;
}

export const PLANETS: PlanetMeta[] = [
  {
    id: 'sun',
    name: 'Sole',
    glyph: '☉',
    astronomyBody: 'Sun',
    rules: 'Leone',
    represents: 'Ego, identità, vitalità, il Sé cosciente',
    cycle: '30 giorni per segno, 1 anno completo',
    retrograde: 'Non va retrogrado',
    retrogradeEffect: 'Il Sole non è mai retrogrado.',
    color: '#F4C430',
  },
  {
    id: 'moon',
    name: 'Luna',
    glyph: '☽',
    astronomyBody: 'Moon',
    rules: 'Cancro',
    represents: 'Emozioni, istinto, inconscio, madre',
    cycle: '2,5 giorni per segno, 28 giorni completi',
    retrograde: 'Non si considera retrograda in astrologia classica',
    retrogradeEffect: 'Le fasi lunari parlano più del moto apparente.',
    color: '#E8E4D9',
  },
  {
    id: 'mercury',
    name: 'Mercurio',
    glyph: '☿',
    astronomyBody: 'Mercury',
    rules: 'Gemelli e Vergine',
    represents: 'Mente, comunicazione, viaggi brevi, commercio',
    cycle: 'Circa 1 anno, con periodi veloci e lenti',
    retrograde: '3–4 volte l’anno, circa 3 settimane',
    retrogradeEffect: 'Rallentamenti in comunicazione, tecnologia e contratti. Tempo di rivedere, non di lanciare.',
    color: '#C4B7A6',
  },
  {
    id: 'venus',
    name: 'Venere',
    glyph: '♀',
    astronomyBody: 'Venus',
    rules: 'Toro e Bilancia',
    represents: 'Amore, bellezza, arte, piacere, denaro',
    cycle: 'Circa 19 mesi per il ciclo completo',
    retrograde: 'Ogni 18 mesi, circa 40 giorni',
    retrogradeEffect: 'Revisione di relazioni, valori e desideri. Si torna su ciò che si ama davvero.',
    color: '#E8A0BF',
  },
  {
    id: 'mars',
    name: 'Marte',
    glyph: '♂',
    astronomyBody: 'Mars',
    rules: 'Ariete (e Scorpione tradizionale)',
    represents: 'Azione, energia, desiderio, coraggio, conflitto',
    cycle: 'Circa 2 anni per il giro dello zodiaco',
    retrograde: 'Ogni 26 mesi, circa 60–80 giorni',
    retrogradeEffect: 'Energia bloccata o reindirizzata. Meglio rivedere le mosse che forzarne di nuove.',
    color: '#D94B4B',
  },
  {
    id: 'jupiter',
    name: 'Giove',
    glyph: '♃',
    astronomyBody: 'Jupiter',
    rules: 'Sagittario (e Pesci tradizionale)',
    represents: 'Espansione, fortuna, filosofia, crescita',
    cycle: 'Circa 12 anni, un anno per segno',
    retrograde: 'Circa 4 mesi all’anno',
    retrogradeEffect: 'Crescita interiore, fede rivista, viaggi e studi più contemplativi.',
    color: '#C9A227',
  },
  {
    id: 'saturn',
    name: 'Saturno',
    glyph: '♄',
    astronomyBody: 'Saturn',
    rules: 'Capricorno (e Acquario tradizionale)',
    represents: 'Disciplina, limiti, karma, struttura, tempo',
    cycle: 'Circa 29,5 anni, 2,5 anni per segno',
    retrograde: 'Circa 4,5 mesi all’anno',
    retrogradeEffect: 'Revisione di responsabilità, confini e strutture. Il maestro interiore parla più piano.',
    color: '#8B7355',
  },
  {
    id: 'uranus',
    name: 'Urano',
    glyph: '♅',
    astronomyBody: 'Uranus',
    rules: 'Acquario',
    represents: 'Rivoluzione, originalità, libertà, cambiamenti improvvisi',
    cycle: 'Circa 84 anni, 7 anni per segno',
    retrograde: 'Circa 5 mesi all’anno',
    retrogradeEffect: 'Rivoluzioni interiori, insight improvvisi, bisogno di autenticità più che di ribellione.',
    color: '#7EC8E3',
  },
  {
    id: 'neptune',
    name: 'Nettuno',
    glyph: '♆',
    astronomyBody: 'Neptune',
    rules: 'Pesci',
    represents: 'Sogni, illusione, spiritualità, compassione',
    cycle: 'Circa 165 anni, 14 anni per segno',
    retrograde: 'Circa 5 mesi all’anno',
    retrogradeEffect: 'Dissoluzione di illusioni e risveglio spirituale. Attenzione alla nebbia emotiva.',
    color: '#6C8CD5',
  },
  {
    id: 'pluto',
    name: 'Plutone',
    glyph: '♇',
    astronomyBody: 'Pluto',
    rules: 'Scorpione',
    represents: 'Trasformazione, potere, inconscio collettivo, rinascita',
    cycle: 'Circa 248 anni, 12–30 anni per segno',
    retrograde: 'Circa 5–6 mesi all’anno',
    retrogradeEffect: 'Trasformazione interiore profonda. Ciò che è sepolto chiede di emergere.',
    color: '#6B3FA0',
  },
  {
    id: 'northnode',
    name: 'Nodo Nord',
    glyph: '☊',
    astronomyBody: 'NorthNode',
    rules: 'Asse karmico',
    represents: 'Destino, direzione dell’anima, crescita futura',
    cycle: 'Circa 18,6 anni per il giro dello zodiaco',
    retrograde: 'Il nodo medio è sempre retrogrado',
    retrogradeEffect: 'Il Nodo Nord indica dove andare, anche quando il cammino sembra contrario.',
    color: '#D4AF37',
  },
];

export const PLANET_BY_ID = Object.fromEntries(PLANETS.map((p) => [p.id, p]));

export const WEEKDAY_RULERS = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'] as const;
