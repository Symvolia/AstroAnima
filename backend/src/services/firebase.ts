import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

function configured() {
  return Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
}

let db: Firestore | null = null;

export function firestore(): Firestore | null {
  if (!configured()) return null;
  if (!db) {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
        }),
      });
    }
    db = getFirestore();
  }
  return db;
}

export async function saveReading(uid: string, reading: { date: string } & Record<string, unknown>) {
  const fs = firestore();
  if (!fs) return;
  await fs.doc(`readings/${uid}_${reading.date}`).set(reading, { merge: true });
}

export async function loadReading(uid: string, date: string) {
  const fs = firestore();
  if (!fs) return null;
  const snap = await fs.doc(`readings/${uid}_${date}`).get();
  return snap.exists ? snap.data() : null;
}

export async function listUsers() {
  const fs = firestore();
  if (!fs) return [];
  const snap = await fs.collection('users').get();
  return snap.docs.map((d) => d.data());
}
