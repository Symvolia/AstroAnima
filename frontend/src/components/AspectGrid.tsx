import { StyleSheet, Text, View } from 'react-native';
import { tAspect, tPlanet, useI18n } from '../i18n';
import { colors, radii } from '../theme';
import type { Aspect } from '../types';

export function AspectGrid({ aspects }: { aspects: Aspect[] }) {
  const { lang, copy } = useI18n();
  if (!aspects.length) {
    return <Text style={styles.empty}>{copy.natal.noAspects}</Text>;
  }

  return (
    <View style={styles.list}>
      {aspects.map((a, i) => (
        <View key={`${a.planetA}-${a.planetB}-${i}`} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: a.harmonious ? colors.harmonious : colors.tense }]} />
          <View style={styles.body}>
            <Text style={styles.title}>
              {tPlanet(a.planetA, lang)} · {tAspect(a.type, lang)} · {tPlanet(a.planetB, lang)}
            </Text>
            <Text style={styles.desc}>{a.description}</Text>
            <Text style={styles.orb}>orb {a.orb}°</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  row: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  body: { flex: 1 },
  title: { color: colors.cream, fontWeight: '600' },
  desc: { color: colors.muted, marginTop: 4, fontSize: 13, lineHeight: 18 },
  orb: { color: colors.gold, marginTop: 4, fontSize: 12 },
  empty: { color: colors.muted, textAlign: 'center', padding: 16 },
});
