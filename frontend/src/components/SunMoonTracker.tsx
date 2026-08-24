import { StyleSheet, Text, View } from 'react-native';
import { tSign, useI18n } from '../i18n';
import { colors, radii } from '../theme';
import type { SunSnapshot } from '../types';

export function SunMoonTracker({ sun }: { sun: SunSnapshot }) {
  const { copy, lang } = useI18n();
  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>{copy.sun.kicker}</Text>
      <Text style={styles.title}>{copy.sun.inSign(tSign(sun.sign, lang))}</Text>
      <View style={styles.times}>
        <View>
          <Text style={styles.label}>{copy.sun.rise}</Text>
          <Text style={styles.value}>{sun.sunrise ?? '—'}</Text>
        </View>
        <View>
          <Text style={styles.label}>{copy.sun.set}</Text>
          <Text style={styles.value}>{sun.sunset ?? '—'}</Text>
        </View>
      </View>
      <Text style={styles.body}>{sun.solarEnergy}</Text>
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
    gap: 8,
  },
  kicker: { color: colors.gold, letterSpacing: 1.4, fontSize: 11, textTransform: 'uppercase' },
  title: { color: colors.cream, fontSize: 20, fontFamily: 'Georgia' },
  times: { flexDirection: 'row', gap: 28, marginVertical: 6 },
  label: { color: colors.muted, fontSize: 12 },
  value: { color: colors.goldSoft, fontSize: 18, marginTop: 2 },
  body: { color: colors.cream, lineHeight: 20 },
});
