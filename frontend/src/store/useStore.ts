import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { Lang } from '../i18n/types';
import type { DailyReading, DailySky, NatalChart, UserProfile } from '../types';
import { astronomyService } from '../services/astronomyService';
import { getDailyReading } from '../services/openaiService';
import {
  ensureUser,
  isFirebaseConfigured,
  loadProfileRemote,
  saveChartRemote,
  saveProfileRemote,
} from '../services/firebase';
import { scheduleDailyReading } from '../services/notificationService';

const PROFILE_KEY = 'astroanima.profile';
const LANG_KEY = 'astroanima.language';

interface AppState {
  hydrated: boolean;
  language: Lang;
  profile: UserProfile | null;
  natal: NatalChart | null;
  sky: DailySky | null;
  reading: DailyReading | null;
  loadingSky: boolean;
  hydrate: () => Promise<void>;
  setLanguage: (language: Lang) => Promise<void>;
  completeOnboarding: (profile: Omit<UserProfile, 'uid' | 'onboardingComplete'>) => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  refreshSky: (geo?: { lat: number; lng: number }) => Promise<void>;
  logoutLocal: () => Promise<void>;
}

async function persist(profile: UserProfile) {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  await saveProfileRemote(profile);
}

export const useStore = create<AppState>((set, get) => ({
  hydrated: false,
  language: 'it',
  profile: null,
  natal: null,
  sky: null,
  reading: null,
  loadingSky: false,

  setLanguage: async (language) => {
    await AsyncStorage.setItem(LANG_KEY, language);
    set({ language, reading: null });
    await get().refreshSky();
  },

  hydrate: async () => {
    try {
      const savedLang = await AsyncStorage.getItem(LANG_KEY);
      if (savedLang === 'it' || savedLang === 'en') set({ language: savedLang });
      const raw = await AsyncStorage.getItem(PROFILE_KEY);
      let profile: UserProfile | null = raw ? JSON.parse(raw) : null;
      if (isFirebaseConfigured) {
        const user = await ensureUser();
        if (user) {
          const remote = await loadProfileRemote(user.uid);
          if (remote) profile = remote;
          else if (profile) profile = { ...profile, uid: user.uid };
        }
      }
      if (!profile) {
        set({ hydrated: true });
        return;
      }
      const natal = astronomyService.natalChart(profile);
      set({ profile, natal, hydrated: true });
      await get().refreshSky();
    } catch {
      set({ hydrated: true });
    }
  },

  completeOnboarding: async (draft) => {
    const user = isFirebaseConfigured ? await ensureUser() : null;
    const profile: UserProfile = {
      ...draft,
      uid: user?.uid ?? `local-${Date.now()}`,
      onboardingComplete: true,
    };
    const natal = astronomyService.natalChart(profile);
    await persist(profile);
    await saveChartRemote(profile.uid, natal);
    await scheduleDailyReading(profile.notificationHour, profile.notificationMinute, profile.name);
    set({ profile, natal });
    await get().refreshSky();
  },

  updateProfile: async (patch) => {
    const current = get().profile;
    if (!current) return;
    const profile = { ...current, ...patch };
    const natal = astronomyService.natalChart(profile);
    await persist(profile);
    await saveChartRemote(profile.uid, natal);
    if (patch.notificationHour != null || patch.notificationMinute != null) {
      await scheduleDailyReading(profile.notificationHour, profile.notificationMinute, profile.name);
    }
    set({ profile, natal });
    await get().refreshSky();
  },

  refreshSky: async (geo) => {
    const { profile, natal, language } = get();
    if (!profile || !natal) return;
    set({ loadingSky: true });
    const sky = astronomyService.dailySky(profile, natal, geo, language);
    set({ sky, loadingSky: false });
    const reading = await getDailyReading(profile, natal, sky, language);
    set({ reading });
  },

  logoutLocal: async () => {
    await AsyncStorage.removeItem(PROFILE_KEY);
    set({ profile: null, natal: null, sky: null, reading: null });
  },
}));
