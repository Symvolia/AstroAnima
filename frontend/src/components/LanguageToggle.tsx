import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useStore } from '../store/useStore';
import { colors, radii } from '../theme';
import type { Lang } from '../i18n/types';

export function LanguageToggle() {
  const lang = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);

  const pick = (next: Lang) => {
    if (next === lang) return;
    void setLanguage(next);
  };

  return (
    <View style={styles.wrap} accessibilityRole="tablist">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Italiano"
        accessibilityState={{ selected: lang === 'it' }}
        onPress={() => pick('it')}
        style={[styles.btn, lang === 'it' && styles.btnOn]}
      >
        <Text style={[styles.txt, lang === 'it' && styles.txtOn]}>ITA</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="English"
        accessibilityState={{ selected: lang === 'en' }}
        onPress={() => pick('en')}
        style={[styles.btn, lang === 'en' && styles.btnOn]}
      >
        <Text style={[styles.txt, lang === 'en' && styles.txtOn]}>ENG</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 44,
    alignItems: 'center',
  },
  btnOn: { backgroundColor: colors.gold },
  txt: { color: colors.muted, fontSize: 11, letterSpacing: 1.2, fontWeight: '700' },
  txtOn: { color: colors.night },
});
