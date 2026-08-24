import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BirthDataForm, emptyChartDraft, toChartInput } from '../components/BirthDataForm';
import { CosmicBackground } from '../components/CosmicBackground';
import { NatalChartView } from '../components/NatalChartView';
import { NatalSignCard } from '../components/NatalSignCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { tSign, useI18n } from '../i18n';
import { buildNatalFromInput, explainBigThree } from '../services/astrologService';
import { useStore } from '../store/useStore';
import { colors, radii } from '../theme';
import type { NatalChart } from '../types';

export function BirthChartScreen() {
  const navigation = useNavigation<any>();
  const { copy, lang } = useI18n();
  const profile = useStore((s) => s.profile);
  const natal = useStore((s) => s.natal);
  const [draft, setDraft] = useState(() =>
    emptyChartDraft(
      profile
        ? {
            name: profile.name,
            birthDate: profile.birthDate,
            birthTime: profile.birthTime,
            unknownBirthTime: profile.unknownBirthTime,
            birthPlace: profile.birthPlace,
          }
        : undefined,
    ),
  );
  const [chart, setChart] = useState<NatalChart | null>(natal);
  const [label, setLabel] = useState(profile?.name ?? 'Tema');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (natal && profile) {
      setChart(natal);
      setLabel(profile.name);
    }
  }, [natal, profile]);

  const calculate = () => {
    const input = toChartInput(draft);
    if (!input) {
      setError(copy.chart.error);
      return;
    }
    setError(null);
    setChart(buildNatalFromInput(input));
    setLabel(input.name);
  };

  const fillMine = () => {
    if (!profile) return;
    setDraft(
      emptyChartDraft({
        name: profile.name,
        birthDate: profile.birthDate,
        birthTime: profile.birthTime,
        unknownBirthTime: profile.unknownBirthTime,
        birthPlace: profile.birthPlace,
      }),
    );
    setError(null);
    setChart(natal);
    setLabel(profile.name);
  };

  const story = useMemo(() => (chart ? explainBigThree(chart, label, lang) : null), [chart, label, lang]);
  const sunSign = chart?.planets.find((p) => p.id === 'sun')?.sign ?? profile?.solarSign;
  const moonSign = chart?.planets.find((p) => p.id === 'moon')?.sign;
  const ascSign = chart?.ascendant?.sign;

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ScreenHeader title={copy.chart.title} lead={copy.chart.lead} />

          {sunSign ? (
            <NatalSignCard sunSign={sunSign} moonSign={moonSign} ascSign={ascSign} />
          ) : null}

          <BirthDataForm
            name={draft.name}
            date={draft.date}
            time={draft.time}
            unknownTime={draft.unknownTime}
            query={draft.query}
            place={draft.place}
            onName={(name) => setDraft((d) => ({ ...d, name }))}
            onDate={(date) => setDraft((d) => ({ ...d, date }))}
            onTime={(time) => setDraft((d) => ({ ...d, time }))}
            onUnknownTime={(unknownTime) => setDraft((d) => ({ ...d, unknownTime }))}
            onQuery={(query) => setDraft((d) => ({ ...d, query }))}
            onPlace={(place) => setDraft((d) => ({ ...d, place }))}
          />

          <View style={styles.actions}>
            <Pressable accessibilityRole="button" onPress={calculate} style={styles.cta}>
              <Text style={styles.ctaText}>{copy.chart.calculate}</Text>
            </Pressable>
            {profile ? (
              <Pressable accessibilityRole="button" onPress={fillMine} style={styles.ghost}>
                <Text style={styles.ghostText}>{copy.chart.useMine}</Text>
              </Pressable>
            ) : null}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Meanings')} style={styles.link}>
            <Text style={styles.linkText}>{copy.chart.guide}</Text>
          </Pressable>

          {story ? (
            <View style={styles.story}>
              <Text style={styles.storyKicker}>{copy.chart.simple}</Text>
              {story.sun ? (
                <View style={styles.storyCard}>
                  <Text style={styles.storyTitle}>{story.sun.title}</Text>
                  <Text style={styles.storyBody}>{story.sun.body}</Text>
                </View>
              ) : null}
              {story.moon ? (
                <View style={styles.storyCard}>
                  <Text style={styles.storyTitle}>{story.moon.title}</Text>
                  <Text style={styles.storyBody}>{story.moon.body}</Text>
                </View>
              ) : null}
              <View style={styles.storyCard}>
                <Text style={styles.storyTitle}>{story.ascendant.title}</Text>
                <Text style={styles.storyBody}>{story.ascendant.body}</Text>
              </View>
              {story.extras.map((line) => (
                <Text key={line} style={styles.extra}>
                  {line}
                </Text>
              ))}
            </View>
          ) : null}

          {chart ? (
            <NatalChartView
              chart={chart}
              headline={label === 'Tema' || label === copy.chart.computed ? copy.chart.computed : copy.chart.of(label)}
              subtitle={
                chart.ascendant
                  ? copy.chart.sunMoonAsc(
                      tSign(chart.planets.find((p) => p.id === 'sun')?.sign ?? '', lang),
                      tSign(chart.planets.find((p) => p.id === 'moon')?.sign ?? '', lang),
                      tSign(chart.ascendant.sign, lang),
                    )
                  : copy.chart.sunMoonAsc(
                      tSign(chart.planets.find((p) => p.id === 'sun')?.sign ?? '', lang),
                      tSign(chart.planets.find((p) => p.id === 'moon')?.sign ?? '', lang),
                    )
              }
            />
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 48, gap: 12 },
  title: { color: colors.cream, fontSize: 28, fontFamily: 'Georgia' },
  lead: { color: colors.muted, lineHeight: 22, fontSize: 15 },
  actions: { gap: 10, marginTop: 8 },
  cta: {
    backgroundColor: colors.gold,
    borderRadius: radii.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: { color: colors.night, fontWeight: '700' },
  ghost: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.full,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ghostText: { color: colors.cream },
  error: { color: colors.tense },
  link: { paddingVertical: 4 },
  linkText: { color: colors.goldSoft, lineHeight: 20 },
  story: { gap: 8, marginTop: 4 },
  storyKicker: { color: colors.gold, letterSpacing: 1.2, fontSize: 11, textTransform: 'uppercase' },
  storyCard: {
    padding: 14,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    gap: 6,
  },
  storyTitle: { color: colors.cream, fontSize: 17, fontWeight: '600' },
  storyBody: { color: colors.muted, lineHeight: 20 },
  extra: { color: colors.cream, lineHeight: 20 },
});
