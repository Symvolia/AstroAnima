import { CITIES } from '../constants/cities';
import type { Lang } from '../i18n/types';
import type { GeoPlace } from '../types';

type GeoHit = {
  id?: number;
  name?: string;
  latitude?: number;
  longitude?: number;
  country?: string;
  admin1?: string;
  admin2?: string;
  feature_code?: string;
};

export function formatPlace(place: GeoPlace): string {
  return [place.name, place.admin, place.country].filter(Boolean).join(', ');
}

function localMatches(query: string, limit: number): GeoPlace[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return CITIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
  ).slice(0, limit);
}

function fromRemote(hit: GeoHit): GeoPlace | null {
  if (!hit.name || typeof hit.latitude !== 'number' || typeof hit.longitude !== 'number') return null;
  return {
    name: hit.name,
    country: hit.country?.trim() || '',
    admin: hit.admin1?.trim() || hit.admin2?.trim() || undefined,
    lat: hit.latitude,
    lng: hit.longitude,
  };
}

function samePlace(a: GeoPlace, b: GeoPlace): boolean {
  return Math.abs(a.lat - b.lat) < 0.04 && Math.abs(a.lng - b.lng) < 0.04 && a.name.toLowerCase() === b.name.toLowerCase();
}

export async function searchCitiesWorld(
  query: string,
  lang: Lang,
  limit = 12,
  signal?: AbortSignal,
): Promise<GeoPlace[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const local = localMatches(q, limit);
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=${limit}&language=${lang}&format=json`;
    const res = await fetch(url, { signal });
    if (!res.ok) return local;
    const data = (await res.json()) as { results?: GeoHit[] };
    const remote = (data.results ?? [])
      .filter((hit) => !hit.feature_code || hit.feature_code.startsWith('PPL'))
      .map(fromRemote)
      .filter((p): p is GeoPlace => Boolean(p));
    const merged: GeoPlace[] = [...local];
    for (const place of remote) {
      if (!merged.some((existing) => samePlace(existing, place))) merged.push(place);
    }
    return merged.slice(0, limit);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return local;
    return local;
  }
}
