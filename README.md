# AstroAnima

A cross-platform daily astrology app: natal chart, live transits, daily reading, sky map and eclipses. All astronomical positions are computed locally, so the app works fully offline-first; cloud sync and AI-written readings are optional add-ons.

## Features

- **Natal chart** rendered as an SVG wheel, with aspects and Placidus houses
- **Real-time planets** and a sky map computed with [astronomy-engine](https://github.com/cosinekitty/astronomy)
- **Daily reading**, generated each morning by a scheduled job (GPT-4o when configured, otherwise a built-in text engine)
- **Eclipses**, moon phases, "planet of the day" and life-area energy
- **Onboarding** with birth data and city autocomplete
- Optional **Firebase** auth and Firestore persistence; without it, data stays on the device

## Stack

| Layer | Technologies |
| --- | --- |
| Mobile / web app | React Native, Expo, TypeScript, React Navigation |
| API | Node.js, Express, node-cron |
| Data & AI (optional) | Firebase Authentication, Firestore, OpenAI |

## Project structure

```
frontend/   Expo app (iOS, Android, web)
backend/    Express API + daily reading cron job
```

## Getting started

```bash
# API — http://127.0.0.1:4000
cd backend
cp .env.example .env
npm install
npm run dev

# App
cd frontend
npm install
npx expo start      # open in Expo Go, or press "w" for the web build
```

On a physical phone, set `extra.apiUrl` in `frontend/app.json` to your computer's LAN IP (e.g. `http://192.168.x.x:4000`).

## Configuration

Backend (`backend/.env`):

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | AI-generated readings |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Save readings and profiles in Firestore |
| `CRON_TZ` | Timezone of the 06:00 daily job (default `Europe/Rome`) |

Frontend: Firebase web config in `frontend/app.json` → `extra`, or as `EXPO_PUBLIC_FIREBASE_*` variables.

## Author

**Nicolò Peruzzi** · [npdevelopment.xyz](https://npdevelopment.xyz)
