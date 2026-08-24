import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { CosmicLoader } from '../components/CosmicLoader';
import { LanguageToggle } from '../components/LanguageToggle';
import { MoonPhaseWidget } from '../components/MoonPhaseWidget';
import { NatalSignCard } from '../components/NatalSignCard';
import { SunMoonTracker } from '../components/SunMoonTracker';
import { UpdateCard } from '../components/UpdateCard';
import { planetNature } from '../i18n/bodies';
import { tPlanet } from '../i18n/catalog';
import { useI18n } from '../i18n';
import { buildHomeFeed } from '../services/homeFeed';
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
  const { copy, locale, lang } = useI18n();
  const profile = useStore((s) => s.profile);
  const natal = useStore((s) => s.natal);
  const sky = useStore((s) => s.sky);
  const reading = useStore((s) => s.reading);
  const loadingSky = useStore((s) => s.loadingSky);
  const refreshSky = useStore((s) => s.refreshSky);

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

  const feed = useMemo(
    () => (sky ? buildHomeFeed(sky, reading, copy, lang) : null),
    [sky, reading, copy, lang],
  );

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

          {loadingSky && !sky ? <CosmicLoader label={copy.loader} /> : null}
          {sky && feed ? (
            <>
              <UpdateCard kicker={copy.home.insight} body={feed.headline} />

              <Text style={styles.section}>{copy.home.updates}</Text>
              {feed.updates.map((card) => (
                <UpdateCard key={card.id} kicker={card.kicker} body={card.body} tone={card.tone} />
              ))}
              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('Reading')}
                style={styles.link}
              >
                <Text style={styles.linkText}>{copy.home.seeReading}</Text>
              </Pressable>

              <Text style={styles.section}>{copy.home.transits}</Text>
              {feed.transits.length === 0 ? (
                <Text style={styles.bodyMuted}>{copy.home.emptyTransits}</Text>
              ) : (
                feed.transits.map((card) => (
                  <UpdateCard
                    key={card.id}
                    kicker={card.kicker}
                    body={card.body}
                    meta={card.meta}
                    tone={card.tone}
                  />
                ))
              )}

              <View style={styles.split}>
                <View style={styles.half}>
                  <Text style={styles.kicker}>{copy.home.favor}</Text>
                  {feed.favor.map((line) => (
                    <Text key={line} style={styles.counsel}>
                      {line}
                    </Text>
                  ))}
                </View>
                <View style={styles.half}>
                  <Text style={styles.kicker}>{copy.home.withhold}</Text>
                  {feed.withhold.map((line) => (
                    <Text key={line} style={styles.counsel}>
                      {line}
                    </Text>
                  ))}
                </View>
              </View>

              {feed.retrogrades.length > 0 ? (
                <View style={styles.planetDay}>
                  <Text style={styles.kicker}>{copy.home.retrogrades}</Text>
                  <Text style={styles.body}>{feed.retrogrades.join('  ·  ')}</Text>
                </View>
              ) : null}

              {reading ? (
                <View style={styles.planetDay}>
                  <Text style={styles.kicker}>{copy.home.timing}</Text>
                  <Text style={styles.body}>
                    {copy.reading.moment} {reading.bestMoment}
                    {'  ·  '}
                    {copy.reading.number} {reading.luckyNumber}
                    {'  ·  '}
                    {copy.reading.color} {reading.luckyColor}
                  </Text>
                </View>
              ) : null}

              <MoonPhaseWidget moon={sky.moon} />
              <SunMoonTracker sun={sky.sun} />

              <View style={styles.energy}>
                <Text style={styles.kicker}>{copy.home.energy}</Text>
                <Text style={styles.energyNum}>{sky.energy}/10</Text>
                <View style={styles.bar}>
                  <View style={[styles.barFill, { width: `${sky.energy * 10}%` }]} />
                </View>
                <View style={styles.areaRow}>
                  {sky.lifeAreas.map((area) => (
                    <View key={area.id} style={styles.areaChip}>
                      <Text style={styles.areaChipTitle}>{area.label}</Text>
                      <Text style={[styles.areaChipScore, { color: toneColor(area.tone) }]}>{area.score}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.planetDay}>
                <Text style={styles.kicker}>{copy.home.planetOfDay}</Text>
                <Text style={styles.planetName}>{tPlanet(sky.planetOfDay.id, lang)}</Text>
                <Text style={styles.body}>{sky.planetOfDay.reason}</Text>
                <Text style={styles.bodyMuted}>{planetNature(sky.planetOfDay.id, lang)}</Text>
              </View>

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

          <View style={styles.shortcuts}>
            <Pressable
              accessibilityRole="button"
              style={styles.shortcut}
              onPress={() => navigation.navigate('Friends')}
            >
              <Text style={styles.shortcutTitle}>{copy.home.compare}</Text>
              <Text style={styles.shortcutSub}>{copy.home.compareSub}</Text>
            </Pressable>
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
  shortcuts: { gap: 10, marginTop: 4 },
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
    gap: 8,
  },
  kicker: { color: colors.gold, letterSpacing: 1.4, fontSize: 11, textTransform: 'uppercase' },
  energyNum: { color: colors.cream, fontSize: 36, fontFamily: 'Georgia', marginVertical: 4 },
  bar: { height: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: colors.gold, borderRadius: 8 },
  section: { color: colors.cream, fontSize: 18, marginTop: 8, fontFamily: 'Georgia' },
  areaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  areaChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    minWidth: 72,
  },
  areaChipTitle: { color: colors.muted, fontSize: 11, textTransform: 'uppercase' },
  areaChipScore: { color: colors.cream, fontSize: 16, fontFamily: 'Georgia', marginTop: 2 },
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
  split: { flexDirection: 'row', gap: 10 },
  half: {
    flex: 1,
    padding: 14,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    gap: 8,
  },
  counsel: { color: colors.cream, fontSize: 14, lineHeight: 20 },
  link: { paddingVertical: 2 },
  linkText: { color: colors.goldSoft },
});
