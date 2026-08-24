import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCitySearch } from '../hooks/useCitySearch';
import { useI18n } from '../i18n';
import { formatPlace } from '../services/citySearch';
import { colors, radii } from '../theme';
import type { GeoPlace } from '../types';

export function CitySearchField({
  query,
  place,
  onQuery,
  onPlace,
}: {
  query: string;
  place: GeoPlace | null;
  onQuery: (v: string) => void;
  onPlace: (v: GeoPlace | null) => void;
}) {
  const { copy } = useI18n();
  const open = !place && query.trim().length >= 2;
  const { results, loading } = useCitySearch(query, open);

  return (
    <View>
      <TextInput
        value={place ? formatPlace(place) : query}
        onChangeText={(t) => {
          onPlace(null);
          onQuery(t);
        }}
        placeholder={copy.form.placePh}
        placeholderTextColor={colors.muted}
        style={styles.input}
        accessibilityLabel={copy.form.place}
        autoCorrect={false}
        autoCapitalize="words"
      />
      <Text style={styles.hint}>{copy.form.placeHint}</Text>
      {open && loading ? <Text style={styles.hint}>{copy.form.searching}</Text> : null}
      {open && !loading && results.length === 0 ? <Text style={styles.hint}>{copy.form.noCity}</Text> : null}
      {open
        ? results.map((c) => (
            <Pressable
              key={`${c.name}-${c.admin ?? ''}-${c.country}-${c.lat.toFixed(3)}-${c.lng.toFixed(3)}`}
              accessibilityRole="button"
              accessibilityLabel={formatPlace(c)}
              style={styles.suggest}
              onPress={() => {
                onPlace(c);
                onQuery(formatPlace(c));
              }}
            >
              <Text style={styles.suggestText}>{formatPlace(c)}</Text>
            </Pressable>
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: 14,
    color: colors.cream,
    backgroundColor: colors.surface,
  },
  hint: { color: colors.muted, fontSize: 13, lineHeight: 18, marginTop: 6 },
  suggest: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(212,175,55,0.12)' },
  suggestText: { color: colors.cream },
});
