import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export function CosmicBackground({ children }: { children: ReactNode }) {
  return (
    <LinearGradient
      colors={['#000000', '#120018', '#2A0A45', '#140022', '#000000']}
      locations={[0, 0.22, 0.5, 0.76, 1]}
      start={{ x: 0.12, y: 0 }}
      end={{ x: 0.92, y: 1 }}
      style={styles.fill}
    >
      <LinearGradient
        colors={['rgba(123, 44, 191, 0.32)', 'rgba(0, 0, 0, 0)', 'rgba(72, 12, 120, 0.22)']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.veil}
      />
      <View style={styles.glowA} />
      <View style={styles.glowB} />
      <View style={styles.glowC} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, overflow: 'hidden' },
  veil: {
    ...StyleSheet.absoluteFillObject,
  },
  glowA: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(157, 78, 221, 0.28)',
    top: -90,
    right: -80,
  },
  glowB: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(88, 24, 140, 0.34)',
    bottom: 80,
    left: -110,
  },
  glowC: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(196, 160, 255, 0.1)',
    top: '38%',
    left: '28%',
  },
});
