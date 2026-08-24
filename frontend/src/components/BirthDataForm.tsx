import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useI18n } from '../i18n';
import { colors, radii } from '../theme';
import type { ChartInput, GeoPlace } from '../types';
import { pad2 } from '../utils/dateFormat';
import { CitySearchField } from './CitySearchField';
import { DatePickerField, TimePickerField } from './DateTimePickers';

export function emptyChartDraft(seed?: Partial<ChartInput>): {
  name: string;
  date: string;
  time: string;
  unknownTime: boolean;
  query: string;
  place: GeoPlace | null;
} {
  return {
    name: seed?.name ?? '',
    date: seed?.birthDate ?? '1990-01-01',
    time: seed?.birthTime ?? '12:00',
    unknownTime: seed?.unknownBirthTime ?? false,
    query: seed?.birthPlace
      ? [seed.birthPlace.name, seed.birthPlace.admin, seed.birthPlace.country].filter(Boolean).join(', ')
      : '',
    place: seed?.birthPlace ?? null,
  };
}

interface Props {
  name: string;
  date: string;
  time: string;
  unknownTime: boolean;
  query: string;
  place: GeoPlace | null;
  onName: (v: string) => void;
  onDate: (v: string) => void;
  onTime: (v: string) => void;
  onUnknownTime: (v: boolean) => void;
  onQuery: (v: string) => void;
  onPlace: (v: GeoPlace | null) => void;
}

export function BirthDataForm(props: Props) {
  const { copy } = useI18n();

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{copy.form.name}</Text>
      <TextInput
        value={props.name}
        onChangeText={props.onName}
        placeholder={copy.form.namePh}
        placeholderTextColor={colors.muted}
        style={styles.input}
        accessibilityLabel={copy.form.name}
      />
      <Text style={styles.label}>{copy.form.date}</Text>
      <DatePickerField value={props.date} onChange={props.onDate} />
      <View style={styles.rowBetween}>
        <Text style={styles.label}>{copy.form.time}</Text>
        <View style={styles.row}>
          <Text style={styles.hint}>{copy.form.unknown}</Text>
          <Switch
            value={props.unknownTime}
            onValueChange={props.onUnknownTime}
            trackColor={{ true: colors.purple }}
            accessibilityLabel={copy.form.unknownA11y}
          />
        </View>
      </View>
      {props.unknownTime ? (
        <Text style={styles.hint}>{copy.form.noTime}</Text>
      ) : (
        <TimePickerField value={props.time} onChange={props.onTime} />
      )}
      <Text style={styles.label}>{copy.form.place}</Text>
      <CitySearchField
        query={props.query}
        place={props.place}
        onQuery={props.onQuery}
        onPlace={props.onPlace}
      />
    </View>
  );
}

export function toChartInput(draft: {
  name: string;
  date: string;
  time: string;
  unknownTime: boolean;
  place: GeoPlace | null;
}): ChartInput | null {
  if (!draft.place) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) return null;
  const parsed = new Date(`${draft.date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  if (!draft.unknownTime && !/^\d{1,2}:\d{2}$/.test(draft.time)) return null;
  const [hh, mm] = draft.time.split(':').map(Number);
  const time =
    draft.unknownTime || !Number.isFinite(hh)
      ? null
      : `${pad2(hh)}:${pad2(Number.isFinite(mm) ? mm : 0)}`;
  return {
    name: draft.name.trim() || 'Tema',
    birthDate: draft.date,
    birthTime: time,
    unknownBirthTime: draft.unknownTime,
    birthPlace: draft.place,
  };
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: { color: colors.goldSoft, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: 14,
    color: colors.cream,
    backgroundColor: colors.surface,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hint: { color: colors.muted, fontSize: 13, lineHeight: 18 },
});
