import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { NatalSignCard } from '../components/NatalSignCard';
import { tArea, tLevel, useI18n } from '../i18n';
import { isFirebaseConfigured } from '../services/firebase';
import { useStore } from '../store/useStore';
import { colors, radii } from '../theme';
import { formatDateIT } from '../utils/dateFormat';

export function ProfileScreen() {
  const { copy, lang } = useI18n();
  const profile = useStore((s) => s.profile);
  const natal = useStore((s) => s.natal);
  const logoutLocal = useStore((s) => s.logoutLocal);

  if (!profile) return null;
  const moon = natal?.planets.find((p) => p.id === 'moon');

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <NatalSignCard
            sunSign={profile.solarSign}
            moonSign={moon?.sign}
            ascSign={natal?.ascendant?.sign}
          />

          <View style={styles.card}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.line}>
              {copy.profile.born} {formatDateIT(profile.birthDate)}
              {profile.birthTime ? ` ${copy.profile.at} ${profile.birthTime}` : ` (${copy.profile.unknownTime})`}
            </Text>
            <Text style={styles.line}>
              {profile.birthPlace.name}, {profile.birthPlace.country}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.kicker}>{copy.profile.prefs}</Text>
            <Text style={styles.line}>
              {copy.profile.notify} {profile.notificationHour.toString().padStart(2, '0')}:
              {profile.notificationMinute.toString().padStart(2, '0')}
            </Text>
            <Text style={styles.line}>
              {copy.profile.level} {tLevel(profile.level, lang)}
            </Text>
            <Text style={styles.line}>
              {copy.profile.interests}: {profile.interests.map((id) => tArea(id, lang)).join(', ')}
            </Text>
            <Text style={styles.line}>
              {copy.profile.account}: {isFirebaseConfigured ? copy.profile.firebase : copy.profile.local}
            </Text>
          </View>
          <Pressable style={styles.danger} onPress={() => void logoutLocal()}>
            <Text style={styles.dangerText}>{copy.profile.reset}</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 48, gap: 12 },
  card: {
    padding: 16,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    gap: 6,
  },
  name: { color: colors.goldSoft, fontSize: 24, fontFamily: 'Georgia' },
  kicker: { color: colors.gold, letterSpacing: 1.2, textTransform: 'uppercase', fontSize: 11 },
  line: { color: colors.cream, lineHeight: 22 },
  danger: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.tense,
    borderRadius: radii.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dangerText: { color: colors.tense, fontWeight: '600' },
});
