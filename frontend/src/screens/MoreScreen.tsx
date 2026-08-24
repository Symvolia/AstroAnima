import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { NatalSignCard } from '../components/NatalSignCard';
import { tSign, useI18n } from '../i18n';
import { useStore } from '../store/useStore';
import { colors, radii } from '../theme';

export function MoreScreen() {
  const navigation = useNavigation<any>();
  const { copy, lang } = useI18n();
  const profile = useStore((s) => s.profile);
  const natal = useStore((s) => s.natal);
  const links = [
    { route: 'Friends', title: copy.more.friends, subtitle: copy.more.friendsSub },
    { route: 'Meanings', title: copy.more.meanings, subtitle: copy.more.meaningsSub },
    { route: 'SkyMap', title: copy.more.sky, subtitle: copy.more.skySub },
    { route: 'Eclipse', title: copy.more.eclipse, subtitle: copy.more.eclipseSub },
    { route: 'Wisdom', title: copy.more.wisdom, subtitle: copy.more.wisdomSub },
    {
      route: 'Profile',
      title: copy.more.profile,
      subtitle: profile
        ? copy.home.natalSun(tSign(profile.solarSign, lang))
        : copy.more.profileSub,
    },
  ];
  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader title={copy.more.title} />
          {profile ? (
            <NatalSignCard
              sunSign={profile.solarSign}
              moonSign={natal?.planets.find((p) => p.id === 'moon')?.sign}
              ascSign={natal?.ascendant?.sign}
              onPress={() => navigation.navigate('Profile')}
            />
          ) : null}
          {links.map((item) => (
            <Pressable key={item.route} style={styles.card} onPress={() => navigation.navigate(item.route)}>
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.subtitle}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, gap: 12 },
  card: {
    padding: 16,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { color: colors.cream, fontSize: 18 },
  cardSub: { color: colors.muted, marginTop: 4 },
  arrow: { color: colors.gold, fontSize: 20 },
});
