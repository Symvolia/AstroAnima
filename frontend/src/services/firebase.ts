import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  signInAnonymously,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, type Firestore } from 'firebase/firestore';
import Constants from 'expo-constants';
import type { DailyReading, NatalChart, UserProfile } from '../types';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;

const firebaseConfig = {
  apiKey: extra.firebaseApiKey ?? process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: extra.firebaseAuthDomain ?? process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: extra.firebaseProjectId ?? process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: extra.firebaseStorageBucket ?? process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: extra.firebaseMessagingSenderId ?? process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.firebaseAppId ?? process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function getFirebase() {
  if (!isFirebaseConfigured) return { app: null, auth: null, db: null };
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
    try {
      auth = getAuth(app);
    } catch {
      auth = null;
    }
    db = getFirestore(app);
  }
  return { app, auth, db };
}

export async function ensureUser(): Promise<User | null> {
  const { auth: a } = getFirebase();
  if (!a) return null;
  if (a.currentUser) return a.currentUser;
  const cred = await signInAnonymously(a);
  return cred.user;
}

export function listenAuth(cb: (user: User | null) => void) {
  const { auth: a } = getFirebase();
  if (!a) {
    cb(null);
    return () => undefined;
  }
  return onAuthStateChanged(a, cb);
}

export async function saveProfileRemote(profile: UserProfile): Promise<void> {
  const { db: firestore } = getFirebase();
  if (!firestore) return;
  await setDoc(doc(firestore, 'users', profile.uid), profile, { merge: true });
}

export async function loadProfileRemote(uid: string): Promise<UserProfile | null> {
  const { db: firestore } = getFirebase();
  if (!firestore) return null;
  const snap = await getDoc(doc(firestore, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function saveReadingRemote(uid: string, reading: DailyReading): Promise<void> {
  const { db: firestore } = getFirebase();
  if (!firestore) return;
  await setDoc(doc(firestore, 'readings', `${uid}_${reading.date}`), reading);
}

export async function loadReadingRemote(uid: string, date: string): Promise<DailyReading | null> {
  const { db: firestore } = getFirebase();
  if (!firestore) return null;
  const snap = await getDoc(doc(firestore, 'readings', `${uid}_${date}`));
  return snap.exists() ? (snap.data() as DailyReading) : null;
}

export async function saveChartRemote(uid: string, chart: NatalChart): Promise<void> {
  const { db: firestore } = getFirebase();
  if (!firestore) return;
  await setDoc(doc(firestore, 'charts', uid), chart);
}
