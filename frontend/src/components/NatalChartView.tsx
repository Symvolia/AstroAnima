import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { planetNature } from '../i18n/bodies';
import { tHouseArea, tHouseTitle, tPlanet, tSign, tSignByIndex, useI18n } from '../i18n';
import { colors, radii } from '../theme';
import type { NatalChart, PlanetPosition } from '../types';
import { pad2 } from '../utils/dateFormat';
import { AspectGrid } from './AspectGrid';
import { PlanetCard } from './PlanetCard';
import { ZodiacWheel } from './ZodiacWheel';

interface Props {
  chart: NatalChart;
  headline: string;
  subtitle?: string;
}

export function NatalChartView({ chart, headline, subtitle }: Props) {
  const { copy, lang } = useI18n();
  const [view, setView] = useState<'ruota' | 'lista'>('ruota');
  const [selected, setSelected] = useState<PlanetPosition | null>(null);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{headline}</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      {!chart.houses ? <Text style={styles.note}>{copy.natal.noTime}</Text> : null}

      <View style={styles.tabs}>
        {(['ruota', 'lista'] as const).map((tab) => (
          <Pressable
            key={tab}
            accessibilityRole="button"
            onPress={() => setView(tab)}
            style={[styles.tab, view === tab && styles.tabOn]}
          >
            <Text style={[styles.tabText, view === tab && styles.tabTextOn]}>
              {tab === 'ruota' ? copy.natal.wheel : copy.natal.list}
            </Text>
          </Pressable>
        ))}
      </View>

      {view === 'ruota' ? (
        <View style={styles.wheel}>
          <ZodiacWheel chart={chart} />
        </View>
      ) : (
        <View style={styles.list}>
          {chart.planets.map((p) => (
            <PlanetCard key={p.id} planet={p} onPress={() => setSelected(p)} />
          ))}
        </View>
      )}

      <Text style={styles.section}>{copy.natal.aspects}</Text>
      <Text style={styles.caption}>{copy.natal.aspectHint}</Text>
      <AspectGrid aspects={chart.aspects.slice(0, 20)} />

      {chart.houses ? (
        <>
          <Text style={styles.section}>{copy.natal.houses}</Text>
          {chart.houses.map((h) => (
            <View key={h.number} style={styles.house}>
              <Text style={styles.houseTitle}>
                {tHouseTitle(h.number, lang)} · {h.degree}° {tSign(h.sign, lang)}
              </Text>
              <Text style={styles.houseArea}>{tHouseArea(h.number, lang)}</Text>
              <Text style={styles.housePlanets}>
                {h.planets.length
                  ? h.planets.map((id) => tPlanet(id, lang)).join(', ')
                  : copy.natal.emptyHouse}
              </Text>
            </View>
          ))}
        </>
      ) : null}

      <Modal visible={Boolean(selected)} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.modalBg} onPress={() => setSelected(null)}>
          {selected ? (
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>{tPlanet(selected.id, lang)}</Text>
              <Text style={styles.modalBody}>
                {selected.degree}°{pad2(selected.minute)}′ {tSignByIndex(selected.signIndex, lang)}
              </Text>
              <Text style={styles.modalBody}>{planetNature(selected.id, lang)}</Text>
              {selected.house ? (
                <Text style={styles.modalBody}>
                  {copy.natal.house} {selected.house}
                </Text>
              ) : null}
            </View>
          ) : null}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  title: { color: colors.cream, fontSize: 24, fontFamily: 'Georgia' },
  sub: { color: colors.gold },
  note: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  caption: { color: colors.muted, fontSize: 13, marginTop: -6 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  tabText: { color: colors.cream },
  tabTextOn: { color: colors.night, fontWeight: '700' },
  wheel: { alignItems: 'center', marginVertical: 8 },
  list: { gap: 10 },
  section: { color: colors.cream, fontSize: 18, marginTop: 10, fontFamily: 'Georgia' },
  house: {
    padding: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    gap: 4,
  },
  houseTitle: { color: colors.cream, fontWeight: '600' },
  houseArea: { color: colors.gold, fontSize: 13 },
  housePlanets: { color: colors.muted, fontSize: 13 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 24 },
  modal: {
    backgroundColor: colors.surfaceSolid,
    borderRadius: radii.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.gold,
    gap: 8,
  },
  modalTitle: { color: colors.cream, fontSize: 22, fontFamily: 'Georgia' },
  modalBody: { color: colors.muted, lineHeight: 20 },
});
