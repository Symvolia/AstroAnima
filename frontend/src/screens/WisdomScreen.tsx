import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { WisdomCard } from '../components/WisdomCard';
import { WISDOM } from '../constants/wisdom';
import { useI18n } from '../i18n';
import { colors } from '../theme';

export function WisdomScreen() {
  const { copy } = useI18n();
  const ofTheDay = useMemo(() => {
    const i = new Date().getDate() % WISDOM.length;
    return WISDOM[i];
  }, []);

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sub}>{copy.wisdom.lead}</Text>
          <WisdomCard item={ofTheDay} />
          {WISDOM.filter((w) => w.id !== ofTheDay.id).map((item) => (
            <WisdomCard key={item.id} item={item} />
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
  sub: { color: colors.muted, marginBottom: 4 },
});
