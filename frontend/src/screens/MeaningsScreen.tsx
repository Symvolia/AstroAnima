import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { MEANING_CATEGORIES, MEANINGS, type MeaningCategory, type MeaningItem } from '../constants/meanings';
import { tAspect, tElement, tHouseTitle, tPlanet, tSign, useI18n } from '../i18n';
import type { AspectType } from '../types';
import { colors, radii } from '../theme';

function meaningTitle(item: MeaningItem, lang: 'it' | 'en'): string {
  if (lang === 'it') return item.title;
  if (item.id.startsWith('segno-')) return tSign(item.id.replace('segno-', ''), lang);
  if (item.id.startsWith('p-')) {
    const map: Record<string, string> = {
      'p-sun': 'sun',
      'p-moon': 'moon',
      'p-mercury': 'mercury',
      'p-venus': 'venus',
      'p-mars': 'mars',
      'p-jupiter': 'jupiter',
      'p-saturn': 'saturn',
      'p-uranus': 'uranus',
      'p-neptune': 'neptune',
      'p-pluto': 'pluto',
      'p-node': 'northnode',
    };
    return tPlanet(map[item.id] ?? '', lang) || item.title;
  }
  if (item.id.startsWith('c') && item.category === 'case') {
    const n = Number(item.id.slice(1));
    if (n) return tHouseTitle(n, lang);
  }
  const aspects: Record<string, AspectType> = {
    'a-conj': 'conjunction',
    'a-sex': 'sextile',
    'a-sqr': 'square',
    'a-tri': 'trine',
    'a-qui': 'quincunx',
    'a-opp': 'opposition',
  };
  if (aspects[item.id]) return tAspect(aspects[item.id], lang);
  if (['fuoco', 'terra', 'aria', 'acqua'].includes(item.id)) return tElement(item.id, lang);
  const basics: Record<string, string> = {
    tema: 'Natal chart',
    'sole-luna-asc': 'Sun, Moon, Ascendant',
    transiti: 'Transits',
    retrogrado: 'Retrograde planet',
    cardinale: 'Cardinal',
    fisso: 'Fixed',
    mobile: 'Mutable',
  };
  return basics[item.id] ?? item.title;
}

export function MeaningsScreen() {
  const { copy, lang } = useI18n();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<MeaningCategory | 'tutti'>('tutti');
  const [open, setOpen] = useState<string | null>('tema');

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEANINGS.filter((item) => {
      const inCat = cat === 'tutti' || item.category === cat;
      if (!inCat) return false;
      if (!q) return true;
      const title = meaningTitle(item, lang);
      return `${title} ${item.subtitle} ${item.body}`.toLowerCase().includes(q);
    });
  }, [query, cat, lang]);

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.lead}>{copy.meanings.lead}</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={copy.meanings.search}
            placeholderTextColor={colors.muted}
            style={styles.search}
            accessibilityLabel={copy.meanings.search}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Chip label={copy.meanings.all} on={cat === 'tutti'} onPress={() => setCat('tutti')} />
            {MEANING_CATEGORIES.map((c) => (
              <Chip key={c.id} label={copy.meanings.cats[c.id]} on={cat === c.id} onPress={() => setCat(c.id)} />
            ))}
          </ScrollView>
          {items.map((item) => (
            <MeaningCard
              key={item.id}
              title={meaningTitle(item, lang)}
              subtitle={item.subtitle}
              body={item.body}
              expanded={open === item.id}
              onToggle={() => setOpen(open === item.id ? null : item.id)}
            />
          ))}
          {items.length === 0 ? <Text style={styles.empty}>{copy.meanings.empty}</Text> : null}
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.chip, on && styles.chipOn]}>
      <Text style={[styles.chipText, on && styles.chipTextOn]}>{label}</Text>
    </Pressable>
  );
}

function MeaningCard({
  title,
  subtitle,
  body,
  expanded,
  onToggle,
}: {
  title: string;
  subtitle: string;
  body: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onToggle} style={styles.card}>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{subtitle}</Text>
      </View>
      {expanded ? <Text style={styles.body}>{body}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 48, gap: 10 },
  lead: { color: colors.muted, lineHeight: 20, marginBottom: 6 },
  search: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: 14,
    color: colors.cream,
    backgroundColor: colors.surface,
  },
  chips: { gap: 8, paddingVertical: 4 },
  chip: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { color: colors.cream },
  chipTextOn: { color: colors.night, fontWeight: '700' },
  card: {
    padding: 14,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    gap: 8,
  },
  cardTitle: { color: colors.cream, fontSize: 17, fontWeight: '600' },
  cardSub: { color: colors.muted, marginTop: 2, fontSize: 13 },
  body: { color: colors.cream, lineHeight: 22, fontSize: 15 },
  empty: { color: colors.muted, textAlign: 'center', padding: 16 },
});
