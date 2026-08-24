import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { CosmicLoader } from '../components/CosmicLoader';
import { DailyInsight } from '../components/DailyInsight';
import { LanguageToggle } from '../components/LanguageToggle';
import { MoonPhaseWidget } from '../components/MoonPhaseWidget';
import { NatalSignCard } from '../components/NatalSignCard';
import { SunMoonTracker } from '../components/SunMoonTracker';
import { planetNature } from '../i18n/bodies';
import { tPlanet } from '../i18n/catalog';
import { useI18n } from '../i18n';
import { useStore } from '../store/useStore';
import { colors, radii } from '../theme';

function greeting(name: string, hour: number, copy: ReturnType<typeof useI18n>['copy']) {
  if (hour < 12) return copy.home.greetingDawn(name);
  if (hour < 18) return copy.home.greetingDay(name);
  return copy.home.greetingDusk(name);
}

function toneColor(tone: 'green' | 'yellow' | 'red') {
  if (tone === 'green') return colors.green;
  if (tone === 'yellow') return colors.yellow;
  return colors.red;
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { copy, locale } = useI18n();
  const profile = useStore((s) => s.profile);
  const natal = useStore((s) => s.natal);
  const sky = useStore((s) => s.sky);
  const reading = useStore((s) => s.reading);
  const loadingSky = useStore((s) => s.loadingSky);
  const refreshSky = useStore((s) => s.refreshSky);
  const lang = useStore((s) => s.language);

  useEffect(() => {
    void refreshSky();
    void (async () => {
      try {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (perm.status !== 'granted') return;
        const pos = await Promise.race([
          Location.getCurrentPositionAsync({}),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('geo-timeout')), 4000)),
        ]);
        await refreshSky({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      } catch {
        /* keep sky based on birth place */
      }
    })();
  }, [refreshSky, lang]);

  if (!profile) return null;

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.top}>
            <Text style={styles.date}>
              {new Date().toLocaleDateString(locale, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
            <LanguageToggle />
          </View>
          <Text style={styles.hello}>{greeting(profile.name, new Date().getHours(), copy)}</Text>

          <NatalSignCard
            sunSign={profile.solarSign}
            moonSign={natal?.planets.find((p) => p.id === 'moon')?.sign}
            ascSign={natal?.ascendant?.sign}
            onPress={() => navigation.navigate('Chart')}
          />

          <View style={styles.shortcuts}>
            <Pressable
              accessibilityRole="button"
              style={styles.shortcut}
              onPress={() => navigation.navigate('Chart')}
            >
              <Text style={styles.shortcutTitle}>{copy.home.shortcutChart}</Text>
              <Text style={styles.shortcutSub}>{copy.home.shortcutChartSub}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.shortcut}
              onPress={() => navigation.navigate('Meanings')}
            >
              <Text style={styles.shortcutTitle}>{copy.home.shortcutMeanings}</Text>
              <Text style={styles.shortcutSub}>{copy.home.shortcutMeaningsSub}</Text>
            </Pressable>
          </View>

          {loadingSky && !sky ? <CosmicLoader label={copy.loader} /> : null}
          {sky ? (
            <>
              <MoonPhaseWidget moon={sky.moon} />
              <SunMoonTracker sun={sky.sun} />

              <View style={styles.energy}>
                <Text style={styles.kicker}>{copy.home.energy}</Text>
                <Text style={styles.energyNum}>{sky.energy}/10</Text>
                <View style={styles.bar}>
                  <View style={[styles.barFill, { width: `${sky.energy * 10}%` }]} />
                </View>
              </View>

              <Text style={styles.section}>{copy.home.areas}</Text>
              {sky.lifeAreas.map((area) => (
                <View key={area.id} style={styles.area}>
                  <View style={styles.areaTop}>
                    <Text style={styles.areaTitle}>{area.label}</Text>
                    <Text style={styles.areaScore}>{area.score}/10</Text>
                  </View>
                  <View style={styles.bar}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${area.score * 10}%`, backgroundColor: toneColor(area.tone) },
                      ]}
                    />
                  </View>
                  <Text style={styles.areaPhrase}>{area.phrase}</Text>
                </View>
              ))}

              <View style={styles.planetDay}>
                <Text style={styles.kicker}>{copy.home.planetOfDay}</Text>
                <Text style={styles.planetName}>{tPlanet(sky.planetOfDay.id, lang)}</Text>
                <Text style={styles.body}>{sky.planetOfDay.reason}</Text>
                <Text style={styles.bodyMuted}>{planetNature(sky.planetOfDay.id, lang)}</Text>
              </View>

              {reading ? <DailyInsight reading={reading} /> : null}

              <Text style={styles.section}>{copy.home.events}</Text>
              {sky.upcoming.map((ev, i) => (
                <Pressable key={`${ev.title}-${i}`} style={styles.event} onPress={() => navigation.navigate('Eclipse')}>
                  <Text style={styles.eventTitle}>{ev.title}</Text>
                  <Text style={styles.eventDate}>
                    {new Date(ev.date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Text>
                  <Text style={styles.bodyMuted}>{ev.detail}</Text>
                </Pressable>
              ))}
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 48, gap: 14 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  date: { color: colors.gold, textTransform: 'capitalize', letterSpacing: 0.4, flex: 1 },
  hello: { color: colors.cream, fontSize: 26, fontFamily: 'Georgia', lineHeight: 32 },
  shortcuts: { gap: 10 },
  shortcut: {
    padding: 14,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
  },
  shortcutTitle: { color: colors.goldSoft, fontSize: 16, fontWeight: '600' },
  shortcutSub: { color: colors.muted, marginTop: 4, fontSize: 13 },
  energy: {
    padding: 16,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
  },
  kicker: { color: colors.gold, letterSpacing: 1.4, fontSize: 11, textTransform: 'uppercase' },
  energyNum: { color: colors.cream, fontSize: 36, fontFamily: 'Georgia', marginVertical: 4 },
  bar: { height: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.gold, borderRadius: 8 },
  section: { color: colors.cream, fontSize: 18, marginTop: 8, fontFamily: 'Georgia' },
  area: {
    padding: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    gap: 6,
  },
  areaTop: { flexDirection: 'row', justifyContent: 'space-between' },
  areaTitle: { color: colors.cream, fontWeight: '600' },
  areaScore: { color: colors.gold },
  areaPhrase: { color: colors.muted, fontSize: 13 },
  planetDay: {
    padding: 16,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    gap: 6,
  },
  planetName: { color: colors.cream, fontSize: 22, fontFamily: 'Georgia' },
  body: { color: colors.cream, lineHeight: 20 },
  bodyMuted: { color: colors.muted, lineHeight: 20 },
  event: {
    padding: 14,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    gap: 4,
  },
  eventTitle: { color: colors.cream, fontWeight: '600' },
  eventDate: { color: colors.gold, fontSize: 13 },
});
