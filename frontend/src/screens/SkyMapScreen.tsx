import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { tPlanet, tPlanetAbbr, useI18n } from '../i18n';
import { astronomyService } from '../services/astronomyService';
import { useStore } from '../store/useStore';
import { colors, radii } from '../theme';

export function SkyMapScreen() {
  const { copy, lang } = useI18n();
  const profile = useStore((s) => s.profile);
  const [geo, setGeo] = useState(profile?.birthPlace ?? { lat: 41.9, lng: 12.5 });

  useEffect(() => {
    void (async () => {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({});
        setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }
    })();
  }, []);

  const points = useMemo(() => astronomyService.skyMap(geo.lat, geo.lng), [geo]);
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 24;

  const xy = (az: number, alt: number) => {
    const r = ((90 - alt) / 90) * maxR;
    const rad = ((az - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.content}>
          <Text style={styles.sub}>{copy.sky.sub(geo.lat.toFixed(2), geo.lng.toFixed(2))}</Text>
          <View style={styles.map}>
            <Svg width={size} height={size}>
              <Circle cx={cx} cy={cy} r={maxR} fill="rgba(0,0,0,0.7)" stroke={colors.gold} />
              <Circle cx={cx} cy={cy} r={maxR * 0.66} fill="none" stroke="rgba(212,175,55,0.25)" />
              <Circle cx={cx} cy={cy} r={maxR * 0.33} fill="none" stroke="rgba(212,175,55,0.2)" />
              <Line x1={cx} y1={cy - maxR} x2={cx} y2={cy + maxR} stroke="rgba(155,126,217,0.35)" />
              <Line x1={cx - maxR} y1={cy} x2={cx + maxR} y2={cy} stroke="rgba(155,126,217,0.35)" />
              <SvgText x={cx} y={18} fill={colors.gold} fontSize="11" textAnchor="middle">
                N
              </SvgText>
              <SvgText x={cx} y={size - 6} fill={colors.muted} fontSize="11" textAnchor="middle">
                S
              </SvgText>
              <SvgText x={14} y={cy + 4} fill={colors.muted} fontSize="11">
                O
              </SvgText>
              <SvgText x={size - 14} y={cy + 4} fill={colors.muted} fontSize="11" textAnchor="middle">
                E
              </SvgText>
              {points.map((p) => {
                if (p.altitude < -5) return null;
                const pos = xy(p.azimuth, Math.max(p.altitude, 0));
                return (
                  <SvgText
                    key={p.id}
                    x={pos.x}
                    y={pos.y}
                    fill={p.visible ? colors.goldSoft : colors.muted}
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {tPlanetAbbr(p.id, lang)}
                  </SvgText>
                );
              })}
            </Svg>
          </View>
          {points.map((p) => (
            <View key={p.id} style={styles.row}>
              <Text style={styles.rowTitle}>{tPlanet(p.id, lang)}</Text>
              <Text style={styles.rowMeta}>
                az {p.azimuth.toFixed(0)}° · h {p.altitude.toFixed(0)}° · {p.visible ? copy.sky.above : copy.sky.below}
              </Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, gap: 8, flex: 1 },
  title: { color: colors.cream, fontSize: 28, fontFamily: 'Georgia' },
  sub: { color: colors.muted, marginBottom: 8 },
  map: { alignItems: 'center', marginVertical: 8 },
  row: {
    padding: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
  },
  rowTitle: { color: colors.cream, fontWeight: '600' },
  rowMeta: { color: colors.muted, marginTop: 2, fontSize: 13 },
});
