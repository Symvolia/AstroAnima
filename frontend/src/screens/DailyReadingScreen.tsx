import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { CosmicLoader } from '../components/CosmicLoader';
import { ScreenHeader } from '../components/ScreenHeader';
import { useI18n } from '../i18n';
import { useStore } from '../store/useStore';
import { colors, radii } from '../theme';

export function DailyReadingScreen() {
  const { copy } = useI18n();
  const reading = useStore((s) => s.reading);
  const profile = useStore((s) => s.profile);
  const loadingSky = useStore((s) => s.loadingSky);
  const source = reading ? (reading.source === 'openai' ? copy.reading.ai : copy.reading.local) : '';

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader
            title={copy.reading.title}
            lead={
              profile
                ? copy.reading.for(profile.name, reading?.date ?? '', source)
                : undefined
            }
          />
          {loadingSky && !reading ? <CosmicLoader label={copy.reading.weaving} /> : null}
          {reading ? (
            <>
              <Block title={copy.reading.general} body={reading.general} />
              <Block title={copy.reading.love} body={reading.love} />
              <Block title={copy.reading.work} body={reading.work} />
              <Block title={copy.reading.health} body={reading.health} />
              <Block title={copy.reading.spirit} body={reading.spiritual} />
              <View style={styles.luckRow}>
                <Luck label={copy.reading.number} value={String(reading.luckyNumber)} />
                <Luck label={copy.reading.color} value={reading.luckyColor} />
                <Luck label={copy.reading.moment} value={reading.bestMoment} />
              </View>
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.block}>
      <Text style={styles.kicker}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

function Luck({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.luck}>
      <Text style={styles.luckLabel}>{label}</Text>
      <Text style={styles.luckValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 48, gap: 12 },
  block: {
    padding: 16,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    gap: 8,
  },
  kicker: { color: colors.gold, letterSpacing: 1.2, textTransform: 'uppercase', fontSize: 11 },
  body: { color: colors.cream, lineHeight: 22, fontSize: 15 },
  luckRow: { flexDirection: 'row', gap: 8 },
  luck: {
    flex: 1,
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  luckLabel: { color: colors.muted, fontSize: 11, textTransform: 'uppercase' },
  luckValue: { color: colors.goldSoft, marginTop: 4, textTransform: 'capitalize' },
});
