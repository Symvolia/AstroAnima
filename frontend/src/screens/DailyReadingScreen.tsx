import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { CosmicLoader } from '../components/CosmicLoader';
import { ScreenHeader } from '../components/ScreenHeader';
import { UpdateCard } from '../components/UpdateCard';
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
              <UpdateCard kicker={copy.reading.general} body={reading.general} />
              <UpdateCard kicker={copy.reading.love} body={reading.love} />
              <UpdateCard kicker={copy.reading.work} body={reading.work} />
              <UpdateCard kicker={copy.reading.health} body={reading.health} />
              <UpdateCard kicker={copy.reading.spirit} body={reading.spiritual} />
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
