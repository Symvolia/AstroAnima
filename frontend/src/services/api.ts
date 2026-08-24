import Constants from 'expo-constants';
import type { DailyReading, UserProfile } from '../types';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;
const BASE_URL =
  extra.apiUrl ?? process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:4000';

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      ...init,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const api = {
  health: () => request<{ ok: boolean }>('/health'),
  generateReading: (payload: { profile: UserProfile; date: string }) =>
    request<DailyReading>('/api/readings/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
