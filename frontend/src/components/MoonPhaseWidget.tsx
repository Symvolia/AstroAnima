import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { isWaxing, tSign, useI18n } from '../i18n';
import type { MoonPhaseId } from '../i18n/types';
import { colors, radii } from '../theme';
import type { MoonSnapshot } from '../types';

function moonPath(illumination: number, waxing: boolean): string {
  const r = 36;
  const cx = 44;
  const cy = 44;
  const k = (illumination / 100) * 2 - 1;
  const sweep = waxing ? 1 : 0;
  const offset = k * r;
  return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${Math.abs(offset) || 1} ${r} 0 1 ${sweep} ${cx} ${cy - r}`;
}

export function MoonPhaseWidget({ moon }: { moon: MoonSnapshot }) {
  const { copy, lang } = useI18n();
  const waxing = isWaxing((moon.phaseId as MoonPhaseId) || 'full');
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Svg width={88} height={88}>
          <Circle cx={44} cy={44} r={36} fill="#050208" stroke={colors.gold} strokeWidth={1} />
          <Circle cx={44} cy={44} r={36} fill="#E4D4FF" opacity={0.12} />
          <Path d={moonPath(moon.illumination, waxing)} fill="#E4D4FF" opacity={0.92} />
        </Svg>
        <View style={styles.info}>
          <Text style={styles.kicker}>{copy.moon.kicker}</Text>
          <Text style={styles.title}>{moon.phaseName}</Text>
          <Text style={styles.stat}>{copy.moon.illum(moon.illumination, tSign(moon.sign, lang))}</Text>
        </View>
      </View>
      <Text style={styles.effect}>{moon.emotionalEffect}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 12,
  },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  info: { flex: 1 },
  kicker: { color: colors.gold, letterSpacing: 1.4, fontSize: 11, textTransform: 'uppercase' },
  title: { color: colors.cream, fontSize: 22, marginTop: 4, fontFamily: 'Georgia' },
  stat: { color: colors.muted, marginTop: 4 },
  effect: { color: colors.cream, lineHeight: 20, fontSize: 14 },
});
