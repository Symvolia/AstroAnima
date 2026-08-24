import { StyleSheet, Text, View } from 'react-native';
import { useI18n } from '../i18n';
import { colors, radii } from '../theme';
import type { DailyReading } from '../types';

export function DailyInsight({ reading }: { reading: DailyReading }) {
  const { copy } = useI18n();
  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>{copy.home.insight}</Text>
      <Text style={styles.body}>{reading.general}</Text>
      <View style={styles.luck}>
        <Text style={styles.luckItem}>
          {copy.reading.number} {reading.luckyNumber}
        </Text>
        <Text style={styles.luckItem}>
          {copy.reading.color} {reading.luckyColor}
        </Text>
        <Text style={styles.luckItem}>{reading.bestMoment}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 10,
  },
  kicker: { color: colors.gold, letterSpacing: 1.4, fontSize: 11, textTransform: 'uppercase' },
  body: { color: colors.cream, lineHeight: 22, fontSize: 15 },
  luck: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  luckItem: {
    color: colors.night,
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    fontSize: 12,
    overflow: 'hidden',
  },
});
