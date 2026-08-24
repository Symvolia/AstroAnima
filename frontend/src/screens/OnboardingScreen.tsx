import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { CitySearchField } from '../components/CitySearchField';
import { DatePickerField, TimePickerField } from '../components/DateTimePickers';
import { LanguageToggle } from '../components/LanguageToggle';
import { NatalSignCard } from '../components/NatalSignCard';
import { tArea, tLevel, useI18n } from '../i18n';
import { useStore } from '../store/useStore';
import { solarSignFromDate } from '../utils/planetCalculations';
import { pad2, parseHm, parseIsoDate, toHm, toIsoDate } from '../utils/dateFormat';
import type { ExperienceLevel, GeoPlace, InterestTheme } from '../types';
import { colors, radii } from '../theme';

const INTERESTS = ['amore', 'lavoro', 'salute', 'spiritualita', 'finanze'] as const;

function pad(n: number) {
  return pad2(n);
}

export function OnboardingScreen() {
  const { copy, lang } = useI18n();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date(1994, 5, 12));
  const [birthTime, setBirthTime] = useState(new Date(2000, 0, 1, 12, 0));
  const [unknownTime, setUnknownTime] = useState(false);
  const [query, setQuery] = useState('');
  const [place, setPlace] = useState<GeoPlace | null>(null);
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [interests, setInterests] = useState<InterestTheme[]>(['amore', 'spiritualita']);
  const [level, setLevel] = useState<ExperienceLevel>('principiante');
  const [busy, setBusy] = useState(false);

  const solarSign = useMemo(() => solarSignFromDate(birthDate), [birthDate]);

  const canNext =
    (step === 0 && name.trim().length > 1 && Boolean(place)) ||
    step === 1 ||
    (step === 2 && interests.length > 0);

  const submit = async () => {
    if (!place) return;
    setBusy(true);
    await completeOnboarding({
      name: name.trim(),
      birthDate: `${birthDate.getFullYear()}-${pad(birthDate.getMonth() + 1)}-${pad(birthDate.getDate())}`,
      birthTime: unknownTime ? null : `${pad(birthTime.getHours())}:${pad(birthTime.getMinutes())}`,
      unknownBirthTime: unknownTime,
      birthPlace: place,
      solarSign,
      notificationHour: hour,
      notificationMinute: minute,
      interests,
      level,
    });
    setBusy(false);
  };

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.top}>
            <Text style={styles.brand}>{copy.onboarding.brand}</Text>
            <LanguageToggle />
          </View>
          <Text style={styles.step}>{copy.onboarding.step(step + 1)}</Text>

            {step === 0 ? (
              <View style={styles.block}>
                <Text style={styles.title}>{copy.onboarding.birthTitle}</Text>
                <Text style={styles.label}>{copy.onboarding.name}</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={copy.onboarding.namePh}
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                />
                <Text style={styles.label}>{copy.onboarding.date}</Text>
                <DatePickerField
                  value={toIsoDate(birthDate)}
                  onChange={(iso) => setBirthDate(parseIsoDate(iso))}
                />
                {solarSign ? <NatalSignCard sunSign={solarSign} /> : null}
                <View style={styles.rowBetween}>
                  <Text style={styles.label}>{copy.onboarding.time}</Text>
                  <View style={styles.row}>
                    <Text style={styles.hint}>{copy.onboarding.unknown}</Text>
                    <Switch value={unknownTime} onValueChange={setUnknownTime} trackColor={{ true: colors.purple }} />
                  </View>
                </View>
                {!unknownTime ? (
                  <TimePickerField
                    value={toHm(birthTime)}
                    onChange={(hm) => {
                      const { hours, minutes } = parseHm(hm);
                      const next = new Date(birthTime);
                      next.setHours(hours, minutes, 0, 0);
                      setBirthTime(next);
                    }}
                  />
                ) : (
                  <Text style={styles.hint}>{copy.onboarding.noTime}</Text>
                )}
                <Text style={styles.label}>{copy.onboarding.place}</Text>
                <CitySearchField query={query} place={place} onQuery={setQuery} onPlace={setPlace} />
              </View>
            ) : null}

            {step === 1 ? (
              <View style={styles.block}>
                <Text style={styles.title}>{copy.onboarding.signTitle}</Text>
                <NatalSignCard sunSign={solarSign} />
              </View>
            ) : null}

            {step === 2 ? (
              <View style={styles.block}>
                <Text style={styles.title}>{copy.onboarding.prefsTitle}</Text>
                <Text style={styles.label}>{copy.onboarding.notify}</Text>
                <View style={styles.row}>
                  {[6, 7, 8, 9].map((h) => (
                    <Pressable
                      key={h}
                      onPress={() => {
                        setHour(h);
                        setMinute(0);
                      }}
                      style={[styles.chip, hour === h && styles.chipOn]}
                    >
                      <Text style={[styles.chipText, hour === h && styles.chipTextOn]}>{h}:00</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.label}>{copy.onboarding.interests}</Text>
                <View style={styles.wrap}>
                  {INTERESTS.map((id) => {
                    const on = interests.includes(id);
                    return (
                      <Pressable
                        key={id}
                        onPress={() =>
                          setInterests((prev) => (on ? prev.filter((i) => i !== id) : [...prev, id]))
                        }
                        style={[styles.chip, on && styles.chipOn]}
                      >
                        <Text style={[styles.chipText, on && styles.chipTextOn]}>{tArea(id, lang)}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Text style={styles.label}>{copy.onboarding.level}</Text>
                <View style={styles.wrap}>
                  {(['principiante', 'intermedio', 'avanzato'] as ExperienceLevel[]).map((lv) => (
                    <Pressable key={lv} onPress={() => setLevel(lv)} style={[styles.chip, level === lv && styles.chipOn]}>
                      <Text style={[styles.chipText, level === lv && styles.chipTextOn]}>{tLevel(lv, lang)}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={step < 2 ? copy.onboarding.next : copy.onboarding.enter}
              disabled={!canNext || busy}
              onPress={() => {
                if (step < 2) setStep(step + 1);
                else void submit();
              }}
              style={[styles.cta, (!canNext || busy) && styles.ctaOff]}
            >
              <Text style={styles.ctaText}>
                {step < 2 ? copy.onboarding.next : busy ? copy.onboarding.saving : copy.onboarding.enter}
              </Text>
            </Pressable>
            {step > 0 ? (
              <Pressable onPress={() => setStep(step - 1)}>
                <Text style={styles.back}>{copy.onboarding.back}</Text>
              </Pressable>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { padding: 24, paddingBottom: 48 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  brand: { color: colors.gold, letterSpacing: 4, textTransform: 'uppercase', flex: 1 },
  step: { color: colors.muted, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  block: { gap: 8 },
  title: { color: colors.cream, fontSize: 28, fontFamily: 'Georgia', marginBottom: 8 },
  label: { color: colors.goldSoft, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: 14,
    color: colors.cream,
    backgroundColor: colors.surface,
  },
  inputText: { color: colors.cream },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hint: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  suggest: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(212,175,55,0.12)' },
  suggestText: { color: colors.cream },
  signName: { color: colors.gold, fontSize: 32, textAlign: 'center', fontFamily: 'Georgia', marginVertical: 16 },
  dates: { color: colors.muted, textAlign: 'center' },
  body: { color: colors.cream, lineHeight: 24, fontSize: 16, marginTop: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { color: colors.cream },
  chipTextOn: { color: colors.night, fontWeight: '700' },
  cta: {
    marginTop: 28,
    backgroundColor: colors.gold,
    borderRadius: radii.full,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaOff: { opacity: 0.45 },
  ctaText: { color: colors.night, fontWeight: '700', letterSpacing: 0.6 },
  back: { color: colors.muted, textAlign: 'center', marginTop: 16 },
});
