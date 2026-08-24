import { StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../theme';
import type { WisdomItem } from '../constants/wisdom';

export function WisdomCard({ item }: { item: WisdomItem }) {
  return (
    <View style={styles.card}>
      <Text style={styles.theme}>{item.theme}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 8,
  },
  theme: { color: colors.gold, letterSpacing: 1.6, fontSize: 11, textTransform: 'uppercase' },
  title: { color: colors.cream, fontSize: 22, fontFamily: 'Georgia' },
  body: { color: colors.muted, lineHeight: 22, fontSize: 15 },
});
