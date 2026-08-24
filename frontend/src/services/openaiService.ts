import type { DailyReading, DailySky, NatalChart, UserProfile } from '../types';
import { localDailyReading } from './astrologService';
import { api } from './api';
import { loadReadingRemote, saveReadingRemote } from './firebase';

export async function getDailyReading(
  profile: UserProfile,
  natal: NatalChart,
  sky: DailySky,
  lang: 'it' | 'en' = 'it',
): Promise<DailyReading> {
  if (lang === 'it') {
    const cached = await loadReadingRemote(profile.uid, sky.date);
    if (cached) return cached;

    const remote = await api.generateReading({ profile, date: sky.date });
    if (remote) {
      await saveReadingRemote(profile.uid, remote);
      return remote;
    }
  }

  const local = localDailyReading(profile, natal, sky, lang);
  if (lang === 'it') await saveReadingRemote(profile.uid, local);
  return local;
}
