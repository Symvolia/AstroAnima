export interface ZodiacSign {
  id: string;
  name: string;
  glyph: string;
  element: 'fuoco' | 'terra' | 'aria' | 'acqua';
  modality: 'cardinale' | 'fisso' | 'mobile';
  ruler: string;
  dates: string;
  short: string;
  description: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'ariete',
    name: 'Ariete',
    glyph: '♈',
    element: 'fuoco',
    modality: 'cardinale',
    ruler: 'Marte',
    dates: '21 mar – 19 apr',
    short: 'Coraggio, inizio, slancio vitale.',
    description:
      'L’Ariete accende la ruota. Sei fatto per iniziare, osare e lasciare un segno. La tua energia è un fuoco che chiede movimento: quando ascolti l’istinto senza bruciare i ponti, diventi una guida naturale.',
  },
  {
    id: 'toro',
    name: 'Toro',
    glyph: '♉',
    element: 'terra',
    modality: 'fisso',
    ruler: 'Venere',
    dates: '20 apr – 20 mag',
    short: 'Stabilità, sensi, valore.',
    description:
      'Il Toro radica ciò che l’Ariete ha seminato. Ami ciò che è concreto, bello e duraturo. La tua forza è la pazienza: costruisci mondi lenti e solidi, e insegni agli altri il piacere di restare.',
  },
  {
    id: 'gemelli',
    name: 'Gemelli',
    glyph: '♊',
    element: 'aria',
    modality: 'mobile',
    ruler: 'Mercurio',
    dates: '21 mag – 20 giu',
    short: 'Curiosità, parole, connessioni.',
    description:
      'I Gemelli tessono ponti tra idee e persone. La tua mente è veloce, brillante, affamata di storie. Quando scegli profondità oltre la varietà, la tua voce diventa medicina.',
  },
  {
    id: 'cancro',
    name: 'Cancro',
    glyph: '♋',
    element: 'acqua',
    modality: 'cardinale',
    ruler: 'Luna',
    dates: '21 giu – 22 lug',
    short: 'Cura, memoria, nido.',
    description:
      'Il Cancro protegge il cuore del cielo. Senti prima di capire, e capisci con il corpo. La tua casa interiore è un santuario: quando la condividi, nutri chi ti sta accanto.',
  },
  {
    id: 'leone',
    name: 'Leone',
    glyph: '♌',
    element: 'fuoco',
    modality: 'fisso',
    ruler: 'Sole',
    dates: '23 lug – 22 ago',
    short: 'Cuore, creatività, presenza.',
    description:
      'Il Leone è il Sole fatto persona. Brilli quando crei, ami e ti mostri senza maschere. La tua generosità è regale: il vero potere nasce dal cuore, non dal palcoscenico.',
  },
  {
    id: 'vergine',
    name: 'Vergine',
    glyph: '♍',
    element: 'terra',
    modality: 'mobile',
    ruler: 'Mercurio',
    dates: '23 ago – 22 set',
    short: 'Precisione, servizio, ordine sacro.',
    description:
      'La Vergine affina il mondo. Vedi i dettagli che altri ignorano e sai come migliorare la vita quotidiana. Il tuo dono è rendere sacro l’ordinario, un gesto alla volta.',
  },
  {
    id: 'bilancia',
    name: 'Bilancia',
    glyph: '♎',
    element: 'aria',
    modality: 'cardinale',
    ruler: 'Venere',
    dates: '23 set – 22 ott',
    short: 'Armonia, relazione, giustizia.',
    description:
      'La Bilancia cerca il punto d’incontro. Ami la bellezza, il dialogo e l’equilibrio. Quando non tradisci te stesso per piacere, diventi un artefice di pace autentica.',
  },
  {
    id: 'scorpione',
    name: 'Scorpione',
    glyph: '♏',
    element: 'acqua',
    modality: 'fisso',
    ruler: 'Plutone',
    dates: '23 ott – 21 nov',
    short: 'Intensità, verità, rinascita.',
    description:
      'Lo Scorpione non teme le profondità. Trasformi ciò che muore in ciò che vive. La tua lealtà è assoluta: chi merita il tuo sguardo, merita anche il tuo mistero.',
  },
  {
    id: 'sagittario',
    name: 'Sagittario',
    glyph: '♐',
    element: 'fuoco',
    modality: 'mobile',
    ruler: 'Giove',
    dates: '22 nov – 21 dic',
    short: 'Visione, viaggio, significato.',
    description:
      'Il Sagittario punta oltre l’orizzonte. Cerchi verità che allarghino il mondo — libri, strade, cieli. Quando la tua fede si fa pratica, ispiri gli altri a crescere.',
  },
  {
    id: 'capricorno',
    name: 'Capricorno',
    glyph: '♑',
    element: 'terra',
    modality: 'cardinale',
    ruler: 'Saturno',
    dates: '22 dic – 19 gen',
    short: 'Maestria, tempo, responsabilità.',
    description:
      'Il Capricorno scala montagne interiori. Rispetti il tempo, la disciplina e i risultati che restano. La tua ambizione è sacra quando serve qualcosa di più grande di te.',
  },
  {
    id: 'acquario',
    name: 'Acquario',
    glyph: '♒',
    element: 'aria',
    modality: 'fisso',
    ruler: 'Urano',
    dates: '20 gen – 18 feb',
    short: 'Libertà, visione, umanità.',
    description:
      'L’Acquario porta il futuro nel presente. Pensi in reti, idee e rivoluzioni gentili. Sei originale senza sforzo: il tuo compito è restare umano mentre cambi il sistema.',
  },
  {
    id: 'pesci',
    name: 'Pesci',
    glyph: '♓',
    element: 'acqua',
    modality: 'mobile',
    ruler: 'Nettuno',
    dates: '19 feb – 20 mar',
    short: 'Empatia, sogno, dissoluzione.',
    description:
      'I Pesci sentono l’oceano dietro ogni cosa. Intuisci, sogni, perdoni. Quando dai forma alla tua compassione, diventi un ponte tra il visibile e l’invisibile.',
  },
];

export const SIGN_BY_INDEX = ZODIAC_SIGNS;

export function signById(id: string): ZodiacSign {
  return ZODIAC_SIGNS.find((s) => s.id === id) ?? ZODIAC_SIGNS[0];
}
