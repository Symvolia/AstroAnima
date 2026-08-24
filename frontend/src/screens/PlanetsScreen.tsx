import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../components/CosmicBackground';
import { PlanetCard } from '../components/PlanetCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { PLANETS } from '../constants/planets';
import { planetCycle, planetNature, planetRetro, planetRetroFx, planetRules } from '../i18n/bodies';
import { tPlanet, tSignByIndex, useI18n } from '../i18n';
import { useStore } from '../store/useStore';
import { colors, radii } from '../theme';
import type { PlanetPosition } from '../types';
import { pad2 } from '../utils/dateFormat';

export function PlanetsScreen() {
  const { copy, lang } = useI18n();
  const sky = useStore((s) => s.sky);
  const [selected, setSelected] = useState<PlanetPosition | null>(null);
  const planets = sky?.planets ?? [];

  const list = useMemo(
    () => PLANETS.map((m) => planets.find((p) => p.id === m.id)).filter(Boolean) as PlanetPosition[],
    [planets],
  );

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader title={copy.planets.title} lead={copy.planets.lead} />
          {list.map((p) => (
            <PlanetCard key={p.id} planet={p} onPress={() => setSelected(p)} />
          ))}
        </ScrollView>
      </SafeAreaView>
      <Modal visible={Boolean(selected)} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.modalBg} onPress={() => setSelected(null)}>
          {selected ? (
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>{tPlanet(selected.id, lang)}</Text>
              <Text style={styles.line}>
                {copy.planets.rules}: {planetRules(selected.id, lang)}
              </Text>
              <Text style={styles.line}>
                {copy.planets.represents}: {planetNature(selected.id, lang)}
              </Text>
              <Text style={styles.line}>
                {copy.planets.cycle}: {planetCycle(selected.id, lang)}
              </Text>
              <Text style={styles.line}>
                {copy.planets.retrograde}: {planetRetro(selected.id, lang)}
              </Text>
              <Text style={selected.retrograde ? styles.warn : styles.line}>{planetRetroFx(selected.id, lang)}</Text>
              <Text style={styles.line}>
                {copy.planets.now}: {selected.degree}°{pad2(selected.minute)}′ {tSignByIndex(selected.signIndex, lang)}
              </Text>
              <Text style={styles.line}>
                {copy.planets.speed}: {selected.speed.toFixed(3)}
                {copy.planets.degDay}
              </Text>
              {selected.distanceAu > 0 ? (
                <Text style={styles.line}>
                  {copy.planets.distance}: {selected.distanceAu.toFixed(3)} {copy.planets.auFromEarth}
                </Text>
              ) : null}
            </View>
          ) : null}
        </Pressable>
      </Modal>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 48, gap: 10 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 24 },
  modal: {
    backgroundColor: colors.surfaceSolid,
    borderRadius: radii.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.gold,
    gap: 8,
  },
  modalTitle: { color: colors.cream, fontSize: 24, fontFamily: 'Georgia' },
  line: { color: colors.muted, lineHeight: 20 },
  warn: { color: colors.goldSoft, lineHeight: 20 },
});
