import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../theme';

export function UpdateCard({
  kicker,
  body,
  meta,
  tone = 'neutral',
  onPress,
}: {
  kicker: string;
  body: string;
  meta?: string;
  tone?: 'flow' | 'tension' | 'neutral';
  onPress?: () => void;
}) {
  const accent = tone === 'flow' ? colors.harmonious : tone === 'tension' ? colors.tense : colors.gold;
  const inner = (
    <>
      <Text style={[styles.kicker, { color: accent }]}>{kicker}</Text>
      <Text style={styles.body}>{body}</Text>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
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
    padding: 16,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    gap: 8,
  },
  kicker: { letterSpacing: 1.6, fontSize: 11, textTransform: 'uppercase' },
  body: { color: colors.cream, fontSize: 17, lineHeight: 24, fontFamily: 'Georgia' },
  meta: { color: colors.muted, fontSize: 13, lineHeight: 18 },
});
