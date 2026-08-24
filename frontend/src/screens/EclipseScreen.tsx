import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { useI18n } from '../i18n';
import { astronomyService } from '../services/astronomyService';
import { colors, radii } from '../theme';

export function EclipseScreen() {
  const { copy, locale, lang } = useI18n();
  const eclipses = useMemo(() => astronomyService.eclipses(new Date(), lang), [lang]);

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sub}>{copy.eclipse.lead}</Text>
          {eclipses.map((e) => (
            <View key={`${e.type}-${e.peak}`} style={styles.card}>
              <Text style={styles.kicker}>
                {e.type === 'lunare' ? copy.eclipse.lunar : copy.eclipse.solar} · {e.kind}
              </Text>
              <Text style={styles.date}>
                {new Date(e.peak).toLocaleString(locale, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text style={styles.body}>{e.detail}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 48, gap: 12 },
  title: { color: colors.cream, fontSize: 28, fontFamily: 'Georgia' },
  sub: { color: colors.muted, lineHeight: 20, marginBottom: 8 },
  card: {
    padding: 16,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    gap: 6,
  },
  kicker: { color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 11 },
  date: { color: colors.cream, fontSize: 18, fontFamily: 'Georgia', textTransform: 'capitalize' },
  body: { color: colors.muted, lineHeight: 20 },
});
