import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { LanguageToggle } from './LanguageToggle';

export function ScreenHeader({
  title,
  lead,
  kicker,
  withLanguage = true,
}: {
  title: string;
  lead?: string;
  kicker?: string;
  withLanguage?: boolean;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <View style={styles.titles}>
          {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        {withLanguage ? <LanguageToggle /> : null}
      </View>
      {lead ? <Text style={styles.lead}>{lead}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, marginBottom: 4 },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  titles: { flex: 1, paddingRight: 8 },
  kicker: { color: colors.gold, letterSpacing: 2, fontSize: 11, textTransform: 'uppercase', marginBottom: 4 },
  title: { color: colors.cream, fontSize: 28, fontFamily: 'Georgia', lineHeight: 34 },
  lead: { color: colors.muted, lineHeight: 22, fontSize: 15 },
});
