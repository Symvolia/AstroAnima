import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

export function CosmicBackground({ children }: { children: ReactNode }) {
  return (
    <LinearGradient colors={[colors.night, colors.deepPurple, colors.nightBlue]} style={styles.fill}>
      <View style={styles.glow} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(107, 63, 160, 0.22)',
    top: -40,
    right: -60,
  },
});
