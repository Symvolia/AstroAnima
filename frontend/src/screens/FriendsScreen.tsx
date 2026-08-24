import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BirthDataForm, emptyChartDraft, toChartInput } from '../components/BirthDataForm';
import { CosmicBackground } from '../components/CosmicBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { UpdateCard } from '../components/UpdateCard';
import { tPlanet, tSign, useI18n } from '../i18n';
import { synastryNote } from '../i18n/sky';
import { buildNatalFromInput } from '../services/astrologService';
import { useStore } from '../store/useStore';
import { colors, radii } from '../theme';
import type { NatalChart } from '../types';
import { calculateSynastry } from '../utils/aspectCalculations';

export function FriendsScreen() {
  const { copy, lang } = useI18n();
  const profile = useStore((s) => s.profile);
  const natal = useStore((s) => s.natal);
  const [draft, setDraft] = useState(() => emptyChartDraft());
  const [other, setOther] = useState<NatalChart | null>(null);
  const [label, setLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    const input = toChartInput(draft);
    if (!input) {
      setError(copy.friends.error);
      return;
    }
    setError(null);
    setOther(buildNatalFromInput(input));
    setLabel(input.name.trim() || copy.friends.unnamed);
  };

  const result = useMemo(() => {
    if (!natal || !other) return null;
    const aspects = calculateSynastry(natal.planets, other.planets, lang);
    const harmonious = aspects.filter((a) => a.harmonious).length;
    const tense = aspects.filter((a) => !a.harmonious).length;
    const sunA = natal.planets.find((p) => p.id === 'sun')?.sign ?? profile?.solarSign ?? '';
    const sunB = other.planets.find((p) => p.id === 'sun')?.sign ?? '';
    const moonA = natal.planets.find((p) => p.id === 'moon')?.sign ?? '';
    const moonB = other.planets.find((p) => p.id === 'moon')?.sign ?? '';
    const note = synastryNote(sunA, sunB, moonA, moonB, harmonious, tense, lang);
    return { aspects, harmonious, tense, sunA, sunB, moonA, moonB, note };
  }, [natal, other, lang, profile?.solarSign]);

  const mineAsc = natal?.ascendant ? tSign(natal.ascendant.sign, lang) : copy.profile.unknownAsc;
  const otherAsc = other?.ascendant ? tSign(other.ascendant.sign, lang) : copy.profile.unknownAsc;

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ScreenHeader title={copy.friends.title} lead={copy.friends.lead} withLanguage={false} />

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

          <Pressable accessibilityRole="button" onPress={calculate} style={styles.cta}>
            <Text style={styles.ctaText}>{copy.friends.calculate}</Text>
          </Pressable>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {result && natal && other ? (
            <>
              <Text style={styles.section}>{copy.friends.placements}</Text>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.kicker}>{copy.friends.yours}</Text>
                  <Text style={styles.place}>
                    {copy.profile.sun} {tSign(result.sunA, lang)}
                  </Text>
                  <Text style={styles.place}>
                    {copy.profile.moon} {tSign(result.moonA, lang)}
                  </Text>
                  <Text style={styles.place}>
                    {copy.profile.asc} {mineAsc}
                  </Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.kicker}>{copy.friends.theirs(label)}</Text>
                  <Text style={styles.place}>
                    {copy.profile.sun} {tSign(result.sunB, lang)}
                  </Text>
                  <Text style={styles.place}>
                    {copy.profile.moon} {tSign(result.moonB, lang)}
                  </Text>
                  <Text style={styles.place}>
                    {copy.profile.asc} {otherAsc}
                  </Text>
                </View>
              </View>

              <View style={styles.score}>
                <Text style={styles.scoreItem}>
                  {copy.friends.flow} {result.harmonious}
                </Text>
                <Text style={styles.scoreItem}>
                  {copy.friends.friction} {result.tense}
                </Text>
              </View>

              <UpdateCard kicker={copy.friends.bond} body={result.note.bond} />
              <UpdateCard kicker={copy.friends.desire} body={result.note.desire} />

              <Text style={styles.section}>{copy.friends.synastry}</Text>
              {result.aspects.length === 0 ? (
                <Text style={styles.muted}>{copy.friends.none}</Text>
              ) : (
                result.aspects.slice(0, 8).map((asp, i) => (
                  <UpdateCard
                    key={`${asp.planetA}-${asp.planetB}-${i}`}
                    kicker={`${tPlanet(asp.planetA, lang)}  ·  ${tPlanet(asp.planetB, lang)}`}
                    body={asp.description}
                    meta={`${asp.orb.toFixed(1)}°`}
                    tone={asp.harmonious ? 'flow' : 'tension'}
                  />
                ))
              )}
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 48, gap: 12 },
  cta: {
    backgroundColor: colors.gold,
    borderRadius: radii.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: { color: colors.night, fontWeight: '700' },
  error: { color: colors.tense },
  section: { color: colors.cream, fontSize: 18, fontFamily: 'Georgia', marginTop: 8 },
  row: { flexDirection: 'row', gap: 10 },
  col: {
    flex: 1,
    padding: 14,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    gap: 6,
  },
  kicker: { color: colors.gold, letterSpacing: 1.2, fontSize: 11, textTransform: 'uppercase' },
  place: { color: colors.cream, lineHeight: 20 },
  score: { flexDirection: 'row', gap: 12 },
  scoreItem: { color: colors.goldSoft, fontSize: 15 },
  muted: { color: colors.muted, lineHeight: 20 },
});
