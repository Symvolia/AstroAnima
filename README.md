# AstroAnima

App di astrologia quotidiana: tema natale, transiti, lettura del giorno, mappa del cielo ed eclissi.

## Stack

- Frontend: React Native + Expo (TypeScript)
- Backend: Node.js + Express
- Calcoli: [astronomy-engine](https://github.com/cosinekitty/astronomy)
- AI (opzionale): OpenAI GPT-4o
- Auth/DB (opzionale): Firebase Authentication + Firestore

L’app funziona anche **senza** Firebase e OpenAI: i dati restano in locale e le letture usano un motore poetico interno.

## Avvio rapido

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API su `http://127.0.0.1:4000`. Cron letture: ogni giorno alle 06:00 (timezone `CRON_TZ`, default Europe/Rome).

### Frontend

```bash
cd frontend
npm install
npx expo start
```

Poi apri Expo Go (iOS/Android) oppure premi `w` per il web.

Su un telefono fisico, in `frontend/app.json` imposta `extra.apiUrl` con l’IP del computer (`http://192.168.x.x:4000`) al posto di `127.0.0.1`.

## Variabili d’ambiente

Backend (`backend/.env`):

- `OPENAI_API_KEY` — per generare letture GPT
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — per salvare letture e profili su Firestore

Frontend (`frontend/app.json` → `extra`, oppure `EXPO_PUBLIC_FIREBASE_*`):

- `firebaseApiKey`, `firebaseAuthDomain`, `firebaseProjectId`, `firebaseStorageBucket`, `firebaseMessagingSenderId`, `firebaseAppId`

Luogo di nascita: autocomplete su un elenco di città (Italia + città del mondo). Puoi collegare Google Places in seguito con una API key.

## Schermate

1. Onboarding (nascita, segno, preferenze)
2. Home (luna, sole, energia, aree della vita, pianeta del giorno, eventi)
3. Tema natale (ruota SVG, aspetti, case Placidus)
4. Lettura quotidiana
5. Pianeti in tempo reale
6. Mappa del cielo
7. Eclissi
8. Saggezza
9. Profilo
