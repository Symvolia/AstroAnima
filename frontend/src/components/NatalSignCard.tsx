import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ZODIAC_SIGNS } from '../constants/zodiacSigns';
import { signDates, signDescription } from '../i18n/bodies';
import { tElement, tMode, tSign, useI18n } from '../i18n';
import { colors, radii } from '../theme';

export function NatalSignCard({
  sunSign,
  moonSign,
  ascSign,
  onPress,
}: {
  sunSign: string;
  moonSign?: string | null;
  ascSign?: string | null;
  onPress?: () => void;
}) {
  const { copy, lang } = useI18n();
  const meta = ZODIAC_SIGNS.find((s) => s.name === sunSign || s.id === sunSign);
  if (!meta) return null;

  const inner = (
    <>
      <Text style={styles.kicker}>{copy.home.natalSign}</Text>
      <Text style={styles.name}>{tSign(meta.name, lang)}</Text>
      <Text style={styles.meta}>
        {copy.home.natalSun(tSign(meta.name, lang))}
        {'  ·  '}
        {tElement(meta.element, lang)}
        {'  ·  '}
        {tMode(meta.modality, lang)}
        {'  ·  '}
        {signDates(meta.id, lang)}
      </Text>
      {moonSign ? <Text style={styles.line}>{copy.home.natalMoon(tSign(moonSign, lang))}</Text> : null}
      <Text style={styles.line}>
        {ascSign ? copy.home.natalAsc(tSign(ascSign, lang)) : copy.home.natalAscUnknown}
      </Text>
      <Text style={styles.body}>{signDescription(meta.id, lang)}</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
        {inner}
      </Pressable>
    );
  }

  return <View style={styles.card}>{inner}</View>;
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.surface,
    gap: 6,
  },
  kicker: { color: colors.gold, letterSpacing: 1.6, fontSize: 11, textTransform: 'uppercase' },
  name: { color: colors.cream, fontSize: 34, fontFamily: 'Georgia', lineHeight: 40 },
  meta: { color: colors.goldSoft, fontSize: 13, lineHeight: 18 },
  line: { color: colors.cream, fontSize: 15, lineHeight: 22 },
  body: { color: colors.muted, lineHeight: 22, fontSize: 15, marginTop: 4 },
});
