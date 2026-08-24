import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PLANET_BY_ID } from '../constants/planets';
import { tPlanet, tPlanetAbbr, tSignByIndex, useI18n } from '../i18n';
import { colors, radii } from '../theme';
import type { PlanetPosition } from '../types';
import { pad2 } from '../utils/dateFormat';

interface Props {
  planet: PlanetPosition;
  onPress?: () => void;
}

export function PlanetCard({ planet, onPress }: Props) {
  const { lang, copy } = useI18n();
  const meta = PLANET_BY_ID[planet.id];
  const pos = `${planet.degree}°${pad2(planet.minute)}′ ${tSignByIndex(planet.signIndex, lang)}`;
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={[styles.glyphWrap, { borderColor: meta?.color ?? colors.gold }]}>
        <Text style={styles.abbr}>{tPlanetAbbr(planet.id, lang)}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>
          {tPlanet(planet.id, lang)}
          {planet.retrograde ? ` ${copy.natal.retro}` : ''}
        </Text>
        <Text style={styles.pos}>{pos}</Text>
        <Text style={styles.meta}>
          {planet.speed.toFixed(3)}
          {copy.natal.perDay}
          {planet.distanceAu > 0 ? ` · ${planet.distanceAu.toFixed(2)} ${copy.natal.au}` : ''}
          {planet.house ? ` · ${copy.natal.house} ${planet.house}` : ''}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  glyphWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
  },
  abbr: { color: colors.goldSoft, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
  body: { flex: 1 },
  name: { color: colors.cream, fontSize: 16, fontWeight: '600' },
  pos: { color: colors.gold, marginTop: 2 },
  meta: { color: colors.muted, marginTop: 4, fontSize: 12 },
});
