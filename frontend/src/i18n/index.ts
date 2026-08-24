import { useStore } from '../store/useStore';
import { STRINGS, type Copy } from './strings';
import type { Lang } from './types';

export function useI18n(): { lang: Lang; copy: Copy; locale: string } {
  const lang = useStore((s) => s.language);
  return {
    lang,
    copy: STRINGS[lang],
    locale: lang === 'it' ? 'it-IT' : 'en-GB',
  };
}

export type { Lang } from './types';
export type { Copy } from './strings';
export { STRINGS } from './strings';
export * from './catalog';
export * from './types';
